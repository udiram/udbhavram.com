import { publicContentRegistry, starterContentIds, type ContentKind, type PublicContentItem } from './contentRegistry'

const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const indexed = publicContentRegistry.map((item, order) => ({ item, order, title: normalize(item.title), summary: normalize(item.summary), meta: normalize(item.meta), keywords: normalize(item.keywords.join(' ')) }))
// Prefer the current, interpretive surfaces when a historical collection echo
// also matches; exact-title scores can still put a specific record first.
const kindWeight: Record<ContentKind, number> = { Study: 60, Experience: 48, Software: 35, Award: 28, Paper: 24, Presentation: 16, Media: 10, Project: 0, Collection: 0 }

export function rankContent(query: string, category: ContentKind | 'All'): PublicContentItem[] {
  const normalized = normalize(query)
  const terms = [...new Set(normalized.split(' ').filter(Boolean))]
  if (!terms.length) {
    if (category !== 'All') return publicContentRegistry.filter(item => item.kind === category).slice(0, 6)
    return starterContentIds.map(id => publicContentRegistry.find(item => item.id === id)).filter((item): item is PublicContentItem => Boolean(item))
  }
  return indexed.filter(entry => category === 'All' || entry.item.kind === category).map(entry => {
    const haystack = `${entry.title} ${entry.summary} ${entry.meta} ${entry.keywords}`
    if (!terms.every(term => haystack.includes(term))) return null
    let score = (entry.title === normalized ? 180 : entry.title.startsWith(normalized) ? 120 : entry.title.includes(normalized) ? 90 : 0) + kindWeight[entry.item.kind]
    for (const term of terms) {
      if (entry.title.split(' ').includes(term)) score += 35
      else if (entry.title.includes(term)) score += 24
      if (entry.keywords.includes(term)) score += 14
      if (entry.meta.includes(term)) score += 10
      if (entry.summary.includes(term)) score += 6
    }
    return { ...entry, score }
  }).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)).sort((a, b) => b.score - a.score || a.order - b.order).slice(0, 12).map(entry => entry.item)
}
