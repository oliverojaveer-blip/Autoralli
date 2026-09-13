'use client'

import { useState } from 'react'
import { OverallTab } from './overall-tab'
import { StageTimesTab } from './stage-times-tab'
import { SplitTimesTab } from './split-times-tab'
import { StageWinnersTab } from './stage-winners-tab'
import { TimetableTab } from './timetable-tab'
import { CompetitorsTab } from './competitors-tab'
import { PenaltiesTab } from './penalties-tab'
import { RetirementsTab } from './retirements-tab'
import { ChipStrip, Chip } from './chip-strip'

const TABS = [
  { id: 'overall', label: 'Üldarvestus', Component: OverallTab },
  { id: 'stage-times', label: 'Katseajad', Component: StageTimesTab },
  { id: 'splits', label: 'Vaheajad', Component: SplitTimesTab },
  { id: 'winners', label: 'Katsevõitjad', Component: StageWinnersTab },
  { id: 'timetable', label: 'Ajatabel', Component: TimetableTab },
  { id: 'start-list', label: 'Startinimekiri', Component: CompetitorsTab },
  { id: 'penalties', label: 'Karistused', Component: PenaltiesTab },
  { id: 'retirements', label: 'Katkestajad', Component: RetirementsTab },
] as const

/**
 * RallyLynx-põhine tulemuste keskus /otse lehel. Vahekaardid vastavad
 * otse API endpointidele (classification/results/retirements/penalties/
 * itinerary/competitors) — igaüks laeb ja uuendab oma andmeid ise.
 *
 * Vahekaardiriba on horisontaalselt keritav "slider" (`ChipStrip`), mitte
 * mitmereaks murduv nupurivi — mobiilis on ühe sõrmeliigutusega kerimine
 * palju kiirem kui mitme rea vahel skaneerimine.
 */
export function LiveCenter() {
  const [activeId, setActiveId] = useState<(typeof TABS)[number]['id']>('overall')
  const active = TABS.find((t) => t.id === activeId) ?? TABS[0]

  return (
    <div>
      <div className="border-b border-line pb-6">
        <ChipStrip ariaLabel="Vali vaade">
          {TABS.map((tab) => (
            <Chip key={tab.id} active={tab.id === activeId} onClick={() => setActiveId(tab.id)}>
              {tab.label}
            </Chip>
          ))}
        </ChipStrip>
      </div>

      <div className="mt-8">
        <active.Component />
      </div>
    </div>
  )
}
