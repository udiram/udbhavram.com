import { useEffect, useMemo, useState } from 'react'
import './App.css'

type StageKey = 'imaging' | 'dose' | 'code' | 'racing'

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

const research = [
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
]

const projects = [
  ['Clinical AI QA', 'Contour review, source-grounded extraction, and validation loops for medical imaging workflows.'],
  ['Radiotherapy Utilities', 'Structure naming, plan checks, and small workflow tools that remove repetitive clinical friction.'],
  ['Strategy Simulation', 'Telemetry and race-strategy modeling as a parallel track in performance systems.'],
  ['Personal Research OS', 'A cleaner public home for writing, projects, papers, talks, and collaborations.'],
]

const commandLinks = [
  ['Research archive', 'https://sites.google.com/view/udbhav-ram/research'],
  ['Project archive', 'https://sites.google.com/view/udbhav-ram/projects'],
  ['UAB profile', 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor'],
  ['X profile', 'https://x.com/UdbhavRam'],
]

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

function App() {
  const [activeStage, setActiveStage] = useState<StageKey>('imaging')
  const [progress, setProgress] = useState(0)
  const stageKeys = useMemo(() => Object.keys(stagePanels) as StageKey[], [])

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

  return (
    <div className="site-shell">
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
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="signal-line">clinical ai / physics / radiology software / performance systems</p>
            <h1 id="hero-title">Udbhav Ram</h1>
            <p className="lede">
              I build clinical AI and physics-driven tools for radiology,
              radiation oncology, and technical workflows that need to hold up
              under real review.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#research">
                View research <ArrowIcon />
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
          {[
            ['01', 'AI systems that stay inspectable after the first impressive demo.'],
            ['02', 'Radiotherapy tooling shaped by naming, QA, review, and handoff friction.'],
            ['03', 'Research translation with enough engineering taste to become usable software.'],
          ].map(([number, text]) => (
            <article key={number}>
              <p>{number}</p>
              <h2>{text}</h2>
            </article>
          ))}
        </section>

        <section className="section research-section" id="research" aria-labelledby="research-title">
          <div className="section-index">research</div>
          <div>
            <h2 id="research-title">Selected research</h2>
            <div className="research-list">
              {research.map((item) => (
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
            <h2 id="projects-title">Software & projects</h2>
            <div className="project-list">
              {projects.map(([title, body], index) => (
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
              {commandLinks.map(([label, url]) => (
                <a href={url} key={label} target="_blank" rel="noreferrer">
                  <span>{label}</span>
                  <ArrowIcon />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div>
            <h2 id="contact-title">Let’s build useful tools.</h2>
            <p>
              Research collaborations, clinical AI projects, medical physics
              software, and technical systems with real operators in mind.
            </p>
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
        <span>clinical AI / medical physics / software</span>
      </footer>
    </div>
  )
}

export default App
