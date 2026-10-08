import { useMemo, useRef, useState } from 'react'
import { ArrowLeft, Copy, Trash } from '@phosphor-icons/react'
import { publicContentById } from './contentRegistry'
import { READING_LIST_LIMIT, useReadingList } from './ReadingListContext'

const decodeSharedIds = (search: string) => {
  const raw = new URLSearchParams(search).get('list')
  if (!raw) return { present: false, ids: [] as string[], invalid: 0, oversized: false }
  const values = raw.split(',').map(value => {
    try { return decodeURIComponent(value.trim()) } catch { return '' }
  }).filter(Boolean)
  const deduped = [...new Set(values)]
  return { present: true, ids: deduped.slice(0, READING_LIST_LIMIT), invalid: values.length - deduped.length, oversized: deduped.length > READING_LIST_LIMIT }
}

function ListItems({ ids, onRemove }: { ids: string[]; onRemove?: (id: string) => void }) {
  return <div className="reading-list-items">{ids.map(id => {
    const item = publicContentById.get(id)
    if (!item) return null
    return <article key={id} data-reading-id={id}><div><span className="meta">{item.kind} · {item.meta}</span><h2><a href={item.href}>{item.title}</a></h2><p>{item.summary}</p></div>{onRemove && <button type="button" className="save-button is-compact" onClick={() => onRemove(id)} aria-label={`Remove ${item.title}`}><Trash aria-hidden="true" /><span>Remove</span></button>}</article>
  })}</div>
}

export default function ReadingListPage() {
  const { ids, issue, remove, clear, merge } = useReadingList()
  const shared = useMemo(() => decodeSharedIds(typeof window === 'undefined' ? '' : window.location.search), [])
  const ownKnown = ids.filter(id => publicContentById.has(id))
  const sharedKnown = shared.ids.filter(id => publicContentById.has(id))
  const ownUnknown = ids.length - ownKnown.length
  const sharedUnknown = shared.ids.length - sharedKnown.length
  const [copyState, setCopyState] = useState('')
  const fallback = useRef<HTMLInputElement>(null)
  const origin = typeof window === 'undefined' || !window.location.origin ? 'https://udbhavram.com' : window.location.origin
  const shareUrl = `${origin}/reading-list?list=${ownKnown.map(encodeURIComponent).join(',')}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyState('Link copied.')
    } catch {
      setCopyState('Copy was blocked. The link is selected below.')
      requestAnimationFrame(() => fallback.current?.select())
    }
  }

  return <>
    <div className="page-intro wrap"><a className="back-link" href="/"><ArrowLeft /> Home</a><span className="meta page-eyebrow">Reading list</span><h1>Keep the threads<br />you want to <em>follow.</em></h1><div className="page-lede"><p>Save research, software, talks, and stories in this browser. Sharing creates a link; opening someone else’s link never changes your own list unless you choose to merge it.</p></div></div>
    <div className="wrap reading-list-page">
      {shared.present && <section className="shared-list" aria-labelledby="shared-list-title"><div className="reading-list-heading"><div><span className="meta">Shared with you</span><h2 id="shared-list-title">A separate reading list.</h2></div>{sharedKnown.length > 0 && <button className="button" type="button" onClick={() => merge(sharedKnown)}>Merge into my list</button>}</div>{(shared.invalid > 0 || shared.oversized || sharedUnknown > 0) && <p className="list-notice" role="status">{[shared.invalid > 0 && `${shared.invalid} duplicate ${shared.invalid === 1 ? 'ID was' : 'IDs were'} removed`, shared.oversized && `only the first ${READING_LIST_LIMIT} IDs were considered`, sharedUnknown > 0 && `${sharedUnknown} unknown ${sharedUnknown === 1 ? 'ID was' : 'IDs were'} ignored`].filter(Boolean).join('; ')}.</p>}{sharedKnown.length ? <ListItems ids={sharedKnown} /> : <div className="empty-reading-list"><h3>No readable items were in this shared link.</h3><p>It may be empty, outdated, or malformed.</p></div>}</section>}
      <section aria-labelledby="own-list-title"><div className="reading-list-heading"><div><span className="meta">Saved in this browser</span><h2 id="own-list-title">My reading list.</h2></div>{ids.length > 0 && <div className="reading-list-actions">{ownKnown.length > 0 && <button className="button" type="button" onClick={copyLink}><Copy /> Copy share link</button>}<button className="text-button" type="button" onClick={clear}>Clear list</button></div>}</div>{(issue || ownUnknown > 0) && <p className="list-notice" role="status">{[issue, ownUnknown > 0 && `${ownUnknown} unknown saved ${ownUnknown === 1 ? 'ID was' : 'IDs were'} ignored.`].filter(Boolean).join(' ')}</p>}{copyState && <p className="list-notice" role="status">{copyState}</p>}<label className="share-fallback"><span>Share link</span><input ref={fallback} value={shareUrl} readOnly aria-label="Reading list share link" /></label>{ownKnown.length ? <ListItems ids={ownKnown} onRemove={remove} /> : <div className="empty-reading-list"><h3>Nothing saved yet.</h3><p>Use Save on a search result, study, paper, presentation, or software project.</p><a className="button" href="/research">Explore the research</a></div>}</section>
    </div>
  </>
}
