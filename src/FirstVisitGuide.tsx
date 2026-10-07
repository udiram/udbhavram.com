import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'

const stops = [
  { time: '00:20', label: 'Meet Udi', href: '#trajectory', detail: 'The path from McMaster and UAB to UW–Madison.' },
  { time: '00:50', label: 'See the research', href: '#work', detail: 'Three clinical questions, with findings and boundaries.' },
  { time: '01:10', label: 'Open the workbench', href: '/software', detail: 'Research software, evaluation tools, and build evidence.' },
  { time: '01:30', label: 'Take a lap', href: '/media#lap-companion', detail: 'An onboard Formula LGB run with an annotated companion.' },
]

export default function FirstVisitGuide() {
  const [query, setQuery] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const term = query.trim()
    window.location.assign(term ? `/collection?q=${encodeURIComponent(term)}` : '/collection')
  }
  return <section className="first-visit wrap" aria-labelledby="first-visit-title">
    <div className="first-visit-heading">
      <span className="meta">New here? Start with the 90-second route</span>
      <h2 id="first-visit-title">Four stops.<br /><em>One connected story.</em></h2>
      <p>Research, software, and the life around them—without needing to read the entire archive.</p>
    </div>
    <ol className="first-visit-stops">
      {stops.map(stop => <li key={stop.time}><a href={stop.href}><span>{stop.time}</span><div><strong>{stop.label}</strong><small>{stop.detail}</small></div><ArrowRight /></a></li>)}
    </ol>
    <form className="first-visit-search" onSubmit={submit} role="search">
      <label htmlFor="first-visit-query">Looking for something specific?</label>
      <div><MagnifyingGlass aria-hidden="true" /><input id="first-visit-query" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try adaptive radiotherapy, violin, or robotics" /><button type="submit">Search the collection</button></div>
    </form>
  </section>
}
