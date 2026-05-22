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

const researchPapers = [
  ['2025', 'Improving TG-263 target name compliance using locally hosted large language models', 'AAPM Blue Ribbon Poster'],
  ['2025', 'Evaluation of High-Fidelity Mode for multi-met single-isocenter stereotactic radiosurgery planning', 'RSS / Cureus abstract'],
  ['2025', 'Assessing state-of-the-art deep learning models in abdominal organ auto-segmentation', 'IJROBP'],
  ['2020', "The connection between nutrition and Alzheimer's disease", 'Molecular Nutrition & Food Research'],
]

const generalSystems = [
  ['Clinical AI', 'Human-reviewable models, local-first LLM workflows, and validation loops for clinical settings.'],
  ['Radiation oncology', 'Planning, segmentation, adaptive workflows, TG-263 naming, and pragmatic QA tools.'],
  ['Motorsport systems', 'Strategy simulation, telemetry review, vehicle controls, and race weekend decision support.'],
  ['Builder mode', 'Full-stack tools, research software, backend infrastructure, and polished demos that actually run.'],
]

const radOncChecks = [
  ['TG-263 harmonization', 'Local LLM pipelines that convert messy target names into rule-checked clinical nomenclature.'],
  ['Ethos 2.0 SRS planning', 'High-fidelity plan evaluation for multi-met, single-isocenter stereotactic workflows.'],
  ['Adaptive APBI contours', 'Interobserver variability work around Ethos adaptive accelerated partial breast irradiation.'],
  ['TrueBeam SBRT commissioning', 'Multi-institution 6X versus 10X FFF comparisons for SBRT plan behavior.'],
]

const racePrograms = [
  ['Arrow McLaren IndyCar', 'Data and strategy internship: deterministic simulation, race-weekend tooling, telemetry, and car performance monitoring.'],
  ['McMaster Formula SAE Electric', 'Software engineering for vehicle controls, dynamics, and custom dashboard implementations.'],
  ['Formula LGB 1300', 'Test and development driver program with Momentum Motorsports.'],
  ['VW Polo Cup testing', 'MRF test driver work at Madras International Circuit.'],
]

const projectRows = [
  ['Clinical software', 'Flask/Django backends, research apps, automated review flows, and deployment pipelines.'],
  ['Open source', 'Contributions around MONAI and OpenHands, plus small utilities for medical imaging workflows.'],
  ['Robotics and autonomy', 'FRC programming, Zone01 robotics mentoring, openpilot experimentation, and control systems.'],
  ['STEM + teaching', 'Sparkin STEM French program coordination, yoga instruction, and volunteer clinical exposure.'],
]

const awards = [
  ['2025', 'AAPM Blue Ribbon Poster for locally hosted LLMs in radiation oncology naming workflows'],
  ['2024', 'Society of Physics Students / AAPM undergraduate research poster recognition'],
  ['2023', 'CUPC Overall Winner, Best Talk, for optimizing dose delivery during fractionated radiotherapy'],
]

const presentationRows = [
  ['AAPM 2025', 'Blue Ribbon Poster: Improving TG-263 target name compliance using locally hosted LLMs'],
  ['COMP 2024', 'Invited talk: locally hosted LLMs for TG-263 target-name compliance'],
  ['AAPM 2024', 'Posters on Ethos 2.0 SRS planning and autoML segmentation workflows'],
  ['CUPC 2023', 'Best Talk: Optimizing dose delivery during fractionated radiotherapy'],
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
          {generalSystems.map(([title, text]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <GeneralContent />
      <ContactPanel accent="general" />
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
      <RadOncContent />
      <ContactPanel accent="rt" />
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
        {racePrograms.slice(0, 3).map(([title, text]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <RacingContent />
      <ContactPanel accent="race" />
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
          {researchPapers.map(([year, title, venue]) => (
            <article key={title}>
              <span>{year}</span>
              <h2>{title}</h2>
              <p>{venue}</p>
            </article>
          ))}
        </div>
      </section>
      <ResearchContent />
      <ContactPanel accent="paper" />
    </main>
  )
}

function GeneralContent() {
  return (
    <>
      <section className="general-strip" id="work">
        <p>currently</p>
        <h2>Medical physics research, clinical AI tools, software systems, and motorsport engineering.</h2>
      </section>
      <section className="project-matrix" aria-label="General work areas">
        {projectRows.map(([title, text]) => (
          <article key={title}>
            <span>{title}</span>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="award-ribbon" id="research">
        {awards.map(([year, title]) => (
          <article key={title}>
            <strong>{year}</strong>
            <p>{title}</p>
          </article>
        ))}
      </section>
    </>
  )
}

function RadOncContent() {
  return (
    <>
      <section className="rt-flow" id="work" aria-label="Radiation oncology workflow">
        {radOncChecks.map(([title, text], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="rt-evidence" id="research">
        <div>
          <p>translation target</p>
          <h2>Build the tool, validate the output, keep a human in the loop.</h2>
        </div>
        <div className="dose-readout">
          {['non-PHI inputs', 'source-traced outputs', 'physics review', 'clinic-safe deployment'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
    </>
  )
}

function RacingContent() {
  return (
    <>
      <section className="race-ledger" id="research">
        {racePrograms.map(([title, text]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="race-transfer">
        <div className="delta-board">
          {['signal', 'model', 'decision', 'feedback'].map((item, index) => (
            <span key={item}>
              {index + 1} / {item}
            </span>
          ))}
        </div>
        <p>
          The racing version is about pressure-tested engineering: noisy inputs, limited time, and decisions that need to be
          explainable after the fact.
        </p>
      </section>
    </>
  )
}

function ResearchContent() {
  return (
    <>
      <section className="publication-index" id="work">
        {researchPapers.map(([year, title, venue]) => (
          <article key={title}>
            <span>{year}</span>
            <h2>{title}</h2>
            <p>{venue}</p>
          </article>
        ))}
      </section>
      <section className="talk-timeline" id="research">
        {presentationRows.map(([event, title]) => (
          <article key={title}>
            <strong>{event}</strong>
            <p>{title}</p>
          </article>
        ))}
      </section>
    </>
  )
}

function ContactPanel({ accent }: { accent: 'general' | 'rt' | 'race' | 'paper' }) {
  return (
    <section className={`contact-panel contact-${accent}`} id="contact">
      <h2>Get in touch</h2>
      <p>Research collaborations, clinical AI projects, medical physics software, racing analytics, and technical systems.</p>
      <div>
        <a href="mailto:ramu@mcmaster.ca">ramu@mcmaster.ca</a>
        <a href="https://x.com/UdbhavRam" target="_blank" rel="noreferrer">
          x.com/UdbhavRam
        </a>
        <a href="https://github.com/udiram" target="_blank" rel="noreferrer">
          github.com/udiram
        </a>
      </div>
    </section>
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
