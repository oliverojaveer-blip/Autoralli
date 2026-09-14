'use client'

import type { RallyStageView } from '@/lib/rallylynx/adapter'
import { ChipStrip, Chip } from './chip-strip'
import { useT } from '../locale-provider'

/**
 * Kiiruskatse valik. Esimene plaat "Viimane" viib alati värskeima katse
 * juurde (sinna, kuhu leht vaikimisi avaneb); aktiivne plaat keritakse
 * vaatesse, nii et SS10 ei jää telefonil serva taha peitu.
 */
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
  const last = stages[stages.length - 1]
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate">{t.live.stage}</p>
      <div className="mt-1.5">
        <ChipStrip ariaLabel={t.live.chooseStage}>
          {last ? (
            <Chip active={false} onClick={() => onChange(last.id)}>
              {t.live.latest}
            </Chip>
          ) : null}
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
