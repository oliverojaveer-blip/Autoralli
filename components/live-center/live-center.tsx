'use client'

import { useState } from 'react'
import Image from 'next/image'
import { OverallTab } from './overall-tab'
import { StageTimesTab } from './stage-times-tab'
import { SplitTimesTab } from './split-times-tab'
import { StageWinnersTab } from './stage-winners-tab'
import { TimetableTab } from './timetable-tab'
import { CompetitorsTab } from './competitors-tab'
import { PenaltiesTab } from './penalties-tab'
import { RetirementsTab } from './retirements-tab'
import { ChipStrip, Chip } from './chip-strip'
import { useT } from '../locale-provider'

const TABS = [
  { id: 'overall', labelKey: 'overall', Component: OverallTab },
  { id: 'stage-times', labelKey: 'stageTimes', Component: StageTimesTab },
  { id: 'splits', labelKey: 'splits', Component: SplitTimesTab },
  { id: 'winners', labelKey: 'winners', Component: StageWinnersTab },
  { id: 'timetable', labelKey: 'timetable', Component: TimetableTab },
  { id: 'start-list', labelKey: 'startList', Component: CompetitorsTab },
  { id: 'penalties', labelKey: 'penalties', Component: PenaltiesTab },
  { id: 'retirements', labelKey: 'retirements', Component: RetirementsTab },
] as const

/**
 * RallyLynx-põhine tulemuste keskus /otse lehel. Vahekaardid vastavad
 * otse API endpointidele — igaüks laeb ja uuendab oma andmeid ise;
 * võistluse ülevaade ja katsete nimekiri tulevad ühisest kontekstist
 * (`LiveSelectionProvider`, lehel bar'i ja keskuse ümber).
 *
 * Vahekaardiriba on tume, päise alla kleepuv juhtriba lipulõikega
 * plaatidest — sama grammatika, mis päisel ja avalehe kiirlinkidel.
 * Ainult see riba on `tablist`; paneel on `tabpanel`, mis viitab tagasi.
 */
export function LiveCenter() {
  const t = useT()
  const [activeId, setActiveId] = useState<(typeof TABS)[number]['id']>('overall')
  const active = TABS.find((tab) => tab.id === activeId) ?? TABS[0]

  return (
    <div>
      <div className="sticky top-16 z-40 border-b border-white/10 bg-midnight sm:top-[72px]">
        <div className="shell">
          <ChipStrip ariaLabel={t.live.chooseView} role="tablist" tone="dark" className="py-3">
            {TABS.map((tab) => (
              <Chip
                key={tab.id}
                id={`live-tab-${tab.id}`}
                controls="live-panel"
                active={tab.id === activeId}
                onClick={() => setActiveId(tab.id)}
              >
                {t.live.tabs[tab.labelKey]}
              </Chip>
            ))}
          </ChipStrip>
        </div>
      </div>

      <div className="shell">
        <div id="live-panel" role="tabpanel" aria-labelledby={`live-tab-${active.id}`} className="pt-6" tabIndex={0}>
          <active.Component />
        </div>

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
      </div>
    </div>
  )
}
