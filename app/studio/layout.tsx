import type { ReactNode } from 'react'

/** Studio oma juurlayout: ilma saidi navi, fontide ja LocaleProviderita. */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="et" style={{ height: '100%' }}>
      <body style={{ margin: 0, height: '100%', overflow: 'hidden' }}>{children}</body>
    </html>
  )
}
