/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { publicContentById } from './contentRegistry'

export const READING_LIST_KEY = 'udbhav-reading-list:v1'
export const READING_LIST_SESSION_KEY = 'udbhav-reading-list:visit:v1'
export const READING_LIST_LIMIT = 24

type StoredReadingList = { version: 1; ids: string[] }
type ReadingListContextValue = {
  ids: string[]
  issue: string | null
  persistence: 'persistent' | 'tab' | 'page'
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  merge: (ids: string[]) => void
}

const ReadingListContext = createContext<ReadingListContextValue | null>(null)
const uniqueBounded = (ids: string[]) => [...new Set(ids.filter(id => typeof id === 'string' && id.length <= 180))].slice(0, READING_LIST_LIMIT)

export function parseStoredReadingList(value: string | null): { ids: string[]; issue: string | null } {
  if (!value) return { ids: [], issue: null }
  try {
    const parsed = JSON.parse(value) as Partial<StoredReadingList>
    if (parsed.version !== 1 || !Array.isArray(parsed.ids)) throw new Error('Unsupported reading-list data')
    const ids = uniqueBounded(parsed.ids)
    return { ids, issue: parsed.ids.length > READING_LIST_LIMIT ? `Only the first ${READING_LIST_LIMIT} saved items were loaded.` : null }
  } catch {
    return { ids: [], issue: 'Saved list data could not be read, so it was left unchanged.' }
  }
}

function readStorage() {
  if (typeof window === 'undefined') return { ids: [], issue: null, persistence: 'persistent' as const }
  // A visit fallback means a previous persistent write failed. It is the
  // authoritative same-tab snapshot (including an explicitly empty list)
  // until a later successful localStorage write removes it.
  try {
    const visitValue = window.sessionStorage.getItem(READING_LIST_SESSION_KEY)
    if (visitValue !== null) {
      const visit = parseStoredReadingList(visitValue)
      return { ids: visit.ids, issue: ['Browser storage is unavailable. Changes will last only for this tab.', visit.issue].filter(Boolean).join(' '), persistence: 'tab' as const }
    }
  } catch {
    /* Persistent storage may still be usable. */
  }
  try {
    const persistent = parseStoredReadingList(window.localStorage.getItem(READING_LIST_KEY))
    return { ...persistent, persistence: 'persistent' as const }
  } catch {
    return { ids: [], issue: 'Browser storage is unavailable. Changes will last only on this page.', persistence: 'page' as const }
  }
}

export function ReadingListProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([])
  const [issue, setIssue] = useState<string | null>(null)
  const [persistence, setPersistence] = useState<'persistent' | 'tab' | 'page'>('persistent')

  useEffect(() => {
    const hydrate = window.setTimeout(() => {
      const current = readStorage()
      setIds(current.ids)
      setIssue(current.issue)
      setPersistence(current.persistence)
    }, 0)
    const onStorage = (event: StorageEvent) => {
      if (event.key !== READING_LIST_KEY) return
      const next = parseStoredReadingList(event.newValue)
      setIds(next.ids)
      setIssue(next.issue)
      setPersistence('persistent')
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.clearTimeout(hydrate)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const commit = useCallback((nextIds: string[]) => {
    const unique = [...new Set(nextIds.filter(id => typeof id === 'string' && id.length <= 180))]
    const known = unique.filter(id => publicContentById.has(id))
    const discarded = unique.length - known.length
    const next = known.slice(0, READING_LIST_LIMIT)
    setIds(next)
    const capacityIssue = known.length > READING_LIST_LIMIT ? `A reading list can contain up to ${READING_LIST_LIMIT} items.` : null
    const staleIssue = discarded > 0 ? `${discarded} outdated saved ${discarded === 1 ? 'item was' : 'items were'} discarded.` : null
    try {
      window.localStorage.setItem(READING_LIST_KEY, JSON.stringify({ version: 1, ids: next } satisfies StoredReadingList))
      try { window.sessionStorage.removeItem(READING_LIST_SESSION_KEY) } catch { /* Optional fallback store. */ }
      setIssue([capacityIssue, staleIssue].filter(Boolean).join(' ') || null)
      setPersistence('persistent')
    } catch {
      let fallback = 'Browser storage is unavailable. Changes will last only on this page.'
      try {
        window.sessionStorage.setItem(READING_LIST_SESSION_KEY, JSON.stringify({ version: 1, ids: next } satisfies StoredReadingList))
        fallback = 'Browser storage is unavailable. Changes will last only for this tab.'
        setPersistence('tab')
      } catch { setPersistence('page') }
      setIssue([fallback, capacityIssue, staleIssue].filter(Boolean).join(' '))
    }
  }, [])

  const value = useMemo<ReadingListContextValue>(() => ({
    ids,
    issue,
    persistence,
    toggle: id => commit(ids.includes(id) ? ids.filter(existing => existing !== id) : [...ids, id]),
    remove: id => commit(ids.filter(existing => existing !== id)),
    clear: () => commit([]),
    merge: incoming => commit([...ids, ...incoming]),
  }), [commit, ids, issue, persistence])

  return <ReadingListContext.Provider value={value}>{children}</ReadingListContext.Provider>
}

export function useReadingList() {
  const value = useContext(ReadingListContext)
  if (!value) throw new Error('useReadingList must be used within ReadingListProvider')
  return value
}
