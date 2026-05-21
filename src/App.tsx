import './App.css'

const research = [
  {
    title: 'LLM agents in clinical workflows',
    meta: 'UAB Radiation Oncology',
    body: 'Exploring locally deployable AI systems that fit into clinical review, naming, QA, and documentation workflows.',
  },
  {
    title: 'Ethos 2.0 high-fidelity planning for multi-met SRS',
    meta: 'JACMP publication',
    body: 'Semi-automated validation work for single-isocentre stereotactic radiotherapy planning and adaptive treatment workflows.',
  },
  {
    title: 'Deep learning auto-segmentation',
    meta: 'International Journal of Radiation Oncology Biology Physics, 2025',
    body: 'Assessment of state-of-the-art abdominal organ segmentation models across CT and MRI imaging workflows.',
  },
]

const projects = [
  {
    title: 'Clinical AI QA tools',
    body: 'Software for validating clinical AI outputs, comparing automated contours, and making model behavior easier to review.',
    tags: ['Python', 'DICOM', 'QA'],
  },
  {
    title: 'Radiotherapy workflow utilities',
    body: 'Small tools for structure naming, plan review, dose workflow checks, and research automation.',
    tags: ['Flask', 'LLMs', 'TPS'],
  },
  {
    title: 'Performance simulation',
    body: 'Race strategy and lap-time simulation work connecting deterministic modeling, telemetry, and decision support.',
    tags: ['Simulation', 'Telemetry', 'Strategy'],
  },
]

const talks = [
  'Blue Ribbon Poster, AAPM 2025',
  'Invited Speaker, COMP Annual Scientific Meeting 2024',
  'Best Talk, Canadian Undergraduate Physics Conference 2023',
  'Poster Presentation, AAPM 2024',
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h10.5M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  )
}

function App() {
  return (
    <div className="site-shell">
      <header className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Udbhav Ram home">
          Udbhav Ram
        </a>
        <nav>
          <a href="#research">Research</a>
          <a href="#projects">Projects</a>
          <a href="#writing">Writing</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Udbhav Ram</h1>
            <p className="lede">
              Building clinical AI and physics-driven tools for radiology,
              radiation oncology, and high-performance technical workflows.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#research">
                View research <ArrowIcon />
              </a>
              <a className="button secondary" href="mailto:hello@udbhavram.com">
                Get in touch <ArrowIcon />
              </a>
            </div>
            <ul className="domain-list" aria-label="Focus areas">
              <li>
                <span>AI</span>
                Clinical translation
              </li>
              <li>
                <span>MP</span>
                Medical physics
              </li>
              <li>
                <span>RO</span>
                Radiation oncology
              </li>
              <li>
                <span>PE</span>
                Performance engineering
              </li>
            </ul>
          </div>
          <div className="hero-media">
            <img
              src="/assets/hero-collage.png"
              alt="Synthetic medical imaging, radiotherapy dose, code, and race engineering collage"
            />
          </div>
        </section>

        <section className="section current-work" aria-labelledby="current-title">
          <div>
            <h2 id="current-title">Current work</h2>
          </div>
          <p>
            I work at the intersection of clinical needs and technical depth:
            validating AI tools, building clinical workflow software, and
            translating research ideas into systems that can survive real review
            by physicians, physicists, and operators.
          </p>
        </section>

        <section className="section split-section" id="research" aria-labelledby="research-title">
          <div className="section-heading">
            <h2 id="research-title">Selected research</h2>
            <a href="https://sites.google.com/view/udbhav-ram/research" target="_blank" rel="noreferrer">
              Older research archive <ArrowIcon />
            </a>
          </div>
          <div className="research-grid">
            {research.map((item) => (
              <article className="card" key={item.title}>
                <p className="card-meta">{item.meta}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <h2 id="projects-title">Software & projects</h2>
            <a href="https://sites.google.com/view/udbhav-ram/projects" target="_blank" rel="noreferrer">
              Project archive <ArrowIcon />
            </a>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <h3>{project.title}</h3>
                <p>{project.body}</p>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section experience-section" id="writing" aria-labelledby="experience-title">
          <div>
            <h2 id="experience-title">Talks, awards & field notes</h2>
            <p>
              Conference work across medical physics, radiation oncology AI,
              clinical software, and a parallel thread in motorsports simulation.
            </p>
          </div>
          <div className="timeline">
            {talks.map((talk) => (
              <p key={talk}>{talk}</p>
            ))}
          </div>
        </section>

        <section className="section source-section" aria-labelledby="source-title">
          <h2 id="source-title">From the older site</h2>
          <div className="source-grid">
            <p>
              Undergraduate Ambassador for UAB/McMaster relations and
              International Visiting Scholar at the University of Alabama at
              Birmingham.
            </p>
            <p>
              Research areas include LLM agent integration in clinical
              workflows, Ethos treatment planning validation, interobserver
              variability, and SBRT commissioning studies.
            </p>
            <p>
              Motorsports experience includes strategy simulation, telemetry,
              vehicle controls, and performance engineering.
            </p>
          </div>
        </section>

        <section className="connect-section" id="contact" aria-labelledby="contact-title">
          <div>
            <h2 id="contact-title">Let’s connect</h2>
            <p>
              I’m open to research collaborations, clinical AI projects,
              medical physics software, and useful technical work.
            </p>
          </div>
          <div className="contact-links">
            <a href="mailto:hello@udbhavram.com">Email</a>
            <a href="https://x.com/UdbhavRam" target="_blank" rel="noreferrer">
              X
            </a>
            <a href="https://sites.google.com/view/udbhav-ram" target="_blank" rel="noreferrer">
              Legacy site
            </a>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 Udbhav Ram</span>
        <a href="https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor" target="_blank" rel="noreferrer">
          UAB profile
        </a>
      </footer>
    </div>
  )
}

export default App
