import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, MagnifyingGlass } from '@phosphor-icons/react'
import { awardRecords, experienceRecords, projectRecords, type AwardRecord, type ExperienceRecord, type ProjectRecord } from './identityContent'
import SaveButton from './SaveButton'

function samePageHashActivation(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null
  if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download') || (link.target && link.target !== '_self')) return null
  const url = new URL(link.href)
  if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return null
  try { return { target: decodeURIComponent(url.hash.slice(1)), hash: url.hash } } catch { return null }
}

function Intro({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children: ReactNode }) {
  return <div className="page-intro wrap"><a className="back-link" href="/"><ArrowLeft /> Home</a><span className="meta page-eyebrow">{eyebrow}</span><h1>{title}</h1><div className="page-lede">{children}</div></div>
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
    <div><span className="meta">{record.category}{record.location ? ` · ${record.location}` : ''}</span><h2>{record.role}</h2><h3>{record.institution}</h3><p>{record.summary}</p><ul>{record.work.map(item => <li key={item}>{item}</li>)}</ul>{record.note && <p className="record-note">Evidence note: {record.note}</p>}<Sources sources={record.sources} /><div className="identity-actions"><a className="record-permalink" href={`#${record.id}`}>Link to this record</a><SaveButton id={`experience:${record.id}`} compact /></div></div>
  </article>
}

function ProjectRow({ project }: { project: ProjectRecord }) {
  const saveId = project.id.startsWith('software-') ? `software:${project.id.slice('software-'.length)}` : `project:${project.id}`
  return <article className="project-record" id={`project-${project.id}`} tabIndex={-1}>
    <span className="meta">{project.category} · {project.period}</span><h3>{project.title}</h3><p className="project-institution">{project.institution}</p><p>{project.summary}</p><p className="project-outcome"><strong>What came of it:</strong> {project.outcome}</p><Sources sources={project.sources} /><SaveButton id={saveId} compact />
  </article>
}

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
    <Intro eyebrow="Experience & affiliations" title={<>Where the work<br /><em>took shape.</em></>}><p>Education, research, engineering, and service—organized by institution, role, dates, work, and source. Current appointments are separated from completed and historical records.</p><div className="intro-actions"><a className="button" href="#timeline">Browse the timeline</a><a className="text-link" href="#project-index">See every project</a></div></Intro>
    <nav className="section-nav wrap" aria-label="On this page"><span>On this page</span><a href="#timeline">Institutions & roles</a><a href="#project-index">Project index</a><a href="/awards">Awards</a></nav>
    <Filters label="experience" query={query} setQuery={setQuery} category={category} setCategory={setCategory} categories={categories} count={filtered.length} />
    <section className="wrap identity-timeline" id="timeline" aria-label="Institution and role timeline">{filtered.map(record => <ExperienceRow record={record} key={record.id} />)}{filtered.length === 0 && <div className="identity-empty"><h2>No experience records match.</h2><button type="button" onClick={() => { setQuery(''); setCategory('All') }}>Reset experience filters</button></div>}</section>
    <section className="detail-band" id="project-index"><div className="wrap"><div className="section-heading"><h2>Projects,<br /><em>connected to place.</em></h2><p>Research, engineering, open-source, software, and community projects connected to the institution or independent context in which each was developed.</p></div></div><Filters label="projects" query={projectQuery} setQuery={setProjectQuery} category={projectCategory} setCategory={setProjectCategory} categories={projectCategories} count={filteredProjects.length} /><div className="wrap project-records">{filteredProjects.map(project => <ProjectRow project={project} key={project.id} />)}{filteredProjects.length === 0 && <div className="identity-empty"><h2>No project records match.</h2><button type="button" onClick={() => { setProjectQuery(''); setProjectCategory('All') }}>Reset project filters</button></div>}</div></section>
  </>
}

const awardYearRank = (record: AwardRecord) => record.year === 'Historical record' ? 0 : Number.parseInt(record.year, 10) || 0

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
    <Intro eyebrow="Awards, training & recognition" title={<>Recognition,<br /><em>training & milestones.</em></>}><p>A source-linked record of research honors, academic milestones, certifications, competitions, arts, and institutional features across the years.</p><div className="intro-actions"><a className="button" href="#award-ledger">Browse the record</a><a className="text-link" href="/experience">Experience & affiliations</a></div></Intro>
    <Filters label="awards" query={query} setQuery={setQuery} category={category} setCategory={setCategory} categories={categories} count={filtered.length} />
    <section className="wrap award-ledger" id="award-ledger" aria-label="Awards and recognition ledger">{filtered.map(record => <article className="award-row" id={record.id} tabIndex={-1} key={record.id}><div className="award-year">{record.year}</div><div><span className="meta">{record.category} · {record.evidence}</span><h2>{record.title}</h2>{record.issuer && <p className="award-issuer">{record.issuer}</p>}<p>{record.detail}</p>{record.ownership === 'Mentor or collaborator' && <div className="ownership-label">Recipient: Carlos Cardenas</div>}{record.note && <p className="record-note">{record.note}</p>}<Sources sources={record.sources} /><div className="identity-actions"><a className="record-permalink" href={`#${record.id}`}>Link to this record</a><SaveButton id={`award:${record.id}`} compact /></div></div></article>)}{filtered.length === 0 && <div className="identity-empty"><h2>No recognition records match.</h2><button type="button" onClick={() => { setQuery(''); setCategory('All') }}>Reset award filters</button></div>}</section>
  </>
}
