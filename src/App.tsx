import { useEffect, useMemo, useState } from 'react'
import './App.css'

type StageKey = 'imaging' | 'dose' | 'code' | 'racing'
type SiteMode = 'general' | 'radonc' | 'racing' | 'research'

type ModeConfig = {
  label: string
  chooserTitle: string
  chooserText: string
  signal: string
  lede: string
  defaultStage: StageKey
  primary: [string, string]
  work: [string, string][]
  researchTitle: string
  research: { year: string; title: string; venue: string }[]
  projectsTitle: string
  projects: [string, string][]
  launcher: [string, string][]
  contactTitle: string
  contactText: string
  footer: string
}

const modes: Record<SiteMode, ModeConfig> = {
  general: {
    label: 'General',
    chooserTitle: 'Full spectrum',
    chooserText: 'Clinical AI, medical physics, software, and performance systems in one view.',
    signal: 'clinical ai / physics / radiology software / performance systems',
    lede:
      'I build clinical AI and physics-driven tools for radiology, radiation oncology, and technical workflows that need to hold up under real review.',
    defaultStage: 'imaging',
    primary: ['View research', '#research'],
    work: [
      ['01', 'AI systems that stay inspectable after the first impressive demo.'],
      ['02', 'Radiotherapy tooling shaped by naming, QA, review, and handoff friction.'],
      ['03', 'Research translation with enough engineering taste to become usable software.'],
    ],
    researchTitle: 'Selected research',
    research: [
      {
        year: '2025',
        title: 'Assessment of state-of-the-art deep learning auto-segmentation models for abdominal organs on CT and MRI',
        venue: 'International Journal of Radiation Oncology Biology Physics',
      },
      {
        year: '2025',
        title: 'Ethos 2.0 high-fidelity image segmentation and treatment planning for multi-metastases SRS',
        venue: 'Journal of Applied Clinical Medical Physics',
      },
      {
        year: '2024',
        title: 'Clinical workflow integration for LLM agents in radiation oncology',
        venue: 'UAB Radiation Oncology',
      },
    ],
    projectsTitle: 'Software & projects',
    projects: [
      ['Clinical AI QA', 'Contour review, source-grounded extraction, and validation loops for medical imaging workflows.'],
      ['Radiotherapy Utilities', 'Structure naming, plan checks, and small workflow tools that remove repetitive clinical friction.'],
      ['Strategy Simulation', 'Telemetry and race-strategy modeling as a parallel track in performance systems.'],
      ['Personal Research OS', 'A cleaner public home for writing, projects, papers, talks, and collaborations.'],
    ],
    launcher: [
      ['Research archive', 'https://sites.google.com/view/udbhav-ram/research'],
      ['Project archive', 'https://sites.google.com/view/udbhav-ram/projects'],
      ['UAB profile', 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor'],
      ['X profile', 'https://x.com/UdbhavRam'],
    ],
    contactTitle: 'Let’s build useful tools.',
    contactText: 'Research collaborations, clinical AI projects, medical physics software, and technical systems with real operators in mind.',
    footer: 'clinical AI / medical physics / software',
  },
  radonc: {
    label: 'Rad Onc',
    chooserTitle: 'Radiation oncology',
    chooserText: 'Planning, QA, segmentation, adaptive workflows, and clinically reviewable AI.',
    signal: 'radiation oncology / treatment planning / qa / clinical ai',
    lede:
      'I focus on radiation oncology workflows where AI has to respect physics, provenance, review burden, and the reality of clinical handoffs.',
    defaultStage: 'dose',
    primary: ['Review clinical work', '#work'],
    work: [
      ['01', 'Plan and structure workflows built around the details clinicians actually touch.'],
      ['02', 'Deep learning evaluation with safety, QA, and reviewability treated as first-class constraints.'],
      ['03', 'Adaptive and SRS planning work where automation has to be measured, not merely demoed.'],
    ],
    researchTitle: 'Radiation oncology work',
    research: [
      {
        year: '2025',
        title: 'Ethos 2.0 high-fidelity image segmentation and treatment planning for multi-metastases SRS',
        venue: 'Journal of Applied Clinical Medical Physics',
      },
      {
        year: '2025',
        title: 'Deep learning auto-segmentation models for abdominal organs on CT and MRI',
        venue: 'International Journal of Radiation Oncology Biology Physics',
      },
      {
        year: '2024',
        title: 'LLM agent integration for review, extraction, and clinical workflow documentation',
        venue: 'UAB Radiation Oncology',
      },
    ],
    projectsTitle: 'Clinical tooling',
    projects: [
      ['Structure QA', 'Tools for naming, comparison, and review of radiotherapy structures before downstream failures appear.'],
      ['Dose Review', 'Interfaces for dose overlays, plan comparison, and uncertainty-aware clinical review.'],
      ['Documentation Agents', 'Local-first LLM workflows for extracting, consolidating, and checking clinical notes.'],
      ['Demo Workbench', 'Synthetic, non-PHI demos that show clinical value without pretending to be production medicine.'],
    ],
    launcher: [
      ['Radiation oncology research', 'https://sites.google.com/view/udbhav-ram/research'],
      ['UAB profile', 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor'],
      ['Clinical projects', 'https://sites.google.com/view/udbhav-ram/projects'],
      ['Email', 'mailto:hello@udbhavram.com'],
    ],
    contactTitle: 'Clinical AI should survive clinical review.',
    contactText: 'I’m interested in radiation oncology software, AI QA, adaptive workflows, and tools that reduce review friction.',
    footer: 'radiation oncology / qa / planning software',
  },
  racing: {
    label: 'Racing',
    chooserTitle: 'Motorsports',
    chooserText: 'Telemetry, strategy, simulation, and performance engineering.',
    signal: 'race strategy / telemetry / simulation / low-latency systems',
    lede:
      'My motorsports work is about turning noisy telemetry and race context into decisions: stint strategy, lap-time models, and systems that stay fast under pressure.',
    defaultStage: 'racing',
    primary: ['See performance work', '#projects'],
    work: [
      ['01', 'Race strategy models that treat uncertainty, timing, and tire windows as live constraints.'],
      ['02', 'Telemetry pipelines built for quick interpretation instead of pretty dashboards no one trusts.'],
      ['03', 'The same engineering instinct: measure what matters, reduce latency, and keep the operator in control.'],
    ],
    researchTitle: 'Transferable engineering',
    research: [
      {
        year: 'SIM',
        title: 'Race strategy simulation and stint-window modeling for changing track conditions',
        venue: 'Performance engineering',
      },
      {
        year: 'DATA',
        title: 'Telemetry interpretation and decision support under time pressure',
        venue: 'Motorsports systems',
      },
      {
        year: 'AI',
        title: 'Clinical AI and motorsports share the same hard problem: useful decisions from uncertain signals',
        venue: 'Cross-domain systems',
      },
    ],
    projectsTitle: 'Performance systems',
    projects: [
      ['Strategy Simulator', 'Lap-time deltas, stint windows, pit timing, and race-state modeling.'],
      ['Telemetry Review', 'Readable traces for quick diagnosis, not vanity plots.'],
      ['Operator Tools', 'Interfaces that surface next actions without burying the driver or engineer.'],
      ['Clinical Transfer', 'Applying performance engineering discipline to medical AI workflows.'],
    ],
    launcher: [
      ['Project archive', 'https://sites.google.com/view/udbhav-ram/projects'],
      ['General profile', 'https://sites.google.com/view/udbhav-ram'],
      ['X profile', 'https://x.com/UdbhavRam'],
      ['Email', 'mailto:hello@udbhavram.com'],
    ],
    contactTitle: 'Fast systems still need judgment.',
    contactText: 'I’m interested in racing analytics, simulation, telemetry tooling, and technical work where decisions happen live.',
    footer: 'motorsports / telemetry / simulation',
  },
  research: {
    label: 'Research',
    chooserTitle: 'Research profile',
    chooserText: 'Publications, talks, collaborations, and the academic through-line.',
    signal: 'publications / talks / research software / collaboration',
    lede:
      'This version foregrounds publications, talks, and research themes across clinical AI, medical physics, segmentation, and workflow software.',
    defaultStage: 'code',
    primary: ['Open research archive', '#research'],
    work: [
      ['01', 'Publication-driven work in segmentation, treatment planning, and clinical AI evaluation.'],
      ['02', 'Research software that makes experiments easier to reproduce and review.'],
      ['03', 'Collaborations that connect medical physics, radiology, software, and applied AI.'],
    ],
    researchTitle: 'Publications & talks',
    research: [
      {
        year: '2025',
        title: 'Assessment of state-of-the-art deep learning auto-segmentation models for abdominal organs on CT and MRI',
        venue: 'International Journal of Radiation Oncology Biology Physics',
      },
      {
        year: '2025',
        title: 'Ethos 2.0 high-fidelity image segmentation and treatment planning for multi-metastases SRS',
        venue: 'Journal of Applied Clinical Medical Physics',
      },
      {
        year: '2025',
        title: 'Blue Ribbon Poster and conference presentations in medical physics and radiation oncology AI',
        venue: 'AAPM / COMP / CUPhC',
      },
    ],
    projectsTitle: 'Research infrastructure',
    projects: [
      ['Evaluation Harnesses', 'Tools for testing models across institutions, scanners, modalities, and edge cases.'],
      ['Synthetic Demo Data', 'Non-PHI clinical cases for showing workflows without compromising privacy.'],
      ['Paper-to-Prototype', 'Turning research methods into local tools that reviewers can actually inspect.'],
      ['Writing Archive', 'A living home for papers, talks, notes, and collaborations.'],
    ],
    launcher: [
      ['Research archive', 'https://sites.google.com/view/udbhav-ram/research'],
      ['Talks and awards', 'https://sites.google.com/view/udbhav-ram'],
      ['UAB profile', 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor'],
      ['Email', 'mailto:hello@udbhavram.com'],
    ],
    contactTitle: 'Research should become inspectable systems.',
    contactText: 'I’m interested in collaborations around clinical AI evaluation, medical physics, segmentation, and workflow-aware research software.',
    footer: 'publications / talks / collaborations',
  },
}

const stagePanels: Record<
  StageKey,
  {
    label: string
    title: string
    detail: string
    readout: string[]
  }
> = {
  imaging: {
    label: 'MRI',
    title: 'Image models that can be audited',
    detail:
      'Synthetic imaging, segmentation checks, and review tools built around clinical uncertainty instead of demo-perfect output.',
    readout: ['slice 18 / 42', 'review contour', 'uncertainty map'],
  },
  dose: {
    label: 'RT',
    title: 'Physics-aware workflow software',
    detail:
      'Planning, QA, and naming utilities for radiation oncology work where small inconsistencies become real operational drag.',
    readout: ['dose overlay', 'plan compare', 'structure map'],
  },
  code: {
    label: 'AI',
    title: 'Local agents for clinical chores',
    detail:
      'LLM systems for documentation, routing, extraction, and review where provenance matters more than chatbot theater.',
    readout: ['agent trace', 'source check', 'human signoff'],
  },
  racing: {
    label: 'SIM',
    title: 'Performance engineering mindset',
    detail:
      'Telemetry, lap-time simulation, and strategy thinking applied to technical systems that need speed without slop.',
    readout: ['stint model', 'delta trace', 'decision window'],
  },
}

const modeKeys = Object.keys(modes) as SiteMode[]
const storageKey = 'udbhavram-site-mode'

function getUrlMode() {
  const mode = new URLSearchParams(window.location.search).get('mode')
  return modeKeys.includes(mode as SiteMode) ? (mode as SiteMode) : null
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h10.5M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  )
}

function StageCanvas({ active }: { active: StageKey }) {
  const panel = stagePanels[active]

  return (
    <div className={`stage-viewport stage-${active}`} aria-live="polite">
      <div className="scan-plane" />
      <img
        className="stage-image"
        src="/assets/hero-collage.png"
        alt="Synthetic imaging, dose map, code, and performance engineering collage"
      />
      <div className="stage-grid" aria-hidden="true">
        {Array.from({ length: 36 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="stage-crosshair" aria-hidden="true" />
      <div className="stage-readout">
        <p>{panel.title}</p>
        <ul>
          {panel.readout.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function AudienceGate({
  onSelect,
}: {
  onSelect: (mode: SiteMode) => void
}) {
  return (
    <section className="audience-gate" aria-labelledby="gate-title">
      <div className="gate-copy">
        <p>udbhavram.com</p>
        <h1 id="gate-title">Choose the version that matches why you’re here.</h1>
      </div>
      <div className="gate-options">
        {modeKeys.map((key) => {
          const mode = modes[key]
          return (
            <button
              className={`gate-option gate-${key}`}
              key={key}
              type="button"
              onClick={() => onSelect(key)}
            >
              <span>{mode.label}</span>
              <strong>{mode.chooserTitle}</strong>
              <em>{mode.chooserText}</em>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function App() {
  const [mode, setMode] = useState<SiteMode>(() => {
    const urlMode = getUrlMode()
    if (urlMode) return urlMode
    const saved = window.localStorage.getItem(storageKey)
    return modeKeys.includes(saved as SiteMode) ? (saved as SiteMode) : 'general'
  })
  const [hasChosenMode, setHasChosenMode] = useState(() => {
    if (getUrlMode()) return true
    return modeKeys.includes(window.localStorage.getItem(storageKey) as SiteMode)
  })
  const [activeStage, setActiveStage] = useState<StageKey>(modes[mode].defaultStage)
  const [progress, setProgress] = useState(0)
  const stageKeys = useMemo(() => Object.keys(stagePanels) as StageKey[], [])
  const config = modes[mode]

  const chooseMode = (nextMode: SiteMode) => {
    setMode(nextMode)
    setActiveStage(modes[nextMode].defaultStage)
    setHasChosenMode(true)
    window.localStorage.setItem(storageKey, nextMode)
    window.history.replaceState(null, '', `?mode=${nextMode}`)
  }

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStage((current) => {
        const index = stageKeys.indexOf(current)
        return stageKeys[(index + 1) % stageKeys.length]
      })
    }, 5400)

    return () => window.clearInterval(interval)
  }, [stageKeys])

  if (!hasChosenMode) {
    return (
      <div className="site-shell theme-gate">
        <AudienceGate onSelect={chooseMode} />
      </div>
    )
  }

  return (
    <div className={`site-shell theme-${mode}`}>
      <div className="scroll-rail" aria-hidden="true">
        <b style={{ height: `${Math.max(progress * 100, 4)}%` }} />
      </div>

      <header className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Udbhav Ram home">
          U/R
        </a>
        <nav>
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="mode-switcher" aria-label="Site version switcher">
          {modeKeys.map((key) => (
            <button
              className={mode === key ? 'active' : ''}
              key={key}
              type="button"
              aria-pressed={mode === key}
              onClick={() => chooseMode(key)}
            >
              {modes[key].label}
            </button>
          ))}
        </div>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="signal-line">{config.signal}</p>
            <h1 id="hero-title">Udbhav Ram</h1>
            <p className="lede">{config.lede}</p>
            <div className="hero-actions">
              <a className="button primary" href={config.primary[1]}>
                {config.primary[0]} <ArrowIcon />
              </a>
              <a className="button secondary" href="mailto:hello@udbhavram.com">
                Get in touch <ArrowIcon />
              </a>
            </div>
          </div>

          <div className="stage-shell">
            <StageCanvas active={activeStage} />
            <div className="stage-tabs" role="tablist" aria-label="Hero media modes">
              {stageKeys.map((key) => (
                <button
                  className={activeStage === key ? 'active' : ''}
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeStage === key}
                  onClick={() => setActiveStage(key)}
                >
                  {stagePanels[key].label}
                </button>
              ))}
            </div>
            <p className="stage-detail">{stagePanels[activeStage].detail}</p>
          </div>
        </section>

        <section className="work-strip" id="work" aria-label="Current work">
          {config.work.map(([number, text]) => (
            <article key={number}>
              <p>{number}</p>
              <h2>{text}</h2>
            </article>
          ))}
        </section>

        <section className="section research-section" id="research" aria-labelledby="research-title">
          <div className="section-index">research</div>
          <div>
            <h2 id="research-title">{config.researchTitle}</h2>
            <div className="research-list">
              {config.research.map((item) => (
                <article key={item.title}>
                  <p>{item.year}</p>
                  <h3>{item.title}</h3>
                  <a href="https://sites.google.com/view/udbhav-ram/research" target="_blank" rel="noreferrer">
                    {item.venue} <ArrowIcon />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section project-section" id="projects" aria-labelledby="projects-title">
          <div className="section-index">projects</div>
          <div>
            <h2 id="projects-title">{config.projectsTitle}</h2>
            <div className="project-list">
              {config.projects.map(([title, body], index) => (
                <article key={title}>
                  <p>{String(index + 1).padStart(2, '0')}</p>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section command-section" aria-labelledby="command-title">
          <div className="section-index">launcher</div>
          <div className="command-panel">
            <h2 id="command-title">Quick launch</h2>
            <div className="command-list">
              {config.launcher.map(([label, url]) => (
                <a href={url} key={label} target={url.startsWith('mailto:') ? undefined : '_blank'} rel={url.startsWith('mailto:') ? undefined : 'noreferrer'}>
                  <span>{label}</span>
                  <ArrowIcon />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div>
            <h2 id="contact-title">{config.contactTitle}</h2>
            <p>{config.contactText}</p>
          </div>
          <div className="contact-links">
            <a href="mailto:hello@udbhavram.com">hello@udbhavram.com</a>
            <a href="https://x.com/UdbhavRam" target="_blank" rel="noreferrer">
              x.com/UdbhavRam
            </a>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 Udbhav Ram</span>
        <span>{config.footer}</span>
      </footer>
    </div>
  )
}

export default App
