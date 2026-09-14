/**
 * Minimaalne tüüp Sanity skeemidele, et need kompileeruksid enne, kui
 * `sanity` pakett on projekti lisatud (claude.md: ära lisa sõltuvust ilma
 * selge põhjuseta — Studio tuleb siis, kui blogi on otsustatud). Kui
 * Sanity lisatakse, asenda `defineType`/`defineField` importidega paketist
 * `sanity`; kujud on samad.
 */
export type SanityField = {
  name: string
  title: string
  type: string
  description?: string
  readOnly?: boolean
  hidden?: boolean
  initialValue?: unknown
  of?: Array<{ type: string; to?: Array<{ type: string }> }>
  to?: Array<{ type: string }>
  options?: Record<string, unknown>
  fields?: SanityField[]
  validation?: (rule: SanityRule) => unknown
}

export type SanityRule = {
  required: () => SanityRule
  max: (n: number) => SanityRule
  min: (n: number) => SanityRule
  uri: (opts: { scheme: string[] }) => SanityRule
  regex: (re: RegExp, opts?: { name?: string }) => SanityRule
  unique: () => SanityRule
}

export type SanityDocumentType = {
  name: string
  title: string
  type: 'document'
  description?: string
  fields: SanityField[]
  preview?: { select: Record<string, string>; prepare?: (v: Record<string, unknown>) => { title?: string; subtitle?: string } }
  orderings?: Array<{ title: string; name: string; by: Array<{ field: string; direction: 'asc' | 'desc' }> }>
}

export function defineType(type: SanityDocumentType): SanityDocumentType {
  return type
}

export function defineField(field: SanityField): SanityField {
  return field
}
