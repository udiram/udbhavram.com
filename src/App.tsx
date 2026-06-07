import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import './App.css'

type SectionId = 'home' | 'education' | 'research' | 'software' | 'performance' | 'proof' | 'contact'

type ImageAsset = {
  src: string
  alt: string
  source?: string
}

type LinkItem = {
  label: string
  href: string
  meta?: string
  image?: ImageAsset
}

type ResearchItem = {
  title: string
  status: string
  venue: string
  summary: string
  methods: string[]
  href?: string
  image: ImageAsset
}

type SoftwareItem = {
  title: string
  purpose: string
  stack: string
  role: string
  category: 'Clinical AI' | 'Open source' | 'Web systems' | 'Research tools'
  href?: string
}

type ProofItem = LinkItem & {
  sourceName: string
}

const imageAssets = {
  uabMentor: {
    src: '/assets/sourced/uab-agarwal-udi.jpg',
    alt: 'Udbhav Ram with Pritish Agarwal in the UAB medicine profile',
    source: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  uabPresentation: {
    src: '/assets/sourced/uab-udi-presentation.jpg',
    alt: 'Udbhav Ram presenting clinical AI work at UAB',
    source: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  uabClinic: {
    src: '/assets/sourced/uab-ai-mentor.jpg',
    alt: 'UAB clinical AI profile image',
    source: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  mcmasterScholar: {
    src: '/assets/sourced/mcmaster-uab-scholar-original.jpg',
    alt: 'Udbhav Ram in the McMaster international visiting scholar profile',
    source: 'https://science.mcmaster.ca/international-visiting-scholar-at-the-university-of-alabama-at-birmingham-the-latest-of-many-achievements-for-mcmaster-science-undergrad/',
  },
  coopAward: {
    src: '/assets/sourced/mcmaster-coop-award-original.png',
    alt: 'Udbhav Ram receiving the McMaster Science Co-op Student of the Year award',
    source: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
  },
  convocation: {
    src: '/assets/sourced/mcmaster-convocation.jpg',
    alt: 'Udbhav Ram in the McMaster Science convocation countdown profile',
    source: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
  },
  employerAward: {
    src: '/assets/sourced/uab-employer-award-1.jpg',
    alt: 'Carlos Cardenas receiving the McMaster Co-op Emerging Employer of the Year Award',
    source: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award',
  },
  employerAwards: {
    src: '/assets/sourced/mcmaster-employer-awards-hero.jpg',
    alt: 'McMaster Science employer of the year award photo',
    source: 'https://careers.science.mcmaster.ca/recognizing-excellence-in-science-2024-co-op-employer-of-the-year-awards/',
  },
  aapm2025: {
    src: '/assets/sourced/screens/aapm-2025-tg263-page.png',
    alt: 'AAPM 2025 source page for the TG-263 Blue Ribbon Poster',
    source: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
  },
  aapm2024Ethos: {
    src: '/assets/sourced/screens/aapm-2024-ethos-page.png',
    alt: 'AAPM 2024 source page for Ethos high-fidelity SRS work',
    source: 'https://aapm.confex.com/aapm/2024am/meetingapp.cgi/Paper/10372',
  },
  aapm2024Automl: {
    src: '/assets/sourced/screens/aapm-2024-automl-page.png',
    alt: 'AAPM 2024 source page for AutoML segmentation work',
    source: 'https://aapm.confex.com/aapm/2024am/meetingapp.cgi/Paper/12166',
  },
  monaiPr: {
    src: '/assets/sourced/screens/monai-pr-page.png',
    alt: 'MONAI tutorials pull request source page',
    source: 'https://github.com/Project-MONAI/tutorials/pull/1129',
  },
  openhandsPr: {
    src: '/assets/sourced/screens/openhands-pr-page.png',
    alt: 'OpenHands pull request source page',
    source: 'https://github.com/All-Hands-AI/OpenHands/pull/731',
  },
  prostheticSite: {
    src: '/assets/sourced/screens/prosthetic-site-page.png',
    alt: 'Automated prosthetic limb prototype Google Site screenshot',
    source: 'https://sites.google.com/view/prostheticlimbprototype/home',
  },
  synthMed: {
    src: '/assets/sourced/screens/synth-med-page.png',
    alt: 'Synth-Med Biotechnology about page screenshot',
    source: 'https://synth-med.com/about/',
  },
  mcmasterPhysics: {
    src: '/assets/sourced/screens/mcmaster-physics-page.png',
    alt: 'McMaster Physics and Astronomy official page screenshot',
    source: 'https://physics.mcmaster.ca/',
  },
  uabRadonc: {
    src: '/assets/sourced/screens/uab-radonc-page.png',
    alt: 'UAB Radiation Oncology official page screenshot',
    source: 'https://www.uab.edu/medicine/radonc/',
  },
  arrowMcLaren: {
    src: '/assets/sourced/screens/arrow-mclaren-page.png',
    alt: 'Arrow McLaren IndyCar official page screenshot',
    source: 'https://www.mclaren.com/racing/indycar/',
  },
} satisfies Record<string, ImageAsset>

const navItems: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'education', label: 'Education' },
  { id: 'research', label: 'Research' },
  { id: 'software', label: 'Software' },
  { id: 'performance', label: 'Performance' },
  { id: 'proof', label: 'Proof' },
  { id: 'contact', label: 'Contact' },
]

const resumeHref = '/assets/Udbhav_Ram_resume.pdf'

const researchItems: ResearchItem[] = [
  {
    title: 'Improving TG-263 target name compliance using locally hosted large language models',
    status: 'Blue Ribbon Poster',
    venue: 'AAPM 2025',
    summary:
      'Local LLM review flows for target-name compliance, clinical interface automation, and reviewer-controlled workflow checks.',
    methods: ['Local LLM review', 'TG-263 standardization', 'Clinical workflow UI'],
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
    image: imageAssets.aapm2025,
  },
  {
    title: 'Ethos 2.0 high-fidelity SRS validation',
    status: 'Published',
    venue: 'JACMP 2025',
    summary:
      'Validation of high-fidelity Ethos planning for multi-met single-isocentre SRS with semi-automated plan comparison.',
    methods: ['Treatment planning', 'Automation', 'SRS validation'],
    href: 'https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/acm2.70370',
    image: imageAssets.aapm2024Ethos,
  },
  {
    title: 'Assessing deep learning frameworks for CT abdominal organ auto-segmentation',
    status: 'Peer-reviewed',
    venue: 'Intelligent Oncology 2025',
    summary:
      'Quantitative and expert review of abdominal organ segmentation frameworks for clinically relevant model comparison.',
    methods: ['Auto-segmentation', 'Expert review', 'Model evaluation'],
    href: 'https://doi.org/10.1016/j.intonc.2025.03.003',
    image: imageAssets.aapm2024Automl,
  },
  {
    title: 'Online adaptive APBI interobserver variability',
    status: 'Submitted',
    venue: 'UAB Radiation Oncology',
    summary:
      'Analysis of contour variability in adaptive partial breast workflows and its impact on treatment planning reliability.',
    methods: ['Adaptive RT', 'CBCT contouring', 'Workflow reliability'],
    image: imageAssets.uabRadonc,
  },
]

const softwareItems: SoftwareItem[] = [
  {
    title: 'MONAI tutorials contribution',
    purpose: 'Medical imaging deep learning examples and documentation',
    stack: 'Python, MONAI, PyTorch',
    role: 'Contributor',
    category: 'Open source',
    href: 'https://github.com/Project-MONAI/tutorials/pull/1129',
  },
  {
    title: 'OpenHands engineering contribution',
    purpose: 'Agent framework improvements for software tasks',
    stack: 'Python, FastAPI, React',
    role: 'Contributor',
    category: 'Open source',
    href: 'https://github.com/All-Hands-AI/OpenHands/pull/731',
  },
  {
    title: 'TG-263 local LLM tool',
    purpose: 'Local naming-compliance interface with visible reviewer control',
    stack: 'Local LLM, clinical UI, radiation oncology',
    role: 'Developer',
    category: 'Clinical AI',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
  },
  {
    title: 'Clinical UI automation benchmark',
    purpose: 'Objective tests for VLM agents around clinical interfaces',
    stack: 'Python, Playwright, VLM evaluation',
    role: 'Researcher',
    category: 'Research tools',
  },
  {
    title: 'AAPM conference explorer',
    purpose: 'Search and schedule workflow for dense conference content',
    stack: 'Flask, SQLAlchemy, Railway',
    role: 'Developer',
    category: 'Web systems',
  },
  {
    title: 'Automated prosthetic limb prototype',
    purpose: 'Mechatronic control and embedded systems project',
    stack: 'C++, Python, ROS',
    role: 'Lead developer',
    category: 'Research tools',
    href: 'https://sites.google.com/view/prostheticlimbprototype/home',
  },
  {
    title: 'Synth-Med Biotechnology',
    purpose: 'Company site and technical content system',
    stack: 'Next.js, TypeScript',
    role: 'Founder',
    category: 'Web systems',
    href: 'https://synth-med.com/about/',
  },
]

const proofItems: ProofItem[] = [
  {
    label: 'McMaster student and UAB mentor drive changes in medicine through AI',
    sourceName: 'UAB Medicine',
    meta: 'AI and radiation oncology profile',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
    image: imageAssets.uabMentor,
  },
  {
    label: 'McMaster-UAB international visiting scholar',
    sourceName: 'McMaster Science',
    meta: 'International visiting scholar profile',
    href: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/',
    image: imageAssets.mcmasterScholar,
  },
  {
    label: "Udbhav Ram's co-op supervisors flew in from Alabama to give him an award",
    sourceName: 'McMaster Daily News',
    meta: 'Science Co-op Student of the Year',
    href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
    image: imageAssets.coopAward,
  },
  {
    label: 'Carlos Cardenas receives McMaster Co-op Emerging Employer of the Year Award',
    sourceName: 'UAB',
    meta: 'Employer award coverage',
    href: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award',
    image: imageAssets.employerAward,
  },
  {
    label: 'Convocation countdown with Udbhav Ram',
    sourceName: 'McMaster Science',
    meta: 'Academic path and next steps',
    href: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
    image: imageAssets.convocation,
  },
  {
    label: 'Recognizing Excellence in Science 2024 Co-op Employer of the Year Awards',
    sourceName: 'McMaster Science',
    meta: 'Co-op award ecosystem',
    href: 'https://careers.science.mcmaster.ca/recognizing-excellence-in-science-2024-co-op-employer-of-the-year-awards/',
    image: imageAssets.employerAwards,
  },
  {
    label: 'GitHub profile',
    sourceName: 'GitHub',
    meta: 'Open-source work',
    href: 'https://github.com/udiram',
  },
  {
    label: 'Google Scholar search',
    sourceName: 'Google Scholar',
    meta: 'Research publications',
    href: 'https://scholar.google.com/scholar?q=%22Udbhav+Ram%22',
  },
  {
    label: 'LinkedIn',
    sourceName: 'LinkedIn',
    meta: 'Professional profile',
    href: 'https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine',
  },
  {
    label: 'Medium',
    sourceName: 'Medium',
    meta: 'Writing archive',
    href: 'https://medium.com/@udbhavram41',
  },
]

const profileFacts = [
  ['PhD', 'Medical Physics, University of Wisconsin-Madison'],
  ['Lab', "Ran Zhang's lab"],
  ['Undergrad', 'McMaster Medical & Biological Physics'],
  ['Open source', 'MONAI and OpenHands'],
]

const educationItems = [
  {
    degree: 'PhD in Medical Physics',
    institution: 'University of Wisconsin-Madison',
    detail: "Started doctoral work in Ran Zhang's lab, focused on medical physics, imaging, and clinical AI systems.",
  },
  {
    degree: 'BSc Honours Medical & Biological Physics',
    institution: 'McMaster University',
    detail: 'Built the foundation across medical physics, biophysics, computation, and radiation oncology research.',
  },
  {
    degree: 'International visiting scholar',
    institution: 'UAB Radiation Oncology',
    detail: 'Worked on clinical AI, adaptive radiotherapy, treatment planning, and workflow automation with UAB collaborators.',
  },
]

function Icon({ name }: { name: 'arrow' | 'download' | 'mail' | 'search' }) {
  const paths: Record<string, ReactNode> = {
    arrow: <path d="M5 10h10M11 6l4 4-4 4" />,
    download: (
      <>
        <path d="M10 4v8" />
        <path d="m6.5 9 3.5 3.5L13.5 9" />
        <path d="M5 16h10" />
      </>
    ),
    mail: (
      <>
        <path d="M4 6h12v8H4z" />
        <path d="m4.5 6.5 5.5 4 5.5-4" />
      </>
    ),
    search: (
      <>
        <circle cx="8.5" cy="8.5" r="4" />
        <path d="m11.5 11.5 4 4" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const opensNewTab = href.startsWith('http')

  return (
    <a className={className} href={href} target={opensNewTab ? '_blank' : undefined} rel={opensNewTab ? 'noreferrer' : undefined}>
      {children}
    </a>
  )
}

function ImageFrame({ image, className = '' }: { image: ImageAsset; className?: string }) {
  return (
    <figure className={`image-frame ${className}`.trim()}>
      <img src={image.src} alt={image.alt} loading={className.includes('hero-image') ? 'eager' : 'lazy'} />
    </figure>
  )
}

function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action}
    </div>
  )
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#home">
        Udbhav Ram
      </a>
      <nav aria-label="Main navigation">
        {navItems.map((item) => (
          <a href={`#${item.id}`} key={item.id}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero section" id="home">
      <div className="hero-copy">
        <h1>Udbhav Ram</h1>
        <p className="role-line">Medical Physics PhD · Clinical AI · Radiation Oncology · Software</p>
        <p className="hero-summary">
          I am a Medical Physics PhD student at the University of Wisconsin-Madison in Ran Zhang's lab, building clinical AI systems and software where precision, workflow, and human judgment matter.
        </p>
        <div className="hero-actions">
          <a className="button primary" href={resumeHref} download>
            Download CV <Icon name="download" />
          </a>
          <a className="button secondary" href="#contact">
            Contact <Icon name="mail" />
          </a>
        </div>
      </div>
      <ImageFrame image={imageAssets.mcmasterScholar} className="hero-image" />
      <dl className="fact-strip">
        {profileFacts.map(([term, description]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Education() {
  return (
    <section className="education-section section" id="education">
      <SectionHeading title="Education" />
      <div className="education-layout">
        <article className="education-primary">
          <span>Current</span>
          <h3>PhD student in Medical Physics at the University of Wisconsin-Madison.</h3>
          <p>
            I recently started doctoral work in Ran Zhang's lab, continuing my path across medical physics, imaging, clinical AI, and translational software systems.
          </p>
        </article>
        <div className="education-list" aria-label="Education and training">
          {educationItems.map((item) => (
            <article key={`${item.degree}-${item.institution}`}>
              <span>{item.institution}</span>
              <strong>{item.degree}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Research() {
  const [selectedTitle, setSelectedTitle] = useState(researchItems[0].title)
  const selected = researchItems.find((item) => item.title === selectedTitle) ?? researchItems[0]

  return (
    <section className="section" id="research">
      <SectionHeading
        title="Featured Research"
        action={
          <ExternalLink href="https://scholar.google.com/scholar?q=%22Udbhav+Ram%22" className="text-link">
            View research <Icon name="arrow" />
          </ExternalLink>
        }
      />
      <div className="research-layout">
        <div className="research-list" aria-label="Research projects">
          {researchItems.map((item) => (
            <button className={item.title === selected.title ? 'active' : ''} key={item.title} onClick={() => setSelectedTitle(item.title)} type="button">
              <span>{item.venue}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>
        <article className="research-detail">
          <ImageFrame image={selected.image} />
          <div>
            <p className="item-meta">
              {selected.venue} · {selected.status}
            </p>
            <h3>{selected.title}</h3>
            <p>{selected.summary}</p>
            <ul>
              {selected.methods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ul>
            {selected.href ? (
              <ExternalLink href={selected.href} className="text-link">
                Open source <Icon name="arrow" />
              </ExternalLink>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  )
}

function Software() {
  const categories = ['All', 'Clinical AI', 'Open source', 'Web systems', 'Research tools'] as const
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const visibleItems = category === 'All' ? softwareItems : softwareItems.filter((item) => item.category === category)

  return (
    <section className="section" id="software">
      <SectionHeading title="Selected Software Projects" />
      <div className="filter-row" aria-label="Software filters">
        {categories.map((item) => (
          <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)} type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="project-table">
        <div className="project-row project-head">
          <span>Project</span>
          <span>Purpose</span>
          <span>Stack</span>
          <span>Role</span>
          <span>Link</span>
        </div>
        {visibleItems.map((item) => (
          <div className="project-row" key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.purpose}</span>
            <span>{item.stack}</span>
            <span>{item.role}</span>
            <span>
              {item.href ? (
                <ExternalLink href={item.href} className="table-link">
                  Open <Icon name="arrow" />
                </ExternalLink>
              ) : (
                'Request access'
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Performance() {
  return (
    <section className="section" id="performance">
      <SectionHeading
        title="Performance Engineering"
        action={
          <ExternalLink href="https://www.mclaren.com/racing/indycar/" className="text-link">
            View performance work <Icon name="arrow" />
          </ExternalLink>
        }
      />
      <div className="performance-feature">
        <ImageFrame image={imageAssets.arrowMcLaren} />
        <div>
          <h3>Race strategy, telemetry, and simulation as a systems lens.</h3>
          <p>
            Motorsport work sharpened the same operating discipline that clinical AI needs: fast feedback, traceable assumptions, robust interfaces, and decisions made under uncertainty.
          </p>
          <ul>
            <li>Deterministic race-session simulation and review tools</li>
            <li>Telemetry analysis and performance context for race weekends</li>
            <li>Formula SAE electric vehicle software and dashboards</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function Proof() {
  const [query, setQuery] = useState('')
  const filteredProof = useMemo(() => {
    const target = query.trim().toLowerCase()
    if (!target) return proofItems
    return proofItems.filter((item) => `${item.label} ${item.meta ?? ''} ${item.sourceName}`.toLowerCase().includes(target))
  }, [query])

  return (
    <section className="section" id="proof">
      <SectionHeading title="Proof & Press" />
      <label className="search-box">
        <Icon name="search" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search publications, news, awards, and profiles" />
      </label>
      <div className="proof-grid" aria-live="polite">
        {filteredProof.length ? (
          filteredProof.map((item) => (
            <ExternalLink href={item.href} className="proof-card" key={item.href}>
              {item.image ? <ImageFrame image={item.image} /> : <div className="proof-placeholder">{item.sourceName.slice(0, 2)}</div>}
              <span>{item.sourceName}</span>
              <strong>{item.label}</strong>
              <em>{item.meta}</em>
            </ExternalLink>
          ))
        ) : (
          <p className="empty-state">No proof links match that search.</p>
        )}
      </div>
    </section>
  )
}

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'site visitor'}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`)
    window.location.href = `mailto:ramu@mcmaster.ca?subject=${subject}&body=${body}`
  }

  return (
    <section className="contact-section section" id="contact">
      <div>
        <h2>Let’s Work Together</h2>
        <p>Reach out for research collaboration, clinical AI tooling, software projects, conference speaking, or performance-engineering crossover work.</p>
        <div className="contact-links">
          <a href="mailto:ramu@mcmaster.ca">ramu@mcmaster.ca</a>
          <ExternalLink href="https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine">LinkedIn</ExternalLink>
          <ExternalLink href="https://github.com/udiram">GitHub</ExternalLink>
        </div>
      </div>
      <form onSubmit={submit}>
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="message-field">
          Message
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} required rows={5} />
        </label>
        <button className="button primary" type="submit">
          Send Message <Icon name="mail" />
        </button>
      </form>
    </section>
  )
}

function App() {
  return (
    <div className="portfolio-site">
      <Header />
      <main>
        <Hero />
        <Education />
        <Research />
        <Software />
        <Performance />
        <Proof />
        <Contact />
      </main>
      <footer className="site-footer">
        <span>© 2026 Udbhav Ram</span>
        <a href={resumeHref} download>
          Download CV
        </a>
      </footer>
    </div>
  )
}

export default App
