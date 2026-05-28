import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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

function ImagePlate({ image, className = '' }: { image: ImageAsset; className?: string }) {
  return (
    <figure className={`image-plate ${className}`.trim()}>
      <img src={image.src} alt={image.alt} loading="lazy" />
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

function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="Interactive clinical AI and performance visual">
      <div className="orbital-stage">
        <ImagePlate image={imageAssets.mcmasterScholar} className="hero-portrait" />
        <svg className="beam-map" viewBox="0 0 620 620" aria-hidden="true">
          <defs>
            <linearGradient id="beamGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.84" />
              <stop offset="52%" stopColor="#8b5cf6" stopOpacity="0.44" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.76" />
            </linearGradient>
          </defs>
          <path className="orbit orbit-one" d="M84 312C120 140 324 70 476 164S572 466 388 524 44 460 84 312Z" />
          <path className="orbit orbit-two" d="M130 190C234 92 438 120 504 260S472 532 294 508 26 312 130 190Z" />
          <path className="orbit orbit-three" d="M196 112C326 68 512 206 504 348S330 548 206 470 66 156 196 112Z" />
          <path className="beam" d="M102 514C206 356 308 300 520 110" />
          <path className="dose-line" d="M160 430C218 388 286 388 340 426S458 470 514 400" />
          <circle className="scan-dot" cx="388" cy="222" r="5" />
        </svg>
        <div className="signal-readout readout-a">
          <span>OART beam arc</span>
          <strong>210 deg</strong>
        </div>
        <div className="signal-readout readout-b">
          <span>Telemetry delta</span>
          <strong>-0.42 s</strong>
        </div>
      </div>
      <div className="hero-proof-grid" aria-label="Selected proof photos">
        <article>
          <ImagePlate image={imageAssets.coopAward} />
          <span>McMaster Science Co-op Student of the Year</span>
        </article>
        <article>
          <ImagePlate image={imageAssets.employerAward} />
          <span>UAB Radiation Oncology collaboration</span>
        </article>
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

function ResearchCard({ item }: { item: ResearchCase }) {
  return (
    <article className="research-card">
      <ImagePlate image={item.image} />
      <div className="research-card-body">
        <div className="card-meta">
          <span>{item.status}</span>
          <span>{item.institution}</span>
        </div>
        <h3>{item.title}</h3>
        <TagList tags={item.tags} />
        <dl>
          <div>
            <dt>Problem</dt>
            <dd>{item.problem}</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>{item.method}</dd>
          </div>
          <div>
            <dt>Impact</dt>
            <dd>{item.impact}</dd>
          </div>
        </dl>
        <div className="card-footer">
          <strong>{item.result}</strong>
          {item.href ? (
            <ExternalLink href={item.href}>
              Read <Arrow />
            </ExternalLink>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function ProjectLab() {
  const [category, setCategory] = useState(projectCategories[0])
  const filtered = category === 'All' ? projects : projects.filter((project) => project.category === category)
  const [selectedTitle, setSelectedTitle] = useState(projects[0].title)
  const selected = filtered.find((project) => project.title === selectedTitle) ?? filtered[0]

  return (
    <div className="project-lab">
      <div className="filter-row" role="tablist" aria-label="Project categories">
        {projectCategories.map((item) => (
          <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)} type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="project-workbench">
        <div className="project-list">
          {filtered.map((project, index) => (
            <button
              className={selected.title === project.title ? 'active' : ''}
              key={project.title}
              onClick={() => setSelectedTitle(project.title)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{project.title}</strong>
              <em>{project.status}</em>
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
            {selected.href ? (
              <ExternalLink href={selected.href} className="inline-action">
                Open source <Arrow />
              </ExternalLink>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  )
}

function MediaWall({ items }: { items: ArchiveItem[] }) {
  return (
    <div className="media-wall">
      {items.map((item) => (
        <article key={item.title}>
          <ImagePlate image={item.image} />
          <div>
            <span>{item.meta}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            {item.href ? (
              <ExternalLink href={item.href}>
                Read <Arrow />
              </ExternalLink>
            ) : null}
          </div>
        </article>
      ))}
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
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) setActive(visible.target.id as SectionId)
      },
      { rootMargin: '-20% 0px -62% 0px', threshold: [0.08, 0.22, 0.38] },
    )

    navItems.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
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
          return item.tags.some((tag) => tag.toLowerCase().includes(researchFilter.replace('/ML', '').replace('/SBRT', '').toLowerCase()))
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
    },
    [scrollToSection],
  )

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

    const syncHash = () => {
      const id = window.location.hash.replace('#', '') as SectionId
      if (!navItems.some((item) => item.id === id)) return
      window.requestAnimationFrame(() => scrollToSection(id, 'auto'))
      window.setTimeout(() => scrollToSection(id, 'auto'), 120)
    }

    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [scrollToSection])

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
              <button type="button" onClick={() => settleScrollToSection('research')}>View Research</button>
              <button type="button" onClick={() => settleScrollToSection('projects')}>View Projects</button>
              <a href={resumeHref} download>Download CV</a>
              <button type="button" onClick={() => settleScrollToSection('contact')}>Contact</button>
            </div>
          </div>
          <HeroVisual />
        </section>

        <ImpactBar />

        <section className="page-section" id="research">
          <SectionHeader
            title="Research"
            text="AI, automation, and quantitative methods for radiation oncology, adaptive radiotherapy, image segmentation, and clinical decision support."
            align="split"
          />
          <div className="filter-row" role="tablist" aria-label="Research filters">
            {researchFilters.map((filter) => (
              <button className={researchFilter === filter ? 'active' : ''} key={filter} onClick={() => setResearchFilter(filter)} type="button">
                {filter}
              </button>
            ))}
          </div>
          <div className="featured-research">
            {visibleResearch.map((item) => (
              <ResearchCard item={item} key={item.title} />
            ))}
          </div>
          <ArchiveGrid items={researchArchive} />
        </section>

        <section className="page-section" id="projects">
          <SectionHeader
            title="Projects Lab"
            text="Software, AI tools, simulations, dashboards, and experimental systems built across medicine, motorsport, education, and automation."
            align="split"
          />
          <ProjectLab />
        </section>

        <section className="page-section media-section" id="media">
          <SectionHeader
            title="Media Wall"
            text="Institutional profiles, UAB/McMaster collaboration coverage, award stories, and source pages that validate the work."
          />
          <MediaWall items={mediaItems} />
          <div className="press-kit">
            <div>
              <h3>Press kit</h3>
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
            title="Performance Engineering"
            text="From racetrack telemetry to clinical decision support: real-time systems, deterministic simulation, and human-machine decision environments."
            align="split"
          />
          <div className="performance-grid">
            <PerformanceSimulator />
            <ArchiveGrid items={performanceItems} />
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
