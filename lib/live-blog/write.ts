import { createClient } from 'next-sanity'
import { randomBytes } from 'node:crypto'
import { apiVersion, dataset, projectId } from '@/sanity/env'

/**
 * ============================================================================
 *  Otseblogi kirjutamine Sanitysse — ainult serveris, ainult boti jaoks.
 * ============================================================================
 *  Token tuleb keskkonnast (SANITY_WRITE_TOKEN), `useCdn: false`, sest
 *  kirjutamine ja värske lugemine peavad käima otse API vastu. Kõik
 *  funktsioonid töötavad dokumenditasandil: bot ei koosta GROQ-i ise.
 */

function writeClient() {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) throw new Error('SANITY_WRITE_TOKEN puudub')
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: 'published' })
}

export type Role = 'trusted' | 'moderated' | 'moderator'

export type LiveEvent = { _id: string; eventId: string; name: string }

export type Contributor = {
  _id: string
  role: Role
  active: boolean
  areas: string[]
  event: LiveEvent
  author: { _id: string; displayName: string; telegramId: string }
}

/** Võistlus, mille blogi on avatud (viimane, kui mitu). */
export async function findEnabledEvent(): Promise<LiveEvent | null> {
  return writeClient().fetch<LiveEvent | null>(
    `*[_type == "rallyEvent" && blogEnabled == true] | order(startsAt desc)[0]{ _id, eventId, name }`,
  )
}

const CONTRIBUTOR_PROJECTION = `{
  _id, role, active, "areas": coalesce(areas, []),
  event->{ _id, eventId, name },
  author->{ _id, displayName, telegramId }
}`

/** Telegrami kasutaja õigus antud võistlusel. */
export async function findContributor(telegramId: number, eventRef: string): Promise<Contributor | null> {
  return writeClient().fetch<Contributor | null>(
    `*[_type == "eventContributor" && event._ref == $eventRef && author->telegramId == $tg][0]${CONTRIBUTOR_PROJECTION}`,
    { eventRef, tg: String(telegramId) },
  )
}

export async function listContributors(eventRef: string): Promise<Contributor[]> {
  return writeClient().fetch<Contributor[]>(
    `*[_type == "eventContributor" && event._ref == $eventRef] | order(author->displayName asc)${CONTRIBUTOR_PROJECTION}`,
    { eventRef },
  )
}

/**
 * Loob kutse: autori kohatäite (telegramId "pending-<kood>") ja kaasautori
 * kirje `active: false`. /start <kood> täidab telegramId, nime ja
 * nõusoleku aja ning lülitab aktiivseks.
 */
export async function createInvite(
  eventRef: string,
  role: Role,
  areas: string[],
  invitedBy: string,
): Promise<{ code: string }> {
  const client = writeClient()
  const code = randomBytes(6).toString('base64url')
  const author = await client.create({
    _type: 'blogAuthor',
    displayName: 'Uus kaasautor',
    telegramId: `pending-${code}`,
  })
  await client.create({
    _type: 'eventContributor',
    author: { _type: 'reference', _ref: author._id },
    event: { _type: 'reference', _ref: eventRef },
    role,
    areas,
    active: false,
    inviteCode: code,
    invitedBy,
  })
  return { code }
}

export async function findInvite(code: string): Promise<Contributor | null> {
  return writeClient().fetch<Contributor | null>(
    `*[_type == "eventContributor" && inviteCode == $code && active == false][0]${CONTRIBUTOR_PROJECTION}`,
    { code },
  )
}

export async function acceptInvite(
  contributor: Contributor,
  user: { id: number; name: string; username?: string },
  consentVersion: string,
): Promise<void> {
  const client = writeClient()
  await client
    .patch(contributor.author._id)
    .set({
      displayName: user.name,
      telegramId: String(user.id),
      telegramUsername: user.username ?? null,
    })
    .commit()
  await client
    .patch(contributor._id)
    .set({ active: true, consentAt: new Date().toISOString(), consentVersion })
    .unset(['inviteCode'])
    .commit()
}

export async function setContributorActive(contributorId: string, active: boolean): Promise<void> {
  await writeClient().patch(contributorId).set({ active }).commit()
}

export async function setContributorRole(contributorId: string, role: Role): Promise<void> {
  await writeClient().patch(contributorId).set({ role }).commit()
}

export type NewPost = {
  eventRef: string
  authorRef: string
  kind: 'text' | 'photo' | 'video' | 'embed' | 'notice'
  status: 'draft' | 'published'
  body: string | null
  stageCode: string | null
  embedUrl: string | null
  image?: { bytes: Buffer; filename: string; alt: string }
  video?: { bytes: Buffer; filename: string; contentType: string }
  capturedAt: string
  telegramChatId: number
  telegramMessageId: number
}

export async function createPost(post: NewPost): Promise<{ _id: string }> {
  const client = writeClient()
  const doc: Record<string, unknown> = {
    _type: 'livePost',
    event: { _type: 'reference', _ref: post.eventRef },
    author: { _type: 'reference', _ref: post.authorRef },
    kind: post.kind,
    status: post.status,
    body: post.body,
    stageCode: post.stageCode,
    embedUrl: post.embedUrl,
    pinned: false,
    capturedAt: post.capturedAt,
    publishedAt: post.status === 'published' ? new Date().toISOString() : null,
    source: 'telegram',
    // "chat:message" — et "paranda"/"kustuta" vastused leiaksid postituse.
    telegramMessageId: `${post.telegramChatId}:${post.telegramMessageId}`,
  }

  if (post.image) {
    const asset = await client.assets.upload('image', post.image.bytes, { filename: post.image.filename })
    doc.image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    doc.imageAlt = post.image.alt
  }
  if (post.video) {
    const asset = await client.assets.upload('file', post.video.bytes, {
      filename: post.video.filename,
      contentType: post.video.contentType,
    })
    doc.video = { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
  }

  const created = await client.create(doc as { _type: 'livePost' })
  return { _id: created._id }
}

export async function findPostByTelegramMessage(chatId: number, messageId: number): Promise<{ _id: string; authorRef: string } | null> {
  return writeClient().fetch<{ _id: string; authorRef: string } | null>(
    `*[_type == "livePost" && telegramMessageId == $key][0]{ _id, "authorRef": author._ref }`,
    { key: `${chatId}:${messageId}` },
  )
}

export async function setPostStatus(postId: string, status: 'published' | 'hidden', moderatedBy?: string): Promise<void> {
  const patch = writeClient().patch(postId).set({ status, moderatedBy: moderatedBy ?? null })
  if (status === 'published') patch.setIfMissing({ publishedAt: new Date().toISOString() })
  await patch.commit()
}

export async function setPostBody(postId: string, body: string, stageCode: string | null): Promise<void> {
  const patch = writeClient().patch(postId).set({ body })
  if (stageCode) patch.set({ stageCode })
  await patch.commit()
}

/** Kinnitab ühe postituse ja vabastab teised sama võistluse omad. */
export async function setPostPinned(postId: string, eventRef: string, pinned: boolean): Promise<void> {
  const client = writeClient()
  if (pinned) {
    const others = await client.fetch<string[]>(
      `*[_type == "livePost" && event._ref == $eventRef && pinned == true && _id != $id]._id`,
      { eventRef, id: postId },
    )
    for (const id of others) await client.patch(id).set({ pinned: false }).commit()
  }
  await client.patch(postId).set({ pinned }).commit()
}

/** GDPR: peidab autori postitused ja anonümiseerib autori kirje. */
export async function eraseAuthor(authorId: string): Promise<void> {
  const client = writeClient()
  const posts = await client.fetch<string[]>(`*[_type == "livePost" && author._ref == $id]._id`, { id: authorId })
  for (const id of posts) await client.patch(id).set({ status: 'hidden' }).commit()
  const contributors = await client.fetch<string[]>(`*[_type == "eventContributor" && author._ref == $id]._id`, { id: authorId })
  for (const id of contributors) await client.patch(id).set({ active: false }).commit()
  await client
    .patch(authorId)
    .set({ displayName: 'Kustutatud kaasautor', telegramId: `erased-${authorId}`, telegramUsername: null, contactEmail: null })
    .unset(['handle', 'avatar'])
    .commit()
}

/** Kõik antud võistluse moderaatorid, kellele saata ülevaatamise teade. */
export async function listModerators(eventRef: string): Promise<Array<{ telegramId: string; displayName: string }>> {
  return writeClient().fetch(
    `*[_type == "eventContributor" && event._ref == $eventRef && role == "moderator" && active == true]{ "telegramId": author->telegramId, "displayName": author->displayName }`,
    { eventRef },
  )
}
