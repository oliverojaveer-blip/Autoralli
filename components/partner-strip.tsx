import Image from 'next/image'

/**
 * Logoriba käib hero ALL, mitte sees. Ainult logod, ilma kategooriasiltideta.
 * Brändiraamat 11/Co-branding: partnerlogod ei sisene meistrivõistluse
 * turva-alasse, eraldi identiteedid vähemalt 1.5X vahega.
 * Uue partneri lisamiseks: pane fail public/ kausta ja lisa siia rida.
 */
const PARTNERS = [
  { src: '/eal-logo.png', alt: 'Eesti Autospordi Liit', width: 40, height: 40 },
  { src: '/terminal-logo.png', alt: 'Terminal', width: 132, height: 33 },
]

export function PartnerStrip() {
  return (
    <section className="border-b border-line bg-mist" aria-label="Partnerid">
      <div className="shell flex flex-wrap items-center gap-x-5 gap-y-6 py-8">
        <div className="flex items-center gap-3">
          <span className="h-[3px] w-6 bg-blue" aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-black">
            Koostöös
          </span>
        </div>
        <div className="hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
        <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
          {PARTNERS.map((partner) => (
            <Image
              key={partner.src}
              src={partner.src}
              alt={partner.alt}
              width={partner.width}
              height={partner.height}
              className="h-8 w-auto opacity-80 transition-opacity hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
