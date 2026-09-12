import Image from 'next/image'
import { Reveal } from './reveal'

/**
 * Brändiraamat 08/Imagery: "show what rally feels like" — koht + skaala,
 * tegevus + tagajärg, inimesed + ettevalmistus. Pildid on päris kaadrid
 * EMV etappidelt (kaust `Fotod/`), mitte lavastatud stock.
 */
const PHOTOS = [
  {
    src: '/images/action-rain.jpg',
    alt: 'Rallisõiduk kihutamas vihmases kiiruskatses',
    caption: 'Iga ilm, iga katse',
  },
  {
    src: '/images/action-crowd.jpg',
    alt: 'Pealtvaatajad jälgimas rallisõidukit lähedalt katsel',
    caption: 'Publik teeäärel',
  },
  {
    src: '/images/action-speed.jpg',
    alt: 'Rallisõiduk kiirel läbisõidul, taustal liikumishägu',
    caption: 'Sekundid loevad',
  },
]

export function MediaGallery() {
  return (
    <section className="border-b border-line py-20 lg:py-28" id="galerii">
      <div className="shell">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">
            Meedia
          </p>
          <h2 className="mt-5 max-w-[20ch] font-display text-4xl font-bold uppercase leading-[1.02] text-black sm:text-5xl">
            Nii tundub Eesti ralli
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-14 grid gap-5 sm:grid-cols-3">
          {PHOTOS.map((photo) => (
            <figure key={photo.src} className="group relative overflow-hidden bg-black">
              <div className="relative aspect-[4/5]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-forward group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />
              </div>
              <figcaption className="absolute bottom-0 left-0 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
