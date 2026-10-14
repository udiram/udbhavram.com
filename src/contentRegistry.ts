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
  href: `/research#paper-${paper.id}`,
  keywords: [...paper.authors, paper.doi, paper.status],
}))

const presentationItems: PublicContentItem[] = presentations.map(presentation => ({
  id: `presentation:${presentation.id}`,
  kind: 'Presentation',
  title: presentation.title,
  summary: `${presentation.role}. ${presentation.status}${presentation.presenter ? ` Presenter: ${presentation.presenter}.` : ''}`,
  meta: `${presentation.date} · ${presentation.venue} · ${presentation.format}`,
  href: `/research#${presentation.id}`,
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

// A source URL is evidence, not identity: one article or recording may support a
// project, award, presentation, profile, and historical collection entry. Only
// aliases reviewed as the same underlying record are folded into a canonical ID.
// Keeping this table semantic and explicit prevents first-source-wins collisions.
const collectionCanonicalIds = new Map<string, string>([
  [collectionRecordContentId('research-record', { title: 'Ethos adaptive partial-breast irradiation contour variability' }), 'project:adaptive-breast'],
  [collectionRecordContentId('research-record', { title: 'Ethos 2.0 high-fidelity multi-met SRS' }), 'project:ethos-srs'],
  [collectionRecordContentId('research-record', { title: 'Abdominal-organ auto-segmentation' }), 'project:auto-segmentation'],
  [collectionRecordContentId('research-record', { title: 'Smartphone gel-electrophoresis analysis' }), 'project:gel-analysis'],
  [collectionRecordContentId('research-record', { title: 'Augmented reality for chronic-kidney-disease surgery models' }), 'project:kidney-ar'],
  [collectionRecordContentId('research-record', { title: "Nutrition, Alzheimer's disease, and amyloid aggregation" }), 'project:amyloid'],
  [collectionRecordContentId('recognition', { title: 'AAPM Blue Ribbon Poster' }), 'award:aapm-blue-ribbon'],
  [collectionRecordContentId('recognition', { title: 'McMaster Emerging Science Co-op Employer of the Year' }), 'award:employer-year'],
  [collectionRecordContentId('recognition', { title: 'McMaster feature' }), 'award:mcmaster-feature'],
  [collectionRecordContentId('recognition', { title: 'UAB feature' }), 'award:uab-feature'],
  [collectionRecordContentId('recognition', { title: 'CUPC 2023 Best Talk - first place' }), 'award:cupc-talk'],
  [collectionRecordContentId('media', { title: "Undergrad adds ‘international visiting scholar in radiation oncology’ to a jam-packed résumé" }), 'media:article:visiting-scholar-2024'],
  [collectionRecordContentId('media', { title: "Udbhav Ram’s co-op supervisors flew in from Alabama to give him an award" }), 'media:article:coop-award-2026'],
  [collectionRecordContentId('media', { title: 'Convocation countdown with Udbhav Ram' }), 'media:article:convocation-2026'],
  [collectionRecordContentId('media', { title: 'International student and mentor drive changes in medicine through AI' }), 'media:article:uab-ai-profile-2024'],
  [collectionRecordContentId('media', { title: 'Cardenas receives McMaster Co-op Emerging Employer of the Year Award' }), 'media:article:employer-recognition-2025'],
  [collectionRecordContentId('media', { title: 'Recognizing Excellence in Science: 2024 Co-op Employer of the Year Awards' }), 'media:article:employer-recognition-2025'],
])

const collectionItems: PublicContentItem[] = portfolioCollections.flatMap(collection =>
  collection.groups.flatMap((group, groupIndex) => group.items.flatMap((item, itemIndex) => {
    const historicalId = collectionRecordContentId(collection.id, item)
    if (item.presentationId || collectionCanonicalIds.has(historicalId)) return []
    return [{
      id: historicalId,
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
  return collectionCanonicalIds.get(historicalId) ?? historicalId
}

export const starterContentIds = [
  'study:clinical-language-models',
  'software:protocoliq',
  'software:rsna-explorer',
  'media:video:video-GNboj6JfDeI',
]
