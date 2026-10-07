import { useState } from 'react'
import { Check, Warning } from '@phosphor-icons/react'

type Lens = 'rules' | 'meaning' | 'decision'

const lenses: Record<Lens, { title: string; copy: string; verdict: string; tone: 'pass' | 'review' }> = {
  rules: {
    title: 'Rules check',
    copy: 'The candidate uses the expected character set, structure, and permitted anatomy label.',
    verdict: 'The format can pass.',
    tone: 'pass',
  },
  meaning: {
    title: 'Meaning check',
    copy: 'A syntactically tidy label can still change laterality, anatomy, intent, or another clinically important detail.',
    verdict: 'Meaning still needs comparison with the source.',
    tone: 'review',
  },
  decision: {
    title: 'Workflow decision',
    copy: 'The safe outcome is a candidate for a qualified reviewer—not an automatic overwrite of the clinical record.',
    verdict: 'Route uncertain cases to review.',
    tone: 'review',
  },
}

export default function ResearchExplainer() {
  const [lens, setLens] = useState<Lens>('rules')
  const selected = lenses[lens]
  return <section className="research-explainer" aria-labelledby="explainer-title">
    <div className="explainer-intro">
      <span className="meta">Interactive explainer · synthetic example</span>
      <h2 id="explainer-title">Passing a rule<br /><em>isn’t the same as being right.</em></h2>
      <p>My TG-263 work exposed a useful safety distinction. Explore the three checks below; no patient data or clinical recommendation is shown.</p>
    </div>
    <div className="explainer-card">
      <div className="explainer-example" aria-label="Synthetic naming example">
        <span>Source note</span><strong>“Left liver lesion, gross target”</strong>
        <span>Model candidate</span><strong>GTVp_Liver</strong>
      </div>
      <div className="explainer-tabs" role="group" aria-label="Review lenses">
        {(Object.keys(lenses) as Lens[]).map(key => <button type="button" aria-pressed={lens === key} key={key} onClick={() => setLens(key)}>{lenses[key].title}</button>)}
      </div>
      <div className={`explainer-result is-${selected.tone}`} aria-live="polite">
        {selected.tone === 'pass' ? <Check /> : <Warning />}
        <div><strong>{selected.verdict}</strong><p>{selected.copy}</p></div>
      </div>
      <p className="explainer-boundary">Illustrative logic only. The published poster evaluated a reviewed naming workflow; it did not validate autonomous clinical use.</p>
      <a className="text-link" href="/research/clinical-language-models">See the methods, results, and limitations →</a>
    </div>
  </section>
}
