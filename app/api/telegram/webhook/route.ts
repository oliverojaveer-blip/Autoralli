import { NextResponse, type NextRequest } from 'next/server'
import {
  answerCallbackQuery,
  botConfigured,
  downloadFile,
  editMessageReplyMarkup,
  escapeHtml,
  sendMessage,
  sendPhoto,
  webhookSecret,
  type TgCallbackQuery,
  type TgMessage,
  type TgUpdate,
} from '@/lib/telegram/api'
import { CONSENT_VERSION, SITE_URL, msg } from '@/lib/telegram/messages'
import { detectEmbed } from '@/lib/live-blog/types'
import {
  acceptInvite,
  createInvite,
  createPost,
  eraseAuthor,
  findContributor,
  findEnabledEvent,
  findInvite,
  findPostByTelegramMessage,
  listContributors,
  listModerators,
  setContributorActive,
  setContributorRole,
  setPostBody,
  setPostPinned,
  setPostStatus,
  type Contributor,
  type Role,
} from '@/lib/live-blog/write'

/**
 * ============================================================================
 *  Telegrami bot — otseblogi sisend.
 * ============================================================================
 *  Üks webhook: Telegram POST-ib iga sõnumi siia. Reeglid:
 *  - iga päringu päises peab olema webhooki saladus (tuletatud tokenist);
 *  - kaasautor tuvastatakse Telegrami ID järgi `eventContributor` kirjest
 *    võistlusel, mille blogi on avatud; Studiosse ta ei logi;
 *  - fail laetakse Telegramist alla ja üles Sanitysse — leht ei viita
 *    kunagi Telegrami failile;
 *  - modereeritava autori postitus jääb `draft`iks ja moderaatorid saavad
 *    oma vestlusse nupud Avalda / Avalda ja kinnita / Peida;
 *  - vastame Telegramile alati 200, ka vea korral — muidu saadab Telegram
 *    sama uuenduse lõputult uuesti.
 */

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_FILE_BYTES = 20 * 1024 * 1024
const STAGE_RE = /\b(SS\s?\d{1,2})\b/i
const URL_RE = /https?:\/\/[^\s]+/i
const ROLE_LABEL: Record<Role, string> = { trusted: 'usaldatud', moderated: 'modereeritav', moderator: 'moderaator' }

// Lihtne sagedus-piir vestluse kohta (serverless: per instants, aga piisav
// kogemata edastatud albumi vastu).
const recent = new Map<number, number[]>()
function rateLimited(chatId: number): boolean {
  const now = Date.now()
  const stamps = (recent.get(chatId) ?? []).filter((t) => now - t < 60_000)
  stamps.push(now)
  recent.set(chatId, stamps)
  return stamps.length > 12
}

export async function POST(request: NextRequest) {
  if (!botConfigured()) return NextResponse.json({ ok: false }, { status: 503 })
  if (request.headers.get('x-telegram-bot-api-secret-token') !== webhookSecret()) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const update = (await request.json()) as TgUpdate
  try {
    if (update.callback_query) await handleCallback(update.callback_query)
    else if (update.message) await handleMessage(update.message)
  } catch (error) {
    console.error('[telegram] update', update.update_id, error)
    const chatId = update.message?.chat.id ?? update.callback_query?.message?.chat.id
    if (chatId) await sendMessage(chatId, msg.error).catch(() => undefined)
  }
  return NextResponse.json({ ok: true })
}

// ---------------------------------------------------------------------------
// Sõnumid
// ---------------------------------------------------------------------------

async function handleMessage(m: TgMessage) {
  if (m.chat.type !== 'private' || !m.from) return
  const chatId = m.chat.id
  const text = (m.text ?? m.caption ?? '').trim()

  // /start <kutsekood> — sidumine ja nõusolek.
  if (text.startsWith('/start')) {
    const code = text.split(/\s+/)[1]
    return code ? await startInvite(chatId, m.from, code) : await sendMessage(chatId, msg.notPaired)
  }

  // /minu_id — Telegrami ID esimese moderaatori Studiosse sisestamiseks;
  // töötab ka sidumata kasutajal.
  if (text === '/minu_id' || text === '/id') {
    return await sendMessage(chatId, `Sinu Telegrami ID: <code>${m.from.id}</code>`)
  }

  if (text === 'kustuta mind') {
    const ctx = await resolveContributor(m.from.id)
    if (ctx.kind === 'ok') {
      await eraseAuthor(ctx.contributor.author._id)
      return await sendMessage(chatId, msg.dataDeleted)
    }
  }

  const ctx = await resolveContributor(m.from.id)
  if (ctx.kind === 'no-event') return await sendMessage(chatId, msg.noEvent)
  if (ctx.kind === 'not-paired') return await sendMessage(chatId, msg.notPaired)
  if (ctx.kind === 'inactive') return await sendMessage(chatId, msg.inactive(ctx.contributor.event.name))
  const { contributor } = ctx

  if (text.startsWith('/')) return await handleCommand(chatId, contributor, text)

  // Vastus oma varasemale sõnumile: paranda / kustuta / kinnita.
  if (m.reply_to_message) return await handleReply(chatId, contributor, m, text)

  if (rateLimited(chatId)) return await sendMessage(chatId, msg.rateLimited)

  return await publishFromMessage(chatId, contributor, m, text)
}

type Resolved =
  | { kind: 'no-event' }
  | { kind: 'not-paired' }
  | { kind: 'inactive'; contributor: Contributor }
  | { kind: 'ok'; contributor: Contributor }

async function resolveContributor(telegramId: number): Promise<Resolved> {
  const event = await findEnabledEvent()
  if (!event) return { kind: 'no-event' }
  const contributor = await findContributor(telegramId, event._id)
  if (!contributor) return { kind: 'not-paired' }
  if (!contributor.active) return { kind: 'inactive', contributor }
  return { kind: 'ok', contributor }
}

async function startInvite(chatId: number, from: NonNullable<TgMessage['from']>, code: string) {
  const invite = await findInvite(code)
  if (!invite) {
    // Võib-olla juba seotud — siis lihtsalt tervitame.
    const ctx = await resolveContributor(from.id)
    if (ctx.kind === 'ok') return await sendMessage(chatId, msg.inviteAlreadyPaired(ctx.contributor.event.name))
    return await sendMessage(chatId, msg.inviteInvalid)
  }
  const name = [from.first_name, from.last_name].filter(Boolean).join(' ')
  await sendMessage(chatId, msg.consent(escapeHtml(invite.event.name), escapeHtml(name)), {
    keyboard: [[{ text: msg.consentButton, callback_data: `consent:${code}` }]],
    disablePreview: true,
  })
}

async function handleCommand(chatId: number, c: Contributor, text: string) {
  const [cmd, ...args] = text.split(/\s+/)
  const isModerator = c.role === 'moderator'

  switch (cmd.toLowerCase()) {
    case '/abi':
    case '/help':
      return await sendMessage(chatId, isModerator ? msg.help : msg.welcome(escapeHtml(c.event.name), c.role, c.areas.join(', ')))

    case '/kutse': {
      if (!isModerator) return await sendMessage(chatId, msg.notAllowed)
      const role = args[0] as Role | undefined
      if (!role || !(role in ROLE_LABEL)) return await sendMessage(chatId, msg.inviteUsage)
      const areas = args.slice(1)
      const { code } = await createInvite(c.event._id, role, areas, c.author.displayName)
      const link = `https://t.me/${process.env.TELEGRAM_BOT_USERNAME ?? 'AutoralliBot'}?start=${code}`
      return await sendMessage(chatId, msg.inviteCreated(link, ROLE_LABEL[role], areas.join(', ')))
    }

    case '/kaasautorid': {
      if (!isModerator) return await sendMessage(chatId, msg.notAllowed)
      const all = await listContributors(c.event._id)
      const lines = all
        .filter((x) => !x.author.telegramId.startsWith('pending-'))
        .map((x) => msg.contributorLine(escapeHtml(x.author.displayName), ROLE_LABEL[x.role], x.active, x.areas.join(', ')))
      return await sendMessage(chatId, [msg.contributorsHeader(escapeHtml(c.event.name)), ...lines].join('\n'))
    }

    case '/eemalda':
    case '/usalda': {
      if (!isModerator) return await sendMessage(chatId, msg.notAllowed)
      const name = args.join(' ').replace(/^@/, '').toLowerCase()
      const all = await listContributors(c.event._id)
      const target = all.find((x) => x.author.displayName.toLowerCase() === name)
      if (!target) return await sendMessage(chatId, msg.userNotFound)
      if (cmd.toLowerCase() === '/eemalda') {
        await setContributorActive(target._id, false)
        return await sendMessage(chatId, msg.removed(escapeHtml(target.author.displayName)))
      }
      await setContributorRole(target._id, 'trusted')
      return await sendMessage(chatId, msg.trusted(escapeHtml(target.author.displayName)))
    }

    default:
      return await sendMessage(chatId, msg.help)
  }
}

async function handleReply(chatId: number, c: Contributor, m: TgMessage, text: string) {
  const original = m.reply_to_message as TgMessage
  // Kasutaja vastab kas oma algsele sõnumile või boti kinnitusele, mis
  // omakorda vastas algsele — mõlemad viivad sama postituseni.
  const candidates = [original.message_id, original.reply_to_message?.message_id].filter((x): x is number => !!x)
  let post: { _id: string; authorRef: string } | null = null
  for (const id of candidates) {
    post = await findPostByTelegramMessage(chatId, id)
    if (post) break
  }
  if (!post) return await sendMessage(chatId, msg.replyTargetUnknown, { replyTo: m.message_id })

  const own = post.authorRef === c.author._id
  const isModerator = c.role === 'moderator'
  const lower = text.toLowerCase()

  if (lower === 'kustuta') {
    if (!own && !isModerator) return await sendMessage(chatId, msg.notAllowed)
    await setPostStatus(post._id, 'hidden', c.author.displayName)
    return await sendMessage(chatId, msg.deleted, { replyTo: m.message_id })
  }
  if (lower.startsWith('paranda')) {
    if (!own && !isModerator) return await sendMessage(chatId, msg.notAllowed)
    const body = text.slice('paranda'.length).trim()
    await setPostBody(post._id, body, extractStage(body))
    return await sendMessage(chatId, msg.edited, { replyTo: m.message_id })
  }
  if (lower === 'kinnita' || lower === 'vabasta') {
    if (!isModerator) return await sendMessage(chatId, msg.notAllowed)
    await setPostPinned(post._id, c.event._id, lower === 'kinnita')
    return await sendMessage(chatId, lower === 'kinnita' ? msg.pinnedOk : msg.unpinnedOk, { replyTo: m.message_id })
  }
  // Tavaline sõnum, mis juhtus olema vastus — postitame nagu ikka.
  return await publishFromMessage(chatId, c, m, text)
}

function extractStage(text: string): string | null {
  const match = text.match(STAGE_RE)
  return match ? match[1].replace(/\s+/g, '').toUpperCase() : null
}

async function publishFromMessage(chatId: number, c: Contributor, m: TgMessage, text: string) {
  const stageCode = extractStage(text)
  const url = text.match(URL_RE)?.[0] ?? null
  const body = text.replace(URL_RE, '').trim() || null
  const status = c.role === 'moderated' ? 'draft' : 'published'
  const base = {
    eventRef: c.event._id,
    authorRef: c.author._id,
    status: status as 'draft' | 'published',
    body,
    stageCode,
    capturedAt: new Date(m.date * 1000).toISOString(),
    telegramChatId: chatId,
    telegramMessageId: m.message_id,
  }

  let kind: 'text' | 'photo' | 'video' | 'embed'
  let image: { bytes: Buffer; filename: string; alt: string } | undefined
  let video: { bytes: Buffer; filename: string; contentType: string } | undefined

  if (m.photo && m.photo.length > 0) {
    const best = m.photo[m.photo.length - 1]
    if ((best.file_size ?? 0) > MAX_FILE_BYTES) return await sendMessage(chatId, msg.tooLarge)
    const file = await downloadFile(best.file_id)
    image = { bytes: file.bytes, filename: `tg-${m.message_id}.${file.extension}`, alt: body ?? '' }
    kind = 'photo'
  } else if (m.video) {
    if ((m.video.file_size ?? 0) > MAX_FILE_BYTES) return await sendMessage(chatId, msg.tooLarge)
    const file = await downloadFile(m.video.file_id)
    video = { bytes: file.bytes, filename: `tg-${m.message_id}.${file.extension}`, contentType: m.video.mime_type ?? 'video/mp4' }
    kind = 'video'
  } else if (url && detectEmbed(url).provider !== 'other') {
    kind = 'embed'
  } else if (body) {
    kind = 'text'
  } else {
    return await sendMessage(chatId, msg.unsupported)
  }

  const post = await createPost({ ...base, kind, embedUrl: kind === 'embed' ? url : null, image, video })

  if (status === 'published') {
    return await sendMessage(chatId, msg.posted(stageCode, `${SITE_URL}/otse#blogi`), { replyTo: m.message_id })
  }

  await sendMessage(chatId, msg.queued(stageCode), { replyTo: m.message_id })
  await notifyModerators(c, m, post._id, kind, stageCode, body)
}

async function notifyModerators(
  c: Contributor,
  m: TgMessage,
  postId: string,
  kind: string,
  stageCode: string | null,
  body: string | null,
) {
  const moderators = await listModerators(c.event._id)
  const keyboard = [
    [
      { text: msg.reviewApprove, callback_data: `approve:${postId}` },
      { text: msg.reviewPin, callback_data: `pin:${postId}` },
      { text: msg.reviewHide, callback_data: `hide:${postId}` },
    ],
  ]
  const caption = msg.review(escapeHtml(c.author.displayName), stageCode, body ? escapeHtml(body) : null, kind)
  for (const mod of moderators) {
    const chat = Number(mod.telegramId)
    if (!Number.isFinite(chat) || chat === m.chat.id) continue
    try {
      if (m.photo && m.photo.length > 0) await sendPhoto(chat, m.photo[m.photo.length - 1].file_id, caption, keyboard)
      else await sendMessage(chat, caption, { keyboard })
    } catch (error) {
      console.error('[telegram] notify moderator', mod.displayName, error)
    }
  }
}

// ---------------------------------------------------------------------------
// Nupud (nõusolek, modereerimine)
// ---------------------------------------------------------------------------

async function handleCallback(q: TgCallbackQuery) {
  const data = q.data ?? ''
  const [action, id] = data.split(':')
  const chatId = q.message?.chat.id

  if (action === 'consent') {
    const invite = await findInvite(id)
    if (!invite) {
      await answerCallbackQuery(q.id, msg.inviteInvalid)
      return
    }
    const name = [q.from.first_name, q.from.last_name].filter(Boolean).join(' ')
    await acceptInvite(invite, { id: q.from.id, name, username: q.from.username }, CONSENT_VERSION)
    await answerCallbackQuery(q.id)
    if (chatId && q.message) await editMessageReplyMarkup(chatId, q.message.message_id, null)
    if (chatId) await sendMessage(chatId, msg.welcome(escapeHtml(invite.event.name), invite.role, invite.areas.join(', ')))
    return
  }

  // Modereerimine: ainult moderaatorid.
  const ctx = await resolveContributor(q.from.id)
  if (ctx.kind !== 'ok' || ctx.contributor.role !== 'moderator') {
    await answerCallbackQuery(q.id, msg.notAllowed)
    return
  }
  const by = ctx.contributor.author.displayName

  if (action === 'approve' || action === 'pin') {
    await setPostStatus(id, 'published', by)
    if (action === 'pin') await setPostPinned(id, ctx.contributor.event._id, true)
  } else if (action === 'hide') {
    await setPostStatus(id, 'hidden', by)
  } else {
    await answerCallbackQuery(q.id)
    return
  }

  const label = action === 'approve' ? msg.reviewApprove : action === 'pin' ? msg.reviewPin : msg.reviewHide
  await answerCallbackQuery(q.id, label)
  if (chatId && q.message) {
    await editMessageReplyMarkup(chatId, q.message.message_id, [[{ text: msg.reviewDone(label, by), callback_data: 'noop' }]])
  }
}
