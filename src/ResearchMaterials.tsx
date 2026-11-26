import bibliography from './bibliography.json'
import media from './mediaContent.json'
import { presentations } from './presentationData'

type ResearchMaterialKind = 'paper' | 'preprint' | 'poster' | 'talk' | 'recording' | 'code'
type MaterialLink = { label: string; href: string }
type ResearchMaterial = {
  id: string
  kind: ResearchMaterialKind
  title: string
  meta: string
  status: string
  links: MaterialLink[]
  preview?: { src: string; alt: string }
}

type RelationDefinition = {
  paperIds?: string[]
  presentationIds?: string[]
  videoIds?: string[]
  extras?: ResearchMaterial[]
}

const relationDefinitions: Record<string, RelationDefinition> = {
  radkev: {
    extras: [
      { id: 'radkev-preprint', kind: 'preprint', title: 'RadKev: An Open-Weight Decision Model for Radiology', meta: 'medRxiv · version 1 · October 13, 2026', status: 'Preprint; not peer reviewed', links: [{ label: 'Read the preprint', href: 'https://www.medrxiv.org/content/10.64898/2026.10.07.26364991v1' }, { label: 'Resolve DOI', href: 'https://doi.org/10.64898/2026.10.07.26364991' }] },
      { id: 'radkev-code', kind: 'code', title: 'RadKev training, evaluation, and analysis code', meta: 'Public reproducibility repository', status: 'Public source code and model links', links: [{ label: 'View code', href: 'https://github.com/udiram/RadKev' }] },
    ],
  },
  'adaptive-breast-radiotherapy': { presentationIds: ['astro-2026-3104', 'aapm-2026-27281'] },
  'clinical-language-models': { presentationIds: ['aapm-2025-20105', 'comp-2024-workshop-tg263'], videoIds: ['video-ITW86kDzaNQ'] },
  'radiosurgery-planning': { paperIds: ['ethos-2025'], presentationIds: ['spscon-2025-poster21-ethos', 'rss-2025-ethos', 'aapm-2024-12166', 'comp-2024-s3-ethos'], videoIds: ['video-NMcoTPjPJ1g'] },
  'organ-segmentation': { paperIds: ['amos-2025'], presentationIds: ['aapm-2024-10372', 'aapm-2023-5933', 'phunc-2023-abdominal-segmentation', 'cupc-2022-abdominal-segmentation', 'cumpc-2022-abdominal-segmentation'], videoIds: ['video-8IKr1QauMGc', 'video-iubpGRBjZN0', 'video-A7_TRUWW6EI'] },
  'brain-metastases-follow-up': { paperIds: ['brain-followup'] },
  'lung-beam-energy': { presentationIds: ['aapm-2025-20068', 'mcmaster-thesis-2025-beam-comparison'], videoIds: ['video-jlnFADrlgfM'] },
  'amyloid-membranes': { paperIds: ['biophysics-2020'] },
}

const previews: Record<string, ResearchMaterial['preview']> = {
  'astro-2026-3104': { src: '/assets/sourced/astro-2026-contouring-uncertainty-poster.webp', alt: 'ASTRO 2026 poster 3104 preview' },
  'aapm-2026-27281': { src: '/assets/sourced/aapm-2026-adaptive-poster.jpg', alt: 'AAPM 2026 digital poster preview for paper 27281' },
  'aapm-2025-20105': { src: '/assets/optimized/aapm-2025-tg263-poster.webp', alt: 'AAPM 2025 TG-263 poster preview' },
  'aapm-2025-20068': { src: '/assets/sourced/aapm-2025-lung-6x10x-poster.webp', alt: 'AAPM 2025 lung beam-energy poster preview' },
}

function presentationKind(format: string): ResearchMaterialKind {
  return /poster/i.test(format) ? 'poster' : 'talk'
}

function materialsFor(slug: string): ResearchMaterial[] {
  const definition = relationDefinitions[slug]
  if (!definition) return []
  const papers = (definition.paperIds ?? []).flatMap(id => {
    const paper = bibliography.find(item => item.id === id)
    if (!paper) return []
    const indexUrl = 'index_url' in paper ? paper.index_url : undefined
    return [{ id: `paper-${paper.id}`, kind: 'paper' as const, title: paper.title, meta: `${paper.journal} · ${paper.issue_date}`, status: paper.status, links: [{ label: 'Publication', href: paper.url }, ...(indexUrl ? [{ label: 'Index record', href: indexUrl }] : [])] }]
  })
  const presentationMaterials = (definition.presentationIds ?? []).flatMap(id => {
    const item = presentations.find(presentation => presentation.id === id)
    if (!item) return []
    return [{ id: `presentation-${item.id}`, kind: presentationKind(item.format), title: item.title, meta: `${item.venue} · ${item.date}${item.programCode ? ` · ${item.programCode}` : ''}`, status: item.status, links: item.sources.map(source => ({ label: source.label, href: source.url })), preview: previews[item.id] }]
  })
  const recordings = (definition.videoIds ?? []).flatMap(id => {
    const video = media.videos.find(item => item.id === id)
    if (!video) return []
    return [{ id: `recording-${video.id}`, kind: 'recording' as const, title: video.title, meta: `Public recording · ${video.duration}`, status: 'Available on YouTube', links: [{ label: 'Watch recording', href: video.url }], preview: { src: `/assets/media/video-thumbnails/${video.video_id}.jpg`, alt: `Preview for ${video.title}` } }]
  })
  return [...papers, ...presentationMaterials, ...recordings, ...(definition.extras ?? [])]
}

const materialLabels: Record<ResearchMaterialKind, string> = { paper: 'Paper', preprint: 'Preprint', poster: 'Poster', talk: 'Talk', recording: 'Recording', code: 'Code' }

function preferredLink(material: ResearchMaterial): MaterialLink | undefined {
  return material.links.find(link => /poster|publication|preprint|watch|code/i.test(link.label)) ?? material.links[0]
}

export function ResearchMaterialActions({ slug }: { slug: string }) {
  const materials = materialsFor(slug)
  if (!materials.length) return null
  return <div className="research-material-actions" aria-label={`Direct research materials for ${slug}`}>
    {materials.map(material => { const link = preferredLink(material); return link ? <a key={material.id} href={link.href}><span>{materialLabels[material.kind]}</span>{material.meta.split(' · ')[0]}</a> : <span key={material.id} className="material-unavailable"><span>{materialLabels[material.kind]}</span>Artifact not public</span> })}
  </div>
}

export function ResearchMaterialShelf({ slug }: { slug: string }) {
  const materials = materialsFor(slug)
  if (!materials.length) return null
  return <section className="wrap research-material-shelf" aria-labelledby={`materials-${slug}`}>
    <div className="research-material-heading"><span className="meta">One study, every public artifact</span><h2 id={`materials-${slug}`}>Read it. See it. Watch it.</h2><p>Paper, event version, recording, and code links are kept distinct. A missing file is not represented as available.</p></div>
    <div className="research-material-grid">{materials.map(material => <article key={material.id} className={`research-material-card material-${material.kind}`}>
      {material.preview && <a className="material-preview" href={preferredLink(material)?.href}><img src={material.preview.src} alt={material.preview.alt} loading="lazy" /></a>}
      <div><span className="meta">{materialLabels[material.kind]} · {material.status}</span><h3>{material.title}</h3><p>{material.meta}</p><div className="material-links">{material.links.length ? material.links.map(link => <a key={link.href} href={link.href}>{link.label}</a>) : <span>Public artifact not located</span>}</div></div>
    </article>)}</div>
  </section>
}
