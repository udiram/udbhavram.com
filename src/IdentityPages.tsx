import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowUpRight, MagnifyingGlass } from '@phosphor-icons/react'
import { awardRecords, experienceRecords, projectRecords, type AwardRecord, type ExperienceRecord, type ProjectRecord } from './identityContent'
import SaveButton from './SaveButton'
import { IdentityMark } from './identityMarks'
import { imageAssets } from './siteContent'

function samePageHashActivation(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null
  if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download') || (link.target && link.target !== '_self')) return null
  const url = new URL(link.href)
  if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return null
  try { return { target: decodeURIComponent(url.hash.slice(1)), hash: url.hash } } catch { return null }
}

function Intro({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children: ReactNode }) {
  return <div className="page-intro identity-page-intro wrap"><a className="back-link" href="/"><ArrowLeft /> Home</a><span className="meta page-eyebrow">{eyebrow}</span><h1>{title}</h1><div className="page-lede">{children}</div></div>
}

function Filters({ label, query, setQuery, category, setCategory, categories, count }: { label: string; query: string; setQuery: (value: string) => void; category: string; setCategory: (value: string) => void; categories: string[]; count: number }) {
  return <div className="identity-filters wrap">
    <label htmlFor={`${label}-search`}>Search {label}</label>
    <div className="search-input"><MagnifyingGlass /><input id={`${label}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${label}, institutions, or details…`} />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</div>
    <div className="filter-buttons" aria-label={`${label} categories`}><button type="button" aria-pressed={category === 'All'} onClick={() => setCategory('All')}>All</button>{categories.map(item => <button type="button" aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    <p role="status">Showing {count} {count === 1 ? 'record' : 'records'}.</p>
  </div>
}

function Sources({ sources }: { sources: { label: string; href: string }[] }) {
  return <div className="identity-sources" aria-label="Sources">{sources.map(source => <a href={source.href} key={`${source.label}-${source.href}`}>{source.label}</a>)}</div>
}

function ExperienceRow({ record }: { record: ExperienceRecord }) {
  return <article className="identity-row" id={record.id} tabIndex={-1}>
    <div className="identity-date"><strong>{record.period}</strong><span>{record.status}</span></div>
    <div className="identity-record-main">
      <span className="meta">{record.category}{record.location ? ` · ${record.location}` : ''}</span>
      <h2>{record.role}</h2>
      <p className="record-institution">{record.institution}</p>
      <p>{record.summary}</p>
      <details className="record-details"><summary>Work and sources</summary><div><ul>{record.work.map(item => <li key={item}>{item}</li>)}</ul>{record.note && <p className="record-note">Evidence note: {record.note}</p>}<Sources sources={record.sources} /></div></details>
      <div className="identity-actions"><a className="record-permalink" href={`#${record.id}`}>Link to this record</a><SaveButton id={`experience:${record.id}`} compact /></div>
    </div>
  </article>
}

function ProjectRow({ project }: { project: ProjectRecord }) {
  const saveId = project.id.startsWith('software-') ? `software:${project.id.slice('software-'.length)}` : `project:${project.id}`
  return <article className="project-record" id={`project-${project.id}`} tabIndex={-1}>
    <span className="meta">{project.category} · {project.period}</span>
    <h3>{project.title}</h3>
    <p className="project-institution">{project.institution}</p>
    <p>{project.summary}</p>
    <details className="record-details"><summary>Outcome and sources</summary><div><p className="project-outcome"><strong>What came of it:</strong> {project.outcome}</p><Sources sources={project.sources} /></div></details>
    <SaveButton id={saveId} compact />
  </article>
}

const experienceOverview = [
  { href: '#uw-medical-physics', label: 'University of Wisconsin–Madison', period: '2026–present', title: 'Medical Physics PhD', copy: 'AI for medical imaging and radiation oncology with Dr. Ran Zhang.' },
  { href: '#mcmaster-medical-physics', label: 'McMaster University', period: '2021–2026', title: 'Honours Medical Physics', copy: 'Physics, computation, co-op placements, research, and student advocacy.' },
  { href: '#uab-research-collaborator', label: 'UAB Radiation Oncology', period: 'Research since 2021', title: 'Clinical research collaboration', copy: 'Imaging, treatment planning, local language models, and adaptive radiotherapy.' },
]

export function ExperiencePage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [projectQuery, setProjectQuery] = useState('')
  const [projectCategory, setProjectCategory] = useState('All')
  const term = query.trim().toLowerCase()
  const projectTerm = projectQuery.trim().toLowerCase()
  const categories = [...new Set(experienceRecords.map(record => record.category))]
  const projectCategories = [...new Set(projectRecords.map(record => record.category))]
  const filtered = useMemo(() => experienceRecords.filter(record => (category === 'All' || record.category === category) && (!term || [record.institution, record.role, record.period, record.location, record.summary, record.work, record.note].flat().join(' ').toLowerCase().includes(term))), [category, term])
  const filteredProjects = useMemo(() => projectRecords.filter(project => (projectCategory === 'All' || project.category === projectCategory) && (!projectTerm || [project.title, project.institution, project.period, project.summary, project.outcome].join(' ').toLowerCase().includes(projectTerm))), [projectCategory, projectTerm])
  useEffect(() => {
    let frame = 0
    const revealHashTarget = (target: string) => {
      if (experienceRecords.some(record => record.id === target)) { setQuery(''); setCategory('All') }
      else if (projectRecords.some(project => `project-${project.id}` === target)) { setProjectQuery(''); setProjectCategory('All') }
      else return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => { const element = document.getElementById(target); element?.focus({ preventScroll: true }); element?.scrollIntoView({ block: 'center', behavior: 'instant' }) }) })
    }
    const revealCurrentHash = () => { try { revealHashTarget(decodeURIComponent(window.location.hash.slice(1))) } catch { /* Ignore malformed fragments. */ } }
    const activateLink = (event: MouseEvent) => {
      const activation = samePageHashActivation(event)
      if (!activation || (!experienceRecords.some(record => record.id === activation.target) && !projectRecords.some(project => `project-${project.id}` === activation.target))) return
      event.preventDefault()
      if (activation.hash !== window.location.hash) history.pushState(null, '', activation.hash)
      revealHashTarget(activation.target)
    }
    revealCurrentHash()
    window.addEventListener('hashchange', revealCurrentHash)
    document.addEventListener('click', activateLink, true)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', revealCurrentHash); document.removeEventListener('click', activateLink, true) }
  }, [])
  return <>
    <Intro eyebrow="Experience & affiliations" title="Experience."><p>My work connects medical physics, imaging, software, and engineering across three institutions.</p><div className="intro-actions"><a className="text-link" href="#timeline">Full timeline</a><a className="text-link" href="#project-index">Project index</a><a className="text-link" href="/awards">Awards</a></div></Intro>
    <section className="experience-overview wrap" aria-label="Three institutions in my research path"><div className="experience-overview-grid">{experienceOverview.map(item => <a href={item.href} key={item.href}><div className="experience-overview-mark"><IdentityMark label={item.label} contextual /></div><span className="experience-institution">{item.label}</span><span className="meta">{item.period}</span><h2>{item.title}</h2><p>{item.copy}</p><strong>Read this chapter <ArrowUpRight /></strong></a>)}</div></section>
    <section className="identity-archive-intro wrap" id="timeline"><span className="meta">Complete record</span><h2>Roles, research<br /><em>and service.</em></h2><p>Search the full timeline, then open a record for detailed work and source links.</p></section>
    <Filters label="experience" query={query} setQuery={setQuery} category={category} setCategory={setCategory} categories={categories} count={filtered.length} />
    <section className="wrap identity-timeline" aria-label="Institution and role timeline">{filtered.map(record => <ExperienceRow record={record} key={record.id} />)}{filtered.length === 0 && <div className="identity-empty"><h2>No experience records match.</h2><button type="button" onClick={() => { setQuery(''); setCategory('All') }}>Reset experience filters</button></div>}</section>
    <section className="detail-band project-index-section" id="project-index"><div className="wrap"><div className="section-heading"><h2>Projects,<br /><em>connected to place.</em></h2><p>Thirty projects trace how medical imaging, software, engineering, and community work moved from coursework into real collaborations.</p></div></div><Filters label="projects" query={projectQuery} setQuery={setProjectQuery} category={projectCategory} setCategory={setProjectCategory} categories={projectCategories} count={filteredProjects.length} /><div className="wrap project-records">{filteredProjects.map(project => <ProjectRow project={project} key={project.id} />)}{filteredProjects.length === 0 && <div className="identity-empty"><h2>No project records match.</h2><button type="button" onClick={() => { setProjectQuery(''); setProjectCategory('All') }}>Reset project filters</button></div>}</div></section>
  </>
}

const awardYearRank = (record: AwardRecord) => record.year === 'Historical record' ? 0 : Number.parseInt(record.year, 10) || 0

const awardGroups = [
  { title: 'Personal honors & results', copy: 'Awards and competition results attributed to Udbhav.', matches: (record: AwardRecord) => record.category === 'Personal honor' || record.category === 'Competition' || record.category === 'Arts' },
  { title: 'Training & qualifications', copy: 'Credentials and structured training, with historical validity stated where known.', matches: (record: AwardRecord) => record.category === 'Training & certification' },
  { title: 'Features & collaborator context', copy: 'Institutional profiles and related recognition kept separate from personal awards.', matches: (record: AwardRecord) => record.category === 'Feature & context' },
]

function AwardRow({ record }: { record: AwardRecord }) {
  return <article className="award-row" id={record.id} tabIndex={-1}>
    <div className="award-year">{record.year}</div>
    <div className="award-record-main"><span className="meta">{record.category} · {record.evidence}</span><div className="award-title-line">{record.issuer && <IdentityMark label={record.issuer} compact />}<div><h3>{record.title}</h3>{record.issuer && <p className="award-issuer">{record.issuer}</p>}</div></div>{record.ownership === 'Mentor or collaborator' && <div className="ownership-label">Recipient: Carlos Cardenas · collaborator context</div>}<p>{record.detail}</p><details className="record-details"><summary>Source and record note</summary><div>{record.note && <p className="record-note">{record.note}</p>}<Sources sources={record.sources} /></div></details><div className="identity-actions"><a className="record-permalink" href={`#${record.id}`}>Link to this record</a><SaveButton id={`award:${record.id}`} compact /></div></div>
  </article>
}

function AwardsFeature() {
  return <section className="awards-feature wrap" aria-labelledby="awards-feature-title"><figure><img src={imageAssets.coopAward.src} alt={imageAssets.coopAward.alt} /><figcaption>McMaster Science Co-op Student of the Year · 2026</figcaption></figure><div className="awards-feature-copy"><span className="meta">Selected recognition · 2026</span><h2 id="awards-feature-title">Science Co-op<br /><em>Student of the Year.</em></h2><p>The recognition marked a research path built across McMaster and UAB—and the mentors who travelled to Hamilton to share the moment.</p><a className="text-link" href="#coop-student-year">Read the award record</a><div className="awards-feature-secondary"><a href="#aapm-blue-ribbon"><IdentityMark label="American Association of Physicists in Medicine" compact contextual /><span><small>2025</small><strong>AAPM Blue Ribbon Poster</strong></span></a><a href="#sps-poster"><IdentityMark label="Society of Physics Students" compact contextual /><span><small>2024</small><strong>Outstanding Poster Presentation</strong></span></a></div></div></section>
}

export function AwardsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const term = query.trim().toLowerCase()
  const categories = [...new Set(awardRecords.map(record => record.category))]
  const filtered = useMemo(() => [...awardRecords].filter(record => (category === 'All' || record.category === category) && (!term || [record.title, record.year, record.issuer, record.category, record.ownership, record.detail, record.note].join(' ').toLowerCase().includes(term))).sort((a, b) => awardYearRank(b) - awardYearRank(a)), [category, term])
  useEffect(() => {
    let frame = 0
    const revealHashTarget = (target: string) => {
      if (!awardRecords.some(record => record.id === target)) return
      setQuery('')
      setCategory('All')
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => { const element = document.getElementById(target); element?.focus({ preventScroll: true }); element?.scrollIntoView({ block: 'center', behavior: 'instant' }) }) })
    }
    const revealCurrentHash = () => { try { revealHashTarget(decodeURIComponent(window.location.hash.slice(1))) } catch { /* Ignore malformed fragments. */ } }
    const activateLink = (event: MouseEvent) => {
      const activation = samePageHashActivation(event)
      if (!activation || !awardRecords.some(record => record.id === activation.target)) return
      event.preventDefault()
      if (activation.hash !== window.location.hash) history.pushState(null, '', activation.hash)
      revealHashTarget(activation.target)
    }
    revealCurrentHash()
    window.addEventListener('hashchange', revealCurrentHash)
    document.addEventListener('click', activateLink, true)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', revealCurrentHash); document.removeEventListener('click', activateLink, true) }
  }, [])
  return <>
    <Intro eyebrow="Awards, training & recognition" title={<>Recognition,<br /><em>with context.</em></>}><p>Recognition for research, co-op work, and the things I’ve learned along the way.</p><div className="intro-actions"><a className="text-link" href="#award-ledger">Search all 31 records</a><a className="text-link" href="/experience">Experience & affiliations</a></div></Intro>
    <AwardsFeature />
    <section className="identity-archive-intro wrap" id="award-ledger"><span className="meta">Complete record</span><h2>Honors, training<br /><em>and milestones.</em></h2><p>Search by title, issuer, category, or detail. Sources and historical caveats remain with each entry.</p></section>
    <Filters label="awards" query={query} setQuery={setQuery} category={category} setCategory={setCategory} categories={categories} count={filtered.length} />
    <div className="wrap award-ledger" aria-label="Awards and recognition ledger">{awardGroups.map(group => { const records = filtered.filter(group.matches); return records.length > 0 && <section className="award-group" aria-labelledby={`award-group-${group.title.replaceAll(' ', '-').toLowerCase()}`} key={group.title}><div className="award-group-heading"><h2 id={`award-group-${group.title.replaceAll(' ', '-').toLowerCase()}`}>{group.title}</h2><p>{group.copy}</p></div>{records.map(record => <AwardRow record={record} key={record.id} />)}</section> })}{filtered.length === 0 && <div className="identity-empty"><h2>No recognition records match.</h2><button type="button" onClick={() => { setQuery(''); setCategory('All') }}>Reset award filters</button></div>}</div>
  </>
}
