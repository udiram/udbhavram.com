import {
  ArrowDown,
  ArrowUpRight,
  Article,
  Code,
  Cube,
  EnvelopeSimple,
  GithubLogo,
  List,
  LinkedinLogo,
  Moon,
  Pulse,
  ShieldCheck,
  Sun,
  X,
} from '@phosphor-icons/react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import './App.css'
import { originalSiteLinks, portfolioCollections, portfolioItemCount, type PortfolioCollection, type RecordItem } from './portfolioContent'

type SectionId = 'home' | 'work' | 'research' | 'trajectory' | 'life' | 'recognition' | 'contact'
type Theme = 'light' | 'dark'

type ImageAsset = {
  src: string
  alt: string
  source?: string
}

type LinkItem = {
  label: string
  href: string
}

type IconName = 'arrow' | 'down' | 'mail' | 'github' | 'article' | 'linkedin' | 'moon' | 'sun' | 'menu' | 'close' | 'code' | 'cube' | 'pulse' | 'shield'

type SnapshotItem = {
  label: string
  title: string
  detail: string
}

type WorkStory = {
  title: string
  strap: string
  text: string
  image: ImageAsset
  evidence: { value: string; label: string }[]
  links: LinkItem[]
}

type CurrentBuild = {
  name: string
  type: string
  status: string
  description: string
  boundary: string
  href: string
  icon: IconName
}

type PublicationItem = {
  year: string
  title: string
  venue: string
  note: string
  href: string
}

type TalkItem = {
  date: string
  event: string
  detail: string
  href?: string
}

type TimelineItem = {
  date: string
  title: string
  org: string
  text: string
}

type ProofCard = {
  source: string
  title: string
  text: string
  href: string
}

const themeStorageKey = 'udbhav-theme'
const currentYear = new Date().getFullYear()

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey)
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  } catch {
    // Storage access can fail in privacy-restricted browsing contexts.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const imageAssets = {
  heroPortrait: {
    src: '/assets/optimized/hero-portrait.webp',
    alt: 'Udbhav Ram outside the McMaster physics building',
    source: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
  },
  heroCollage: {
    src: '/assets/optimized/clinical-imaging-collage.webp',
    alt: 'Collage of MR imaging, code, CT imaging, and radiation dose distribution',
    source: 'https://sites.google.com/view/udbhav-ram/research',
  },
  coopAward: {
    src: '/assets/optimized/coop-award.webp',
    alt: 'Udbhav Ram receiving the McMaster Science Co-op Student of the Year award',
    source: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
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
    src: '/assets/optimized/uab-radonc.webp',
    alt: 'UAB Radiation Oncology treatment-planning visual',
    source: 'https://www.uab.edu/medicine/radonc/',
  },
  uabPresentation: {
    src: '/assets/optimized/uab-presentation.webp',
    alt: 'Udbhav Ram presenting clinical AI research at UAB Radiation Oncology',
    source: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  tg263Poster: {
    src: '/assets/optimized/aapm-2025-tg263-poster.webp',
    alt: 'AAPM poster describing a locally hosted language-model pipeline for TG-263 naming quality assurance',
    source: 'https://aapm.confex.com/aapm/2025am/mediafile/Handout/Paper20105/AAPM2025_BRP_LLM.pdf',
  },
  arrowMcLaren: {
    src: '/assets/optimized/arrow-mclaren.webp',
    alt: 'Arrow McLaren IndyCar race car on track',
    source: 'https://www.arrowmclaren.com/',
  },
  formulaLgb: {
    src: '/assets/sourced/motorsports/formula-lgb.jpg',
    alt: 'Formula LGB 1300 race car during a test and development program',
  },
  macFormulaSae: {
    src: '/assets/sourced/motorsports/mac-formula-sae.png',
    alt: 'McMaster Formula SAE Electric car and team',
  },
  vwPoloCup: {
    src: '/assets/sourced/motorsports/vw-polo-cup.jpg',
    alt: 'Volkswagen Polo Cup race car at Madras International Circuit',
  },
  visitingScholar: {
    src: '/assets/sourced/mcmaster-uab-scholar.png',
    alt: 'Udbhav Ram during his international visiting scholar term at UAB',
  },
  convocation: {
    src: '/assets/sourced/mcmaster-convocation.jpg',
    alt: 'Udbhav Ram at McMaster University convocation',
  },
  uabMentor: {
    src: '/assets/sourced/uab-ai-mentor.jpg',
    alt: 'Udbhav Ram with his UAB clinical AI mentor',
  },
  uabEmployerAward: {
    src: '/assets/sourced/uab-employer-award-1.jpg',
    alt: 'UAB mentor receiving McMaster co-op employer recognition',
  },
  employerAwards: {
    src: '/assets/sourced/mcmaster-employer-awards-hero.jpg',
    alt: 'McMaster Science co-op employer award recipients',
  },
} satisfies Record<string, ImageAsset>

const navItems: { id: SectionId; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'research', label: 'Research' },
  { id: 'trajectory', label: 'Path' },
  { id: 'life', label: 'Beyond' },
  { id: 'recognition', label: 'Record' },
  { id: 'contact', label: 'Contact' },
]

const socialItems: (LinkItem & { icon: IconName })[] = [
  { label: 'Email', href: 'mailto:ramu@mcmaster.ca', icon: 'mail' },
  { label: 'LinkedIn', href: 'https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/udiram', icon: 'github' },
  { label: 'Publications', href: 'https://pubmed.ncbi.nlm.nih.gov/?term=Udbhav+S+Ram', icon: 'article' },
]

const heroSummary = 'I build medical AI and imaging systems that stay accountable to physics, clinical review, and the people who use them.'

const heroSnapshots: SnapshotItem[] = [
  {
    label: 'Now',
    title: 'Medical Physics PhD · UW–Madison',
    detail: '2026 doctoral student advised by Dr. Ran Zhang.',
  },
  {
    label: 'Clinical AI',
    title: 'Clinical AI · UAB Radiation Oncology',
    detail: 'A collaboration active since 2021, including an on-site visiting-scholar term.',
  },
  {
    label: 'Public record',
    title: 'Two first-author papers',
    detail: 'Planning and segmentation studies published in JACMP and Intelligent Oncology.',
  },
  {
    label: 'Recognition',
    title: 'Research recognized in two settings',
    detail: 'AAPM poster honors and McMaster Science Co-op Student of the Year.',
  },
]

const selectedWork: WorkStory[] = [
  {
    title: 'Locally hosted LLMs for TG-263 naming QA',
    strap: 'AAPM 2025 Blue Ribbon Poster',
    text: "A local pipeline used structured prompts, rules, and language models to standardize radiotherapy target names. All 1,000 outputs passed the TG-263 ruleset, but the poster also documents cases where a compliant name did not preserve the author's intent. That distinction is why this belongs in a reviewed QA workflow, not an autonomous one.",
    image: imageAssets.tg263Poster,
    evidence: [
      { value: '1,000', label: 'clinical names evaluated' },
      { value: '<8%', label: 'compliant at baseline' },
      { value: '22 s', label: 'average multi-model correction' },
    ],
    links: [
      { label: 'Read the poster', href: 'https://aapm.confex.com/aapm/2025am/mediafile/Handout/Paper20105/AAPM2025_BRP_LLM.pdf' },
      { label: 'UAB collaboration story', href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor' },
    ],
  },
  {
    title: 'Ethos 2.0 high-fidelity SRS planning',
    strap: 'First author, JACMP 2025',
    text: 'Across 45 patients and four planning templates, enabling high-fidelity mode with control rings improved normal-tissue sparing, conformity, and dose falloff while lowering plan complexity. The result is a concrete template-design finding for single-isocenter SRS, not a generic claim about automation.',
    image: imageAssets.uabPresentation,
    evidence: [
      { value: '45', label: 'patients' },
      { value: '4', label: 'planning templates' },
      { value: 'p<0.0001', label: 'key quality comparisons' },
    ],
    links: [
      { label: 'Read the paper', href: 'https://pubmed.ncbi.nlm.nih.gov/41272935/' },
      { label: 'View in JACMP', href: 'https://aapm.onlinelibrary.wiley.com/doi/10.1002/acm2.70370' },
    ],
  },
  {
    title: 'Abdominal CT auto-segmentation',
    strap: 'First author, Intelligent Oncology 2025',
    text: 'The study compared nnU-Net, MONAI Auto3DSeg, and SwinUNETR on the same data, then added a blinded physician review rather than stopping at geometric metrics. Both AutoML frameworks outperformed SwinUNETR; physicians preferred nnU-Net over Auto3DSeg.',
    image: imageAssets.uabRadonc,
    evidence: [
      { value: '122', label: 'training images' },
      { value: '72', label: 'holdout images' },
      { value: '30 × 3', label: 'cases and physicians' },
    ],
    links: [
      { label: 'Read the paper', href: 'https://pubmed.ncbi.nlm.nih.gov/41020282/' },
      { label: 'Open the free full text', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12462693/' },
    ],
  },
]

const currentBuilds: CurrentBuild[] = [
  {
    name: 'RadKev',
    type: 'Radiology decision research',
    status: 'Public · active October 2026',
    description: 'A radiology-specialized decision model designed to return calibrated probabilities across a constrained answer set in one forward pass.',
    boundary: 'Research system with a pre-registered evaluation; it is not a diagnostic device.',
    href: 'https://github.com/udiram/RadKev',
    icon: 'pulse',
  },
  {
    name: 'MedPhysBench',
    type: 'Evaluation infrastructure',
    status: 'Public · active 2026',
    description: 'A safety-aware benchmark for evaluating AI and agent systems on medical-physics tasks with explicit evidence and review boundaries.',
    boundary: 'Research-only benchmark; scores do not establish clinical readiness.',
    href: 'https://github.com/udiram/MedPhysBench',
    icon: 'shield',
  },
  {
    name: 'VoxelWeave Designer',
    type: 'Imaging-to-fabrication workflow',
    status: 'Public · active 2026',
    description: 'A macOS workspace for accountable DICOM-to-Prusa XL phantom fabrication, material mapping, and scan-back evidence.',
    boundary: 'Research-use tooling; output still requires printer, material, and scan validation.',
    href: 'https://github.com/udiram/VoxelWeave-Designer',
    icon: 'cube',
  },
  {
    name: 'Glioblastoma analysis',
    type: 'Imaging research code',
    status: 'Public · updated October 2026',
    description: 'An active public repository exploring deep-learning methods for imaging characteristics of glioblastoma.',
    boundary: 'Exploratory code; the repository does not claim validated clinical performance.',
    href: 'https://github.com/udiram/Glioblastoma_analysis',
    icon: 'code',
  },
]

const publications: PublicationItem[] = [
  {
    year: '2025',
    title: 'AI-based framework to fuse pre-RT brain metastases contours with follow-up MRI to improve post-RT assessment',
    venue: 'Neuro-Oncology Practice',
    note: 'Co-authored 40-patient study. Median review time fell from 7.97 to 3.95 minutes while agreement with the consensus label rose from 72.4% to 93.5%.',
    href: 'https://academic.oup.com/nop/article/13/3/497/8382617',
  },
  {
    year: '2025',
    title: 'Dosimetric evaluation of Ethos 2.0 high-fidelity mode for single-isocenter SRS',
    venue: 'Journal of Applied Clinical Medical Physics',
    note: 'First-author, 45-patient evaluation of four template configurations for multi-metastasis SRS planning.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/41272935/',
  },
  {
    year: '2025',
    title: 'Assessing quantitative performance and expert review of multiple deep learning-based frameworks for CT abdominal organ auto-segmentation',
    venue: 'Intelligent Oncology',
    note: 'First-author comparison of SwinUNETR, nnU-Net, and MONAI Auto3DSeg with quantitative and blinded physician review.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/41020282/',
  },
  {
    year: '2020',
    title: 'The effects of resveratrol, caffeine, beta-carotene, and EGCG on amyloid aggregation in synthetic brain membranes',
    venue: 'Molecular Nutrition & Food Research',
    note: 'Earlier biophysics publication from McMaster work.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/32981185/',
  },
]

const talkTimeline: TalkItem[] = [
  {
    date: 'ASTRO 2026',
    event: 'ASTRO 2026, Boston',
    detail: 'Poster presented on contouring uncertainty in CBCT-guided online adaptive partial-breast irradiation.',
    href: 'https://amportal.astro.org/udbhav-ram-bs-135368427',
  },
  {
    date: 'July 2025',
    event: 'AAPM Annual Meeting',
    detail: 'Blue Ribbon poster for the TG-263 locally hosted LLM work.',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
  },
  {
    date: 'July 2025',
    event: 'AAPM Annual Meeting',
    detail: 'First-author poster comparing 6X-FFF and 10X-FFF for lung SBRT across dosimetry and delivery efficiency.',
    href: 'https://aapm.confex.com/aapm/2025am/mediafile/Handout/Paper20068/AAPM2025_eposter_6X10X.pdf',
  },
  {
    date: '2024',
    event: 'AAPM / SPS undergraduate research competition',
    detail: 'Best poster presentation for the Ethos 2.0 high-fidelity SRS work.',
    href: 'https://www.aapm.org/pubs/newsletter/archive/5001.pdf',
  },
  {
    date: 'October 2023',
    event: 'Canadian Undergraduate Physics Conference',
    detail: 'First-place oral presentation for work on optimizing dose delivery during fractionated radiotherapy.',
    href: 'https://uwaterloo.ca/physics-astronomy/news/our-department-hosts-cupc-first-time-1989',
  },
]

const pathTimeline: TimelineItem[] = [
  {
    date: '2026-present',
    title: 'Doctoral training in medical physics',
    org: 'University of Wisconsin-Madison',
    text: 'The current chapter is a PhD in medical physics under Dr. Ran Zhang, with a focus that public conference bios describe as AI for radiation oncology, image segmentation, vision-language models, treatment planning, and image-guided radiotherapy.',
  },
  {
    date: '2021-2025',
    title: 'Long-running UAB collaboration',
    org: 'UAB Radiation Oncology',
    text: 'The public record traces the collaboration back to 2021, first remotely and then through an international visiting-scholar term in Birmingham from January through August 2024, followed by publications and conference work in 2025.',
  },
  {
    date: '2021-2026',
    title: 'Honours Medical Physics with Co-op',
    org: 'McMaster University',
    text: "McMaster's 2026 convocation profile documents the undergraduate medical-physics path, institutional advocacy, and the cross-border UAB relationship. The university also named me a 2026 Science Co-op Student of the Year.",
  },
  {
    date: '2023',
    title: 'Applied performance engineering',
    org: 'Arrow McLaren IndyCar',
    text: 'McMaster documents a data-and-strategy internship with McLaren Racing. That performance background still informs how I think about latency, instrumentation, and decisions under pressure.',
  },
]

const proofCards: ProofCard[] = [
  {
    source: 'UW-Madison',
    title: 'Medical Physics student profile',
    text: 'Current official listing: 2026 PhD student, advisor Dr. Ran Zhang.',
    href: 'https://medphysics.wisc.edu/graduate-program/meet-our-students/',
  },
  {
    source: 'UAB Medicine',
    title: 'AI collaboration profile',
    text: 'Official story covering the UAB collaboration, clinical AI focus, and 2024 Birmingham stay.',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  {
    source: 'McMaster Science',
    title: 'Convocation profile',
    text: 'Official graduation profile describing the McMaster path and the ambassador role between the two institutions.',
    href: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
  },
  {
    source: 'McMaster Careers',
    title: 'Science Co-op Student of the Year',
    text: 'Official award story documenting the UAB placement, the co-op award, and the Ontario nomination.',
    href: 'https://careers.science.mcmaster.ca/a-moment-worth-flying-for-udbhav-rams-extraordinary-co-op-experience/',
  },
  {
    source: 'ASTRO 2026',
    title: 'Speaker bio and current research framing',
    text: 'Conference bio summarizing the UW PhD, research topics, and AAPM poster recognition.',
    href: 'https://amportal.astro.org/udbhav-ram-bs-135368427',
  },
  {
    source: 'AAPM',
    title: 'Undergraduate poster recognition',
    text: 'AAPM newsletter coverage naming the undergraduate competition poster winner from the 2024 annual meeting.',
    href: 'https://www.aapm.org/pubs/newsletter/archive/5001.pdf',
  },
  {
    source: 'PubMed',
    title: 'Publication trail',
    text: 'Searchable publication records, abstracts, author order, affiliations, and links to full text where available.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/?term=Udbhav+S+Ram',
  },
  {
    source: 'GitHub',
    title: 'Public software record',
    text: 'Public repositories across medical imaging, simulation, and open-source contributions, including a merged OpenHands PR and a merged MONAI tutorials PR.',
    href: 'https://github.com/udiram',
  },
]

const sourceMapLinks: LinkItem[] = [
  { label: 'UW student profile', href: 'https://medphysics.wisc.edu/graduate-program/meet-our-students/' },
  { label: 'UAB collaboration profile', href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor' },
  { label: 'McMaster convocation profile', href: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/' },
  { label: 'McMaster co-op award story', href: 'https://careers.science.mcmaster.ca/a-moment-worth-flying-for-udbhav-rams-extraordinary-co-op-experience/' },
  { label: 'McMaster 2024 visiting-scholar profile', href: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/' },
  { label: 'AAPM newsletter', href: 'https://www.aapm.org/pubs/newsletter/archive/5001.pdf' },
  { label: 'AAPM 2025 abstract', href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105' },
  { label: 'AAPM 2025 6X-FFF vs 10X-FFF poster', href: 'https://aapm.confex.com/aapm/2025am/mediafile/Handout/Paper20068/AAPM2025_eposter_6X10X.pdf' },
  { label: 'ASTRO 2026 speaker page', href: 'https://amportal.astro.org/udbhav-ram-bs-135368427' },
  { label: 'PubMed publication search', href: 'https://pubmed.ncbi.nlm.nih.gov/?term=Udbhav+S+Ram' },
  { label: 'GitHub profile', href: 'https://github.com/udiram' },
  { label: 'RadKev repository', href: 'https://github.com/udiram/RadKev' },
  { label: 'MedPhysBench repository', href: 'https://github.com/udiram/MedPhysBench' },
  { label: 'VoxelWeave Designer repository', href: 'https://github.com/udiram/VoxelWeave-Designer' },
  { label: 'Glioblastoma analysis repository', href: 'https://github.com/udiram/Glioblastoma_analysis' },
  { label: 'Project MONAI contribution', href: 'https://github.com/Project-MONAI/tutorials/pull/1129' },
  { label: 'OpenHands contribution', href: 'https://github.com/OpenHands/OpenHands/pull/731' },
  { label: 'LinkedIn profile', href: 'https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine' },
  ...originalSiteLinks,
]

const hashAliases: Record<string, string> = {
  about: 'trajectory',
  path: 'trajectory',
  proof: 'recognition',
  archive: 'recognition',
  publications: 'research',
  talks: 'research',
  projects: 'work',
  sources: 'recognition',
  history: 'profile-foundations',
  motorsports: 'motorsports',
  activities: 'life',
  awards: 'recognition',
  media: 'media',
  'google-site-archive': 'recognition',
}

function collectionById(id: string) {
  const collection = portfolioCollections.find((item) => item.id === id)
  if (!collection) throw new Error(`Missing portfolio collection: ${id}`)
  return collection
}

const profileCollection = collectionById('profile-foundations')
const researchCollection = collectionById('research-record')
const engineeringCollection = collectionById('engineering-projects')
const motorsportsCollection = collectionById('motorsports')
const activitiesCollection = collectionById('activities-service')
const recognitionCollection = collectionById('recognition')
const mediaCollection = collectionById('media')

function collectionItemCount(collection: PortfolioCollection) {
  return collection.groups.reduce((total, group) => total + group.items.length, 0)
}

function Icon({ name }: { name: IconName }) {
  const icons = {
    arrow: ArrowUpRight,
    down: ArrowDown,
    mail: EnvelopeSimple,
    github: GithubLogo,
    article: Article,
    linkedin: LinkedinLogo,
    menu: List,
    close: X,
    moon: Moon,
    sun: Sun,
    code: Code,
    cube: Cube,
    pulse: Pulse,
    shield: ShieldCheck,
  }
  const Component = icons[name]

  return <Component aria-hidden="true" weight="bold" />
}

function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const opensNewTab = href.startsWith('http')

  return (
    <a className={className} href={href} target={opensNewTab ? '_blank' : undefined} rel={opensNewTab ? 'noreferrer' : undefined}>
      {children}
      {opensNewTab && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}

function ImageFrame({ image, className = '' }: { image: ImageAsset; className?: string }) {
  const isHero = className.includes('hero')

  return (
    <figure className={`image-frame ${className}`.trim()}>
      <img src={image.src} alt={image.alt} loading={isHero ? 'eager' : 'lazy'} decoding="async" fetchPriority={isHero ? 'high' : 'auto'} />
    </figure>
  )
}

function useHashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const rawHash = window.location.hash.slice(1)
      if (!rawHash) return true

      const decodedHash = decodeURIComponent(rawHash)
      const target = document.getElementById(decodedHash) ?? document.getElementById(hashAliases[decodedHash] ?? decodedHash)
      if (!target) return false

      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18
      const previousScrollBehavior = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' })
      document.documentElement.style.scrollBehavior = previousScrollBehavior

      return Math.abs(target.getBoundingClientRect().top - headerHeight - 18) < 8
    }

    const timeouts = new Set<number>()
    const scheduleScroll = () => {
      window.requestAnimationFrame(scrollToHash)

      ;[140, 420, 900].forEach((delay) => {
        const timeoutId = window.setTimeout(() => {
          scrollToHash()
          timeouts.delete(timeoutId)
        }, delay)
        timeouts.add(timeoutId)
      })
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
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
      pendingImages.forEach((image) => {
        image.removeEventListener('load', scrollToHash)
        image.removeEventListener('error', scrollToHash)
      })
    }
  }, [])
}

function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('home')

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.id)).filter((section): section is HTMLElement => Boolean(section))
    if (!sections.length) return undefined

    const setFromHash = () => {
      const rawHash = window.location.hash.slice(1)
      const sectionId = hashAliases[rawHash] ?? rawHash
      if (navItems.some((item) => item.id === sectionId)) {
        setActiveSection(sectionId as SectionId)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const nearestVisibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0]

        if (nearestVisibleSection) setActiveSection(nearestVisibleSection.target.id as SectionId)
      },
      { rootMargin: '-18% 0px -72% 0px', threshold: 0 },
    )

    setFromHash()
    sections.forEach((section) => observer.observe(section))
    window.addEventListener('hashchange', setFromHash)

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', setFromHash)
    }
  }, [])

  return activeSection
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

function Header({ activeSection, theme, onToggleTheme }: { activeSection: SectionId; theme: Theme; onToggleTheme: () => void }) {
  const nextTheme = theme === 'light' ? 'dark' : 'light'
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return undefined

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header className="site-header">
      <a className="brand" href="#home">
        <span>UR</span>
        <strong>Udbhav Ram</strong>
      </a>
      <nav aria-label="Main navigation" className={menuOpen ? 'is-open' : undefined} id="main-navigation">
        {navItems.map((item) => (
          <a aria-current={activeSection === item.id ? 'location' : undefined} href={`#${item.id}`} key={item.id} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button aria-label={`Switch to ${nextTheme} mode`} className="theme-toggle" onClick={onToggleTheme} title={`Switch to ${nextTheme} mode`} type="button">
          <Icon name={theme === 'light' ? 'moon' : 'sun'} />
        </button>
        <button aria-controls="main-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} type="button">
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero section" id="home">
      <div className="hero-copy">
        <p className="hero-kicker"><span aria-hidden="true" /> Medical physics · clinical AI · software</p>
        <h1>
          <span>Physics for AI</span>
          <span className="hero-title-accent">that meets the clinic.</span>
        </h1>
        <p className="hero-summary">{heroSummary}</p>
        <div className="hero-actions">
          <a className="button primary" href="#work">
            Selected work <Icon name="down" />
          </a>
          <a className="button secondary" href="#research">
            Research record <Icon name="arrow" />
          </a>
        </div>
      </div>
      <div className="hero-media">
        <ImageFrame image={imageAssets.heroPortrait} className="hero-image" />
        <div className="hero-figure-index" aria-hidden="true">01 / 04</div>
        <div className="hero-note" aria-label="Current position">
          <span className="status-dot" aria-hidden="true" />
          <div>
            <strong>Currently in Madison</strong>
            <p>Medical Physics PhD · advised by Dr. Ran Zhang</p>
          </div>
        </div>
      </div>
      <a className="hero-scroll" href="#work">
        Scroll to the work <Icon name="down" />
      </a>
    </section>
  )
}

function ProfileStrip() {
  return (
    <section className="profile-strip section" aria-label="Quick profile">
      <dl className="hero-snapshot">
        {heroSnapshots.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Work() {
  return (
    <section className="section work-section" id="work">
      <SectionIntro
        title="Selected work"
        text="Three clinical studies show the through-line: local AI with an explicit review boundary, planning tied to dosimetric evidence, and segmentation evaluated by both metrics and physicians."
        action={
          <ExternalLink href="https://github.com/udiram" className="text-link">
            GitHub <Icon name="arrow" />
          </ExternalLink>
        }
      />
      <div className="story-list">
        {selectedWork.map((story, index) => (
          <article className={`story-card ${index % 2 === 1 ? 'is-reversed' : ''}`} key={story.title}>
            <div className="story-media">
              <ImageFrame image={story.image} />
              <span className="story-index" aria-hidden="true">0{index + 1}</span>
            </div>
            <div className="story-copy">
              <span>{story.strap}</span>
              <h3>{story.title}</h3>
              <p>{story.text}</p>
              <dl className="story-evidence" aria-label={`${story.title} study details`}>
                {story.evidence.map((item) => (
                  <div key={item.label}>
                    <dt>{item.value}</dt>
                    <dd>{item.label}</dd>
                  </div>
                ))}
              </dl>
              <nav className="story-links" aria-label={`${story.title} links`}>
                {story.links.map((link) => (
                  <ExternalLink className="inline-link" href={link.href} key={link.href}>
                    {link.label} <Icon name="arrow" />
                  </ExternalLink>
                ))}
              </nav>
            </div>
          </article>
        ))}
      </div>
      <CurrentBuilds />
      <ContentExplorer
        className="engineering-explorer"
        collection={engineeringCollection}
        intro="The engineering practice extends beyond the three clinical case studies, from robotics and full-stack systems to autonomous driving, biotechnology, and STEM outreach."
        title="Engineering beyond the selected work"
      />
    </section>
  )
}

function CurrentBuilds() {
  return (
    <section aria-labelledby="current-builds-title" className="current-builds">
      <header className="feature-heading builds-heading">
        <div>
          <span>Open workbench · verified 05 Oct 2026</span>
          <h3 id="current-builds-title">What is moving now</h3>
        </div>
        <p>Public repositories show the current direction. Each description states the practical boundary because active research should not read like a finished clinical product.</p>
      </header>
      <div className="build-ledger">
        {currentBuilds.map((build, index) => (
          <ExternalLink className={`build-entry ${index === 0 ? 'is-featured' : ''}`} href={build.href} key={build.name}>
            <div className="build-entry-icon"><Icon name={build.icon} /></div>
            <div className="build-entry-main">
              <span>{build.type}</span>
              <h4>{build.name}</h4>
              <p>{build.description}</p>
            </div>
            <div className="build-entry-meta">
              <strong>{build.status}</strong>
              <small>{build.boundary}</small>
              <b>Open repository <Icon name="arrow" /></b>
            </div>
          </ExternalLink>
        ))}
      </div>
    </section>
  )
}

function Research() {
  return (
    <section className="section research-section" id="research">
      <SectionIntro
        title="Research record"
        text="The published and presented work is concentrated in radiation oncology AI, image segmentation, adaptive radiotherapy, and workflow validation rather than generic AI-for-health claims."
        action={
          <ExternalLink href="https://pubmed.ncbi.nlm.nih.gov/?term=Udbhav+S+Ram" className="text-link">
            PubMed record <Icon name="arrow" />
          </ExternalLink>
        }
      />
      <div className="research-hero">
        <ImageFrame image={imageAssets.heroCollage} className="research-collage" />
        <div className="research-summary">
          <h3>What ties the papers together</h3>
          <p>The consistent question is whether automation can improve clinical work without making the workflow less legible. That shows up in naming QA, segmentation, planning validation, and follow-up imaging.</p>
        </div>
      </div>
      <div className="publication-ledger" id="publications">
        {publications.map((item) => (
          <ExternalLink className="publication-item" href={item.href} key={item.title}>
            <span>{item.year}</span>
            <strong>{item.title}</strong>
            <em>{item.venue}</em>
            <p>{item.note}</p>
              <b>
                Read paper <Icon name="arrow" />
              </b>
          </ExternalLink>
        ))}
      </div>
      <div className="research-talks">
        <div className="research-talks-intro">
          <h3>Selected talks and posters</h3>
          <p>Conference work ranges from early imaging and dose-delivery studies to current clinical AI and adaptive-radiotherapy projects.</p>
        </div>
        <div className="timeline-ledger" id="talks">
          {talkTimeline.map((item) => (
            <article key={item.href ?? `${item.date}-${item.event}`}>
              <span>{item.date}</span>
              <div>
                <strong>{item.event}</strong>
                <p>{item.detail}</p>
                {item.href ? (
                  <ExternalLink className="inline-link" href={item.href}>
                    View reference <Icon name="arrow" />
                  </ExternalLink>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
      <ContentExplorer
        className="research-explorer"
        collection={researchCollection}
        intro="Browse the complete research record by affiliation, project, presentation, or open-source contribution."
        title="The broader research record"
      />
    </section>
  )
}

function Path() {
  return (
    <section className="section path-section" id="trajectory">
      <SectionIntro
        title="The path here"
        text="The route crosses medical physics, radiation oncology, open-source imaging, and motorsports data. The common thread is software that stays legible under real review, timing, and workflow constraints."
      />
      <div className="path-layout">
        <div className="path-summary">
          <h3>The through-line</h3>
          <p>I have moved between academic medical physics, hospital-facing radiation oncology collaboration, open-source imaging software, and motorsports data work. The work looks broad on paper, but the habit is consistent: build systems that stay understandable when they matter.</p>
          <div className="institution-band" aria-label="Core institutions">
            <div className="institution-chip">
              <img src={imageAssets.uwMadisonLogo.src} alt={imageAssets.uwMadisonLogo.alt} />
              <strong>UW-Madison</strong>
            </div>
            <div className="institution-chip">
              <img src={imageAssets.mcmasterLogo.src} alt={imageAssets.mcmasterLogo.alt} />
              <strong>McMaster</strong>
            </div>
            <div className="institution-chip text-only">
              <strong>UAB Radiation Oncology</strong>
            </div>
            <div className="institution-chip text-only">
              <strong>Arrow McLaren</strong>
            </div>
          </div>
        </div>
        <div className="timeline-ledger">
          {pathTimeline.map((item) => (
            <article key={`${item.date}-${item.title}`}>
              <span>{item.date}</span>
              <div>
                <strong>{item.title}</strong>
                <em>{item.org}</em>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ContentExplorer
        className="profile-explorer"
        collection={profileCollection}
        intro="Earlier roles, working strengths, active research themes, and goals provide context for the current doctoral chapter without being mistaken for current credentials."
        title="What built the current practice"
      />
      <Motorsports />
    </section>
  )
}

function RecordItemCard({ item }: { item: RecordItem }) {
  const content = (
    <>
      {item.meta ? <span>{item.meta}</span> : null}
      <strong>{item.title}</strong>
      {item.detail ? <p>{item.detail}</p> : null}
      {item.note ? <small>{item.note}</small> : null}
      {item.href ? (
        <b>
          Open reference <Icon name="arrow" />
        </b>
      ) : null}
    </>
  )

  if (item.href) {
    return (
      <ExternalLink className="record-item has-link" href={item.href}>
        {content}
      </ExternalLink>
    )
  }

  return <article className="record-item">{content}</article>
}

function ContentExplorer({
  collection,
  title,
  intro,
  className = '',
}: {
  collection: PortfolioCollection
  title: string
  intro: string
  className?: string
}) {
  const [activeGroup, setActiveGroup] = useState(0)
  const itemCount = collectionItemCount(collection)
  const needsHistoricalContext = collection.id === 'profile-foundations' || collection.id === 'recognition'

  return (
    <section aria-labelledby={`${collection.id}-title`} className={`content-explorer ${className}`.trim()} id={collection.id}>
      <header className="explorer-header">
        <div>
          <h3 id={`${collection.id}-title`}>{title}</h3>
          <p>{intro}</p>
        </div>
        <div className="explorer-count" aria-label={`${itemCount} items in this section`}>
          <strong>{itemCount}</strong>
          <span>items</span>
        </div>
      </header>

      <div className="explorer-shell">
        {collection.groups.length > 1 ? (
          <div aria-label={`${title} categories`} className="explorer-tabs">
            {collection.groups.map((group, index) => (
              <button
                aria-controls={`${collection.id}-panel-${index}`}
                aria-expanded={activeGroup === index}
                className={activeGroup === index ? 'is-active' : undefined}
                id={`${collection.id}-tab-${index}`}
                key={group.title}
                onClick={() => setActiveGroup(index)}
                type="button"
              >
                <strong>{group.title}</strong>
                <span>{group.items.length}</span>
              </button>
            ))}
          </div>
        ) : null}

        <div className="explorer-panels">
          {collection.groups.map((group, index) => (
            <section
              aria-labelledby={collection.groups.length > 1 ? `${collection.id}-tab-${index}` : undefined}
              className="explorer-panel"
              hidden={activeGroup !== index}
              id={`${collection.id}-panel-${index}`}
              key={group.title}
            >
              <h4>{group.title}</h4>
              <div className="record-grid">
                {group.items.map((item) => (
                  <RecordItemCard item={item} key={`${item.title}-${item.meta ?? ''}`} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {needsHistoricalContext ? (
        <p className="context-note">Time-bound goals, credentials, and recognition are retained with their original context. A historical listing is not presented as a current credential, and mentor or employer awards remain attributed to their recipients.</p>
      ) : null}
    </section>
  )
}

function Motorsports() {
  const items = motorsportsCollection.groups.flatMap((group) => group.items)
  const images = [imageAssets.arrowMcLaren, imageAssets.macFormulaSae, imageAssets.formulaLgb, imageAssets.vwPoloCup]

  return (
    <section aria-labelledby="motorsports-title" className="motorsports-feature" id="motorsports">
      <div className="feature-heading">
        <h3 id="motorsports-title">Performance engineering under pressure</h3>
        <p>{motorsportsCollection.summary}</p>
      </div>
      <div className="motorsports-grid">
        {items.map((item, index) => (
          <article className="motorsport-card record-item" key={item.title}>
            <ImageFrame image={images[index]} />
            <div>
              {item.meta ? <span>{item.meta}</span> : null}
              <strong>{item.title}</strong>
              {item.detail ? <p>{item.detail}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Life() {
  return (
    <section className="section life-section" id="life">
      <SectionIntro
        title="Beyond the lab"
        text="Clinical exposure and service sit alongside teaching, robotics, sport, flight training, and a long musical practice. Together they explain the range without reducing it to a list of hobbies."
      />
      <ContentExplorer
        className="life-explorer"
        collection={activitiesCollection}
        intro="Move between service, instruction and sport, and music. Every item from the earlier public record is retained with time-sensitive claims labelled carefully."
        title="Service, sport, and music"
      />
    </section>
  )
}

function MediaGrid() {
  const items = mediaCollection.groups.flatMap((group) => group.items)
  const images = [imageAssets.visitingScholar, imageAssets.coopAward, imageAssets.convocation, imageAssets.uabMentor, imageAssets.uabEmployerAward, imageAssets.employerAwards]

  return (
    <section aria-labelledby="media-title" className="media-feature" id="media">
      <div className="feature-heading">
        <h3 id="media-title">Profiles and institutional coverage</h3>
        <p>{mediaCollection.summary}</p>
      </div>
      <div className="media-grid">
        {items.map((item, index) => (
          <ExternalLink className="media-card record-item" href={item.href ?? mediaCollection.source} key={item.title}>
            <ImageFrame image={images[index]} />
            <div>
              {item.meta ? <span>{item.meta}</span> : null}
              <strong>{item.title}</strong>
              {item.detail ? <p>{item.detail}</p> : null}
              <b>Read profile <Icon name="arrow" /></b>
            </div>
          </ExternalLink>
        ))}
      </div>
    </section>
  )
}

function Recognition() {
  return (
    <section className="section proof-section" id="recognition">
      <SectionIntro
        title="The public record"
        text="Awards, certifications, institutional profiles, publications, conference records, and public code are presented together with clear ownership and direct references."
      />
      <div className="proof-hero">
        <ImageFrame image={imageAssets.coopAward} />
        <div>
          <span>Documented recognition</span>
          <h3>The record is broad, but the ownership is precise.</h3>
          <p>Personal honors, training, mentor recognition, media profiles, and public research evidence stay distinct so a reader can understand what each item actually represents.</p>
        </div>
      </div>
      <div className="proof-grid" id="sources">
        {proofCards.map((item) => (
          <ExternalLink className="proof-card" href={item.href} key={item.title}>
            <span>{item.source}</span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
              <b>
                Open reference <Icon name="arrow" />
              </b>
          </ExternalLink>
        ))}
      </div>
      <ContentExplorer
        className="recognition-explorer"
        collection={recognitionCollection}
        intro="Browse research and institutional recognition, earlier academic and service credentials, and arts, mentoring, and competition results."
        title="The complete recognition record"
      />
      <MediaGrid />
      <details className="reference-drawer content-drawer">
        <summary>Reference map <span>{sourceMapLinks.length} public links used across the site</span></summary>
        <nav className="source-links" aria-label="Reference map">
          {sourceMapLinks.map((item) => (
            <ExternalLink href={item.href} key={item.href}>
              {item.label} <Icon name="arrow" />
            </ExternalLink>
          ))}
        </nav>
      </details>
    </section>
  )
}

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim()
    const cleanMessage = message.trim()
    const subject = encodeURIComponent(`Portfolio inquiry from ${cleanName || 'site visitor'}`)
    const body = encodeURIComponent(`${cleanMessage}\n\nFrom: ${cleanName}\nEmail: ${cleanEmail}`)
    window.location.href = `mailto:ramu@mcmaster.ca?subject=${subject}&body=${body}`
  }

  return (
    <section className="contact-section section" id="contact">
      <div>
        <span className="contact-kicker">Have a difficult problem?</span>
        <h2>Let’s make it legible.</h2>
        <p>I’m glad to hear about research collaborations, medical-physics work, clinical AI tooling, or software systems that have to hold up under real constraints.</p>
        <nav className="social-links" aria-label="Contact links">
          {socialItems.map((item) => (
            <ExternalLink className="social-link" href={item.href} key={item.label}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </ExternalLink>
          ))}
        </nav>
      </div>
      <form onSubmit={submit}>
        <label>
          Name
          <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Email
          <input autoComplete="email" inputMode="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="message-field">
          Message
          <textarea minLength={12} required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} />
        </label>
        <button className="button primary" type="submit">
          Open email draft <Icon name="mail" />
        </button>
        <p className="form-note">This opens your default mail app. The address shown is the public correspondence address used in my research record.</p>
      </form>
    </section>
  )
}

function App() {
  useHashScroll()
  const activeSection = useActiveSection()
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem(themeStorageKey, theme)
    } catch {
      // Theme persistence is optional when storage is unavailable.
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#11120f' : '#f2efe7')
  }, [theme])

  return (
    <div className="portfolio-site" data-theme={theme}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header activeSection={activeSection} onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))} theme={theme} />
      <main data-portfolio-items={portfolioItemCount} id="main-content" tabIndex={-1}>
        <Hero />
        <ProfileStrip />
        <Work />
        <Research />
        <Path />
        <Life />
        <Recognition />
        <Contact />
      </main>
      <footer className="site-footer">
        <span>© {currentYear} Udbhav Ram</span>
        <a href="#home">Medical physics · clinical AI · accountable software <Icon name="arrow" /></a>
      </footer>
    </div>
  )
}

export default App
