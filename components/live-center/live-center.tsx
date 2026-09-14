'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { OverallTab } from './overall-tab'
import { BlogTab } from './blog-tab'
import { BroadcastTab } from './broadcast-tab'
import { StageTimesTab } from './stage-times-tab'
import { SplitTimesTab } from './split-times-tab'
import { StageWinnersTab } from './stage-winners-tab'
import { TimetableTab } from './timetable-tab'
import { CompetitorsTab } from './competitors-tab'
import { PenaltiesTab } from './penalties-tab'
import { RetirementsTab } from './retirements-tab'
import { ChipStrip, Chip } from './chip-strip'
import { useT } from '../locale-provider'

/**
 * Live Center on kolm osa, mis on eri allikatega ja eri asjad:
 *   Tulemused    — ajavõtt RallyLynxist (kaheksa vaadet)
 *   Otseülekanne — YouTube
 *   Otseblogi    — autoralli.ee kaasautorid
 * RallyLynxi nimi käib ainult tulemuste all; blogil ja ülekandel on oma
 * allikas. Sektsioon on ülemine tume riba; tulemuste sees on teine riba
 * kaheksa ajavõtuvaatega.
 */
const TIMING_VIEWS = [
  { id: 'overall', labelKey: 'overall', hash: 'uldarvestus', Component: OverallTab },
  { id: 'stage-times', labelKey: 'stageTimes', hash: 'katseajad', Component: StageTimesTab },
  { id: 'splits', labelKey: 'splits', hash: 'vaheajad', Component: SplitTimesTab },
  { id: 'winners', labelKey: 'winners', hash: 'katsevoitjad', Component: StageWinnersTab },
  { id: 'timetable', labelKey: 'timetable', hash: 'ajatabel', Component: TimetableTab },
  { id: 'start-list', labelKey: 'startList', hash: 'startinimekiri', Component: CompetitorsTab },
  { id: 'penalties', labelKey: 'penalties', hash: 'karistused', Component: PenaltiesTab },
  { id: 'retirements', labelKey: 'retirements', hash: 'katkestajad', Component: RetirementsTab },
] as const

type TimingId = (typeof TIMING_VIEWS)[number]['id']
type SectionId = 'timing' | 'broadcast' | 'blog'

const SECTION_HASH: Record<SectionId, string> = { timing: 'tulemused', broadcast: 'otseulekanne', blog: 'otseblogi' }

/** Ankur → (sektsioon, ajavõtuvaade). Tunneb ka vanu ankruid (#blogi, #katseajad). */
function fromHash(hash: string): { section: SectionId; view: TimingId } | null {
  const key = hash.replace(/^#/, '').toLowerCase()
  if (!key) return null
  if (key === 'otseblogi' || key === 'blogi' || key === 'blog') return { section: 'blog', view: 'overall' }
  if (key === 'otseulekanne' || key === 'broadcast') return { section: 'broadcast', view: 'overall' }
  if (key === 'tulemused' || key === 'timing') return { section: 'timing', view: 'overall' }
  const view = TIMING_VIEWS.find((v) => v.hash === key || v.id === key)
  return view ? { section: 'timing', view: view.id } : null
}

export function LiveCenter() {
  const t = useT()
  const [section, setSection] = useState<SectionId>('timing')
  const [view, setView] = useState<TimingId>('overall')
  const active = TIMING_VIEWS.find((v) => v.id === view) ?? TIMING_VIEWS[0]

  // Süvalingid: /otse#otseblogi, #otseulekanne, #katseajad … Aadressiriba
  // järgib valikut, et linki saaks edasi saata.
  useEffect(() => {
    const apply = () => {
      const parsed = fromHash(window.location.hash)
      if (parsed) {
        setSection(parsed.section)
        setView(parsed.view)
      }
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [])

  const selectSection = (id: SectionId) => {
    setSection(id)
    window.history.replaceState(null, '', `#${id === 'timing' ? active.hash : SECTION_HASH[id]}`)
  }
  const selectView = (id: TimingId) => {
    setView(id)
    const v = TIMING_VIEWS.find((x) => x.id === id) ?? TIMING_VIEWS[0]
    window.history.replaceState(null, '', `#${v.hash}`)
  }

  const sections: Array<{ id: SectionId; label: string }> = [
    { id: 'timing', label: t.live.sections.timing },
    { id: 'broadcast', label: t.live.sections.broadcast },
    { id: 'blog', label: t.live.sections.blog },
  ]

  return (
    <div>
      {/* Ülemine riba: kolm osa. Kleepub päise alla. */}
      <div className="sticky top-16 z-40 border-b border-white/10 bg-midnight sm:top-[72px]">
        <div className="shell">
          <ChipStrip ariaLabel={t.live.chooseSection} role="tablist" tone="dark" className="py-3">
            {sections.map((s) => (
              <Chip
                key={s.id}
                id={`live-section-${s.id}`}
                controls="live-panel"
                active={s.id === section}
                onClick={() => selectSection(s.id)}
              >
                {s.label}
              </Chip>
            ))}
          </ChipStrip>
        </div>
      </div>

      {/* Tulemuste sees: ajavõtuvaated. Hele, sest see on juba ajavõtuleht. */}
      {section === 'timing' ? (
        <div className="border-b border-line bg-mist">
          <div className="shell">
            <ChipStrip ariaLabel={t.live.chooseView} role="tablist" className="py-2">
              {TIMING_VIEWS.map((v) => (
                <Chip
                  key={v.id}
                  id={`live-view-${v.id}`}
                  controls="live-panel"
                  active={v.id === view}
                  onClick={() => selectView(v.id)}
                >
                  {t.live.tabs[v.labelKey]}
                </Chip>
              ))}
            </ChipStrip>
          </div>
        </div>
      ) : null}

      <div className="shell">
        <div
          id="live-panel"
          role="tabpanel"
          aria-labelledby={section === 'timing' ? `live-view-${active.id}` : `live-section-${section}`}
          className="pt-6"
          tabIndex={0}
        >
          {section === 'timing' ? <active.Component /> : section === 'broadcast' ? <BroadcastTab /> : <BlogTab />}
        </div>

        {/* Ajavõtupartneri tunnustus ainult tulemuste all — blogil ja ülekandel on oma allikas. */}
        {section === 'timing' ? (
          <a
            href="https://rallylynx.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-16 mt-10 inline-flex items-center gap-3 border-t border-line pt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate transition-colors hover:text-black"
          >
            {t.results.poweredBy}
            <Image
              src="/images/partners/rallylynx-logo.png"
              alt="RallyLynx"
              width={1024}
              height={551}
              className="h-7 w-auto object-contain"
            />
          </a>
        ) : (
          <div className="mb-16" />
        )}
      </div>
    </div>
  )
}
