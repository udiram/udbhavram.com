import bibliography from './bibliography.json'
import { studies } from './expandedContent'
import media from './mediaContent.json'
import { portfolioCollections, type RecordItem } from './portfolioContent'
import { presentations } from './presentationData'
import { softwareProjects } from './softwareContent'
import { awardRecords, experienceRecords, projectRecords } from './identityContent'

export type ContentKind = 'Study' | 'Software' | 'Paper' | 'Presentation' | 'Media' | 'Experience' | 'Project' | 'Award' | 'Collection'

export type PublicContentItem = {
  id: string
  kind: ContentKind
  title: string
  summary: string
  meta: string
  href: string
  keywords: string[]
}

const slug = (value: string) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

export const collectionRecordContentId = (collectionId: string, item: { id?: string; title: string }) => `collection:${collectionId}:${slug(item.id ?? item.title)}`

const studyItems: PublicContentItem[] = studies.map(study => ({
  id: `study:${study.slug}`,
  kind: 'Study',
  title: study.title,
  summary: study.intro,
  meta: `${study.year} · ${study.status}`,
  href: `/research/${study.slug}`,
  keywords: [study.subtitle, ...study.sections.map(section => section.heading)],
}))

const softwareItems: PublicContentItem[] = softwareProjects.map(project => ({
  id: `software:${project.id}`,
  kind: 'Software',
  title: project.name,
  summary: project.copy,
  meta: project.meta,
  href: `/software#${project.id === 'ct-forge' ? 'ct-forge' : `software-${project.id}`}`,
  keywords: [project.boundary],
}))

const paperItems: PublicContentItem[] = bibliography.map(paper => ({
  id: `paper:${paper.id}`,
  kind: 'Paper',
  title: paper.title,
  summary: `${paper.role}. Published in ${paper.journal}.`,
  meta: `${paper.issue_date} · ${paper.journal}`,
  href: `/publications#paper-${paper.id}`,
  keywords: [...paper.authors, paper.doi, paper.status],
}))

const presentationItems: PublicContentItem[] = presentations.map(presentation => ({
  id: `presentation:${presentation.id}`,
  kind: 'Presentation',
  title: presentation.title,
  summary: `${presentation.role}. ${presentation.status}${presentation.presenter ? ` Presenter: ${presentation.presenter}.` : ''}`,
  meta: `${presentation.date} · ${presentation.venue} · ${presentation.format}`,
  href: `/publications#${presentation.id}`,
  keywords: [presentation.location, presentation.programCode, presentation.award, ...presentation.variants].filter((value): value is string => Boolean(value)),
}))

const articleGroups = [...new Set(media.articles.map(article => article.story_group))]
const mediaArticleItems: PublicContentItem[] = articleGroups.map(group => {
  const editions = media.articles.filter(article => article.story_group === group)
  const article = editions[0]
  return {
    id: `media:article:${group}`,
    kind: 'Media',
    title: article.title,
    summary: article.summary,
    meta: `${article.published_date} · ${article.publisher}`,
    href: `/media#${article.id}`,
    keywords: editions.flatMap(edition => [edition.title, edition.publisher, edition.udi_role, edition.author]).filter((value): value is string => Boolean(value)),
  }
})

const mediaVideoItems: PublicContentItem[] = media.videos.map(video => ({
  id: `media:video:${video.id}`,
  kind: 'Media',
  title: video.title,
  summary: video.summary,
  meta: `${video.topic} · ${video.duration}`,
  href: `/media#${video.id}`,
  keywords: [video.upload_date, video.event_date].filter((value): value is string => Boolean(value)),
}))

const mediaProfileItems: PublicContentItem[] = media.profiles.map(profile => ({
  id: `media:profile:${profile.id}`,
  kind: 'Media',
  title: profile.title,
  summary: profile.summary,
  meta: profile.publisher,
  href: `/media#profile-${profile.id}`,
  keywords: profile.related_pages,
}))

const mediaWritingItems: PublicContentItem[] = media.writing.map(entry => ({
  id: `media:writing:${entry.id}`,
  kind: 'Media',
  title: entry.title,
  summary: 'An essay from Udi’s earlier research, preserved with its original source.',
  meta: `${entry.published_date} · ${entry.publisher}`,
  href: `/media#writing-${entry.id}`,
  keywords: [],
}))

const experienceItems: PublicContentItem[] = experienceRecords.map(record => ({
  id: `experience:${record.id}`,
  kind: 'Experience',
  title: `${record.role} · ${record.institution}`,
  summary: record.summary,
  meta: `${record.period} · ${record.category} · ${record.status}`,
  href: `/experience#${record.id}`,
  keywords: [record.location, record.note, ...record.work].filter((value): value is string => Boolean(value)),
}))

// Software projects appear in the institution-connected project index, but
// their canonical discovery/save identity remains `software:<id>`.
const projectIdentityItems: PublicContentItem[] = projectRecords.filter(project => !project.id.startsWith('software-')).map(project => ({
  id: `project:${project.id}`,
  kind: 'Project',
  title: project.title,
  summary: project.summary,
  meta: `${project.institution} · ${project.period} · ${project.category}`,
  href: `/experience#project-${project.id}`,
  keywords: [project.outcome],
}))

const awardItems: PublicContentItem[] = awardRecords.map(record => ({
  id: `award:${record.id}`,
  kind: 'Award',
  title: record.title,
  summary: record.detail,
  meta: [record.year, record.issuer, record.category].filter(Boolean).join(' · '),
  href: `/awards#${record.id}`,
  keywords: [record.ownership, record.evidence, record.note].filter((value): value is string => Boolean(value)),
}))

const canonicalSourceHrefs = new Set<string>([
  ...studies.flatMap(study => study.sources.map(source => source.href)),
  ...bibliography.flatMap(paper => [paper.url, 'index_url' in paper ? paper.index_url : undefined]),
  ...presentations.flatMap(presentation => presentation.sources.map(source => source.url)),
  ...media.articles.map(article => article.url),
  ...media.videos.map(video => video.url),
  ...media.profiles.map(profile => profile.url),
  ...media.writing.map(entry => entry.url),
  ...softwareProjects.map(project => project.href),
].filter((href): href is string => Boolean(href)))

// Historical collection records sometimes point at an item that already has a
// richer canonical surface. Keep those records in their chapter, but make Save
// resolve to the canonical registry identity instead of creating a dead alias.
const canonicalIdBySourceHref = new Map<string, string>()
const registerCanonicalSource = (href: string | undefined, id: string) => {
  if (href && !canonicalIdBySourceHref.has(href)) canonicalIdBySourceHref.set(href, id)
}
bibliography.forEach(paper => {
  registerCanonicalSource(paper.url, `paper:${paper.id}`)
  if ('index_url' in paper) registerCanonicalSource(paper.index_url, `paper:${paper.id}`)
})
presentations.forEach(presentation => presentation.sources.forEach(source => registerCanonicalSource(source.url, `presentation:${presentation.id}`)))
media.articles.forEach(article => registerCanonicalSource(article.url, `media:article:${article.story_group}`))
media.videos.forEach(video => registerCanonicalSource(video.url, `media:video:${video.id}`))
media.profiles.forEach(profile => registerCanonicalSource(profile.url, `media:profile:${profile.id}`))
media.writing.forEach(entry => registerCanonicalSource(entry.url, `media:writing:${entry.id}`))
softwareProjects.forEach(project => registerCanonicalSource(project.href, `software:${project.id}`))
studies.forEach(study => study.sources.forEach(source => registerCanonicalSource(source.href, `study:${study.slug}`)))

const collectionItems: PublicContentItem[] = portfolioCollections.flatMap(collection =>
  collection.groups.flatMap((group, groupIndex) => group.items.flatMap((item, itemIndex) => {
    if (item.presentationId || (item.href && canonicalSourceHrefs.has(item.href))) return []
    return [{
      id: collectionRecordContentId(collection.id, item),
      kind: 'Collection' as const,
      title: item.title,
      summary: item.detail ?? item.note ?? `A record from ${collection.title}.`,
      meta: [collection.title, group.title, item.meta].filter(Boolean).join(' · '),
      href: `/collection/${collection.id}#entry-${groupIndex}-${itemIndex}`,
      keywords: [item.note, item.href].filter((value): value is string => Boolean(value)),
    }]
  })),
)

const candidates = [
  ...studyItems,
  ...softwareItems,
  ...paperItems,
  ...presentationItems,
  ...mediaArticleItems,
  ...mediaVideoItems,
  ...mediaProfileItems,
  ...mediaWritingItems,
  ...experienceItems,
  ...projectIdentityItems,
  ...awardItems,
  ...collectionItems,
]

const seen = new Set<string>()
export const publicContentRegistry: PublicContentItem[] = candidates.filter(item => {
  if (seen.has(item.id)) return false
  seen.add(item.id)
  return true
})

export const publicContentById = new Map(publicContentRegistry.map(item => [item.id, item]))

export function resolveCollectionRecordContentId(collectionId: string, item: RecordItem) {
  if (item.presentationId) return `presentation:${item.presentationId}`
  const historicalId = collectionRecordContentId(collectionId, item)
  if (publicContentById.has(historicalId)) return historicalId
  return (item.href && canonicalIdBySourceHref.get(item.href)) || historicalId
}

export const starterContentIds = [
  'study:clinical-language-models',
  'software:protocoliq',
  'software:rsna-explorer',
  'media:video:video-GNboj6JfDeI',
]
