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
 * otse API endpointidele (classification/results/retirements/penalties/
 * itinerary/competitors) — igaüks laeb ja uuendab oma andmeid ise.
 *
 * Vahekaardiriba on horisontaalselt keritav "slider" (`ChipStrip`), mitte
 * mitmereaks murduv nupurivi — mobiilis on ühe sõrmeliigutusega kerimine
 * palju kiirem kui mitme rea vahel skaneerimine.
 */
export function LiveCenter() {
  const t = useT()
  const [activeId, setActiveId] = useState<(typeof TABS)[number]['id']>('overall')
  const active = TABS.find((tab) => tab.id === activeId) ?? TABS[0]

  return (
    <div>
      <div className="border-b border-line pb-6">
        <ChipStrip ariaLabel={t.live.chooseView}>
          {TABS.map((tab) => (
            <Chip key={tab.id} active={tab.id === activeId} onClick={() => setActiveId(tab.id)}>
              {t.live.tabs[tab.labelKey]}
            </Chip>
          ))}
        </ChipStrip>
      </div>

      <div className="mt-8">
        <active.Component />
      </div>

      <div className="mt-10 flex items-center justify-end gap-2 border-t border-line pt-6 text-xs text-slate">
        <span>{t.common.dataSource}</span>
        <Image
          src="/images/partners/rallylynx-logo.png"
          alt="RallyLynx"
          width={1024}
          height={551}
          className="h-4 w-auto object-contain opacity-70"
        />
      </div>
    </div>
  )
}
