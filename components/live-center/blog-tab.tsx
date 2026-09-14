'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowUp, ArrowUpRight, Play, PushPin } from '@phosphor-icons/react/dist/ssr'
import type { LiveBlogPost, LiveBlogView } from '@/lib/live-blog/types'
import { embedFrameUrl } from '@/lib/live-blog/types'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary, EMPTY_BOX } from './resource-boundary'
import { ChipStrip, Chip } from './chip-strip'
import { useLiveSelection } from './live-selection'
import { useLocale, useT } from '../locale-provider'
import { TabHeader } from './table'

const ALL = 'all'

/**
 * Otseblogi: kaasautorite postitused ajajoonena, uuemad ees. Katse kood
 * on iga rea vasakus servas (sama Barlow Condensed nagu ajatabelis) ja
 * lingib katse aegadele; kinnitatud teade seisab ees. Meedia on kerge:
 * foto kohandatud suuruses, video kaadrina (mängib klõpsuga), sotsiaal-
 * meedia embed laetakse alles klõpsuga (küpsised + 3G).
 *
 * Uued postitused ei hüppa lugeja ette: nupp "3 uut postitust" toob need
 * nähtavale, nii et lugemine ei katke iga 30 s.
 */
export function BlogTab() {
  const t = useT()
  const { setStageId, stages } = useLiveSelection()
  const state = useRallyLynxResource<LiveBlogView>('/api/live-blog', { pollMs: 30_000 })
  const [stageFilter, setStageFilter] = useState(ALL)
  const [shownIds, setShownIds] = useState<Set<string> | null>(null)

  const data = state.kind === 'ready' ? state.data : null

  // Esimesel laadimisel on kõik nähtav; hiljem lisanduvad ID-d jäävad
  // "uute" nupu taha, kuni lugeja need ise avab.
  useEffect(() => {
    if (data && shownIds === null) setShownIds(new Set(data.posts.map((p) => p.id)))
  }, [data, shownIds])

  const unseen = useMemo(
    () => (data && shownIds ? data.posts.filter((p) => !shownIds.has(p.id)) : []),
    [data, shownIds],
  )

  return (
    <ResourceBoundary state={state}>
      {(view) => {
        const stageCodes = Array.from(new Set(view.posts.map((p) => p.stageCode).filter((c): c is string => !!c)))
        const visible = view.posts.filter(
          (p) => (shownIds ? shownIds.has(p.id) : true) && (stageFilter === ALL || p.stageCode === stageFilter),
        )
        const pinned = visible.find((p) => p.pinned) ?? null
        const timeline = visible.filter((p) => p !== pinned)

        return (
          <div>
            <TabHeader
              title={t.live.blog.title}
              detail={t.live.blog.postCount(view.posts.length)}
              source={t.live.blog.source}
              updatedAt={view.generatedAt}
              note={
                view.sample ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="bg-checker h-3 w-3 text-caution" aria-hidden="true" />
                    <strong className="font-bold uppercase tracking-[0.1em] text-caution">{t.home.standingsSample}:</strong>{' '}
                    {t.live.blog.sampleNote}
                  </span>
                ) : undefined
              }
            />

            {/* Üleskutse publikule: nemad postitavad Instagrami, kuraator toob parimad siia. */}
            <p className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate">
              <span>{t.live.blog.hashtagCta}</span>
              {view.hashtags.map((tag) => (
                <a
                  key={tag}
                  href={`https://www.instagram.com/explore/tags/${tag}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue hover:text-black"
                >
                  #{tag}
                </a>
              ))}
            </p>

            {stageCodes.length > 1 ? (
              <div className="mb-6 border-b border-line pb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate">{t.live.blog.filterByStage}</p>
                <div className="mt-1.5">
                  <ChipStrip ariaLabel={t.live.blog.filterByStage}>
                    <Chip active={stageFilter === ALL} onClick={() => setStageFilter(ALL)}>
                      {t.common.all}
                    </Chip>
                    {stageCodes.map((code) => (
                      <Chip key={code} active={stageFilter === code} onClick={() => setStageFilter(code)}>
                        {code}
                      </Chip>
                    ))}
                  </ChipStrip>
                </div>
              </div>
            ) : null}

            {unseen.length > 0 ? (
              <button
                type="button"
                onClick={() => setShownIds(new Set(view.posts.map((p) => p.id)))}
                className="mb-5 inline-flex min-h-[44px] skew-x-[-19deg] items-center border border-blue bg-blue px-5 text-white transition-colors hover:bg-black"
              >
                <span className="flex skew-x-[19deg] items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em]">
                  <ArrowUp size={14} weight="bold" aria-hidden="true" />
                  {t.live.blog.newPosts(unseen.length)}
                </span>
              </button>
            ) : null}

            {visible.length === 0 ? (
              <div className={EMPTY_BOX}>{t.live.blog.empty}</div>
            ) : (
              <ol className="flex flex-col">
                {pinned ? <PostRow key={pinned.id} post={pinned} onStage={jumpToStage} /> : null}
                {timeline.map((post) => (
                  <PostRow key={post.id} post={post} onStage={jumpToStage} />
                ))}
              </ol>
            )}
          </div>
        )

        function jumpToStage(code: string) {
          const stage = stages.kind === 'ready' ? stages.data.find((s) => s.code === code) : null
          if (stage) setStageId(stage.id)
        }
      }}
    </ResourceBoundary>
  )
}

function PostRow({ post, onStage }: { post: LiveBlogPost; onStage: (code: string) => void }) {
  const t = useT()
  const locale = useLocale()
  const time = new Date(post.publishedAt).toLocaleTimeString(locale === 'et' ? 'et-EE' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const isNotice = post.kind === 'notice'

  return (
    <li
      className={`grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-line py-5 sm:grid-cols-[5rem_1fr] sm:gap-x-6 ${
        post.pinned ? 'shadow-[inset_3px_0_0_0_#0D71B8] bg-blue/[0.04] pl-3' : ''
      }`}
    >
      {/* Vasak veerg: katse kood ja kellaaeg, nagu ajatabelis. */}
      <div className="pt-0.5">
        {post.stageCode ? (
          <button
            type="button"
            onClick={() => onStage(post.stageCode as string)}
            title={t.live.blog.openStage(post.stageCode)}
            className="font-display text-xl font-bold uppercase leading-none text-black hover:text-blue focus-visible:ring-offset-2"
          >
            {post.stageCode}
          </button>
        ) : (
          <span className="font-display text-xl font-bold uppercase leading-none text-slate/60">—</span>
        )}
        <time dateTime={post.publishedAt} className="mt-1 block font-mono text-[12px] tabular-nums text-slate">
          {time}
        </time>
      </div>

      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 text-[12px] text-slate">
          {post.pinned ? (
            <span className="inline-flex items-center gap-1 font-bold uppercase tracking-[0.1em] text-blue">
              <PushPin size={12} weight="fill" aria-hidden="true" />
              {t.live.blog.pinned}
            </span>
          ) : null}
          <span className={`font-semibold ${isNotice ? 'text-black' : 'text-black'}`}>{post.author.name}</span>
          {post.author.handle ? <span>{post.author.handle}</span> : null}
          {post.author.areaLabel ? <span>· {post.author.areaLabel}</span> : null}
          {isNotice ? <span className="font-bold uppercase tracking-[0.1em] text-caution">· {t.live.blog.notice}</span> : null}
        </p>

        {post.body ? (
          <p className={`mt-1.5 max-w-[62ch] text-[15px] leading-relaxed text-black ${isNotice ? 'font-semibold' : ''}`}>
            {post.body}
          </p>
        ) : null}

        {post.image ? (
          <figure className="mt-3 max-w-[640px]">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              width={post.image.width}
              height={post.image.height}
              sizes="(min-width: 640px) 640px, 100vw"
              className="h-auto w-full bg-mist"
            />
            {post.credit ? <figcaption className="mt-1.5 text-[12px] text-slate">{post.credit}</figcaption> : null}
          </figure>
        ) : null}

        {post.video ? <VideoBlock video={post.video} credit={post.credit} /> : null}

        {post.embed ? <EmbedCard post={post} /> : null}
      </div>
    </li>
  )
}

function VideoBlock({ video, credit }: { video: NonNullable<LiveBlogPost['video']>; credit: string | null }) {
  const t = useT()
  const [playing, setPlaying] = useState(false)
  return (
    <figure className="mt-3 max-w-[640px]">
      {playing ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={video.src} poster={video.poster ?? undefined} controls autoPlay playsInline className="w-full bg-black" />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={t.live.blog.playVideo}
          className="group relative block aspect-video w-full overflow-hidden bg-black focus-visible:ring-offset-2"
        >
          {video.poster ? (
            <Image src={video.poster} alt="" fill sizes="(min-width: 640px) 640px, 100vw" className="object-cover opacity-80" />
          ) : null}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 skew-x-[-19deg] items-center justify-center bg-blue text-white transition-colors group-hover:bg-white group-hover:text-black">
              <Play size={22} weight="fill" className="skew-x-[19deg]" aria-hidden="true" />
            </span>
          </span>
        </button>
      )}
      {credit ? <figcaption className="mt-1.5 text-[12px] text-slate">{credit}</figcaption> : null}
    </figure>
  )
}

const PROVIDER_LABEL: Record<NonNullable<LiveBlogPost['embed']>['provider'], string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X',
  other: 'Link',
}

/** Sotsiaalmeedia postitus: kerge kaart, iframe alles klõpsuga. */
function EmbedCard({ post }: { post: LiveBlogPost }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const embed = post.embed as NonNullable<LiveBlogPost['embed']>
  const frame = embedFrameUrl(embed)
  const label = PROVIDER_LABEL[embed.provider]

  if (open && frame) {
    return (
      <div className="mt-3 max-w-[540px] border border-line bg-white">
        <iframe
          src={frame}
          title={`${label} ${embed.handle ?? ''}`.trim()}
          className="block w-full"
          style={{ height: embed.provider === 'youtube' ? 304 : 620 }}
          allow="encrypted-media; picture-in-picture"
          loading="lazy"
        />
        <a
          href={embed.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 border-t border-line px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-slate hover:text-black"
        >
          {t.live.blog.openOn(label)}
          <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
        </a>
      </div>
    )
  }

  return (
    <div className="mt-3 flex max-w-[540px] flex-wrap items-center justify-between gap-3 border border-line bg-mist px-4 py-3">
      <span className="text-[13px] text-black">
        <span className="font-bold">{label}</span>
        {embed.handle ? <span className="text-slate"> · {embed.handle}</span> : null}
        <span className="block text-[12px] text-slate">{t.live.blog.embedNote}</span>
      </span>
      {frame ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-[40px] skew-x-[-19deg] items-center border border-line bg-white px-4 text-black transition-colors hover:border-blue hover:bg-blue hover:text-white"
        >
          <span className="skew-x-[19deg] text-[12px] font-bold uppercase tracking-[0.1em]">{t.live.blog.showPost}</span>
        </button>
      ) : (
        <a
          href={embed.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[40px] skew-x-[-19deg] items-center border border-line bg-white px-4 text-black transition-colors hover:border-blue hover:bg-blue hover:text-white"
        >
          <span className="flex skew-x-[19deg] items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em]">
            {t.live.blog.openOn(label)}
            <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
          </span>
        </a>
      )}
    </div>
  )
}
