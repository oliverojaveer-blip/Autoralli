/**
 * Diskreetne märgis, et kõik nähtav on väljamõeldud näidissisu.
 * Renderdatakse ainult arenduskeskkonnas. Tootmises kaob ise ära.
 */
export function DemoBadge() {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <p
      className="pointer-events-none fixed bottom-5 left-16 z-[70] sm:bottom-7 border border-line bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted backdrop-blur"
      aria-hidden
    >
      näidisandmed
    </p>
  )
}
