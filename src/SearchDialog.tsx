import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, MagnifyingGlass, X } from '@phosphor-icons/react'
import type { ContentKind } from './contentRegistry'
import SaveButton from './SaveButton'
import { rankContent } from './searchRanking'

const categories: (ContentKind | 'All')[] = ['All', 'Study', 'Software', 'Paper', 'Presentation', 'Media', 'Collection']

export default function SearchDialog({ onClose, returnFocus }: { onClose: () => void; returnFocus: React.RefObject<HTMLButtonElement | null> }) {
  const dialog = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ContentKind | 'All'>('All')
  const results = useMemo(() => rankContent(query, category), [category, query])

  useEffect(() => {
    const focusTarget = returnFocus.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const background = [...document.querySelectorAll<HTMLElement>('#root > .skip-link, #root > main, .site-header > .header-inner')]
    const backgroundState = background.map(element => ({ element, inert: element.inert, ariaHidden: element.getAttribute('aria-hidden') }))
    background.forEach(element => {
      element.inert = true
      element.setAttribute('aria-hidden', 'true')
    })
    input.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialog.current) return
      const focusable = [...dialog.current.querySelectorAll<HTMLElement>('button:not([disabled]), input, select, a[href]')].filter(element => !element.hidden)
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      backgroundState.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert
        if (ariaHidden === null) element.removeAttribute('aria-hidden')
        else element.setAttribute('aria-hidden', ariaHidden)
      })
      document.removeEventListener('keydown', onKeyDown)
      focusTarget?.focus()
    }
  }, [onClose, returnFocus])

  return <div className="search-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title" ref={dialog}>
      <div className="search-dialog-header"><div><span className="meta">Search the whole portfolio</span><h2 id="search-title">Where should we go?</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close search"><X /></button></div>
      <label className="global-search-input" htmlFor="global-search"><MagnifyingGlass aria-hidden="true" /><input ref={input} id="global-search" aria-label="Search the portfolio" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try TG-263, segmentation, McMaster…" autoComplete="off" /><kbd aria-hidden="true">Esc</kbd></label>
      <div className="search-categories" role="group" aria-label="Filter search results">{categories.map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</div>
      <div className="search-result-summary" role="status">{query.trim() ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'A few good places to start'}</div>
      <div className="global-search-results">{results.map(item => <article key={item.id} data-search-id={item.id}><a href={item.href} onClick={onClose}><span className="meta">{item.kind} · {item.meta}</span><strong>{item.title}</strong><p>{item.summary}</p><span className="search-open">Open <ArrowRight /></span></a><SaveButton id={item.id} compact /></article>)}</div>
      {!results.length && <div className="global-search-empty"><h3>No matches for “{query.trim()}”.</h3><p>Try fewer words, another category, or a broader idea such as imaging, software, or motorsport.</p><button type="button" onClick={() => { setQuery(''); setCategory('All') }}>Clear search</button></div>}
      <div className="search-dialog-footer"><a href="/reading-list" onClick={onClose}>Open reading list</a><span><kbd>⌘</kbd><kbd>K</kbd> opens search anywhere</span></div>
    </div>
  </div>
}
