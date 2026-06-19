import { useLayoutEffect, useState, type FormEvent, type ReactNode } from 'react'
import './App.css'

type SectionId = 'home' | 'profile' | 'research' | 'projects' | 'proof' | 'contact'

type ImageAsset = {
  src: string
  alt: string
  source?: string
}

type LinkItem = {
  label: string
  href: string
}

type IconName = 'arrow' | 'download' | 'mail' | 'github' | 'scholar' | 'linkedin' | 'medium'

const resumeHref = '/assets/Udbhav_Ram_resume.pdf'

const imageAssets = {
  hero: {
    src: '/assets/sourced/mcmaster-uab-scholar-original.jpg',
    alt: 'Udbhav Ram in the McMaster international visiting scholar profile',
    source: 'https://science.mcmaster.ca/international-visiting-scholar-at-the-university-of-alabama-at-birmingham-the-latest-of-many-achievements-for-mcmaster-science-undergrad/',
  },
  mentor: {
    src: '/assets/sourced/uab-agarwal-udi.jpg',
    alt: 'Udbhav Ram with Pritish Agarwal in the UAB medicine profile',
    source: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
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
  uwMedicalPhysics: {
    src: '/assets/sourced/uw-medical-physics-graduates.jpg',
    alt: 'UW-Madison Department of Medical Physics graduates',
    source: 'https://medphysics.wisc.edu/',
  },
  uwMadisonLogo: {
    src: '/assets/sourced/uw-madison-logo.png',
    alt: 'University of Wisconsin-Madison official crest logo',
    source: 'https://brand.wisc.edu/resource/uw-institutional-logos-for-web-digital-use/',
  },
  mcmasterLogo: {
    src: '/assets/sourced/mcmaster-science.png',
    alt: 'McMaster University Brighter World logo',
    source: 'https://brand.mcmaster.ca/guidelines_introduction/logos-and-marks/logos-and-marks-cont-mcmaster-logo-minimal-size/',
  },
  uabRadonc: {
    src: '/assets/sourced/uab-radonc-treatment-hero.png',
    alt: 'UAB Radiation Oncology treatment planning visual',
    source: 'https://www.uab.edu/medicine/radonc/',
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
  aapm2024Auto: {
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
  synthMed: {
    src: '/assets/sourced/screens/synth-med-page.png',
    alt: 'Synth-Med Biotechnology about page screenshot',
    source: 'https://synth-med.com/about/',
  },
  arrowMcLaren: {
    src: '/assets/sourced/arrow-mclaren-race.png',
    alt: 'Arrow McLaren IndyCar on track from the original portfolio motorsports page',
    source: 'https://sites.google.com/view/udbhav-ram/motorsports',
  },
  prostheticSite: {
    src: '/assets/sourced/screens/prosthetic-site-page.png',
    alt: 'Automated prosthetic limb prototype Google Site screenshot',
    source: 'https://sites.google.com/view/prostheticlimbprototype/home',
  },
} satisfies Record<string, ImageAsset>

const navItems: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'profile', label: 'Profile' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'proof', label: 'Proof' },
  { id: 'contact', label: 'Contact' },
]

const socialItems: (LinkItem & { icon: IconName })[] = [
  { label: 'Email', href: 'mailto:ramu@mcmaster.ca', icon: 'mail' },
  { label: 'LinkedIn', href: 'https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/udiram', icon: 'github' },
  { label: 'Google Scholar', href: 'https://scholar.google.com/scholar?q=%22Udbhav+Ram%22', icon: 'scholar' },
  { label: 'Medium', href: 'https://medium.com/@udbhavram41', icon: 'medium' },
]

const focusAreas = [
  {
    title: 'Clinical AI systems',
    text: 'Builds local, reviewer-controlled AI tools for radiation oncology workflows where traceability matters.',
  },
  {
    title: 'Medical physics research',
    text: 'Works across adaptive radiotherapy, treatment-planning validation, auto-segmentation, and clinical QA.',
  },
  {
    title: 'Software that ships',
    text: 'Moves between Python, React, automation, open source, and deployed research tooling rather than only analysis notebooks.',
  },
  {
    title: 'High-pressure systems',
    text: 'Applies the same feedback-loop discipline from race strategy and telemetry to clinical and research software.',
  },
]

const educationRows = [
  {
    logo: imageAssets.uwMadisonLogo,
    title: 'PhD in Medical Physics',
    place: 'University of Wisconsin-Madison',
    detail: "Started doctoral work in Ran Zhang's lab across medical physics, imaging, clinical AI, and translational software.",
    meta: '2026-Present · Madison, WI',
  },
  {
    logo: imageAssets.mcmasterLogo,
    title: 'BSc Honours Medical & Biological Physics',
    place: 'McMaster University',
    detail: 'Foundation in medical physics, biophysics, computation, radiotherapy, and co-op research.',
    meta: 'Completed 2025 · Hamilton, ON',
  },
  {
    logo: imageAssets.uabRadonc,
    title: 'International visiting scholar',
    place: 'UAB Radiation Oncology',
    detail: 'Clinical AI, adaptive radiotherapy, treatment planning, and workflow automation with UAB collaborators.',
    meta: 'Jan-Aug 2024 · Birmingham, AL',
  },
]

const experienceRows = [
  {
    time: '2026-Present',
    role: 'Medical Physics PhD student',
    org: 'University of Wisconsin-Madison',
    text: 'Doctoral work in medical physics, imaging, clinical AI, and translational software systems.',
  },
  {
    time: '2021-Present',
    role: 'Research collaborator / visiting scholar',
    org: 'UAB Radiation Oncology',
    text: 'AI tools for radiation treatment and planning, including target naming, auto-segmentation, adaptive workflows, and treatment-planning validation.',
  },
  {
    time: 'Undergraduate research',
    role: 'Researcher',
    org: 'Hamilton Health Sciences, Lawson Health Research Institute, McMaster Physics',
    text: 'Radiotherapy, optical brain measurement ML, augmented-reality surgical model support, and smartphone-based biophysics analysis.',
  },
]

const researchHighlights = [
  {
    title: 'Improving TG-263 target-name compliance using locally hosted large language models',
    venue: 'AAPM 2025 · Blue Ribbon Poster',
    text: 'Local LLM review flows for target-name compliance, clinical interface automation, and reviewer-controlled workflow checks.',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
    image: imageAssets.aapm2025,
  },
  {
    title: 'Ethos 2.0 high-fidelity SRS validation',
    venue: 'JACMP 2025',
    text: 'Validation of high-fidelity Ethos planning for multi-met single-isocentre SRS with semi-automated plan comparison.',
    href: 'https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/acm2.70370',
    image: imageAssets.aapm2024Ethos,
  },
  {
    title: 'Deep learning frameworks for CT abdominal organ auto-segmentation',
    venue: 'Intelligent Oncology 2025',
    text: 'Quantitative and expert review of abdominal organ segmentation frameworks for clinically relevant model comparison.',
    href: 'https://doi.org/10.1016/j.intonc.2025.03.003',
    image: imageAssets.aapm2024Auto,
  },
]

const publicationRows = [
  ['2025', 'Online adaptive APBI interobserver variability', 'Adaptive RT · contour variability · workflow reliability'],
  ['2024', 'Multi-institution 6X versus 10XFFF SBRT commissioning on TrueBeam iTX', 'Commissioning · Eclipse TPS · clinical implementation'],
  ['2023', 'Optimizing dose delivery during fractionated radiotherapy', 'CUPC best talk winner · radiotherapy optimization'],
  ['2021-2022', 'Gel electrophoresis smartphone analysis and AR kidney-model guidance', 'CAP oral presentations · biophysics and biomedical imaging'],
]

const projectRows = [
  {
    image: imageAssets.monaiPr,
    title: 'MONAI tutorials contribution',
    type: 'Open source',
    stack: 'Python · MONAI · PyTorch',
    text: 'Documentation and tutorial improvements for medical-imaging deep-learning users.',
    outcome: 'Merged contribution to Project MONAI tutorials.',
    href: 'https://github.com/Project-MONAI/tutorials/pull/1129',
  },
  {
    image: imageAssets.openhandsPr,
    title: 'OpenHands engineering contribution',
    type: 'Open source',
    stack: 'Python · FastAPI · React',
    text: 'Contribution inside an agent software stack spanning backend, application code, and developer workflow.',
    outcome: 'Merged contribution to OpenHands.',
    href: 'https://github.com/All-Hands-AI/OpenHands/pull/731',
  },
  {
    image: imageAssets.synthMed,
    title: 'Synth-Med Biotechnology',
    type: 'Founder / web systems',
    stack: 'Next.js · TypeScript',
    text: 'Public company site and technical content system for research-and-development positioning.',
    outcome: 'Live public site.',
    href: 'https://synth-med.com/about/',
  },
  {
    image: imageAssets.prostheticSite,
    title: 'Automated prosthetic limb prototype',
    type: 'Robotics archive',
    stack: 'C++ · Python · ROS',
    text: 'Mechatronic control and embedded-systems project connecting robotics, controls, and public documentation.',
    outcome: 'Public project archive.',
    href: 'https://sites.google.com/view/prostheticlimbprototype/home',
  },
]

const proofItems = [
  {
    title: 'McMaster student and UAB mentor drive changes in medicine through AI',
    source: 'UAB Medicine · June 2024',
    text: 'External profile on clinical AI tools for radiation treatment and planning.',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
    image: imageAssets.mentor,
  },
  {
    title: "Udbhav Ram's co-op supervisors flew in from Alabama to give him an award",
    source: 'McMaster Daily News · 2025',
    text: 'Science Co-op Student of the Year recognition connected to the UAB Radiation Oncology placement.',
    href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
    image: imageAssets.coopAward,
  },
  {
    title: 'Convocation countdown with Udbhav Ram',
    source: 'McMaster Science · May 2026',
    text: 'Academic profile covering Medical Physics with Co-op, UAB, mentorship, and doctoral next steps.',
    href: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
    image: imageAssets.convocation,
  },
]

const recognitionRows = [
  ['2025', 'AAPM Blue Ribbon Poster', 'Highest-scoring abstract designation for locally hosted LLMs and TG-263 target-name compliance.'],
  ['2025', 'Science Co-op Student of the Year', 'McMaster recognition tied to UAB Radiation Oncology research and mentorship.'],
  ['2024', 'Outstanding Poster Presentation', 'Society of Physics Students-AAPM undergraduate research competition.'],
  ['2023', 'Best Talk, CUPC', 'First prize for work on optimizing dose delivery during fractionated radiotherapy.'],
]

const archiveItems = [
  {
    image: imageAssets.arrowMcLaren,
    title: 'Motorsports',
    text: 'Arrow McLaren race strategy, Formula SAE electric vehicle software, telemetry, simulation, and driver-development context.',
  },
  {
    image: imageAssets.prostheticSite,
    title: 'Robotics & STEM outreach',
    text: "Automated prosthetic limb prototype, FRC/Robotique Zone01 mentorship, and Sparkin' STEM French curriculum coordination.",
  },
  {
    image: imageAssets.uwMedicalPhysics,
    title: 'Clinical service & teaching',
    text: 'Hospital volunteering, radiation oncology shadowing, yoga instruction, community programming, and long-term music training.',
  },
]

const hashAliases: Record<string, SectionId> = {
  education: 'profile',
  experience: 'profile',
  awards: 'proof',
  media: 'proof',
  activities: 'proof',
  motorsports: 'proof',
  software: 'projects',
}

function Icon({ name }: { name: IconName | 'arrow' | 'download' }) {
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
    github: (
      <>
        <path d="M7.2 16.2c-2 .6-2-1-2.8-1.3" />
        <path d="M13.2 17v-2.2c0-.6-.2-1-.6-1.3 2-.2 4.1-1 4.1-4.5 0-1-.3-1.8-.9-2.4.1-.3.4-1.3-.1-2.4 0 0-.8-.3-2.5.9A8.4 8.4 0 0 0 8.8 5c-1.7-1.2-2.5-.9-2.5-.9-.5 1.1-.2 2.1-.1 2.4A3.4 3.4 0 0 0 5.3 9c0 3.5 2.1 4.3 4.1 4.5-.3.2-.5.7-.6 1.2V17" />
      </>
    ),
    scholar: (
      <>
        <path d="m3.5 8 6.5-3.5L16.5 8 10 11.5 3.5 8z" />
        <path d="M6 10v3.2c1.1.9 2.4 1.3 4 1.3s2.9-.4 4-1.3V10" />
        <path d="M16.5 8v4" />
      </>
    ),
    linkedin: (
      <>
        <path d="M5.2 8.2V15" />
        <path d="M9 15v-4.1c0-1.6 1-2.6 2.4-2.6s2.4 1 2.4 2.8V15" />
        <path d="M9 8.4V15" />
        <circle cx="5.2" cy="5.3" r="1" />
        <path d="M3.5 3.5h13v13h-13z" />
      </>
    ),
    medium: (
      <>
        <circle cx="6.6" cy="10" r="4.1" />
        <ellipse cx="12.5" cy="10" rx="2.2" ry="3.8" />
        <path d="M16.1 6.6c.9 0 1.6 1.5 1.6 3.4s-.7 3.4-1.6 3.4-1.6-1.5-1.6-3.4.7-3.4 1.6-3.4z" />
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
      <img src={image.src} alt={image.alt} loading={className.includes('hero') ? 'eager' : 'lazy'} />
    </figure>
  )
}

function useHashScroll() {
  useLayoutEffect(() => {
    const scrollToHash = () => {
      const rawHash = window.location.hash.slice(1)
      if (!rawHash) return true

      const decodedHash = decodeURIComponent(rawHash)
      const target = document.getElementById(hashAliases[decodedHash] ?? decodedHash)
      if (!target) return false

      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' })

      return Math.abs(target.getBoundingClientRect().top - headerHeight - 18) < 8
    }

    const intervals = new Set<number>()
    const scheduleScroll = () => {
      window.requestAnimationFrame(scrollToHash)
      window.setTimeout(scrollToHash, 120)
      window.setTimeout(scrollToHash, 450)
      window.setTimeout(scrollToHash, 1000)

      let attempts = 0
      const intervalId = window.setInterval(() => {
        attempts += 1

        if (scrollToHash() || attempts >= 8) {
          window.clearInterval(intervalId)
          intervals.delete(intervalId)
        }
      }, 250)

      intervals.add(intervalId)
    }

    const pendingImages = Array.from(document.images).filter((image) => !image.complete)

    scheduleScroll()
    window.addEventListener('hashchange', scheduleScroll)
    pendingImages.forEach((image) => {
      image.addEventListener('load', scrollToHash)
      image.addEventListener('error', scrollToHash)
    })

    return () => {
      window.removeEventListener('hashchange', scheduleScroll)
      intervals.forEach((intervalId) => window.clearInterval(intervalId))
      pendingImages.forEach((image) => {
        image.removeEventListener('load', scrollToHash)
        image.removeEventListener('error', scrollToHash)
      })
    }
  }, [])
}

function SectionIntro({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="section-intro">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
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
      <a className="header-action" href={resumeHref} download>
        CV <Icon name="download" />
      </a>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero section" id="home">
      <div className="hero-copy">
        <h1>Udbhav Ram</h1>
        <p className="role-line">Medical Physics PhD student building clinical AI and software for radiation oncology.</p>
        <p className="hero-summary">
          I work at the intersection of medical physics, imaging, radiation oncology, and practical software engineering: the kind of work where a tool has to be technically strong, clinically understandable, and usable by real people.
        </p>
        <div className="hero-actions">
          <a className="button primary" href={resumeHref} download>
            Download CV <Icon name="download" />
          </a>
          <a className="button secondary" href="#research">
            View work <Icon name="arrow" />
          </a>
          <a className="button ghost" href="#contact">
            Contact <Icon name="mail" />
          </a>
        </div>
      </div>
      <div className="hero-media">
        <ImageFrame image={imageAssets.hero} className="hero-image" />
        <div className="hero-caption">
          <strong>Current direction</strong>
          <span>UW-Madison Medical Physics · Ran Zhang's lab · clinical AI and imaging software</span>
        </div>
      </div>
      <div className="hero-proof" aria-label="Profile highlights">
        {[
          ['PhD', 'Medical Physics, University of Wisconsin-Madison'],
          ['Research', 'Radiation oncology AI, adaptive RT, auto-segmentation'],
          ['Software', 'Python, React, automation, open source, local LLM systems'],
          ['Signal', 'AAPM Blue Ribbon Poster, JACMP paper, MONAI/OpenHands contributions'],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function Profile() {
  return (
    <section className="section" id="profile">
      <SectionIntro
        title="Profile"
        text="The through-line is clinical translation: technical systems that survive contact with medical workflow, evidence, and multidisciplinary review."
      />
      <div className="focus-grid">
        {focusAreas.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <div className="two-column profile-columns">
        <div className="ledger-panel">
          <h3>Education & Clinical Training</h3>
          <div className="logo-ledger">
            {educationRows.map((item) => (
              <article key={item.title}>
                <div className="logo-box">
                  <img src={item.logo.src} alt={item.logo.alt} />
                </div>
                <div>
                  <span>{item.meta}</span>
                  <strong>{item.title}</strong>
                  <em>{item.place}</em>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="ledger-panel">
          <h3>Experience Spine</h3>
          <div className="timeline-ledger">
            {experienceRows.map((item) => (
              <article key={`${item.time}-${item.role}`}>
                <span>{item.time}</span>
                <div>
                  <strong>{item.role}</strong>
                  <em>{item.org}</em>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Research() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = researchHighlights[selectedIndex]

  return (
    <section className="section research-section" id="research">
      <SectionIntro
        title="Research"
        text="Selected work is ordered by what an employer or collaborator needs to understand first: clinical AI, treatment-planning validation, and evaluation discipline."
        action={
          <ExternalLink href="https://scholar.google.com/scholar?q=%22Udbhav+Ram%22" className="text-link">
            Google Scholar <Icon name="arrow" />
          </ExternalLink>
        }
      />
      <div className="research-feature">
        <div className="research-tabs" aria-label="Research highlights">
          {researchHighlights.map((item, index) => (
            <button className={selectedIndex === index ? 'active' : ''} key={item.title} onClick={() => setSelectedIndex(index)} type="button">
              <span>{item.venue}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>
        <article className="research-detail">
          <ImageFrame image={selected.image} />
          <div>
            <span>{selected.venue}</span>
            <h3>{selected.title}</h3>
            <p>{selected.text}</p>
            <ExternalLink href={selected.href} className="button secondary">
              Open source <Icon name="arrow" />
            </ExternalLink>
          </div>
        </article>
      </div>
      <div className="publication-ledger">
        {publicationRows.map(([year, title, detail]) => (
          <article key={title}>
            <span>{year}</span>
            <strong>{title}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section className="section" id="projects">
      <SectionIntro
        title="Selected Software & Projects"
        text="A tighter project list: fewer items, clearer stakes, and visible evidence that the work exists outside a private resume bullet."
        action={
          <ExternalLink href="https://github.com/udiram" className="text-link">
            GitHub <Icon name="arrow" />
          </ExternalLink>
        }
      />
      <div className="project-grid">
        {projectRows.map((item) => (
          <ExternalLink href={item.href} className="project-card" key={item.title}>
            <ImageFrame image={item.image} />
            <div>
              <span>{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <dl>
                <div>
                  <dt>Stack</dt>
                  <dd>{item.stack}</dd>
                </div>
                <div>
                  <dt>Outcome</dt>
                  <dd>{item.outcome}</dd>
                </div>
              </dl>
              <b>
                View evidence <Icon name="arrow" />
              </b>
            </div>
          </ExternalLink>
        ))}
      </div>
    </section>
  )
}

function Proof() {
  return (
    <section className="section proof-section" id="proof">
      <SectionIntro
        title="Proof"
        text="Awards and media are not the main story; they are the credibility layer underneath the research and software narrative."
      />
      <div className="proof-layout">
        <div className="media-list">
          {proofItems.map((item) => (
            <ExternalLink href={item.href} className="media-card" key={item.title}>
              <ImageFrame image={item.image} />
              <div>
                <span>{item.source}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
                <b>
                  Read source <Icon name="arrow" />
                </b>
              </div>
            </ExternalLink>
          ))}
        </div>
        <aside className="recognition-panel">
          <h3>Recognition</h3>
          <div>
            {recognitionRows.map(([year, title, detail]) => (
              <article key={title}>
                <span>{year}</span>
                <strong>{title}</strong>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </aside>
      </div>
      <div className="archive-strip">
        {archiveItems.map((item) => (
          <article key={item.title}>
            <ImageFrame image={item.image} />
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
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
        <h2>Let’s connect.</h2>
        <p>Research collaboration, clinical AI tooling, medical physics work, software projects, and performance-engineering crossover conversations are all welcome.</p>
        <nav className="social-links" aria-label="Social links">
          {socialItems.map((item) => (
            <ExternalLink href={item.href} className="social-link" key={item.label}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </ExternalLink>
          ))}
        </nav>
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
  useHashScroll()

  return (
    <div className="portfolio-site">
      <Header />
      <main>
        <Hero />
        <Profile />
        <Research />
        <Projects />
        <Proof />
        <Contact />
      </main>
      <footer className="site-footer">
        <span>© 2026 Udbhav Ram</span>
        <span>Medical physics · clinical AI · software</span>
      </footer>
    </div>
  )
}

export default App
