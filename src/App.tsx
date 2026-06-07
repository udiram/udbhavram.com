import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import './App.css'

type SectionId = 'home' | 'research' | 'projects' | 'media' | 'performance' | 'leadership' | 'archive' | 'contact'

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

type ResearchCase = {
  title: string
  status: string
  role: string
  institution: string
  tags: string[]
  problem: string
  method: string
  impact: string
  result: string
  href?: string
  image: ImageAsset
}

type ProjectItem = {
  title: string
  category: string
  status: string
  problem: string
  solution: string
  stack: string[]
  href?: string
  image: ImageAsset
}

type TimelineItem = {
  year: string
  title: string
  text: string
  tone: 'mcmaster' | 'uab' | 'aapm' | 'uw' | 'performance'
}

type ArchiveItem = {
  title: string
  text: string
  meta: string
  href?: string
  image: ImageAsset
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
  employerAwardAlt: {
    src: '/assets/sourced/uab-employer-award-2.jpg',
    alt: 'McMaster and UAB employer award presentation group photo',
    source: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award',
  },
  employerAwards: {
    src: '/assets/sourced/mcmaster-employer-awards-hero.jpg',
    alt: 'McMaster Science employer of the year award photo',
    source: 'https://careers.science.mcmaster.ca/recognizing-excellence-in-science-2024-co-op-employer-of-the-year-awards/',
  },
  employerAwardsUdi: {
    src: '/assets/sourced/mcmaster-employer-awards-udi.jpg',
    alt: 'Udbhav Ram with Sean Van Koughnett at the McMaster Science employer awards',
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
  githubProfile: {
    src: '/assets/sourced/github-profile.jpg',
    alt: 'Udbhav Ram GitHub profile image',
    source: 'https://github.com/udiram',
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
  spsPoster: {
    src: '/assets/sourced/screens/aapm-2024-ethos-page.png',
    alt: 'AAPM 2024 Ethos SRS source page connected to the SPS poster recognition',
    source: 'https://www.aapm.org/pubs/newsletter/archive/5001.pdf',
  },
  originalResearch: {
    src: '/assets/sourced/screens/google-site-research-page.png',
    alt: 'Original Google Site research archive page',
    source: 'https://sites.google.com/view/udbhav-ram/research',
  },
  originalActivities: {
    src: '/assets/sourced/screens/google-site-activities-page.png',
    alt: 'Original Google Site activities archive page',
    source: 'https://sites.google.com/view/udbhav-ram/activities',
  },
  mcmasterScience: {
    src: '/assets/sourced/mcmaster-science.png',
    alt: 'McMaster Science official site image',
    source: 'https://science.mcmaster.ca/',
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
  western: {
    src: '/assets/sourced/western-university.jpg',
    alt: 'Western University official site image',
    source: 'https://www.uwo.ca/',
  },
  lawson: {
    src: '/assets/sourced/screens/lawson-research-page.png',
    alt: 'Lawson Research Institute official page screenshot',
    source: 'https://www.lawsonresearch.ca/',
  },
  arrowMcLaren: {
    src: '/assets/sourced/screens/arrow-mclaren-page.png',
    alt: 'Arrow McLaren IndyCar official page screenshot',
    source: 'https://www.mclaren.com/racing/indycar/',
  },
  videoOne: {
    src: '/assets/sourced/yt-7JgRKwVRkEo.jpg',
    alt: 'YouTube research video thumbnail',
    source: 'https://youtu.be/7JgRKwVRkEo',
  },
  videoTwo: {
    src: '/assets/sourced/yt-I0ESYlp85Rk.jpg',
    alt: 'YouTube research video thumbnail',
    source: 'https://youtu.be/I0ESYlp85Rk',
  },
  videoThree: {
    src: '/assets/sourced/yt-xW7umxU6NSM.jpg',
    alt: 'YouTube research video thumbnail',
    source: 'https://youtu.be/xW7umxU6NSM',
  },
  videoFour: {
    src: '/assets/sourced/yt-8IKr1QauMGc.jpg',
    alt: 'YouTube archive video thumbnail',
    source: 'https://youtu.be/8IKr1QauMGc',
  },
  videoFive: {
    src: '/assets/sourced/yt-A7_TRUWW6EI.jpg',
    alt: 'YouTube archive video thumbnail',
    source: 'https://youtu.be/A7_TRUWW6EI',
  },
} satisfies Record<string, ImageAsset>

const navItems: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'media', label: 'Media' },
  { id: 'performance', label: 'Performance' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'archive', label: 'CV' },
  { id: 'contact', label: 'Contact' },
]

const socialLinks: LinkItem[] = [
  { label: 'Email', href: 'mailto:ramu@mcmaster.ca' },
  { label: 'LinkedIn', href: 'https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine' },
  { label: 'GitHub', href: 'https://github.com/udiram' },
  { label: 'Google Scholar', href: 'https://scholar.google.com/scholar?q=%22Udbhav+Ram%22' },
  { label: 'Medium', href: 'https://medium.com/@udbhavram41' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCTn6NYNbV55T4zs9v1nHOwA' },
]

const resumeHref = '/assets/Udbhav_Ram_resume.pdf'

const proofLinks: LinkItem[] = [
  {
    label: 'McMaster profile',
    href: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/',
    meta: 'International visiting scholar profile',
    image: imageAssets.mcmasterScholar,
  },
  {
    label: 'UAB profile',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
    meta: 'AI and radiation oncology feature',
    image: imageAssets.uabMentor,
  },
  {
    label: 'Co-op award',
    href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
    meta: 'Science Co-op Student of the Year',
    image: imageAssets.coopAward,
  },
  {
    label: 'Original archive',
    href: 'https://sites.google.com/view/udbhav-ram/home',
    meta: 'Full legacy Google Site archive',
    image: imageAssets.originalResearch,
  },
]

const metrics = [
  ['2', 'peer-reviewed papers'],
  ['5+', 'conference abstracts'],
  ['4', 'AAPM/COMP presentations'],
  ['2', 'poster awards'],
  ['UAB/McMaster', 'international scholar'],
  ['MONAI', 'open-source contributor'],
]

const heroChips = [
  'AAPM award-winning researcher',
  'UAB/McMaster international scholar',
  'AI + clinical workflow + motorsport systems',
]

const researchCases: ResearchCase[] = [
  {
    title: 'Online adaptive APBI interobserver variability',
    status: 'Submitted',
    role: 'Analyst / collaborator',
    institution: 'UAB Radiation Oncology',
    tags: ['Radiation Oncology', 'OART', 'CBCT', 'Contouring'],
    problem: 'Adaptive partial breast workflows depend on contours that must be fast, reproducible, and clinically reviewable.',
    method: 'Compared interobserver variation across Ethos adaptive APBI structures and reviewed how contour decisions propagate into treatment planning.',
    impact: 'Frames contour variability as a workflow reliability problem, not just a segmentation metric.',
    result: 'Submitted to IJROBP',
    image: imageAssets.uabRadonc,
  },
  {
    title: 'Ethos 2.0 high-fidelity SRS validation',
    status: 'Published',
    role: 'Research author / analyst',
    institution: 'UAB',
    tags: ['SRS', 'Ethos', 'TPS Validation', 'Automation'],
    problem: 'Multi-met single-isocentre SRS needs fast planning without quietly losing dosimetric quality.',
    method: 'Validated Ethos 2.0 high-fidelity planning with semi-automated comparative analysis and treatment-planning review.',
    impact: 'Turns a planning-system upgrade into measurable evidence for clinical deployment decisions.',
    result: 'JACMP 2025',
    href: 'https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/acm2.70370',
    image: imageAssets.aapm2024Ethos,
  },
  {
    title: 'LLM agents for clinical workflow automation',
    status: 'Active',
    role: 'Developer / researcher',
    institution: 'UAB + McMaster',
    tags: ['LLMs', 'Clinical UI', 'TG-263', 'Local AI'],
    problem: 'Clinical teams need automation that is local, auditable, and easy to override.',
    method: 'Built local LLM review flows for target-name compliance, interface automation, and clinical workflow checks.',
    impact: 'Connects model behavior to visible clinical operations instead of treating AI as a black box.',
    result: 'AAPM 2025 Blue Ribbon Poster',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
    image: imageAssets.aapm2025,
  },
]

const researchArchive: ArchiveItem[] = [
  {
    title: 'Assessing quantitative performance and expert review of deep learning frameworks for CT abdominal organ auto-segmentation',
    text: 'Paper comparing deep learning frameworks for abdominal organ segmentation.',
    meta: '2025, Intelligent Oncology',
    href: 'https://doi.org/10.1016/j.intonc.2025.03.003',
    image: imageAssets.aapm2024Automl,
  },
  {
    title: 'Improving TG-263 target name compliance using locally hosted large language models',
    text: 'Blue Ribbon Poster on locally hosted LLMs for radiation oncology target-name compliance.',
    meta: '2025, AAPM',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
    image: imageAssets.aapm2025,
  },
  {
    title: 'TrueBeam SBRT commissioning',
    text: 'Multi-institution commissioning comparison of 6X and 10X FFF beams for SBRT using Eclipse TPS.',
    meta: 'JCC + UAB',
    image: imageAssets.uabClinic,
  },
  {
    title: 'Nutrition and amyloid aggregation',
    text: 'Biophysics work on food ingredient effects on amyloid-beta aggregation in synthetic brain membranes.',
    meta: '2020, Molecular Nutrition & Food Research',
    href: 'https://doi.org/10.1002/mnfr.202000632',
    image: imageAssets.mcmasterPhysics,
  },
]

const researchFilters = ['All', 'Radiation Oncology', 'AI/ML', 'Adaptive RT', 'LLMs', 'SRS/SBRT', 'Publications']

const projects: ProjectItem[] = [
  {
    title: 'AAPM 2026 Explorer',
    category: 'Clinical AI tools',
    status: 'Live',
    problem: 'AAPM conference content is dense, time-sensitive, and hard to search on mobile.',
    solution: 'Conference browser for abstracts, sessions, authors, institutions, favorites, and schedule workflows.',
    stack: ['Flask', 'SQLAlchemy', 'Railway', 'Search', 'Mobile UI'],
    image: imageAssets.aapm2025,
  },
  {
    title: 'Consigliere journaling app',
    category: 'Web apps',
    status: 'Prototype',
    problem: 'Personal reflection tools often stop at notes instead of extracting useful follow-up signals.',
    solution: 'Full-stack journaling product with auth, friends, scheduler, email, and Gemini summarization.',
    stack: ['React', 'Auth', 'Mailjet', 'Gemini', 'Scheduler'],
    image: imageAssets.githubProfile,
  },
  {
    title: 'Clinical UI automation benchmark',
    category: 'Clinical AI tools',
    status: 'Research',
    problem: 'VLM agents need objective tests before they can be trusted around clinical interfaces.',
    solution: 'Benchmark table and model-comparison harness for clinical UI actions and review tasks.',
    stack: ['Python', 'VLMs', 'Evaluation', 'Playwright'],
    image: imageAssets.uabClinic,
  },
  {
    title: 'TG-263 local LLM tool',
    category: 'Clinical AI tools',
    status: 'Research',
    problem: 'Target-name drift creates review burden and plan-documentation risk.',
    solution: 'Local LLM naming-compliance interface that shows proposed changes and keeps reviewer control.',
    stack: ['Local LLM', 'TG-263', 'Radiation Oncology', 'Review UI'],
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
    image: imageAssets.aapm2025,
  },
  {
    title: 'Motorsport strategy simulations',
    category: 'Motorsport analytics',
    status: 'Built',
    problem: 'Race strategy depends on fast decisions under noisy, high-stakes telemetry conditions.',
    solution: 'Deterministic race-session simulation and telemetry review work from Arrow McLaren and Formula SAE contexts.',
    stack: ['Simulation', 'Telemetry', 'ODE models', 'Dashboards'],
    image: imageAssets.arrowMcLaren,
  },
  {
    title: 'Open-source medical AI contributions',
    category: 'Open source',
    status: 'Merged',
    problem: 'Research tooling improves faster when examples and docs stay reproducible.',
    solution: 'Public contributions to MONAI tutorials and OpenHands engineering workflows.',
    stack: ['MONAI', 'OpenHands', 'GitHub', 'Docs'],
    href: 'https://github.com/Project-MONAI/tutorials/pull/1129',
    image: imageAssets.monaiPr,
  },
]

const projectCategories = ['All', 'Clinical AI tools', 'Web apps', 'Motorsport analytics', 'Open source']

const timeline: TimelineItem[] = [
  {
    year: 'McMaster',
    title: 'Medical and Biological Physics foundation',
    text: 'Built the base across medical physics, computational research, biophysics, and engineering-adjacent project work.',
    tone: 'mcmaster',
  },
  {
    year: 'UAB',
    title: 'International radiation oncology collaboration',
    text: 'Joined UAB Radiation Oncology as an international visiting scholar focused on clinical AI and adaptive workflows.',
    tone: 'uab',
  },
  {
    year: 'AAPM',
    title: 'Research visibility and poster recognition',
    text: 'Presented Ethos SRS, AutoML segmentation, and locally hosted LLM work across AAPM and COMP.',
    tone: 'aapm',
  },
  {
    year: 'UW',
    title: 'Medical physics PhD direction',
    text: 'Next direction: clinical AI, medical physics, and translational systems for radiation oncology.',
    tone: 'uw',
  },
  {
    year: 'Track',
    title: 'Performance engineering lens',
    text: 'Arrow McLaren and Formula SAE work turned telemetry, simulation, and real-time decisions into a durable systems mindset.',
    tone: 'performance',
  },
]

const mediaItems: ArchiveItem[] = [
  {
    title: 'McMaster student and UAB mentor drive changes in medicine through AI',
    text: 'UAB feature on the McMaster-UAB collaboration and AI projects in radiation treatment and planning.',
    meta: 'UAB Heersink School of Medicine',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
    image: imageAssets.uabMentor,
  },
  {
    title: 'Udbhav Ram\'s co-op supervisors flew in from Alabama to give him an award',
    text: 'McMaster profile on the UAB radiation oncology collaboration and Science Co-op Student of the Year recognition.',
    meta: 'McMaster Daily News',
    href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
    image: imageAssets.coopAward,
  },
  {
    title: 'McMaster-UAB international visiting scholar',
    text: 'Profile on becoming an international visiting scholar and building the institutional research connection.',
    meta: 'McMaster Daily News',
    href: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/',
    image: imageAssets.mcmasterScholar,
  },
  {
    title: 'Carlos Cardenas receives McMaster Co-op Emerging Employer of the Year Award',
    text: 'UAB article on the McMaster employer award connected to mentorship and the international co-op research experience.',
    meta: 'UAB',
    href: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award',
    image: imageAssets.employerAward,
  },
  {
    title: 'Convocation countdown with Udbhav Ram',
    text: 'McMaster Science profile covering academic path, research direction, and next steps.',
    meta: 'McMaster Science',
    href: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
    image: imageAssets.convocation,
  },
  {
    title: 'Recognizing Excellence in Science 2024 Co-op Employer of the Year Awards',
    text: 'McMaster Science careers coverage of the co-op employer award ecosystem.',
    meta: 'McMaster Science',
    href: 'https://careers.science.mcmaster.ca/recognizing-excellence-in-science-2024-co-op-employer-of-the-year-awards/',
    image: imageAssets.employerAwards,
  },
]

const performanceItems: ArchiveItem[] = [
  {
    title: 'Arrow McLaren / McLaren Racing',
    text: 'Data and strategy internship in Indianapolis with deterministic simulation, race-weekend tools, telemetry review, and car-performance context.',
    meta: 'Race strategy + performance engineering',
    image: imageAssets.arrowMcLaren,
  },
  {
    title: 'McMaster Formula SAE Electric',
    text: 'Vehicle controls, custom dashboards, software engineering, and electric race-car systems support.',
    meta: 'Vehicle software',
    image: imageAssets.arrowMcLaren,
  },
  {
    title: 'Formula LGB 1300',
    text: 'Test and development driver work with Momentum Motorsports.',
    meta: 'Driver development',
    image: imageAssets.videoTwo,
  },
  {
    title: 'VW Polo Cup / MRF',
    text: 'Track testing at Madras International Circuit with driver-development context.',
    meta: 'Track testing',
    image: imageAssets.videoFive,
  },
]

const leadershipGroups = [
  {
    title: 'Leadership & community',
    items: ['UAB Hindu YUVA', 'McMaster Hindu YUVA', 'Student ambassador work', 'Mentoring and co-op support', 'STEM outreach'],
  },
  {
    title: 'Clinical & research exposure',
    items: ['Clinical shadowing', 'Radiation oncology', 'Medical imaging', 'Hospital volunteering'],
  },
  {
    title: 'Technical builder identity',
    items: ['Software engineering', 'Robotics', 'DevOps', 'Full-stack development'],
  },
  {
    title: 'Exploration & discipline',
    items: ['Scuba diving', 'Equestrian sports', 'Flight training', 'Yoga instruction'],
  },
  {
    title: 'Music & classical training',
    items: ['Western classical violin', 'Piano', 'Carnatic violin', 'Carnatic vocal'],
  },
]

const awards: ArchiveItem[] = [
  {
    title: 'AAPM Blue Ribbon Poster',
    text: 'Improving TG-263 target name compliance using locally hosted LLMs.',
    meta: '2025',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
    image: imageAssets.aapm2025,
  },
  {
    title: 'McMaster Science Co-op Student of the Year',
    text: 'Recognized for UAB radiation oncology research and international collaboration.',
    meta: '2026',
    href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
    image: imageAssets.coopAward,
  },
  {
    title: 'Society of Physics Students poster recognition',
    text: 'Undergraduate poster recognition around Ethos 2.0 SRS work.',
    meta: '2024',
    href: 'https://www.aapm.org/pubs/newsletter/archive/5001.pdf',
    image: imageAssets.spsPoster,
  },
  {
    title: 'CUPC Overall Winner and Best Talk',
    text: 'Optimizing dose delivery during fractionated radiotherapy.',
    meta: '2023',
    image: imageAssets.mcmasterPhysics,
  },
  {
    title: 'UAB-McMaster Ambassador',
    text: 'Supported institutional partnership and student advising around the UAB-McMaster research path.',
    meta: '2025',
    image: imageAssets.mcmasterScholar,
  },
  {
    title: 'Ethos Adaptive Radiotherapy certification',
    text: 'Clinical systems training connected to adaptive radiotherapy workflows.',
    meta: 'Certification',
    image: imageAssets.uabRadonc,
  },
]

const allExternalLinks: LinkItem[] = [
  ...socialLinks,
  ...proofLinks,
  ...researchCases
    .filter((item) => item.href)
    .map((item) => ({ label: item.title, href: item.href as string, meta: item.result, image: item.image })),
  ...researchArchive
    .filter((item) => item.href)
    .map((item) => ({ label: item.title, href: item.href as string, meta: item.meta, image: item.image })),
  ...projects
    .filter((item) => item.href)
    .map((item) => ({ label: item.title, href: item.href as string, meta: item.status, image: item.image })),
  ...mediaItems.map((item) => ({ label: item.title, href: item.href as string, meta: item.meta, image: item.image })),
  ...awards
    .filter((item) => item.href)
    .map((item) => ({ label: item.title, href: item.href as string, meta: item.meta, image: item.image })),
]

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h10.5M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  )
}

function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target={href.startsWith('#') ? undefined : '_blank'} rel={href.startsWith('#') ? undefined : 'noreferrer'}>
      {children}
    </a>
  )
}

function Icon({ name }: { name: 'arrow' | 'book' | 'code' | 'download' | 'external' | 'filter' | 'grid' | 'home' | 'mail' | 'microscope' | 'pause' | 'play' | 'profile' | 'search' | 'spark' | 'trophy' }) {
  const paths: Record<string, ReactNode> = {
    arrow: <path d="M4 10h10.5M10.5 5.5 15 10l-4.5 4.5" />,
    book: <path d="M5 4.5h8.5A2.5 2.5 0 0 1 16 7v9.5H7A2 2 0 0 1 5 14.5v-10Zm0 0v10M8 8h5M8 11h4" />,
    code: <><path d="m7.5 6-4 4 4 4" /><path d="m12.5 6 4 4-4 4" /></>,
    download: <><path d="M10 3v9" /><path d="m6.5 8.5 3.5 3.5 3.5-3.5" /><path d="M4 16h12" /></>,
    external: <><path d="M7 5H5v10h10v-2" /><path d="M10 4h6v6" /><path d="m9 11 7-7" /></>,
    filter: <><path d="M4 6h12" /><path d="M7 10h6" /><path d="M9 14h2" /></>,
    grid: <><path d="M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z" /></>,
    home: <><path d="m3 10 7-6 7 6" /><path d="M5 9v7h10V9" /></>,
    mail: <><path d="M3.5 5.5h13v9h-13z" /><path d="m4 6 6 5 6-5" /></>,
    microscope: <><path d="M8 4h4M10 4v6M7 16h8M9 10l-3 5M11 10l3 5" /><path d="M8.5 7.5h3v3h-3z" /></>,
    pause: <><path d="M7 5v10M13 5v10" /></>,
    play: <path d="M7 5.5 15 10l-8 4.5v-9Z" />,
    profile: <><path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M4.5 16c.9-3 2.8-4.5 5.5-4.5s4.6 1.5 5.5 4.5" /></>,
    search: <><circle cx="8.5" cy="8.5" r="4.5" /><path d="m12 12 4 4" /></>,
    spark: <><path d="M10 3v4M10 13v4M3 10h4M13 10h4" /><path d="m5.8 5.8 2 2M12.2 12.2l2 2M14.2 5.8l-2 2M7.8 12.2l-2 2" /></>,
    trophy: <><path d="M7 4h6v4a3 3 0 0 1-6 0V4Z" /><path d="M7 6H4.5A2.5 2.5 0 0 0 7 10M13 6h2.5A2.5 2.5 0 0 1 13 10M10 11v4M7 16h6" /></>,
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function ImagePlate({ image, className = '' }: { image: ImageAsset; className?: string }) {
  const isPriority = className.includes('hero-portrait')

  return (
    <figure className={`image-plate ${className}`.trim()}>
      <img src={image.src} alt={image.alt} loading={isPriority ? 'eager' : 'lazy'} />
    </figure>
  )
}

function SectionHeader({ title, text, align = 'default' }: { title: string; text: string; align?: 'default' | 'split' }) {
  return (
    <div className={`section-header ${align}`}>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  )
}

function ContactLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'contact-links compact' : 'contact-links'} aria-label="Contact and profile links">
      {socialLinks.slice(0, compact ? 4 : socialLinks.length).map((item) => (
        <ExternalLink href={item.href} key={item.label}>
          {item.label}
          <Arrow />
        </ExternalLink>
      ))}
    </div>
  )
}

function AnimatedMetric({ value }: { value: string }) {
  const ref = useRef<HTMLElement | null>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const numeric = value.match(/^(\d+)(.*)$/)
    if (!numeric) return

    const target = Number(numeric[1])
    const suffix = numeric[2]
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return
    }

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const started = performance.now()
        const duration = 850

        const tick = (now: number) => {
          const progress = Math.min(1, (now - started) / duration)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(`${Math.round(target * eased)}${suffix}`)
          if (progress < 1) window.requestAnimationFrame(tick)
        }

        window.requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value])

  return <strong ref={ref}>{display}</strong>
}

function ImpactBar() {
  return (
    <div className="impact-bar" aria-label="Impact metrics">
      {metrics.map(([value, label]) => (
        <div key={label}>
          <AnimatedMetric value={value} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

function ProofCockpit() {
  const cards: LinkItem[] = [
    proofLinks[0],
    proofLinks[1],
    proofLinks[2],
    { label: 'AAPM 2025 TG-263 Poster', href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105', meta: 'Blue Ribbon recognition', image: imageAssets.aapm2025 },
    { label: 'Open source contributor', href: 'https://github.com/udiram', meta: 'MONAI, OpenHands, clinical tooling', image: imageAssets.githubProfile },
  ]
  const [activeCard, setActiveCard] = useState(0)
  const selected = cards[activeCard]

  const move = (direction: -1 | 1) => {
    setActiveCard((current) => (current + direction + cards.length) % cards.length)
  }

  return (
    <div className="proof-cockpit" aria-label="Interactive proof cockpit">
      <div className="cockpit-topline">
        <span><Icon name="spark" /> Proof cockpit</span>
        <span>Drag rail</span>
      </div>
      <div className="cockpit-grid">
        <ExternalLink href={selected.href} className="proof-primary">
          {selected.image ? <ImagePlate image={selected.image} className="hero-portrait" /> : null}
          <span className="proof-open"><Icon name="external" /></span>
          <div>
            <strong>{selected.label}</strong>
            <span>{selected.meta}</span>
          </div>
        </ExternalLink>
        <div className="proof-stack">
          {cards.map((card, index) => (
            <button className={activeCard === index ? 'active' : ''} key={card.label} onClick={() => setActiveCard(index)} type="button">
              {card.image ? <ImagePlate image={card.image} /> : null}
              <span>{card.label}</span>
            </button>
          ))}
        </div>
        <div className="github-tile">
          <ImagePlate image={imageAssets.githubProfile} />
          <div>
            <strong>Open source contributor</strong>
            <span>MONAI, OpenHands, clinical tools</span>
          </div>
        </div>
      </div>
      <div className="cockpit-controls">
        <span>{String(activeCard + 1).padStart(2, '0')}</span>
        <input
          aria-label="Select proof card"
          max={cards.length - 1}
          min="0"
          onChange={(event) => setActiveCard(Number(event.target.value))}
          type="range"
          value={activeCard}
        />
        <span>{String(cards.length).padStart(2, '0')}</span>
        <button type="button" onClick={() => move(-1)} aria-label="Previous proof">
          <Icon name="arrow" />
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Next proof">
          <Icon name="arrow" />
        </button>
      </div>
    </div>
  )
}

function ProgressRail({ active }: { active: SectionId }) {
  return (
    <aside className="progress-rail" aria-label="Page progress">
      <div className="progress-track">
        <span />
      </div>
      <ol>
        {navItems.map((item) => (
          <li key={item.id}>
            <a className={active === item.id ? 'active' : ''} href={`#${item.id}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  )
}

function ProjectDeck() {
  const [category, setCategory] = useState(projectCategories[0])
  const filtered = category === 'All' ? projects : projects.filter((project) => project.category === category)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = filtered[selectedIndex] ?? filtered[0]

  return (
    <div className="project-deck">
      <div className="deck-head">
        <span>Project deck</span>
        <strong>{selectedIndex + 1} of {filtered.length}</strong>
      </div>
      <div className="deck-stack" aria-label="Selected projects">
        {filtered.map((project, index) => {
          const offset = (index - selectedIndex + filtered.length) % filtered.length
          return (
            <button
              className={index === selectedIndex ? 'active' : ''}
              key={project.title}
              onClick={() => setSelectedIndex(index)}
              style={{ '--stack-index': offset } as CSSProperties}
              type="button"
            >
              <span>{project.category}</span>
              <strong>{project.title}</strong>
              <em>{project.status}</em>
            </button>
          )
        })}
      </div>
      <label className="deck-scrubber">
        <span>Scrub to explore</span>
        <input
          aria-label="Select project"
          max={Math.max(0, filtered.length - 1)}
          min="0"
          onChange={(event) => setSelectedIndex(Number(event.target.value))}
          type="range"
          value={selectedIndex}
        />
      </label>
      <div className="filter-row compact" role="tablist" aria-label="Project categories">
        {projectCategories.map((item) => (
          <button
            className={category === item ? 'active' : ''}
            key={item}
            onClick={() => {
              setCategory(item)
              setSelectedIndex(0)
            }}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <article className="project-detail">
        <ImagePlate image={selected.image} />
        <div>
          <div className="card-meta">
            <span>{selected.status}</span>
            <span>{selected.category}</span>
          </div>
          <h3>{selected.title}</h3>
          <dl>
            <div>
              <dt>Problem</dt>
              <dd>{selected.problem}</dd>
            </div>
            <div>
              <dt>Solution</dt>
              <dd>{selected.solution}</dd>
            </div>
          </dl>
          <TagList tags={selected.stack} />
          <div className="deck-actions">
            {selected.href ? (
              <ExternalLink href={selected.href} className="inline-action">
                Open Source <Icon name="external" />
              </ExternalLink>
            ) : null}
            <button type="button" onClick={() => setSelectedIndex((selectedIndex + 1) % filtered.length)}>
              Next <Icon name="arrow" />
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

function ResearchWorkbench({ researchFilter, setResearchFilter, visibleResearch }: { researchFilter: string; setResearchFilter: (value: string) => void; visibleResearch: ResearchCase[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = visibleResearch[selectedIndex] ?? visibleResearch[0] ?? researchCases[0]
  const selectFilter = (filter: string) => {
    setResearchFilter(filter)
    setSelectedIndex(0)
  }
  const countFor = (filter: string) => {
    if (filter === 'All') return researchCases.length
    if (filter === 'Publications') return researchCases.filter((item) => item.status === 'Published').length
    if (filter === 'AI/ML') return researchCases.filter((item) => `${item.title} ${item.tags.join(' ')}`.toLowerCase().includes('ai') || item.tags.includes('LLMs')).length
    if (filter === 'Adaptive RT') return researchCases.filter((item) => `${item.title} ${item.tags.join(' ')}`.toLowerCase().includes('adaptive') || item.tags.includes('OART')).length
    if (filter === 'SRS/SBRT') return researchCases.filter((item) => item.tags.some((tag) => ['SRS', 'SBRT'].some((needle) => tag.includes(needle)))).length
    return researchCases.filter((item) => item.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))).length
  }

  return (
    <div className="research-workbench">
      <aside className="research-filters" aria-label="Research filters">
        <span>Filters</span>
        {researchFilters.map((filter) => (
          <button className={researchFilter === filter ? 'active' : ''} key={filter} onClick={() => selectFilter(filter)} type="button">
            <Icon name={filter === 'Publications' ? 'book' : filter === 'LLMs' ? 'code' : 'microscope'} />
            <strong>{filter}</strong>
            <em>{countFor(filter)}</em>
          </button>
        ))}
        <button className="clear-filter" onClick={() => selectFilter('All')} type="button">Clear filters</button>
      </aside>

      <div className="research-console">
        <div className="console-tabs">
          <button className="active" type="button">Research</button>
          <button type="button">Selected Projects</button>
          <span>{visibleResearch.length} results</span>
        </div>
        <article className="research-feature">
          <ImagePlate image={selected.image} />
          <div className="research-body">
            <div className="card-meta">
              <span>{selected.status}</span>
              <span>{selected.institution}</span>
            </div>
            <h3>{selected.title}</h3>
            <TagList tags={selected.tags} />
            <dl>
              <div>
                <dt>Problem</dt>
                <dd>{selected.problem}</dd>
              </div>
              <div>
                <dt>Method</dt>
                <dd>{selected.method}</dd>
              </div>
              <div>
                <dt>Impact</dt>
                <dd>{selected.impact}</dd>
              </div>
            </dl>
            <div className="source-strip">
              <span>{selected.result}</span>
              {selected.href ? (
                <ExternalLink href={selected.href}>
                  Open source <Icon name="external" />
                </ExternalLink>
              ) : null}
            </div>
          </div>
        </article>
        <div className="research-rows">
          {visibleResearch.map((item, index) => (
            <button className={index === selectedIndex ? 'active' : ''} key={item.title} onClick={() => setSelectedIndex(index)} type="button">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.title}</strong>
              <em>{item.result}</em>
            </button>
          ))}
        </div>
      </div>

      <ProjectDeck />
    </div>
  )
}

function MediaWall({ items }: { items: ArchiveItem[] }) {
  const [selected, setSelected] = useState(0)
  const active = items[selected]

  return (
    <div className="media-wall">
      <article className="media-player">
        <ImagePlate image={active.image} />
        <button className="play-button" type="button" aria-label="Play selected media">
          <Icon name="play" />
        </button>
        <div className="media-caption">
          <span>{active.meta}</span>
          <h3>{active.title}</h3>
          <p>{active.text}</p>
        </div>
        <div className="media-controls">
          <button type="button" onClick={() => setSelected((selected + items.length - 1) % items.length)} aria-label="Previous media">
            <Icon name="arrow" />
          </button>
          <input
            aria-label="Select media item"
            max={items.length - 1}
            min="0"
            onChange={(event) => setSelected(Number(event.target.value))}
            type="range"
            value={selected}
          />
          <button type="button" onClick={() => setSelected((selected + 1) % items.length)} aria-label="Next media">
            <Icon name="arrow" />
          </button>
          {active.href ? (
            <ExternalLink href={active.href}>
              Read profile <Icon name="external" />
            </ExternalLink>
          ) : null}
        </div>
      </article>
      <div className="media-thumbnails" aria-label="Media thumbnails">
        {items.map((item, index) => (
          <button className={index === selected ? 'active' : ''} key={item.title} onClick={() => setSelected(index)} type="button">
            <ImagePlate image={item.image} />
            <span>{item.meta}</span>
          </button>
        ))}
      </div>
      <div className="profile-cards">
        {items.slice(0, 4).map((item) => (
          <article key={item.title}>
            <ImagePlate image={item.image} />
            <div>
              <span>{item.meta}</span>
              <h3>{item.title}</h3>
              {item.href ? (
                <ExternalLink href={item.href}>
                  Read profile <Icon name="external" />
                </ExternalLink>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Timeline() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="timeline-module">
      <div className="timeline-rail" role="tablist" aria-label="Trajectory timeline">
        {timeline.map((item, index) => (
          <button
            className={selected === index ? `active ${item.tone}` : item.tone}
            key={item.title}
            onClick={() => setSelected(index)}
            type="button"
          >
            <span>{item.year}</span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
      <article className={`timeline-detail ${timeline[selected].tone}`}>
        <span>{timeline[selected].year}</span>
        <h3>{timeline[selected].title}</h3>
        <p>{timeline[selected].text}</p>
      </article>
    </div>
  )
}

function PerformanceTimeline() {
  const [selected, setSelected] = useState(2)
  const [compare, setCompare] = useState(false)
  const markers = [
    { label: 'AAPM 2024 Ethos SRS', month: 'Mar 11-14', tone: 'green', left: 10 },
    { label: 'AAPM 2024 AutoML Seg', month: 'Jul 14-17', tone: 'orange', left: 39 },
    { label: 'TG-263 Blue Ribbon Poster', month: 'Mar 16-20', tone: 'cyan', left: 70 },
    { label: 'AAPM 2025 Oral Presentation', month: 'Jul 27-30', tone: 'gray', left: 86 },
  ]
  const active = markers[selected]

  return (
    <div className="performance-timeline">
      <div className="timeline-toolbar">
        <div>
          <button className="active" type="button">All</button>
          <button type="button">2024</button>
          <button type="button">2025</button>
        </div>
        <label>
          <span>Compare</span>
          <input checked={compare} onChange={(event) => setCompare(event.target.checked)} type="checkbox" />
        </label>
      </div>
      <div className={compare ? 'marker-stage compare' : 'marker-stage'}>
        {markers.map((marker, index) => (
          <button
            className={index === selected ? `active ${marker.tone}` : marker.tone}
            key={marker.label}
            onClick={() => setSelected(index)}
            style={{ left: `${marker.left}%` }}
            type="button"
          >
            <span>{marker.month}</span>
            <strong>{marker.label}</strong>
          </button>
        ))}
      </div>
      <label className="deck-scrubber">
        <span>Scrub timeline</span>
        <input
          aria-label="Select timeline event"
          max={markers.length - 1}
          min="0"
          onChange={(event) => setSelected(Number(event.target.value))}
          type="range"
          value={selected}
        />
      </label>
      <article className={`timeline-card ${active.tone}`}>
        <span>{active.month}</span>
        <h3>{active.label}</h3>
        <p>{compare ? 'Comparison mode highlights timing, recognition, and project phase differences.' : 'Selected marker controls the detail card and timeline emphasis.'}</p>
      </article>
    </div>
  )
}

function PerformanceSimulator() {
  const [lapPosition, setLapPosition] = useState(42)
  const speed = Math.round(148 + lapPosition * 1.58)
  const throttle = Math.min(100, Math.round(42 + Math.sin(lapPosition / 13) * 28 + lapPosition / 2.6))
  const brake = Math.max(0, Math.round(65 - throttle / 1.4))
  const gear = Math.min(7, Math.max(2, Math.round(lapPosition / 18) + 2))

  return (
    <div className="telemetry-board">
      <div className="timing-head">
        <span>Lap simulation</span>
        <strong>Decision Support</strong>
      </div>
      <div className="lap-sim">
        <svg viewBox="0 0 420 300" aria-label="Interactive lap trace">
          <path className="track-path track-shadow" d="M78 190C36 130 86 52 166 72c54 14 60 65 111 58 66-9 100 24 86 82-18 75-142 84-192 39-34-30-60-14-93-61Z" />
          <path className="track-path" d="M78 190C36 130 86 52 166 72c54 14 60 65 111 58 66-9 100 24 86 82-18 75-142 84-192 39-34-30-60-14-93-61Z" />
          <path className="trace trace-cyan" d="M40 246 C92 170 126 230 182 154 S272 80 320 146 374 234 292 258 152 294 40 246" />
          <circle className="lap-marker" cx={70 + lapPosition * 2.75} cy={210 - Math.sin(lapPosition / 12) * 86} r="7" />
        </svg>
        <div className="telemetry-values">
          <dl>
            <div>
              <dt>Speed</dt>
              <dd>{speed} km/h</dd>
            </div>
            <div>
              <dt>Gear</dt>
              <dd>{gear}</dd>
            </div>
            <div>
              <dt>Throttle</dt>
              <dd>{throttle}%</dd>
            </div>
            <div>
              <dt>Brake</dt>
              <dd>{brake}%</dd>
            </div>
          </dl>
        </div>
      </div>
      <label className="lap-control">
        <span>Scrub lap state</span>
        <input
          aria-label="Scrub lap simulation"
          max="100"
          min="0"
          onChange={(event) => setLapPosition(Number(event.target.value))}
          type="range"
          value={lapPosition}
        />
      </label>
      <div className="timing-stats">
        <span>Telemetry</span>
        <span>Simulation</span>
        <span>Strategy</span>
      </div>
      <PerformanceTimeline />
    </div>
  )
}

function ArchiveGrid({ items }: { items: ArchiveItem[] }) {
  return (
    <div className="archive-grid">
      {items.map((item) => (
        <article key={item.title}>
          <ImagePlate image={item.image} />
          <div>
            <span>{item.meta}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            {item.href ? (
              <ExternalLink href={item.href}>
                Source <Arrow />
              </ExternalLink>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}

function LinkArchive() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const target = query.trim().toLowerCase()
    if (!target) return allExternalLinks
    return allExternalLinks.filter((item) => `${item.label} ${item.meta ?? ''} ${item.href}`.toLowerCase().includes(target))
  }, [query])

  return (
    <div className="link-archive">
      <label>
        <span>Search proof links</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="papers, profiles, code, awards..." />
      </label>
      <div className="link-ledger" aria-live="polite">
        {filtered.map((item, index) => (
          <ExternalLink href={item.href} key={`${item.href}-${index}`}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
            <em>{item.meta ?? item.href}</em>
            <Arrow />
          </ExternalLink>
        ))}
      </div>
    </div>
  )
}

function LeadershipPanel() {
  return (
    <div className="leadership-grid">
      {leadershipGroups.map((group) => (
        <article key={group.title}>
          <h3>{group.title}</h3>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

function useActiveSection() {
  const [active, setActive] = useState<SectionId>('home')

  useEffect(() => {
    let frame = 0

    const updateActive = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const topbar = document.querySelector('.site-nav')
        const probeY = (topbar?.getBoundingClientRect().height ?? 64) + window.innerHeight * 0.28
        let current: SectionId = 'home'

        navItems.forEach(({ id }) => {
          const section = document.getElementById(id)
          if (section && section.getBoundingClientRect().top <= probeY) current = id
        })

        setActive(current)
      })
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [])

  return { active, setActive }
}

function useScrollProgress(active: SectionId) {
  useEffect(() => {
    const root = document.documentElement
    const updateScroll = () => {
      const scrollable = root.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      root.style.setProperty('--scroll-progress', progress.toFixed(4))
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)

    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--active-index', String(Math.max(0, navItems.findIndex((item) => item.id === active))))
  }, [active])
}

function useActiveTabIntoView(active: SectionId) {
  useEffect(() => {
    const tab = document.querySelector<HTMLAnchorElement>(`.nav-links a[href="#${active}"]`)
    const tabs = tab?.parentElement
    if (!tab || !tabs) return

    const left = tab.offsetLeft - (tabs.clientWidth - tab.clientWidth) / 2
    tabs.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [active])
}

function App() {
  const { active, setActive } = useActiveSection()
  const [researchFilter, setResearchFilter] = useState('All')
  const [isScrolled, setIsScrolled] = useState(false)
  useScrollProgress(active)
  useActiveTabIntoView(active)

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const visibleResearch =
    researchFilter === 'All'
      ? researchCases
      : researchCases.filter((item) => {
          if (researchFilter === 'Publications') return item.status === 'Published'
          if (researchFilter === 'AI/ML') return `${item.title} ${item.tags.join(' ')}`.toLowerCase().includes('ai') || item.tags.includes('LLMs')
          if (researchFilter === 'Adaptive RT') return `${item.title} ${item.tags.join(' ')}`.toLowerCase().includes('adaptive') || item.tags.includes('OART')
          if (researchFilter === 'SRS/SBRT') return item.tags.some((tag) => ['SRS', 'SBRT'].some((needle) => tag.includes(needle)))
          return item.tags.some((tag) => tag.toLowerCase().includes(researchFilter.toLowerCase()))
        })

  const scrollToSection = useCallback(
    (id: SectionId, behavior: ScrollBehavior = 'smooth') => {
      const section = document.getElementById(id)
      if (!section) return

      setActive(id)
      const topbar = document.querySelector('.site-nav')
      const offset = Math.ceil((topbar?.getBoundingClientRect().height ?? 64) + 18)
      const top = section.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: Math.max(0, top), behavior })
    },
    [setActive],
  )

  const settleScrollToSection = useCallback(
    (id: SectionId, behavior: ScrollBehavior = 'smooth') => {
      scrollToSection(id, behavior)
      window.requestAnimationFrame(() => scrollToSection(id, 'auto'))
      window.setTimeout(() => scrollToSection(id, 'auto'), 180)
      window.setTimeout(() => scrollToSection(id, 'auto'), 520)
      window.setTimeout(() => scrollToSection(id, 'auto'), 1100)
      window.setTimeout(() => scrollToSection(id, 'auto'), 1800)
    },
    [scrollToSection],
  )

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

    const syncHash = () => {
      const id = window.location.hash.replace('#', '') as SectionId
      if (!navItems.some((item) => item.id === id)) return
      settleScrollToSection(id, 'auto')
    }

    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [settleScrollToSection])

  return (
    <div className={`portfolio-site active-${active}`}>
      <ProgressRail active={active} />
      <header className={isScrolled ? 'site-nav scrolled' : 'site-nav'}>
        <a
          className="brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault()
            window.history.pushState(null, '', '#home')
            settleScrollToSection('home')
          }}
        >
          <span className="brand-mark" aria-hidden="true">UR</span>
          <span>Udbhav Ram</span>
        </a>
        <nav className="nav-links" aria-label="Main sections">
          {navItems.map((item) => (
            <a
              className={active === item.id ? 'active' : ''}
              href={`#${item.id}`}
              key={item.id}
              aria-current={active === item.id ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault()
                window.history.pushState(null, '', `#${item.id}`)
                settleScrollToSection(item.id)
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <nav className="mobile-dock" aria-label="Mobile quick sections">
        {navItems.slice(0, 4).map((item) => (
          <a
            className={active === item.id ? 'active' : ''}
            href={`#${item.id}`}
            key={item.id}
            onClick={(event) => {
              event.preventDefault()
              window.history.pushState(null, '', `#${item.id}`)
              settleScrollToSection(item.id)
            }}
          >
            <Icon name={item.id === 'home' ? 'home' : item.id === 'research' ? 'search' : item.id === 'projects' ? 'grid' : 'play'} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <main>
        <section className="hero-section page-section" id="home">
          <div className="hero-copy">
            <h1>Udbhav Ram</h1>
            <p className="hero-position">
              Medical physicist-in-training building <span>AI systems</span> for <span>radiation oncology</span>, clinical workflow automation, and <span>high-performance decision support</span>.
            </p>
            <p className="hero-summary">
              I work at the intersection of medical physics, machine learning, radiation oncology, software engineering, and performance strategy - translating computational tools into clinically useful systems.
            </p>
            <div className="credibility-row" aria-label="Credibility highlights">
              {heroChips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
            <div className="hero-actions">
              <button type="button" onClick={() => settleScrollToSection('research')}><Icon name="microscope" /> View Research</button>
              <button type="button" onClick={() => settleScrollToSection('projects')}><Icon name="play" /> Play Project Deck</button>
              <a href={resumeHref} download><Icon name="download" /> Download CV</a>
              <button type="button" onClick={() => settleScrollToSection('contact')}><Icon name="mail" /> Contact</button>
            </div>
          </div>
          <ProofCockpit />
        </section>

        <ImpactBar />

        <section className="page-section" id="research">
          <SectionHeader
            title="Research"
            text="AI, automation, and quantitative methods for radiation oncology, adaptive radiotherapy, image segmentation, and clinical decision support."
            align="split"
          />
          <ResearchWorkbench researchFilter={researchFilter} setResearchFilter={setResearchFilter} visibleResearch={visibleResearch} />
          <ArchiveGrid items={researchArchive} />
        </section>

        <section className="page-section" id="projects">
          <SectionHeader
            title="Selected Projects"
            text="Software, AI tools, simulations, dashboards, and experimental systems built across medicine, motorsport, education, and automation."
            align="split"
          />
          <ProjectDeck />
        </section>

        <section className="page-section media-section" id="media">
          <SectionHeader
            title="Media"
            text="Institutional profiles, UAB/McMaster collaboration coverage, award stories, and source pages that validate the work."
          />
          <MediaWall items={mediaItems} />
          <div className="press-kit">
            <div>
              <h3>Press & Profiles</h3>
              <p>Short bio, long bio, headshot source, downloadable CV, and collaboration contact points for conference organizers and research partners.</p>
            </div>
            <div className="press-actions">
              <a href={resumeHref} download>Download CV</a>
              <ContactLinks compact />
            </div>
          </div>
        </section>

        <section className="page-section performance-section" id="performance">
          <SectionHeader
            title="Performance"
            text="From racetrack telemetry to clinical decision support: real-time systems, deterministic simulation, and human-machine decision environments."
            align="split"
          />
          <div className="performance-grid">
            <PerformanceSimulator />
            <div>
              <div className="track-work-head">
                <h3>Track Work</h3>
                <ExternalLink href="https://www.mclaren.com/racing/indycar/">View project <Icon name="external" /></ExternalLink>
              </div>
              <ArchiveGrid items={performanceItems} />
            </div>
          </div>
        </section>

        <section className="page-section" id="leadership">
          <SectionHeader
            title="Leadership"
            text="Community work, clinical exposure, technical building, and disciplines that give the technical profile a human operating context."
            align="split"
          />
          <LeadershipPanel />
          <Timeline />
        </section>

        <section className="page-section" id="archive">
          <SectionHeader
            title="Awards, Publications, and Archive"
            text="Featured awards stay visible, while the full proof-link ledger keeps the site complete without overwhelming the primary pages."
            align="split"
          />
          <ArchiveGrid items={awards} />
          <LinkArchive />
        </section>

        <section className="page-section contact-section" id="contact">
          <div>
            <h2>Interested in AI for radiation oncology, clinical workflow automation, or medical physics collaboration?</h2>
            <p>
              Reach out for research collaboration, clinical AI tooling, conference speaking, project review, or performance-engineering crossover work.
            </p>
          </div>
          <ContactLinks />
          <footer>
            <a href={resumeHref} download>
              Download CV <Arrow />
            </a>
            <ExternalLink href="https://sites.google.com/view/udbhav-ram/home">
              Legacy Google Site archive <Arrow />
            </ExternalLink>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App
