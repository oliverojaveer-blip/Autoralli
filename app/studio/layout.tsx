import type { ReactNode } from 'react'

/** Studio oma juurlayout: ilma saidi navi, fontide ja LocaleProviderita. */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="et">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
