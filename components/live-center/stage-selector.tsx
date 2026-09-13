'use client'

import type { RallyStageView } from '@/lib/rallylynx/adapter'

export function StageSelector({
  stages,
  activeId,
  onChange,
}: {
  stages: RallyStageView[]
  activeId: string | null
  onChange: (id: string) => void
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
        Kiiruskatse
      </p>
      <div role="tablist" aria-label="Vali kiiruskatse" className="mt-2 flex flex-wrap gap-2">
        {stages.map((stage) => (
          <button
            key={stage.id}
            type="button"
            role="tab"
            aria-selected={activeId === stage.id}
            onClick={() => onChange(stage.id)}
            className={`border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em] transition-colors ${
              activeId === stage.id ? 'border-blue bg-blue text-white' : 'border-line text-slate'
            }`}
          >
            {stage.code}
          </button>
        ))}
      </div>
    </div>
  )
}
