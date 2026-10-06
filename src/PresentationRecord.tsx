import type { Presentation } from './presentationTypes'

export default function PresentationRecord({ presentation: p, compact = false }: { presentation: Presentation; compact?: boolean }) {
  return (
    <article className={`presentation-record${compact ? ' compact' : ''}`} id={p.id} data-presentation-id={p.id} tabIndex={-1}>
      {p.legacyAnchors?.map(id => <span id={id} key={id} className="legacy-presentation-anchor" />)}
      <span className="meta">{p.date} · {p.format}</span>
      <h3>{p.title}</h3>
      <p className="presentation-venue">{p.venue}{p.location ? ` · ${p.location}` : ''}</p>
      <p className="presentation-role">{p.role}{p.presenter ? ` · Presenter: ${p.presenter}` : ''}</p>
      <p className="small-note">{p.status}{p.programCode ? ` · ${p.programCode}` : ''}</p>
      {p.award && <p className="presentation-award">{p.award}</p>}
      {p.note && <p className="small-note">{p.note}</p>}
      {p.variants.length > 0 && <details className="citation-details"><summary>Title variants in source materials</summary><ul>{p.variants.map(title => <li key={title}>{title}</li>)}</ul></details>}
      {p.authors && p.authors.length > 0 && <details className="citation-details"><summary>Authors</summary><p>{p.authors.join(', ')}</p></details>}
      <div className="presentation-links">
        {p.sources.map(source => <a className="source-link" key={source.url} href={source.url}>{source.label}</a>)}
        {p.studyPath && <a className="source-link" href={p.studyPath}>Study details</a>}
        <a className="source-link" href={`/publications#${p.id}`} aria-label={`Link to ${p.title}`}>Link to this presentation</a>
      </div>
    </article>
  )
}
