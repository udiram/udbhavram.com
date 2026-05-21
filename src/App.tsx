import { useEffect, useState } from 'react'
import './App.css'

type SiteMode = 'general' | 'radonc' | 'racing' | 'research'

const modes: Record<SiteMode, { label: string; title: string; text: string }> = {
  general: {
    label: 'General',
    title: 'Full spectrum',
    text: 'Clinical AI, medical physics, software, and performance systems.',
  },
  radonc: {
    label: 'Rad Onc',
    title: 'Radiation oncology',
    text: 'Planning, QA, segmentation, adaptive workflows, and reviewable AI.',
  },
  racing: {
    label: 'Racing',
    title: 'Motorsports',
    text: 'Telemetry, race strategy, simulation, and performance engineering.',
  },
  research: {
    label: 'Research',
    title: 'Research profile',
    text: 'Publications, talks, collaborations, and the academic thread.',
  },
}

const modeOrder = Object.keys(modes) as SiteMode[]
const storageKey = 'udbhavram-site-mode'

const papers = [
  ['2025', 'Deep learning auto-segmentation models for abdominal organs on CT and MRI', 'IJROBP'],
  ['2025', 'Ethos 2.0 high-fidelity segmentation and treatment planning for multi-metastases SRS', 'JACMP'],
  ['2024', 'LLM agent integration for radiation oncology review and documentation workflows', 'UAB Radiation Oncology'],
]

const tools = [
  ['Clinical AI QA', 'Validation loops, contour review, source checks, and uncertainty-aware workflows.'],
  ['Radiotherapy Utilities', 'Structure naming, plan comparison, dose review, and small tools that remove clinical friction.'],
  ['Strategy Simulation', 'Lap-time deltas, stint windows, telemetry review, and race-state modeling.'],
]

function getInitialMode() {
  const urlMode = new URLSearchParams(window.location.search).get('mode')
  if (modeOrder.includes(urlMode as SiteMode)) return urlMode as SiteMode

  const saved = window.localStorage.getItem(storageKey)
  return modeOrder.includes(saved as SiteMode) ? (saved as SiteMode) : null
}

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h10.5M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  )
}

function LensGate({ onChoose }: { onChoose: (mode: SiteMode) => void }) {
  return (
    <main className="lens-gate">
      <section className="gate-intro">
        <p>udbhavram.com</p>
        <h1>Pick the version that matches why you are here.</h1>
      </section>
      <section className="gate-grid" aria-label="Choose site version">
        {modeOrder.map((mode) => (
          <button className={`gate-card gate-card-${mode}`} key={mode} type="button" onClick={() => onChoose(mode)}>
            <span>{modes[mode].label}</span>
            <strong>{modes[mode].title}</strong>
            <em>{modes[mode].text}</em>
          </button>
        ))}
      </section>
    </main>
  )
}

function ModeSwitcher({ active, onChoose }: { active: SiteMode; onChoose: (mode: SiteMode) => void }) {
  return (
    <aside className={`lens-switcher mode-${active}`} aria-label="Switch site version">
      <span>Lens</span>
      {modeOrder.map((mode) => (
        <button
          className={active === mode ? 'active' : ''}
          key={mode}
          type="button"
          aria-pressed={active === mode}
          onClick={() => onChoose(mode)}
        >
          {modes[mode].label}
        </button>
      ))}
    </aside>
  )
}

function MediaSlice({ variant }: { variant: 'general' | 'rt' | 'race' | 'research' }) {
  return (
    <div className={`media-slice media-${variant}`}>
      <img src="/assets/hero-collage.png" alt="Synthetic imaging, radiotherapy, code, and racing engineering collage" />
      <i className="scan-x" />
      <i className="scan-y" />
    </div>
  )
}

function GeneralSite() {
  return (
    <main className="site-page general-site">
      <header className="site-nav">
        <a href="#top">Udbhav Ram</a>
        <nav>
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <section className="general-hero" id="top">
        <div>
          <p className="mode-line">clinical ai / medical physics / software / performance systems</p>
          <h1>
            Builder across
            <br />
            clinic, code,
            <br />
            and physics.
          </h1>
          <p>
            I work on clinical AI, radiation oncology workflows, research software, and technical systems that need to be fast,
            inspectable, and useful under pressure.
          </p>
          <a className="action-link" href="#work">
            View work <Arrow />
          </a>
        </div>
        <div className="systems-board">
          {[
            ['Clinical AI', 'Human-reviewable models and workflow agents'],
            ['Medical Physics', 'Dose, planning, QA, and uncertainty'],
            ['Software', 'Small tools that remove operational friction'],
            ['Performance', 'Telemetry, simulation, and decision support'],
          ].map(([title, text]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <ContentRows accent="general" />
    </main>
  )
}

function RadOncSite() {
  return (
    <main className="site-page rt-site">
      <header className="rt-topline">
        <span>udbhav@rt-workstation</span>
        <span>plan-review --ai --qa --human-signoff</span>
      </header>
      <section className="rt-hero" id="top">
        <div className="terminal-panel">
          <p className="prompt">$ load clinical_workflow.md</p>
          <h1>
            Clinic-ready
            <br />
            radiation
            <br />
            oncology
            <br />
            software.
          </h1>
          <div className="terminal-output">
            <p>structure names... aligned</p>
            <p>synthetic case... non-PHI</p>
            <p>dose overlay... readable</p>
            <p>source trace... attached</p>
            <p>physician / physicist review ready</p>
          </div>
          <a className="action-link" href="#research">
            Review clinical work <Arrow />
          </a>
        </div>
        <div className="rt-workstation">
          <MediaSlice variant="rt" />
          <div className="rt-console">
            <p>RT_CHECKLIST</p>
            <span>Plan compare</span>
            <span>Contour review</span>
            <span>Dose QA</span>
          </div>
        </div>
      </section>
      <ContentRows accent="rt" />
    </main>
  )
}

function RacingSite() {
  return (
    <main className="site-page racing-site">
      <header className="race-bar">
        <span>pit wall</span>
        <span>sector delta +0.083</span>
        <span>window open lap 18</span>
      </header>
      <section className="race-hero" id="top">
        <div className="race-copy">
          <p className="mode-line">telemetry / strategy / simulation / performance engineering</p>
          <h1>
            Race systems
            <br />
            for decisions
            <br />
            at speed.
          </h1>
          <p>
            Turning noisy telemetry and race context into strategy: stint windows, lap-time models, pit timing, and tools an
            engineer can trust while the clock is running.
          </p>
        </div>
        <div className="pit-wall">
          <MediaSlice variant="race" />
          <div className="timing-tower">
            {['P01 1:28.420', 'P02 +0.118', 'P03 +0.406', 'P04 +0.911', 'BOX L18'].map((row) => (
              <p key={row}>{row}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="race-cards" id="work">
        {[
          ['Strategy', 'Stint windows, tire state, fuel burn, and pit timing as changing constraints.'],
          ['Telemetry', 'Readable traces for fast diagnosis, not a wall of vanity plots.'],
          ['Transfer', 'The same discipline applies to clinical systems: measure, simplify, decide.'],
        ].map(([title, text]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <ContentRows accent="race" />
    </main>
  )
}

function ResearchSite() {
  return (
    <main className="site-page research-site">
      <header className="paper-nav">
        <a href="#top">Udbhav Ram</a>
        <span>research index</span>
      </header>
      <section className="paper-hero" id="top">
        <div>
          <p className="mode-line">publications / talks / collaborations / research software</p>
          <h1>
            Research, talks,
            <br />
            and tools become
            <br />
            inspectable systems.
          </h1>
          <p>
            A publication-first view of work across medical physics, clinical AI, segmentation, treatment planning, and
            workflow-aware software.
          </p>
        </div>
        <div className="paper-stack">
          {papers.map(([year, title, venue]) => (
            <article key={title}>
              <span>{year}</span>
              <h2>{title}</h2>
              <p>{venue}</p>
            </article>
          ))}
        </div>
      </section>
      <ContentRows accent="paper" />
    </main>
  )
}

function ContentRows({ accent }: { accent: 'general' | 'rt' | 'race' | 'paper' }) {
  return (
    <>
      <section className={`work-table work-table-${accent}`} id="work">
        <div>
          <p>01</p>
          <h2>Current work</h2>
        </div>
        <div className="row-list">
          {tools.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={`work-table work-table-${accent}`} id="research">
        <div>
          <p>02</p>
          <h2>Research</h2>
        </div>
        <div className="row-list">
          {papers.map(([year, title, venue]) => (
            <article key={title}>
              <span>{year}</span>
              <h3>{title}</h3>
              <p>{venue}</p>
            </article>
          ))}
        </div>
      </section>
      <section className={`contact-panel contact-${accent}`} id="contact">
        <h2>Get in touch</h2>
        <p>Research collaborations, clinical AI projects, medical physics software, racing analytics, and technical systems.</p>
        <div>
          <a href="mailto:hello@udbhavram.com">hello@udbhavram.com</a>
          <a href="https://x.com/UdbhavRam" target="_blank" rel="noreferrer">
            x.com/UdbhavRam
          </a>
        </div>
      </section>
    </>
  )
}

function App() {
  const [mode, setMode] = useState<SiteMode | null>(() => getInitialMode())

  const chooseMode = (nextMode: SiteMode) => {
    setMode(nextMode)
    window.localStorage.setItem(storageKey, nextMode)
    window.history.replaceState(null, '', `?mode=${nextMode}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    document.documentElement.dataset.mode = mode ?? 'gate'
  }, [mode])

  if (!mode) {
    return <LensGate onChoose={chooseMode} />
  }

  return (
    <>
      <ModeSwitcher active={mode} onChoose={chooseMode} />
      {mode === 'general' && <GeneralSite />}
      {mode === 'radonc' && <RadOncSite />}
      {mode === 'racing' && <RacingSite />}
      {mode === 'research' && <ResearchSite />}
    </>
  )
}

export default App
