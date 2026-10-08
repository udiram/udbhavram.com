import { BookmarkSimple, Check } from '@phosphor-icons/react'
import { useReadingList } from './ReadingListContext'

export default function SaveButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { ids, issue, persistence, toggle } = useReadingList()
  const saved = ids.includes(id)
  const visitListHref = `/reading-list?list=${ids.map(encodeURIComponent).join(',')}`
  return <span className="save-control"><button className={`save-button${saved ? ' is-saved' : ''}${compact ? ' is-compact' : ''}`} data-save-id={id} type="button" aria-pressed={saved} onClick={() => toggle(id)}>{saved ? <Check aria-hidden="true" /> : <BookmarkSimple aria-hidden="true" />}<span>{saved ? 'Saved' : 'Save'}</span></button>{issue && <span className="save-feedback" role="status">{issue}{persistence === 'page' && ids.length > 0 && <> <a href={visitListHref}>Open or share this visit’s list</a>.</>}</span>}</span>
}
