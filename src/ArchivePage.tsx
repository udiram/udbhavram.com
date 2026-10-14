import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DownloadSimple, LinkSimple, MagnifyingGlass, Shuffle, SlidersHorizontal, X } from '@phosphor-icons/react'
import { archiveRecords, archiveStats, legacyArchiveTargetIds, legacyCollectionQueryForPath, type ArchiveRecord } from './archiveData'
import { cvPath } from './expandedContent'
import SaveButton from './SaveButton'
import './Archive.css'

type Sort = 'newest' | 'alpha' | 'category'
type View = 'timeline' | 'list'
type FilterName = 'category' | 'year' | 'institution' | 'role'
type ArchiveState = { query: string; category: string; year: string; institution: string; role: string; sort: Sort; view: View }

const categories = [...new Set(archiveRecords.map(record => record.kind === 'Collection' ? 'Historical' : record.kind))]
const years = [...new Set(archiveRecords.flatMap(record => record.years))]
const institutions = [...new Set(archiveRecords.flatMap(record => record.institutions))]
const roles = [...new Set(archiveRecords.map(record => record.roleType))]
const validSorts = new Set<Sort>(['newest', 'alpha', 'category'])
const validViews = new Set<View>(['timeline', 'list'])
const labelForKind = (record: ArchiveRecord) => record.kind === 'Collection' ? 'Historical' : record.kind
const valueOrAll = (value: string | null, options: readonly string[]) => value && options.includes(value) ? value : 'all'
const searchableTextFor = (record: ArchiveRecord) => [record.title, record.summary, record.meta, ...record.institutions, record.roleType, ...record.details, ...record.notes, record.id].join(' ').toLowerCase()

function recordMatchesState(record: ArchiveRecord, state: ArchiveState, omit?: FilterName) {
  const term = state.query.trim().toLowerCase()
  return (omit === 'category' || state.category === 'all' || labelForKind(record) === state.category) &&
    (omit === 'year' || state.year === 'all' || record.years.includes(state.year)) &&
    (omit === 'institution' || state.institution === 'all' || record.institutions.includes(state.institution)) &&
    (omit === 'role' || state.role === 'all' || record.roleType === state.role) &&
    (!term || searchableTextFor(record).includes(term))
}

function stateExposingRecord(state: ArchiveState, record: ArchiveRecord): ArchiveState {
  const term = state.query.trim().toLowerCase()
  return {
    ...state,
    query: !term || searchableTextFor(record).includes(term) ? state.query : '',
    category: state.category === 'all' || labelForKind(record) === state.category ? state.category : 'all',
    year: state.year === 'all' || record.years.includes(state.year) ? state.year : 'all',
    institution: state.institution === 'all' || record.institutions.includes(state.institution) ? state.institution : 'all',
    role: state.role === 'all' || record.roleType === state.role ? state.role : 'all',
  }
}

function stateFromLocation(legacyCategory?: string): ArchiveState {
  const params = new URLSearchParams(window.location.search)
  const topic = params.get('topic')
  const collectionQuery = legacyCollectionQueryForPath.get(window.location.pathname) ?? legacyCollectionQueryForPath.get(`/collection/${topic}`)
  const sortValue = params.get('sort') as Sort | null
  const viewValue = params.get('view') as View | null
  const sort = sortValue && validSorts.has(sortValue) ? sortValue : 'newest'
  const requestedView = viewValue && validViews.has(viewValue) ? viewValue : 'timeline'
  return {
    query: params.get('q') ?? collectionQuery ?? '',
    category: valueOrAll(params.get('category') ?? (topic === 'presentations' ? 'Presentation' : legacyCategory) ?? null, categories),
    year: valueOrAll(params.get('year'), years),
    institution: valueOrAll(params.get('institution'), institutions),
    role: valueOrAll(params.get('role'), roles),
    sort,
    view: sort === 'newest' ? requestedView : 'list',
  }
}

function urlForState(state: ArchiveState, hash = window.location.hash) {
  const params = new URLSearchParams()
  if (state.query) params.set('q', state.query)
  if (state.category !== 'all') params.set('category', state.category)
  if (state.year !== 'all') params.set('year', state.year)
  if (state.institution !== 'all') params.set('institution', state.institution)
  if (state.role !== 'all') params.set('role', state.role)
  if (state.sort !== 'newest') params.set('sort', state.sort)
  if (state.view !== 'timeline') params.set('view', state.view)
  return `/archive${params.size ? `?${params.toString()}` : ''}${hash}`
}

function countValues(records: readonly ArchiveRecord[], values: (record: ArchiveRecord) => readonly string[]) {
  const counts = new Map<string, number>()
  records.forEach(record => values(record).forEach(value => counts.set(value, (counts.get(value) ?? 0) + 1)))
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

function FilterGroup({ name, label, values, value, onChange }: { name: FilterName; label: string; values: [string, number][]; value: string; onChange: (name: FilterName, value: string) => void }) {
  return <fieldset className="archive-filter-group"><legend>{label}</legend><button type="button" aria-pressed={value === 'all'} className={value === 'all' ? 'is-active' : ''} onClick={() => onChange(name, 'all')}>All</button>{values.map(([option, count]) => <button type="button" aria-pressed={value === option} className={value === option ? 'is-active' : ''} onClick={() => onChange(name, option)} key={option}><span>{option}</span><b>{count}</b></button>)}</fieldset>
}

function ArchiveCard({ record, onReveal }: { record: ArchiveRecord; onReveal: (id: string, mode?: 'push' | 'replace') => void }) {
  return <article className={`archive-card archive-kind-${record.kind.toLowerCase()}`} id={record.anchor} data-record-id={record.id} tabIndex={-1}>
    {record.image ? <img className="archive-thumb" src={record.image} alt={record.imageAlt ?? ''} loading="lazy" decoding="async" /> : <div className="archive-thumb archive-icon" aria-hidden="true"><span>{labelForKind(record).slice(0, 2).toUpperCase()}</span></div>}
    <div className="archive-card-copy">
      <div className="archive-card-meta"><span>{labelForKind(record)} · {record.meta}</span>{record.featuredHref && <a href={record.featuredHref}>Featured</a>}</div>
      <h2>{record.title}</h2>
      <p>{record.summary}</p>
      {(record.details.length > 0 || record.notes.length > 0 || record.sources.length > 0) && <details><summary>Details and sources ({record.sources.length})</summary><div>{record.details.length > 0 && <ul>{record.details.map(detail => <li key={detail}>{detail}</li>)}</ul>}{record.notes.map(note => <p className="archive-record-note" key={note}>{note}</p>)}{record.sources.map(source => <a href={source.href} key={`${record.id}-${source.href}`}>{source.label}</a>)}</div></details>}
      <div className="archive-card-actions"><button type="button" className="archive-permalink" onClick={() => onReveal(record.id)} aria-label={`Link to ${record.title}`}><LinkSimple /> Link</button><SaveButton id={record.id} compact /></div>
    </div>
  </article>
}

export default function ArchivePage({ legacyCategory }: { legacyCategory?: string }) {
  const [state, setState] = useState<ArchiveState>(() => {
    const parsed = stateFromLocation(legacyCategory)
    const targetId = legacyArchiveTargetIds.get(`${window.location.pathname}${window.location.hash}`)
    const record = targetId ? archiveRecords.find(item => item.id === targetId) : undefined
    return record ? stateExposingRecord(parsed, record) : parsed
  })
  const stateRef = useRef(state)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const filterPanel = useRef<HTMLElement>(null)
  const filterTrigger = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const restoreFocus = useRef(true)

  const commitState = useCallback((next: ArchiveState, mode: 'push' | 'replace' = 'push', hash = window.location.hash) => {
    stateRef.current = next
    setState(next)
    window.history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', urlForState(next, hash))
  }, [])

  const closeFilters = useCallback((shouldRestoreFocus = true) => {
    restoreFocus.current = shouldRestoreFocus
    setFiltersOpen(false)
  }, [])

  const revealRecord = useCallback((id: string, mode: 'push' | 'replace' = 'push', sourceState = stateRef.current) => {
    const record = archiveRecords.find(item => item.id === id)
    if (!record) return false
    const next = stateExposingRecord(sourceState, record)
    commitState(next, mode, `#${record.anchor}`)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = document.getElementById(record.anchor)
      if (!target) return
      document.querySelectorAll('[data-permalink-target]').forEach(element => element.removeAttribute('data-permalink-target'))
      target.setAttribute('data-permalink-target', 'true')
      target.focus({ preventScroll: true })
      target.scrollIntoView({ block: 'start' })
    }))
    return true
  }, [commitState])

  const matches = useCallback((record: ArchiveRecord, omit?: FilterName) => recordMatchesState(record, state, omit), [state])

  const categoryCounts = useMemo(() => countValues(archiveRecords.filter(record => matches(record, 'category')), record => [labelForKind(record)]), [matches])
  const yearCounts = useMemo(() => countValues(archiveRecords.filter(record => matches(record, 'year')), record => record.years), [matches])
  const institutionCounts = useMemo(() => countValues(archiveRecords.filter(record => matches(record, 'institution')), record => record.institutions), [matches])
  const roleCounts = useMemo(() => countValues(archiveRecords.filter(record => matches(record, 'role')), record => [record.roleType]), [matches])
  const filtered = useMemo(() => archiveRecords.filter(record => matches(record)).toSorted((a, b) => {
    if (state.sort === 'alpha') return a.title.localeCompare(b.title)
    if (state.sort === 'category') return labelForKind(a).localeCompare(labelForKind(b)) || a.title.localeCompare(b.title)
    if (a.date === null) return b.date === null ? a.title.localeCompare(b.title) : 1
    if (b.date === null) return -1
    return b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
  }), [matches, state.sort])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mediaQuery = window.matchMedia('(max-width: 760px)')
    const onChange = () => { setIsMobile(mediaQuery.matches); if (!mediaQuery.matches) closeFilters(false) }
    const frame = requestAnimationFrame(onChange)
    mediaQuery.addEventListener('change', onChange)
    return () => { cancelAnimationFrame(frame); mediaQuery.removeEventListener('change', onChange) }
  }, [closeFilters])

  useEffect(() => {
    const targetId = legacyArchiveTargetIds.get(`${window.location.pathname}${window.location.hash}`)
    const record = targetId ? archiveRecords.find(item => item.id === targetId) : undefined
    const hash = record ? `#${record.anchor}` : window.location.pathname === '/archive' ? window.location.hash : ''
    window.history.replaceState(null, '', urlForState(state, hash))
    if (record) requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = document.getElementById(record.anchor)
      if (!target) return
      target.setAttribute('data-permalink-target', 'true')
      target.focus({ preventScroll: true })
      target.scrollIntoView({ block: 'start' })
    }))
  // This is deliberately mount-only: later navigation is handled by popstate/hashchange.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onNavigation = () => {
      const next = stateFromLocation(legacyCategory)
      const targetId = legacyArchiveTargetIds.get(`${window.location.pathname}${window.location.hash}`)
      if (targetId) { revealRecord(targetId, 'replace', next); return }
      setState(next)
      stateRef.current = next
      if (window.location.pathname !== '/archive' || window.location.href !== new URL(urlForState(next), window.location.origin).href) window.history.replaceState(null, '', urlForState(next))
    }
    window.addEventListener('popstate', onNavigation)
    window.addEventListener('hashchange', onNavigation)
    return () => { window.removeEventListener('popstate', onNavigation); window.removeEventListener('hashchange', onNavigation) }
  }, [legacyCategory, revealRecord])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const editing = target?.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && !editing) { event.preventDefault(); searchRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!isMobile || !filtersOpen) return
    const panel = filterPanel.current
    if (!panel) return
    const inertTargets = [document.querySelector('.site-header'), document.querySelector('.archive-hero'), document.querySelector('.archive-controls'), document.querySelector('.archive-results'), document.querySelector('.page-footer')].filter((element): element is HTMLElement => element instanceof HTMLElement)
    inertTargets.forEach(element => element.setAttribute('inert', ''))
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusables = () => [...panel.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    focusables()[0]?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeFilters(); return }
      if (event.key !== 'Tab') return
      const items = focusables(); if (items.length === 0) { event.preventDefault(); return }
      const first = items[0]; const last = items.at(-1)!
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    panel.addEventListener('keydown', onKey)
    return () => { panel.removeEventListener('keydown', onKey); inertTargets.forEach(element => element.removeAttribute('inert')); document.body.style.overflow = previousOverflow }
  }, [closeFilters, filtersOpen, isMobile])

  useEffect(() => { if (isMobile && !filtersOpen && restoreFocus.current) filterTrigger.current?.focus() }, [filtersOpen, isMobile])

  const changeFilter = (name: FilterName, value: string) => commitState({ ...state, [name]: value }, 'push', '')
  const reset = () => commitState({ query: '', category: 'all', year: 'all', institution: 'all', role: 'all', sort: 'newest', view: 'timeline' }, 'push', '')
  const random = () => { const record = filtered[Math.floor(Math.random() * filtered.length)]; if (record) revealRecord(record.id) }
  const groups = state.view === 'timeline' ? [...new Set(filtered.map(record => record.date?.slice(0, 4) ?? 'Undated'))].map(groupYear => ({ year: groupYear, records: filtered.filter(record => (record.date?.slice(0, 4) ?? 'Undated') === groupYear) })) : [{ year: '', records: filtered }]

  return <div className="archive-page">
    <header className="archive-hero wrap"><a className="back-link" href="/">← Home</a><span className="meta">Archive</span><h1>Everything, for the record.</h1><p>The short version is the rest of the site.</p><div className="archive-stats" aria-label="Archive statistics"><strong>{archiveStats.records}<span>records</span></strong><strong>{archiveStats.years}<span>years</span></strong><strong>{archiveStats.institutions}<span>institutions</span></strong></div><div className="archive-hero-actions"><a className="button" href={cvPath} download="Udbhav_Ram_Public_CV_October_2026.pdf"><DownloadSimple /> Download public CV <span className="pdf-label">PDF</span></a><button type="button" className="text-button" onClick={random} disabled={filtered.length === 0}><Shuffle /> Random record</button></div></header>
    <section className="archive-controls wrap" aria-label="Archive controls"><label className="archive-search" htmlFor="archive-search"><MagnifyingGlass aria-hidden="true" /><input ref={searchRef} id="archive-search" type="search" value={state.query} onChange={event => commitState({ ...state, query: event.target.value }, 'replace', '')} placeholder="Search titles, organizations, descriptions, dates…" /><kbd>/</kbd></label><button ref={filterTrigger} className="archive-filter-trigger" type="button" aria-expanded={filtersOpen} aria-controls="archive-filters" aria-haspopup={isMobile ? 'dialog' : undefined} onClick={() => setFiltersOpen(true)}><SlidersHorizontal /> Filters</button><div className="archive-display-controls"><label>Sort <select value={state.sort} onChange={event => { const sort = event.target.value as Sort; commitState({ ...state, sort, view: sort === 'newest' ? state.view : 'list' }, 'push', '') }}><option value="newest">Newest first</option><option value="alpha">Alphabetical</option><option value="category">By category</option></select></label><div role="group" aria-label="Archive view"><button aria-pressed={state.view === 'timeline'} className={state.view === 'timeline' ? 'is-active' : ''} type="button" onClick={() => commitState({ ...state, sort: 'newest', view: 'timeline' }, 'push', '')}>Timeline</button><button aria-pressed={state.view === 'list'} className={state.view === 'list' ? 'is-active' : ''} type="button" onClick={() => commitState({ ...state, view: 'list' }, 'push', '')}>List</button></div></div><p role="status">{filtered.length} {filtered.length === 1 ? 'record' : 'records'} shown</p></section>
    <div className="archive-layout wrap"><aside id="archive-filters" ref={filterPanel} className={filtersOpen ? 'archive-filters is-open' : 'archive-filters'} role={isMobile ? 'dialog' : undefined} aria-modal={isMobile && filtersOpen ? true : undefined} aria-labelledby="archive-filter-title" hidden={isMobile && !filtersOpen} inert={isMobile && !filtersOpen}><div className="archive-filter-heading"><strong id="archive-filter-title">Filter the archive</strong><button type="button" aria-label="Close filters" onClick={() => closeFilters()}><X /></button></div><FilterGroup name="category" label="Category" values={categoryCounts} value={state.category} onChange={changeFilter} /><FilterGroup name="year" label="Year" values={yearCounts} value={state.year} onChange={changeFilter} /><FilterGroup name="institution" label="Institution" values={institutionCounts} value={state.institution} onChange={changeFilter} /><FilterGroup name="role" label="Role type" values={roleCounts} value={state.role} onChange={changeFilter} /><button className="archive-reset" type="button" onClick={reset}>Clear all filters</button></aside>{isMobile && filtersOpen && <button type="button" className="archive-filter-scrim" aria-label="Close filters" onClick={() => closeFilters()} />}<div className={`archive-results archive-view-${state.view}`}>{groups.map(group => <section className="archive-year-group" key={group.year || 'all'}>{group.year && <h2 className="archive-year">{group.year}</h2>}<div className="archive-grid">{group.records.map(record => <ArchiveCard record={record} onReveal={revealRecord} key={record.id} />)}</div></section>)}{filtered.length === 0 && <div className="archive-empty"><h2>No records match.</h2><p>Try a broader search or clear the filters.</p><button className="button" type="button" onClick={reset}>Reset archive</button></div>}</div></div>
  </div>
}
