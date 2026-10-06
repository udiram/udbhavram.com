export type PresentationSource = { label: string; url: string }

/** One conference contribution or institutional talk, distinct from its awards. */
export type Presentation = {
  id: string
  title: string
  date: string
  sortDate: string
  year: number
  venue: string
  location?: string
  format: string
  role: string
  status: string
  programCode?: string
  aggregate: boolean
  variants: string[]
  presenter?: string
  authors?: string[]
  award?: string
  note?: string
  sources: PresentationSource[]
  studyPath?: string
  /** Existing collection anchor IDs retained for inbound links. */
  legacyAnchors?: string[]
}
