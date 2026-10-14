import { useHashNavigation } from './useHashNavigation'
import { homePresentations } from './presentationData'
import {
  ArrowUpRight,
  List,
  X,
  Moon,
  Sun,
  Plus,
  MagnifyingGlass,
  BookmarkSimple,
} from '@phosphor-icons/react'
import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  imageAssets,
  selectedWork,
  publications,
  currentBuilds,
  socialItems,
  type ImageAsset,
} from './siteContent'
import { portfolioItemCount } from './portfolioContent'
import DetailPages, { PageFooter } from './DetailPages'
import routeMeta from './routeMeta.json'
import { ReadingListProvider, useReadingList } from './ReadingListContext'
import { studies } from './expandedContent'
import { awardRecords } from './identityContent'
import { IdentityMark } from './identityMarks'
import './App.css'
import './Details.css'

const SearchDialog = lazy(() => import('./SearchDialog'))

const nav = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'trajectory', label: 'About', href: '/about' },
  { id: 'work', label: 'Research', href: '/research' },
  { id: 'projects', label: 'Software', href: '/software' },
  { id: 'archive', label: 'Archive', href: '/archive' },
]
const aliases: Record<string, string> = {
  about: 'trajectory',
  path: 'trajectory',
  projects: 'work',
  beyond: 'life',
  activities: 'activities-service',
  awards: 'recognition',
  proof: 'recognition',
  archive: 'recognition',
  history: 'profile-foundations',
  'google-site-archive': 'recognition',
  sources: 'recognition',
}
const researchStories = studies.slice(2, 5).map(study => ({
  title: study.title,
  topic: `${study.year} · ${study.status}`,
  summary: study.intro,
  detail: study.sections.map(section => section.paragraphs[0]).join(' '),
}))
function ExternalLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

function Photo({
  asset,
  className = '',
  priority = false,
  caption,
}: {
  asset: ImageAsset
  className?: string
  priority?: boolean
  caption?: ReactNode
}) {
  return (
    <figure className={className}>
      <img
        src={asset.src}
        alt={asset.alt}
        width="960"
        height="720"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}


function Header({
  dark,
  setDark,
}: {
  dark: boolean
  setDark: (dark: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchButton = useRef<HTMLButtonElement>(null)
  const { ids: readingListIds } = useReadingList()
  const toggle = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  const [active, setActive] = useState('')
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const closeOutside = (event: PointerEvent) => {
      if (header.current && !header.current.contains(event.target as Node))
        setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', closeOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', closeOutside)
    }
  }, [open])
  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || (!event.metaKey && !event.ctrlKey)) return
      event.preventDefault()
      setOpen(false)
      setSearchOpen(true)
    }
    window.addEventListener('keydown', onShortcut)
    return () => window.removeEventListener('keydown', onShortcut)
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-15% 0px -65% 0px' },
    )
    ;[{ id: 'home' }, ...nav].forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])
  return (
    <header className="site-header" ref={header}>
      <div className="header-inner">
        <a
          className="brand"
          href="/"
          onClick={() => {
            setOpen(false)
            setActive('')
          }}
        >
          Udbhav Ram<span className="brand-dot">.</span>
        </a>
        <nav
          aria-label="Main navigation"
          id="main-navigation"
          className={open ? 'is-open' : ''}
        >
          {nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              aria-current={(item.href === '/' ? window.location.pathname === '/' : window.location.pathname.startsWith(item.href)) ? 'page' : active === item.id ? 'location' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button className="search-trigger" type="button" ref={searchButton} aria-label="Search site" aria-haspopup="dialog" onClick={() => { setOpen(false); setSearchOpen(true) }}><MagnifyingGlass /><span>Search</span><kbd>⌘K</kbd></button>
          <a className="reading-list-link" href="/reading-list" aria-label={`Reading list with ${readingListIds.length} saved ${readingListIds.length === 1 ? 'item' : 'items'}`}><BookmarkSimple /><span className="reading-list-label">List</span>{readingListIds.length > 0 && <b>{readingListIds.length}</b>}</a>
          <button
            className="icon-button theme-toggle"
            type="button"
            aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun /> : <Moon />}
          </button>
          <button
            className="icon-button menu-toggle"
            ref={toggle}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <List />}
          </button>
        </div>
      </div>
      {searchOpen && <Suspense fallback={<div className="search-loading" role="status">Opening search…</div>}><SearchDialog onClose={closeSearch} returnFocus={searchButton} /></Suspense>}
    </header>
  )
}

function Hero() {
  return (
    <section className="hero wrap" id="home" tabIndex={-1}>
      <div className="hero-copy">
        <h1>I’m Udi — a Medical Physics PhD student at UW–Madison.</h1>
        <p>I build AI tools for radiation oncology, mostly around imaging and treatment planning.</p>
      </div>
      <Photo
        asset={imageAssets.heroPortrait}
        priority
        className="hero-photo"
      />
      <div className="hero-actions">
        <a className="button" href="/about">About me <ArrowUpRight /></a>
      </div>
    </section>
  )
}

export function LegacyHomeAbout() {
  return (
    <section
      className="about-section wrap section"
      id="trajectory"
      tabIndex={-1}
    >
      <div className="section-heading">
        <h2>
          A path shaped
          <br />
          by <em>people.</em>
        </h2>
        <div>
          <p>
            I came to medical physics through a love of building things and a
            desire to make them useful. That curiosity has taken me from
            McMaster to radiation oncology research at UAB, and now to a PhD at
            UW–Madison.
          </p>
          <p>
            I’m interested in how AI and vision-language models can help us
            understand medical images and improve cancer care. Outside research,
            you’ll find another side of me in motorsport, riding, diving, music,
            and making things.
          </p>
        </div>
      </div>
      <div className="about-story">
        <Photo
          asset={imageAssets.coopAward}
          caption="McMaster Science Co-op Student of the Year, 2026"
        />
        <div>
          <h3>
            Good mentors open doors.
            <br />I want to hold them open.
          </h3>
          <p>
            My collaboration with Dr. Carlos Cardenas at UAB grew from remote
            research into a visiting-scholar experience in Birmingham. Along the
            way, I helped connect students and opportunities across UAB and
            McMaster.
          </p>
          <p>
            Mentorship, ambassadorship, and teaching are part of how I hope to
            make a difference, too.
          </p>
          <ExternalLink
            href="https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor"
            className="text-link"
          >
            The story behind the collaboration <ArrowUpRight />
          </ExternalLink>
        </div>
      </div>
      <ol className="path-line">
        <li>
          <a href="/experience#mcmaster-medical-physics">
            <IdentityMark label="McMaster University" compact contextual />
            <span>2021–2026</span>
            <strong>McMaster University</strong>
            <p>Honours Medical Physics with Co-op</p>
          </a>
        </li>
        <li>
          <a href="/experience#uab-research-collaborator">
            <IdentityMark label="UAB Radiation Oncology" compact contextual />
            <span>Research since 2021</span>
            <strong>UAB Radiation Oncology</strong>
            <p>Research with Dr. Carlos Cardenas; visiting scholar in 2024</p>
          </a>
        </li>
        <li>
          <a href="/experience#uw-medical-physics">
            <IdentityMark label="University of Wisconsin–Madison" compact contextual />
            <span>2026–present</span>
            <strong>UW–Madison</strong>
            <p>Medical Physics PhD student with Dr. Ran Zhang</p>
          </a>
        </li>
      </ol>
    </section>
  )
}

export function LegacyHomeResearch() {
  return (
    <section className="research-section section" id="work" tabIndex={-1}>
      <div className="wrap">
        <div className="section-heading">
          <h2>
            Research,
            <br />
            <em>made useful.</em>
          </h2>
          <p>
            I work on tools that help clinicians make sense of medical images
            and plan radiation treatment. Here are three questions I’ve
            explored.
          </p>
        </div>
        <div className="research-stories">
          {researchStories.map((story, index) => (
            <article className="research-story" key={story.title}>
              <Photo
                asset={selectedWork[index].image}
                className={`research-photo research-photo-${index}`}
              />
              <div className="research-copy">
                <span className="meta">{story.topic}</span>
                <h3>{story.title}</h3>
                <p>{story.summary}</p>
                <div className="research-links">
                  <ExternalLink
                    className="text-link"
                    href={selectedWork[index].links[0].href}
                  >
                    {index === 0 ? 'Read the poster' : 'Read the paper'}{' '}
                    <ArrowUpRight />
                  </ExternalLink>
                  <a className="text-link" href={`/research/${['clinical-language-models', 'radiosurgery-planning', 'organ-segmentation'][index]}`}>Full case study</a>
                  <details className="study-details">
                    <summary>
                      Quick findings <Plus />
                    </summary>
                    <p>{story.detail}</p>
                  </details>
                </div>
              </div>
            </article>
          ))}
        </div>
        <details
          className="publications-disclosure"
          id="research"
          tabIndex={-1}
        >
          <summary>
            <span>Journal articles</span>
            <Plus />
          </summary>
          <div className="disclosure-body">
            <div id="publications" tabIndex={-1}>
              <h3>Selected publications</h3>
              {publications.map((item) => (
                <article className="publication" key={item.title}>
                  <span className="meta">
                    {item.year} · {item.venue}
                  </span>
                  <h4>
                    <ExternalLink href={item.href}>
                      {item.title} <ArrowUpRight />
                    </ExternalLink>
                  </h4>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>

          </div>
        </details>
        <section className="home-presentations">            <div id="talks" tabIndex={-1}>
              <h3>Talks & posters</h3>
              {homePresentations.slice(0, 2).map((item) => (
                <article className="publication" key={item.id}>
                  <span className="meta">{item.date}</span>
                  <h4>{item.title}</h4>
                  <p>{item.venue} · {item.format}</p><p>{item.role} · Presenter: {item.presenter}</p><p className="small-note">{item.status}</p>
                  {(
                    <ExternalLink href={`/publications#${item.id}`} className="text-link">
                      View presentation record <ArrowUpRight />
                    </ExternalLink>
                  )}
                </article>
              ))}
            </div><a className="text-link" href="/publications#presentations">Explore the reconciled presentation record</a></section>
        <div className="research-full-link"><a className="button" href="/research">Explore all research</a><a className="text-link" href="/publications">Full publications & presentations</a></div>
        <div className="workbench" id="projects">
          <div className="section-heading">
            <h3>On my workbench</h3>
            <p>
              Open research and tools I’m building. These are research projects;
              clinical use requires further validation.
            </p>
          </div>
          <div className="project-list">
            {currentBuilds.slice(0, 3).map((build) => (
              <ExternalLink
                className="project"
                href={build.href}
                key={build.name}
              >
                <div>
                  <span className="meta">{build.type}</span>
                  <h4>{build.name}</h4>
                </div>
                <p>{build.description}</p>
                <ArrowUpRight />
              </ExternalLink>
            ))}
          </div>
          <ExternalLink href="https://github.com/udiram" className="text-link">
            More projects on GitHub <ArrowUpRight />
          </ExternalLink>
        </div>
      </div>
    </section>
  )
}

export function LegacyHomeLife() {
  return (
    <section className="life-section wrap section" id="life" tabIndex={-1}>
      <h2>
        There’s a world
        <br />
        <em>beyond the lab.</em>
      </h2>
      <div className="life-feature" id="motorsports" tabIndex={-1}>
        <Photo
          asset={imageAssets.arrowMcLaren}
          caption="Motorsport · Arrow McLaren IndyCar"
        />
        <div>
          <h3>
            A different kind
            <br />
            of precision.
          </h3>
          <p>
            From race data to riding, diving, and making things, I like learning
            by doing.
          </p>
          <p>
            In 2023, I took that curiosity to Arrow McLaren as a
            data-and-strategy intern. My motorsport experience also spans
            Formula SAE, Formula LGB, and the Polo Cup.
          </p>
          <ExternalLink
            href="/beyond#race-engineering"
            className="text-link"
          >
            My motorsport journey <ArrowUpRight />
          </ExternalLink>
        </div>
      </div>
      <div className="life-notes">
        <article className="life-note-photo">
          <a className="life-note-image" href="/beyond#scuba" aria-label="Open the scuba story"><Photo asset={imageAssets.beyondScuba} caption={imageAssets.beyondScuba.caption!} /></a>
          <div><span className="meta">Scuba</span>
            <h3>Below the surface</h3>
            <p>PADI Advanced Open Water and Nitrox training built on an earlier SSI Open Water qualification.</p>
            <a className="text-link" href="/beyond#scuba">Dive into the story</a></div>
        </article>
        <article className="life-note-photo">
          <a className="life-note-image" href="/beyond#equestrian" aria-label="Open the equestrian story"><Photo asset={imageAssets.beyondEquestrian} caption={imageAssets.beyondEquestrian.caption!} /></a>
          <div><span className="meta">Equestrian</span>
            <h3>Time in the saddle</h3>
            <p>English riding, Western horsemanship, horse care, and time helping at an Alabama lesson barn.</p>
            <a className="text-link" href="/beyond#equestrian">Follow the riding path</a></div>
        </article>
        <article className="life-note-text">
          <span className="meta">Creative practice</span>
          <h3>A musical thread</h3>
          <p>
            Western and Carnatic violin, piano, and Carnatic singing have been
            another part of my life alongside science.
          </p>
          <a className="text-link" href="/beyond#music">Hear the musical thread</a>
        </article>
      </div>
    </section>
  )
}

const homeStudySlugs = ['radkev', 'clinical-language-models', 'radiosurgery-planning', 'organ-segmentation']
const homeStudies = homeStudySlugs.map(slug => studies.find(study => study.slug === slug)!).filter(Boolean)

function CuratedResearch() {
  const [lead, ...highlights] = homeStudies
  return <section className="curated-research section" id="work" tabIndex={-1}><div className="wrap"><div className="section-heading"><h2>Research</h2><p>Recent work ranges from radiology decision models to treatment-planning and imaging studies.</p></div><article className="curated-research-lead"><Photo asset={lead.image} /><div><span className="meta">{lead.year} · {lead.status}</span><h3>{lead.title}</h3><p>{lead.intro}</p><div className="card-actions"><a className="button" href={`/research/${lead.slug}`}>Read the preprint story</a><a className="text-link" href={lead.sources[0].href}>medRxiv record</a></div></div></article><div className="curated-research-grid">{highlights.map(study => <article key={study.slug}><Photo asset={study.image} /><span className="meta">{study.year} · {study.status}</span><h3>{study.title}</h3><p>{study.intro}</p><a className="text-link" href={`/research/${study.slug}`}>Read the case study</a></article>)}</div><div className="curated-section-links"><a className="button" href="/research">All research</a></div></div></section>
}

function CuratedMotorsport() {
  return <section className="curated-motorsport wrap section" id="life"><Photo asset={imageAssets.arrowMcLaren} caption="Arrow McLaren IndyCar · 2023" /><div><span className="meta">Outside the lab</span><h2>Motorsport</h2><p>In 2023, I worked at Arrow McLaren IndyCar as a data-and-strategy intern. I built race-strategy simulations and worked with telemetry and performance tools during race weekends. Formula SAE and test-driving taught me the same lesson from another angle: a model is useful only when it helps someone make a decision. I still make time for music, riding, and diving, but motorsport is the thread that most directly shapes how I build.</p><a className="text-link" href="/beyond#race-engineering">More beyond the lab →</a></div></section>
}

const featuredAwards = ['coop-student-year', 'aapm-blue-ribbon', 'sps-poster'].map(id => awardRecords.find(record => record.id === id)!)

export function LegacyHomeAwardsHighlight() {
  return <section className="home-awards section"><div className="wrap"><div className="section-heading"><h2>Milestones<br /><em>along the way.</em></h2><div><p>Selected recognition from research and co-op work, with the full source-linked record kept in one place.</p><a className="text-link" href="/awards">Explore awards, training & recognition</a></div></div><div className="home-award-list">{featuredAwards.map(record => <a href={`/awards#${record.id}`} key={record.id}><span className="meta">{record.year} · {record.issuer}</span><div className="home-award-heading"><IdentityMark label={record.issuer || record.title} compact contextual /><h3>{record.title}</h3></div><p>{record.detail}</p><strong>View the record →</strong></a>)}</div></div></section>
}

export function LegacyHomeContact() {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('ramu@mcmaster.ca')
      setCopied(true)
      setCopyFailed(false)
    } catch {
      setCopyFailed(true)
    }
  }
  return (
    <section className="contact-section" id="contact" tabIndex={-1}>
      <div className="wrap contact-inner">
        <h2>
          Good work starts
          <br />
          with a <em>conversation.</em>
        </h2>
        <div>
          <p>
            Research, ideas, or just a hello—
            <br />
            I’d love to hear from you.
          </p>
          <a className="contact-email" href="mailto:ramu@mcmaster.ca">
            Say hello <ArrowUpRight />
          </a>
          <div className="email-row">
            <span>ramu@mcmaster.ca</span>
            <button type="button" onClick={copyEmail}>
              {copied ? 'Copied' : 'Copy email'}
            </button>
          </div>
          <span role="status" className="copy-status">
            {copyFailed
              ? 'Please select and copy the email address above.'
              : copied
                ? 'Email address copied.'
                : ''}
          </span>
        </div>
        <nav aria-label="Social links">
          {socialItems
            .filter(
              (item) => item.label === 'LinkedIn' || item.label === 'GitHub',
            )
            .map((item) => (
              <ExternalLink
                href={item.href}
                className="text-link"
                key={item.label}
              >
                {item.label} <ArrowUpRight />
              </ExternalLink>
            ))}
        </nav>
      </div>
      <footer className="wrap site-footer">
        <span>© {new Date().getFullYear()} Udbhav Ram</span>
        <a href="/">
          Back to top <ArrowUpRight />
        </a>
      </footer>
    </section>
  )
}

function AppContent() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const isHome = path === '/'
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('udbhav-theme') === 'dark'
    } catch {
      return false
    }
  })
  useHashNavigation(aliases)
  useEffect(() => {
    const meta = routeMeta[path as keyof typeof routeMeta]
    document.title = meta?.title ?? 'Page not found | Udbhav Ram'
    if (meta) document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [path])
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? '#19251f' : '#f7f5ef')
    try {
      localStorage.setItem('udbhav-theme', dark ? 'dark' : 'light')
    } catch {
      /* Theme works without storage. */
    }
  }, [dark])
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header dark={dark} setDark={setDark} />
      <main
        id="main-content"
        tabIndex={-1}
        data-portfolio-items={portfolioItemCount}
      >
        {isHome ? <><Hero /><CuratedResearch /><CuratedMotorsport /><PageFooter /></> : <><DetailPages path={path} /><PageFooter /></>}
      </main>
    </>
  )
}

export default function App() {
  return <ReadingListProvider><AppContent /></ReadingListProvider>
}
