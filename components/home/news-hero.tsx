'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'motion/react'
import { ArrowUpRight, Pause, Play } from '@phosphor-icons/react/dist/ssr'
import type { NewsArticleView } from '@/lib/autosport/adapter'
import { formatLongDate } from '@/lib/dates'
import { useLocale, useT } from '@/components/locale-provider'

export const ROTATE_MS = 6000

/**
 * Avalehe uudistelava: suur kaart, millel kolm viimast uudist vahetuvad
 * 6 s tagant 19° pühkega (brändi lõige), kõrval kaks seisvat kaarti.
 *
 * - Hover, fookus või pausinupp hoiab vahetuse kinni (teleteksti HOLD).
 * - prefers-reduced-motion: ei roteeru ise, vahetus on hetkeline, punktid
 *   jäävad nuppudeks.
 * - Enne mount'i on lava serverist renderdatud esimese uudisega, nii et
 *   sisu on olemas ka ilma JS-ita.
 */
export function NewsHero({
  rotating,
  aside,
}: {
  rotating: NewsArticleView[]
  aside: NewsArticleView[]
}) {
  const t = useT()
  const locale = useLocale()
  const reduced = useReducedMotion() ?? false
  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [held, setHeld] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hidden, setHidden] = useState(false)
  const labelId = useId()

  const total = rotating.length
  const playing = mounted && !reduced && !held && !hidden && !userPaused && total > 1

  const go = useCallback(
    (next: number) => {
      setPrevIndex(index)
      setIndex(((next % total) + total) % total)
    },
    [index, total],
  )

  useEffect(() => setMounted(true), [])

  // Vahetuse taimer ON progressiriba animatsioon: kui riba jõuab lõppu,
  // vahetub uudis. Nii ei saa riba ja taimer kunagi lahku joosta ning
  // paus (`animation-play-state`) peatab mõlemad samast kohast.
  const autoplay = mounted && !reduced && total > 1

  // Kui vaheleht läheb taustale, jääb taimer ootele: brauser aeglustab
  // taustataimereid ja pühe ei tohi naastes "järele joosta".
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const active = rotating[index]

  return (
    <section aria-labelledby={labelId} className="bg-black pb-6 text-white sm:pb-8">
      <h2 id={labelId} className="sr-only">
        {t.home.newsHeroAria}
      </h2>
      <div className="shell grid gap-3 lg:grid-cols-12 lg:gap-4">
        {/* Suur roteeruv kaart */}
        <div
          className="relative lg:col-span-8"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocusCapture={() => setHeld(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false)
          }}
        >
          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-roledescription="carousel"
            aria-label={`${t.home.newsSlideOf(index + 1, total)}: ${active.title}`}
            className="group relative block aspect-[4/5] overflow-hidden bg-midnight sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[560px] focus-visible:ring-offset-black"
          >
            {/* Pildikihid: aktiivne pühib 19° lõikega eelmise peale. */}
            {rotating.map((article, i) => {
              const isActive = i === index
              const isPrev = i === prevIndex
              if (!isActive && !isPrev) return null
              return (
                <div
                  key={`${article.id}-${isActive ? 'in' : 'out'}`}
                  aria-hidden="true"
                  className={`absolute inset-0 ${isActive ? 'z-10' : 'z-0'} ${
                    isActive && prevIndex !== null && !reduced ? 'wipe-in' : ''
                  }`}
                >
                  {article.image ? (
                    <Image
                      src={article.image.src}
                      alt=""
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 66vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-forward group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-midnight">
                      <span className="bg-checker h-16 w-16 text-white/10" />
                    </div>
                  )}
                </div>
              )
            })}
            <div
              className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/55 to-transparent"
              aria-hidden="true"
            />

            <div className="absolute inset-x-0 bottom-0 z-30 p-5 pb-16 sm:p-8 sm:pb-20 lg:p-10 lg:pb-24">
              <div key={active.id} className={reduced || prevIndex === null ? '' : 'rise-in'}>
                <h3 className="max-w-[16ch] text-balance font-display text-3xl font-bold uppercase leading-[0.96] sm:text-4xl lg:text-[3.25rem] xl:text-[3.75rem]">
                  {active.title}
                </h3>
                <p className="mt-3 text-[14px] text-white/75">
                  <span className="tnum font-semibold text-white">{formatLongDate(active.publishedAt, locale)}</span>
                  <span className="mx-2 text-white/30" aria-hidden="true">
                    ·
                  </span>
                  autosport.ee
                </p>
                {active.excerpt ? (
                  <p className="mt-4 hidden max-w-[56ch] text-base leading-relaxed text-white/75 sm:line-clamp-2">
                    {active.excerpt}
                  </p>
                ) : null}
                <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-blue transition-colors group-hover:text-white">
                  {t.news.readOnAutosport}
                  <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                </span>
              </div>
            </div>
          </a>

          {/* Juhtriba: kolm progressiriba on nupud, pluss paus/jätka. */}
          {total > 1 ? (
            <div className="absolute inset-x-0 bottom-0 z-40 flex items-center gap-3 px-5 pb-5 sm:px-8 sm:pb-7 lg:px-10 lg:pb-8">
              <ul className="flex flex-1 items-center gap-2" aria-label={t.home.newsHeroAria}>
                {rotating.map((article, i) => (
                  <li key={article.id} className="flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        go(i)
                      }}
                      aria-label={t.home.newsSlideOf(i + 1, total)}
                      aria-current={i === index ? 'true' : undefined}
                      className="group/bar flex h-6 w-full items-center focus-visible:ring-offset-black"
                    >
                      <span className="relative block h-[3px] w-full overflow-hidden bg-white/25 transition-colors group-hover/bar:bg-white/40">
                        {i === index && autoplay ? (
                          <span
                            key={index}
                            className="bar-fill absolute inset-y-0 left-0 w-full bg-white"
                            style={{
                              animationDuration: `${ROTATE_MS}ms`,
                              animationPlayState: playing ? 'running' : 'paused',
                            }}
                            onAnimationEnd={() => go(index + 1)}
                          />
                        ) : (
                          <span
                            className={`absolute inset-y-0 left-0 bg-white ${i <= index ? 'w-full' : 'w-0'}`}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {!reduced ? (
                <button
                  type="button"
                  onClick={() => setUserPaused((v) => !v)}
                  aria-pressed={userPaused}
                  aria-label={userPaused ? t.home.newsPlay : t.home.newsPause}
                  className="flex h-9 w-9 items-center justify-center border border-white/25 text-white transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:ring-offset-black"
                >
                  {userPaused ? <Play size={14} weight="fill" /> : <Pause size={14} weight="fill" />}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Kaks seisvat kaarti */}
        <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:gap-4">
          {aside.map((article) => (
            <li key={article.id}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex gap-4 border border-white/10 bg-midnight p-3 transition-colors hover:border-white/30 focus-visible:ring-offset-black lg:block lg:h-[272px] lg:overflow-hidden lg:border-0 lg:p-0"
              >
                {/* Alla lg: pisipilt + pealkiri reana; lg: foto täidab kaardi, tekst peal. */}
                <div className="relative h-[84px] w-[112px] shrink-0 overflow-hidden bg-black lg:absolute lg:inset-0 lg:h-auto lg:w-auto">
                  {article.image ? (
                    <Image
                      src={article.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 112px"
                      className="object-cover"
                    />
                  ) : null}
                  <div
                    className="absolute inset-0 hidden bg-gradient-to-t from-black via-black/70 via-45% to-transparent lg:block"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 self-center lg:absolute lg:inset-x-0 lg:bottom-0 lg:p-5">
                  <h3 className="line-clamp-3 font-display text-lg font-bold uppercase leading-[1.02] transition-colors group-hover:text-blue lg:line-clamp-none lg:text-balance lg:text-2xl">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-white/65">
                    <span className="tnum">{formatLongDate(article.publishedAt, locale)}</span> · autosport.ee
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
