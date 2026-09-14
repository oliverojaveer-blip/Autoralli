'use client'

import type { RallyStageView } from '@/lib/rallylynx/adapter'
import { ChipStrip, Chip } from './chip-strip'
import { useT } from '../locale-provider'

export function StageSelector({
  stages,
  activeId,
  onChange,
}: {
  stages: RallyStageView[]
  activeId: string | null
  onChange: (id: string) => void
}) {
  const t = useT()
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
        {t.live.stage}
      </p>
      <div className="mt-2">
        <ChipStrip ariaLabel={t.live.chooseStage}>
          {stages.map((stage) => (
            <Chip key={stage.id} active={activeId === stage.id} onClick={() => onChange(stage.id)}>
              {stage.code}
            </Chip>
          ))}
        </ChipStrip>
      </div>
    </div>
  )
}
