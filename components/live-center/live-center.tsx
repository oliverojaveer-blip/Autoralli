'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ClassificationTab } from './classification-tab'
import { SplitTimesTab } from './split-times-tab'
import { StageWinnersTab } from './stage-winners-tab'
import { TimetableTab } from './timetable-tab'
import { RetirementsTab } from './retirements-tab'
import { PenaltiesTab } from './penalties-tab'
import { CompetitorsTab } from './competitors-tab'

const TABS = [
  { id: 'classification', label: 'Klassifikatsioon', Component: ClassificationTab },
  { id: 'splits', label: 'Vahepunktid', Component: SplitTimesTab },
  { id: 'winners', label: 'Kiiruskatsete võitjad', Component: StageWinnersTab },
  { id: 'timetable', label: 'Ajakava', Component: TimetableTab },
  { id: 'retirements', label: 'Katkestamised', Component: RetirementsTab },
  { id: 'penalties', label: 'Karistused', Component: PenaltiesTab },
  { id: 'competitors', label: 'Osalejad', Component: CompetitorsTab },
] as const

/**
 * RallyLynx-põhine tulemuste keskus /otse lehel. Vahekaardid vastavad
 * otse API endpointidele (classification/results/retirements/penalties/
 * itinerary/competitors) — igaüks laeb ja uuendab oma andmeid ise.
 */
export function LiveCenter() {
  const [activeId, setActiveId] = useState<(typeof TABS)[number]['id']>('classification')
  const reducedMotionRaw = useReducedMotion()
  const reducedMotion = reducedMotionRaw ?? false
  const active = TABS.find((t) => t.id === activeId) ?? TABS[0]

  return (
    <div>
      <div
        role="tablist"
        aria-label="Vali vaade"
        className="flex flex-wrap gap-2 border-b border-line pb-6"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(tab.id)}
              className="relative px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] transition-colors"
            >
              {isActive ? (
                <motion.span
                  layoutId="live-center-tab-pill"
                  className="absolute inset-0 bg-blue"
                  transition={
                    reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }
                  }
                />
              ) : (
                <span className="absolute inset-0 border border-line" aria-hidden="true" />
              )}
              <span className={`relative ${isActive ? 'text-white' : 'text-slate'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-8">
        <active.Component />
      </div>
    </div>
  )
}
