'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, Play } from '@phosphor-icons/react/dist/ssr'
import type { LiveBlogView } from '@/lib/live-blog/types'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary, EMPTY_BOX } from './resource-boundary'
import { useT } from '../locale-provider'
import { TabHeader } from './table'

/** YouTube’i video ID watch/youtu.be/live/shorts URL-ist. */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url)
    const seg = u.pathname.split('/').filter(Boolean)
    if (u.hostname === 'youtu.be') return seg[0] ?? null
    if (!u.hostname.endsWith('youtube.com')) return null
    if (u.searchParams.get('v')) return u.searchParams.get('v')
    if (['live', 'shorts', 'embed'].includes(seg[0] ?? '') && seg[1]) return seg[1]
    return null
  } catch {
    return null
  }
}

/**
 * Otseülekanne: YouTube’i mängija, mis laetakse alles klõpsuga — enne
 * seda ainult kaader ja mängunupp (privaatsus + 3G). Link tuleb Sanity
 * võistluse dokumendist (`broadcastUrl`), sama vastuse kaudu kui blogi.
 * Ilma lingita on aus tühi seisund, mitte plakat.
 */
export function BroadcastTab() {
  const t = useT()
  const state = useRallyLynxResource<LiveBlogView>('/api/live-blog', { pollMs: 60_000 })
  const [playing, setPlaying] = useState(false)

  return (
    <ResourceBoundary state={state}>
      {(view) => {
        const id = view.broadcastUrl ? youtubeId(view.broadcastUrl) : null
        return (
          <div>
            <TabHeader title={t.live.broadcast.title} source={id ? t.live.broadcast.source : undefined} />
            {!id ? (
              <div className={EMPTY_BOX}>
                <p>{t.live.broadcast.empty}</p>
                <p className="mt-2 font-normal text-slate">{t.live.broadcast.emptyHint}</p>
              </div>
            ) : (
              <div className="max-w-[960px]">
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  {playing ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                      title={t.live.broadcast.title}
                      className="absolute inset-0 h-full w-full"
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      aria-label={t.live.broadcast.play}
                      className="group absolute inset-0 focus-visible:ring-offset-2"
                    >
                      <Image
                        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 960px, 100vw"
                        className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
                      />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-16 w-24 skew-x-[-19deg] items-center justify-center bg-live text-white transition-colors group-hover:bg-white group-hover:text-black">
                          <Play size={26} weight="fill" className="skew-x-[19deg]" aria-hidden="true" />
                        </span>
                      </span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-3 text-[12px] text-slate">
                  <span>{t.live.broadcast.loadNote}</span>
                  <a
                    href={view.broadcastUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.1em] text-blue hover:text-black"
                  >
                    {t.live.broadcast.openOnYouTube}
                    <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )
      }}
    </ResourceBoundary>
  )
}
