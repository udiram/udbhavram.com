import bibliography from './bibliography.json'
import media from './mediaContent.json'
import { studies } from './expandedContent'
import { awardRecords, experienceRecords, projectRecords } from './identityContent'
import { portfolioCollections } from './portfolioContent'
import { presentations } from './presentationData'
import { publicContentRegistry, resolveCollectionRecordContentId, type ContentKind } from './contentRegistry'
import { softwareProjects } from './softwareContent'
import { curatedExperienceSourceIds } from './curatedExperience'

export type ArchiveSource = Readonly<{ label: string; href: string }>
export type ArchiveRecord = Readonly<{
  id: string; anchor: string; kind: ContentKind; title: string; summary: string; meta: string
  date: string | null; years: readonly string[]; institutions: readonly string[]; roleType: string
  sources: readonly ArchiveSource[]; details: readonly string[]; notes: readonly string[]
  image?: string; imageAlt?: string; featuredHref?: string
}>
type ArchiveDetail = { sources: ArchiveSource[]; details: string[]; notes: string[]; image?: string; imageAlt?: string }
type ArchiveMetadata = { date: string | null; years: string[]; institutions: string[]; roleType: string }

// Static portfolio data is reconciled against this date so present-tense roles
// remain deterministic and honest across builds. Update it with the source audit.
export const archiveAsOfDate = '2026-10-14'
const archiveAsOfYear = Number(archiveAsOfDate.slice(0, 4))

const detailById = new Map<string, ArchiveDetail>()
const metadataById = new Map<string, ArchiveMetadata>()
const unique = (values: readonly (string | null | undefined)[]) => [...new Set(values.map(value => value?.trim()).filter((value): value is string => Boolean(value)))]
const uniqueSources = (sources: readonly ArchiveSource[]) => [...new Map(sources.filter(source => source.href).map(source => [source.href, { ...source }])).values()]
const mergeDetail = (id: string, incoming: Partial<ArchiveDetail>) => {
  const current = detailById.get(id) ?? { sources: [], details: [], notes: [] }
  detailById.set(id, {
    sources: uniqueSources([...current.sources, ...(incoming.sources ?? [])]),
    details: unique([...current.details, ...(incoming.details ?? [])]),
    notes: unique([...current.notes, ...(incoming.notes ?? [])]),
    image: current.image ?? incoming.image,
    imageAlt: current.imageAlt ?? incoming.imageAlt,
  })
}

const institutionAliases: Readonly<Record<string, string | null>> = Object.freeze({
  'uw–madison': 'University of Wisconsin–Madison',
  'uw-madison': 'University of Wisconsin–Madison',
  'university of wisconsin–madison': 'University of Wisconsin–Madison',
  'university of wisconsin-madison': 'University of Wisconsin–Madison',
  'uab': 'University of Alabama at Birmingham',
  'uab heersink school of medicine': 'University of Alabama at Birmingham',
  'uab mary heersink institute for global health': 'University of Alabama at Birmingham',
  'uab radiation oncology': 'University of Alabama at Birmingham',
  'university of alabama at birmingham': 'University of Alabama at Birmingham',
  'mcmaster': 'McMaster University',
  'mcmaster university': 'McMaster University',
  'mcmaster news': 'McMaster University',
  'mcmaster faculty of science': 'McMaster University',
  'mcmaster university faculty of science': 'McMaster University',
  'mcmaster physics & astronomy': 'McMaster University',
  'mcmaster science careers & experience centre': 'McMaster University',
  'mcmaster science careers and experience centre': 'McMaster University',
  'mcmaster undergraduate physics society': 'McMaster University',
  'mcmaster university athletics': 'McMaster University',
  'w booth school of engineering practice and technology': 'McMaster University',
  'lawson': 'Lawson Health Research Institute',
  'lawson health research institute': 'Lawson Health Research Institute',
  'zone01': 'Robotique Zone01',
  'robotique zone01': 'Robotique Zone01',
  'frc 4939': 'FIRST Robotics Competition Team 4939',
  'first robotics competition team 4939': 'FIRST Robotics Competition Team 4939',
  'astro 2026': 'American Society for Radiation Oncology',
  'open source': null,
  'radiation oncology': null,
  'uab partnership': null,
})
const normalizeInstitution = (value: string) => {
  const trimmed = value.trim()
  const alias = institutionAliases[trimmed.toLowerCase()]
  if (alias !== undefined || Object.hasOwn(institutionAliases, trimmed.toLowerCase())) return alias
  if (/^(AAPM|AAPM Newsletter.+|American Association of Physicists in Medicine)$/i.test(trimmed)) return 'American Association of Physicists in Medicine'
  if (/^(independent(?:\s.+)?|historical|other|conference record|publication record|research collaboration)$/i.test(trimmed)) return null
  return trimmed
}
const namedInstitutions = (values: readonly (string | undefined)[]) => unique(values)
  .flatMap(value => value.split(' · '))
  .map(value => normalizeInstitution(value))
  .filter((value): value is string => Boolean(value))
  .filter((value, index, all) => all.indexOf(value) === index)
const yearsFrom = (value: string | undefined) => {
  if (!value) return []
  const found = [...value.matchAll(/(?:19|20)\d{2}/g)].map(match => Number(match[0]))
  if (found.length === 0) return []
  const ranges = value.matchAll(/((?:19|20)\d{2})\s*[–-]\s*(?:[A-Za-z]+\s+)?(present|(?:19|20)\d{2})/gi)
  for (const range of ranges) {
    const start = Number(range[1]); const end = range[2].toLowerCase() === 'present' ? archiveAsOfYear : Number(range[2])
    for (let year = start; year <= end; year += 1) found.push(year)
  }
  return [...new Set(found)].sort((a, b) => b - a).map(String)
}
const monthNumbers: Readonly<Record<string, string>> = Object.freeze({
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
})
const dateFrom = (value: string | undefined) => {
  if (!value) return null
  if (/\bpresent\b/i.test(value)) return archiveAsOfDate
  const iso = value.match(/(?:19|20)\d{2}(?:-\d{2})?(?:-\d{2})?/)?.[0]
  if (iso && iso.length > 4) return iso
  const monthDates = [...value.matchAll(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:(\d{1,2}),?\s+)?((?:19|20)\d{2})/gi)]
  const lastMonthDate = monthDates.at(-1)
  if (lastMonthDate) {
    const month = monthNumbers[lastMonthDate[1].toLowerCase()]
    const day = lastMonthDate[2]?.padStart(2, '0')
    return `${lastMonthDate[3]}-${month}${day ? `-${day}` : ''}`
  }
  return yearsFrom(value)[0] ?? null
}
const setMetadata = (id: string, values: Omit<ArchiveMetadata, 'years'> & { years?: string[]; yearSource?: string }) => {
  metadataById.set(id, {
    date: values.date,
    years: unique(values.years ?? yearsFrom(values.yearSource ?? values.date ?? undefined)).sort((a, b) => Number(b) - Number(a)),
    institutions: namedInstitutions(values.institutions),
    roleType: values.roleType,
  })
}

studies.forEach(study => {
  const id = `study:${study.slug}`
  mergeDetail(id, { sources: study.sources, details: [study.subtitle, ...study.facts.map(fact => `${fact.value} ${fact.label}`)], image: study.image.src, imageAlt: study.image.alt })
  setMetadata(id, { date: dateFrom(study.year), yearSource: study.year, institutions: study.slug === 'radkev' ? ['University of Wisconsin–Madison'] : [], roleType: 'Research study' })
})
softwareProjects.forEach(project => {
  const id = `software:${project.id}`; const projectRecord = projectRecords.find(record => record.id === `software-${project.id}`)
  mergeDetail(id, {
    sources: [project.href ? { label: project.cta ?? 'Project', href: project.href } : undefined, ...(projectRecord?.sources ?? [])].filter((source): source is ArchiveSource => Boolean(source)),
    details: [project.boundary, projectRecord?.outcome].filter((value): value is string => Boolean(value)), image: project.image || undefined, imageAlt: project.imageLabel || undefined,
  })
  setMetadata(id, { date: dateFrom(projectRecord?.period ?? project.meta), yearSource: projectRecord?.period ?? project.meta, institutions: projectRecord ? [projectRecord.institution] : [], roleType: projectRecord?.category ?? 'Software & data' })
})
bibliography.forEach(paper => {
  const id = `paper:${paper.id}`
  mergeDetail(id, {
    sources: [{ label: 'Publication', href: paper.url }, 'index_url' in paper ? { label: 'Index record', href: paper.index_url } : undefined, 'source' in paper ? { label: 'Journal issue', href: paper.source } : undefined].filter((source): source is ArchiveSource => Boolean(source)),
    details: [`Authors: ${paper.authors.join(', ')}`, `First published online ${paper.online_date}; journal issue ${paper.issue_date}.`, `${paper.journal} ${paper.volume}(${paper.issue}), ${'pages' in paper ? paper.pages : paper.article_number}. DOI: ${paper.doi}.`],
  })
  setMetadata(id, { date: paper.online_date, years: unique([...yearsFrom(paper.online_date), ...yearsFrom(paper.issue_date)]), institutions: [], roleType: paper.role })
})
presentations.forEach(presentation => {
  const id = `presentation:${presentation.id}`
  mergeDetail(id, { sources: presentation.sources.map(source => ({ label: source.label, href: source.url })), details: [presentation.presenter ? `Presenter: ${presentation.presenter}` : undefined, presentation.programCode ? `Program: ${presentation.programCode}` : undefined, ...presentation.variants].filter((value): value is string => Boolean(value)), notes: [presentation.award, presentation.note].filter((value): value is string => Boolean(value)) })
  setMetadata(id, { date: presentation.sortDate || null, yearSource: presentation.sortDate, institutions: [], roleType: presentation.format })
})
experienceRecords.forEach(record => {
  const id = `experience:${record.id}`
  mergeDetail(id, { sources: record.sources, details: record.work, notes: [record.note].filter((value): value is string => Boolean(value)) })
  setMetadata(id, { date: dateFrom(record.period), yearSource: record.period, institutions: [record.institution], roleType: record.category })
})
projectRecords.filter(record => !record.id.startsWith('software-')).forEach(record => {
  const id = `project:${record.id}`
  mergeDetail(id, { sources: record.sources, details: [record.outcome] })
  setMetadata(id, { date: dateFrom(record.period), yearSource: record.period, institutions: [record.institution], roleType: record.category })
})
awardRecords.forEach(record => {
  const id = `award:${record.id}`
  mergeDetail(id, { sources: record.sources, details: [`Ownership: ${record.ownership}`, `Evidence: ${record.evidence}`], notes: [record.note].filter((value): value is string => Boolean(value)) })
  setMetadata(id, { date: dateFrom(record.year), yearSource: record.year, institutions: record.issuer ? [record.issuer] : [], roleType: record.category })
})
media.articles.forEach(article => {
  const id = `media:article:${article.story_group}`
  mergeDetail(id, {
    sources: [{ label: `${article.publisher} · ${article.published_date}`, href: article.url }],
    details: [`Edition title (${article.publisher} · ${article.published_date}): ${article.title}`, `Edition summary (${article.publisher} · ${article.published_date}): ${article.summary}`, article.author ? `By ${article.author}` : undefined, article.udi_role, article.date_note].filter((value): value is string => Boolean(value)),
  })
  const current = metadataById.get(id); const date = [current?.date, article.published_date].filter((value): value is string => Boolean(value)).sort().at(-1) ?? null
  setMetadata(id, { date, years: unique([...(current?.years ?? []), ...yearsFrom(article.published_date)]), institutions: [...(current?.institutions ?? []), article.publisher], roleType: 'Article or profile' })
})
media.videos.forEach(video => {
  const id = `media:video:${video.id}`; const date = video.event_date ?? video.upload_date
  mergeDetail(id, { sources: [{ label: 'Recording', href: video.url }], details: [`Uploaded ${video.upload_date}`, video.event_date ? `Recorded ${video.event_date}` : undefined, 'relationship' in video ? video.relationship : undefined].filter((value): value is string => Boolean(value)) })
  setMetadata(id, { date, years: unique([...yearsFrom(video.event_date), ...yearsFrom(video.upload_date)]), institutions: [], roleType: video.topic })
})
media.profiles.forEach(profile => { const id = `media:profile:${profile.id}`; mergeDetail(id, { sources: [{ label: profile.publisher, href: profile.url }] }); setMetadata(id, { date: null, institutions: [profile.publisher], roleType: 'Profile' }) })
media.writing.forEach(entry => { const id = `media:writing:${entry.id}`; mergeDetail(id, { sources: [{ label: entry.publisher, href: entry.url }] }); setMetadata(id, { date: entry.published_date, yearSource: entry.published_date, institutions: [entry.publisher], roleType: 'Writing' }) })

portfolioCollections.forEach(collection => collection.groups.forEach(group => group.items.forEach(item => {
  const id = resolveCollectionRecordContentId(collection.id, item)
  mergeDetail(id, { sources: [item.href ? { label: 'Original item', href: item.href } : undefined, { label: `Original ${collection.title} collection`, href: collection.source }].filter((source): source is ArchiveSource => Boolean(source)), details: [`Collection: ${collection.title}`, `Collection record title: ${item.title}`, item.detail, item.meta].filter((value): value is string => Boolean(value)), notes: [item.note].filter((value): value is string => Boolean(value)) })
  if (!metadataById.has(id)) setMetadata(id, { date: dateFrom(item.meta), yearSource: item.meta, institutions: [], roleType: group.title })
  if (collection.id === 'activities-service' && item.title === 'Equestrian sport') mergeDetail(id, {
    sources: [{ label: 'The American Cowboy Academy', href: 'https://theamericancowboyacademy.com/' }, { label: 'Riding story', href: '/beyond#equestrian' }],
    details: ['English and Western riding, including about two years helping at an Alabama lesson barn focused on Western riding and barrel racing.', 'Structured horsemanship, ranch-skills, and horse-care training through The American Cowboy Academy.'],
  })
})))

const slug = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const archiveAnchorForId = (id: string) => `archive-${slug(id)}`
const featuredHrefFor = (id: string, kind: ContentKind) => {
  if (kind === 'Study') return `/research/${id.slice('study:'.length)}`
  if (kind === 'Software') return `/software#${id === 'software:ct-forge' ? 'ct-forge' : `software-${id.slice('software:'.length)}`}`
  if (kind === 'Paper') return '/research#journal-articles'
  if (kind === 'Presentation') return '/research#presentations'
  if (id.startsWith('experience:') && curatedExperienceSourceIds.has(id.slice('experience:'.length))) return '/about#timeline'
  if (['award:coop-student-year', 'award:aapm-blue-ribbon', 'award:sps-poster'].includes(id)) return '/about#recognition-about'
  return undefined
}

export const archiveRecords: readonly ArchiveRecord[] = Object.freeze(publicContentRegistry.map(item => {
  const detail = detailById.get(item.id) ?? { sources: [], details: [], notes: [] }
  const metadata = metadataById.get(item.id) ?? { date: null, years: [], institutions: [], roleType: item.kind }
  const sources = detail.sources.length > 0 ? detail.sources : item.href.startsWith('http') ? [{ label: 'Source', href: item.href }] : []
  return Object.freeze({ id: item.id, anchor: archiveAnchorForId(item.id), kind: item.kind, title: item.title, summary: item.summary, meta: item.meta, date: metadata.date, years: Object.freeze([...metadata.years]), institutions: Object.freeze([...metadata.institutions]), roleType: metadata.roleType, sources: Object.freeze(uniqueSources(sources)), details: Object.freeze([...detail.details]), notes: Object.freeze([...detail.notes]), image: detail.image, imageAlt: detail.imageAlt, featuredHref: featuredHrefFor(item.id, item.kind) })
}))
export const archiveStats = Object.freeze({ records: archiveRecords.length, years: new Set(archiveRecords.flatMap(record => record.years)).size, institutions: new Set(archiveRecords.flatMap(record => record.institutions)).size })

export const legacyArchiveTargetIds = new Map<string, string>()
const registerLegacy = (href: string, id: string) => { if (href.startsWith('/')) { const url = new URL(href, 'https://archive.local'); legacyArchiveTargetIds.set(`${url.pathname}${url.hash}`, id) } }
publicContentRegistry.forEach(item => registerLegacy(item.href, item.id))
archiveRecords.forEach(record => legacyArchiveTargetIds.set(`/archive#${record.anchor}`, record.id))
experienceRecords.forEach(record => registerLegacy(`/experience#${record.id}`, `experience:${record.id}`))
projectRecords.forEach(record => registerLegacy(`/experience#project-${record.id}`, record.id.startsWith('software-') ? `software:${record.id.slice('software-'.length)}` : `project:${record.id}`))
awardRecords.forEach(record => registerLegacy(`/awards#${record.id}`, `award:${record.id}`))
bibliography.forEach(paper => registerLegacy(`/publications#paper-${paper.id}`, `paper:${paper.id}`))
presentations.forEach(presentation => { registerLegacy(`/publications#${presentation.id}`, `presentation:${presentation.id}`); (presentation.legacyAnchors ?? []).forEach(anchor => registerLegacy(`/publications#${anchor}`, `presentation:${presentation.id}`)) })
media.articles.forEach(article => registerLegacy(`/media#${article.id}`, `media:article:${article.story_group}`))
media.videos.forEach(video => registerLegacy(`/media#${video.id}`, `media:video:${video.id}`))
media.profiles.forEach(profile => registerLegacy(`/media#profile-${profile.id}`, `media:profile:${profile.id}`))
media.writing.forEach(entry => registerLegacy(`/media#writing-${entry.id}`, `media:writing:${entry.id}`))
if (experienceRecords[0]) legacyArchiveTargetIds.set('/experience#timeline', `experience:${experienceRecords[0].id}`)
if (projectRecords[0]) legacyArchiveTargetIds.set('/experience#project-index', `project:${projectRecords[0].id}`)
if (awardRecords[0]) legacyArchiveTargetIds.set('/awards#award-ledger', `award:${awardRecords[0].id}`)
if (media.articles[0]) legacyArchiveTargetIds.set('/media#coverage', `media:article:${media.articles[0].story_group}`)
if (media.videos[0]) {
  legacyArchiveTargetIds.set('/media#videos', `media:video:${media.videos[0].id}`)
  legacyArchiveTargetIds.set('/media#lap-companion', `media:video:${media.videos[0].id}`)
}
if (media.writing[0]) legacyArchiveTargetIds.set('/media#writing', `media:writing:${media.writing[0].id}`)
if (media.profiles[0]) legacyArchiveTargetIds.set('/media#profiles', `media:profile:${media.profiles[0].id}`)
portfolioCollections.forEach(collection => collection.groups.forEach((group, groupIndex) => {
  if (group.items[0]) legacyArchiveTargetIds.set(`/collection/${collection.id}#group-${groupIndex}`, resolveCollectionRecordContentId(collection.id, group.items[0]))
  group.items.forEach((item, itemIndex) => { const id = resolveCollectionRecordContentId(collection.id, item); registerLegacy(`/collection/${collection.id}#entry-${groupIndex}-${itemIndex}`, id); if (item.presentationId) registerLegacy(`/collection/${collection.id}#${item.presentationId}`, id) })
}))
export const legacyCategoryForPath = (pathname: string) => pathname === '/experience' ? 'Experience' : pathname === '/awards' ? 'Award' : pathname === '/media' ? 'Media' : undefined
export const legacyCollectionQueryForPath = new Map(portfolioCollections.map(collection => [`/collection/${collection.id}`, collection.title]))
