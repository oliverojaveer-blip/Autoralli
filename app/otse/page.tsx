import type { Metadata } from 'next'
import Image from 'next/image'
import { CalendarBlank, MapPin } from '@phosphor-icons/react/dist/ssr'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { LiveCountdown } from '@/components/live-countdown'
import { formatRange, nextEvent } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Live',
  description: 'Otseülekanne ja loendur järgmise Eesti meistrivõistluste etapini — Estonian Rally Championship Live Center.',
}

const MONTHS_SHORT = [
  'JAAN',
  'VEEBR',
  'MÄRTS',
  'APR',
  'MAI',
  'JUUNI',
  'JUULI',
  'AUG',
  'SEPT',
  'OKT',
  'NOV',
  'DETS',
]

function dateTile(iso: string) {
  const d = new Date(iso)
  return { day: d.getUTCDate(), month: MONTHS_SHORT[d.getUTCMonth()] }
}

/**
 * Live Center — eraldi leht (mitte /tulemused, mis jääb omaette
 * tulemuste lehena). `status` on siin praegu alati "scheduled", sest
 * saidil ei ole veel ajavõtupartneri liidestust, mis annaks teada, millal
 * etapp on tegelikult otse-eetris (vt claude.md "Live-andmete puudumisel
 * ära genereeri oletatavaid positsioone"). Kui EAL alustab YouTube'i
 * otseülekannet, tuleb `status="live"` ja `youtubeVideoId` siduda selle
 * päris andmeallikaga, mitte kõvasti kirjutada.
 */
export default function OtsePage() {
  const event = nextEvent()
  const start = dateTile(event.startsAt)
  const end = dateTile(event.endsAt)

  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="relative overflow-hidden bg-black">
          <div className="absolute inset-0">
            <Image
              src={event.photo.src}
              alt={event.photo.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          </div>

          <div className="shell relative flex min-h-[420px] flex-col justify-end gap-6 pb-10 pt-24 sm:min-h-[480px] sm:pb-14">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                {event.logo ? (
                  <div className="mb-5 inline-flex items-center bg-white/95 px-4 py-3 shadow-lg">
                    <Image
                      src={event.logo.src}
                      alt={event.logo.alt}
                      width={event.logo.width}
                      height={event.logo.height}
                      className="h-14 w-auto object-contain sm:h-16"
                    />
                  </div>
                ) : null}

                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">
                  Live Center
                </p>
                <h1 className="mt-3 max-w-[22ch] font-display text-4xl font-bold uppercase leading-[0.98] text-white sm:text-5xl lg:text-6xl">
                  {event.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={16} weight="bold" className="text-blue" />
                    {event.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarBlank size={16} weight="bold" className="text-blue" />
                    {formatRange(event.startsAt, event.endsAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center bg-white px-4 py-2.5 leading-none text-black">
                  <span className="font-display text-2xl font-bold">{start.day}</span>
                  <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate">
                    {start.month}
                  </span>
                </div>
                <span className="text-white/40">—</span>
                <div className="flex flex-col items-center bg-white px-4 py-2.5 leading-none text-black">
                  <span className="font-display text-2xl font-bold">{end.day}</span>
                  <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate">
                    {end.month}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black py-16 lg:py-20">
          <div className="shell">
            <LiveCountdown eventName={event.name} targetTime={event.startsAt} status="scheduled" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
