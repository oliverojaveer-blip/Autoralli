import Image from 'next/image'
import { Play, Images, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { NEWS } from '@/lib/concept/fixtures'
import { Parallax, Rise } from '../motion'

const MONTHS = ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets']

function date(iso: string) {
  const d = new Date(iso)
  return `${d.getUTCDate()}. ${MONTHS[d.getUTCMonth()]}`
}

function KindIcon({ kind }: { kind: string }) {
  if (kind === 'video') return <Play size={12} weight="fill" />
  if (kind === 'galerii') return <Images size={12} weight="bold" />
  return null
}

/**
 * Toimetuse võrgustik: üks suur lugu, üks video, kolm lühikest rida.
 * Erinevad kaalud, mitte viis ühesugust kaarti.
 */
export function NewsGrid() {
  const [feature, video, ...rest] = NEWS

  return (
    <section id="uudised" className="scroll-mt-16 border-b border-line py-16 lg:py-24">
      <div className="shell">
        <Rise>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold leading-[1.02] tracking-headline sm:text-4xl lg:text-5xl">
              Uudised ja meedia
            </h2>
            <a href="/uudised" className="text-sm font-semibold text-muted transition-colors duration-150 hover:text-chalk">
              Kõik lood
            </a>
          </div>
        </Rise>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <Rise className="lg:col-span-7">
            <a href={`/uudised/${feature.id}`} className="group block">
              <Parallax className="aspect-[16/10] bg-surface" strength={24}>
                <Image
                  src={feature.image!}
                  alt=""
                  width={1600}
                  height={1000}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="h-[112%] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                />
              </Parallax>
              <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                <span>{date(feature.date)}</span>
                <span className="h-3 w-px bg-line" aria-hidden />
                <span>{feature.minutes} min</span>
              </div>
              <h3 className="mt-3 max-w-[26ch] text-2xl font-bold leading-[1.1] tracking-headline transition-colors duration-150 group-hover:text-signal sm:text-3xl">
                {feature.title}
              </h3>
              <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-muted">{feature.summary}</p>
            </a>
          </Rise>

          <div className="lg:col-span-5">
            <Rise delay={0.08}>
              <a href={`/uudised/${video.id}`} className="group block">
                <div className="relative aspect-video overflow-hidden bg-surface">
                  <Image
                    src={video.image!}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-4 left-4 inline-flex h-12 w-12 items-center justify-center bg-signal text-ink transition-transform duration-200 group-hover:scale-105">
                    <Play size={18} weight="fill" />
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  <span className="flex items-center gap-1.5 text-signal"><KindIcon kind="video" /> Video</span>
                  <span className="h-3 w-px bg-line" aria-hidden />
                  <span>{video.minutes} min</span>
                </div>
                <h3 className="mt-2 text-xl font-bold leading-tight tracking-headline transition-colors duration-150 group-hover:text-signal">
                  {video.title}
                </h3>
              </a>
            </Rise>

            <Rise delay={0.16} className="mt-8">
              <ul className="border-t border-line">
                {rest.map((item) => (
                  <li key={item.id} className="border-b border-line">
                    <a href={`/uudised/${item.id}`} className="group flex items-start justify-between gap-4 py-4">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                          <KindIcon kind={item.kind} />
                          <span>{date(item.date)}</span>
                        </div>
                        <h3 className="mt-1.5 text-base font-semibold leading-snug transition-colors duration-150 group-hover:text-signal">
                          {item.title}
                        </h3>
                      </div>
                      <ArrowUpRight size={16} weight="bold" className="mt-1 shrink-0 text-muted transition-colors duration-150 group-hover:text-chalk" />
                    </a>
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  )
}
