import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import './App.css'

type SectionId = 'home' | 'work' | 'research' | 'trajectory' | 'archive' | 'contact'
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

type IconName = 'arrow' | 'download' | 'mail' | 'github' | 'scholar' | 'linkedin' | 'medium' | 'youtube' | 'moon' | 'sun' | 'menu' | 'close'

type EducationRow = {
  logo?: ImageAsset
  mark?: string
  markDetail?: string
  title: string
  place: string
  detail: string
  meta: string
}

const resumeHref = '/assets/Udbhav_Ram_resume.pdf'
const themeStorageKey = 'udbhav-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const storedTheme = window.localStorage.getItem(themeStorageKey)
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const imageAssets = {
  heroPortrait: {
    src: '/assets/optimized/hero-portrait.webp',
    alt: 'Udbhav Ram outside the McMaster physics building',
    source: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
  },
  heroCollage: {
    src: '/assets/optimized/hero-collage.webp',
    alt: 'Collage of medical imaging, code, radiation dose distribution, and a race car',
  },
  hero: {
    src: '/assets/sourced/mcmaster-convocation.jpg',
    alt: 'Udbhav Ram in the McMaster Science convocation profile portrait',
    source: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
  },
  mentor: {
    src: '/assets/sourced/uab-agarwal-udi.jpg',
    alt: 'Udbhav Ram with Pritish Agarwal in the UAB medicine profile',
    source: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  coopAward: {
    src: '/assets/optimized/coop-award.webp',
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
    src: '/assets/optimized/uab-radonc.webp',
    alt: 'UAB Radiation Oncology treatment planning visual',
    source: 'https://www.uab.edu/medicine/radonc/',
  },
  uabEmployerAward: {
    src: '/assets/sourced/uab-employer-award-1.jpg',
    alt: 'Udbhav Ram with UAB Radiation Oncology collaborators after employer award recognition',
    source: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  uabPresentation: {
    src: '/assets/optimized/uab-presentation.webp',
    alt: 'Udbhav Ram presenting clinical AI research at UAB Radiation Oncology',
    source: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
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
    src: '/assets/optimized/arrow-mclaren.webp',
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
  { id: 'work', label: 'Work' },
  { id: 'research', label: 'Research' },
  { id: 'trajectory', label: 'Trajectory' },
  { id: 'archive', label: 'Archive' },
  { id: 'contact', label: 'Contact' },
]

const socialItems: (LinkItem & { icon: IconName })[] = [
  { label: 'Email', href: 'mailto:ramu@mcmaster.ca', icon: 'mail' },
  { label: 'LinkedIn', href: 'https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/udiram', icon: 'github' },
  { label: 'Google Scholar', href: 'https://scholar.google.com/scholar?q=%22Udbhav+Ram%22', icon: 'scholar' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCTn6NYNbV55T4zs9v1nHOwA', icon: 'youtube' },
  { label: 'Medium', href: 'https://medium.com/@udbhavram41', icon: 'medium' },
]

const focusAreas = [
  {
    title: 'Clinical AI translation',
    text: 'Builds reviewer-controlled AI and LLM workflows for radiation oncology QA, naming compliance, segmentation, and follow-up review.',
  },
  {
    title: 'Medical physics evidence',
    text: 'Works across adaptive radiotherapy, SRS planning validation, photon-beam commissioning, contour variability, and clinical QA.',
  },
  {
    title: 'Software that survives use',
    text: 'Moves between Python, React, DevOps, automation, clinical data handling, and open-source contributions instead of stopping at notebooks.',
  },
  {
    title: 'Performance systems',
    text: 'Carries race strategy, telemetry, controls, simulation, and vehicle-dynamics habits into medical software and research workflows.',
  },
]

const profileNarrative = [
  'I am a Medical Physics PhD student at UW-Madison building software for places where clinical workflow, imaging evidence, and engineering discipline all matter at once.',
  'My path runs through UAB Radiation Oncology, McMaster Medical Physics, Juravinski Cancer Centre, Western/Lawson, St. Josephs Healthcare Hamilton, Arrow McLaren, and open-source medical-imaging software. The common thread is turning technical systems into tools that real teams can understand, validate, and use.',
]

const educationRows: EducationRow[] = [
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
    detail: 'Medical physics with co-op, Dean\'s List record, and coursework across clinical physics, radiation biology, radiation methodology, and biophysics.',
    meta: 'Graduated 2026 · Summa Cum Laude · Hamilton, ON',
  },
  {
    mark: 'UAB',
    markDetail: 'Rad Onc',
    title: 'International visiting scholar',
    place: 'UAB Radiation Oncology',
    detail: 'Clinical AI, adaptive radiotherapy, SRS planning, auto-segmentation, TG-263 naming QA, and clinical shadowing with UAB collaborators.',
    meta: '2021-Present collaboration · Birmingham, AL',
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
    text: 'Radiation oncology AI tools, adaptive RT validation, local LLM workflows, auto-segmentation, clinical QA software, and more than 400 hours of clinical shadowing.',
  },
  {
    time: '2024-2025',
    role: 'Undergraduate thesis student',
    org: 'Juravinski Cancer Centre / Hamilton Health Sciences',
    text: 'Multi-institution dosimetric comparison of 6X and 10XFFF photon beams on a TrueBeam iTX for SBRT applications using Eclipse TPS.',
  },
  {
    time: '2023',
    role: 'Data and Strategy Intern',
    org: 'Arrow McLaren IndyCar',
    text: 'Built modelling pipelines, stochastic simulation, and computer-vision tools for race, performance, strategy, and data engineers.',
  },
  {
    time: '2019-2023',
    role: 'Researcher / engineer',
    org: 'McMaster, Western/Lawson, St. Josephs, W Booth School',
    text: 'Biophysics publication work, optical brain measurement ML, AR surgery tools, transcript-generation software, and biomedical computer-vision systems.',
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
    title: 'AI framework to fuse pre-RT brain metastases contours with follow-up MRI',
    venue: 'Neuro-Oncology Practice · 2025',
    text: 'PACS-oriented workflow that propagates prior radiation treatment context into follow-up MRI to reduce review time and improve agreement.',
    href: 'https://academic.oup.com/nop/article/13/3/497/8382617',
    image: imageAssets.uabRadonc,
  },
  {
    title: 'Ethos 2.0 high-fidelity SRS validation',
    venue: 'JACMP · 2025',
    text: 'Semi-automated, template-based validation of Ethos high-fidelity mode and control rings for multi-met single-isocentre SRS.',
    href: 'https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/acm2.70370',
    image: imageAssets.aapm2024Ethos,
  },
  {
    title: 'Deep learning frameworks for CT abdominal organ auto-segmentation',
    venue: 'Intelligent Oncology · 2025',
    text: 'Head-to-head quantitative and expert review of SwinUNETR, nnU-Net, and MONAI Auto3DSeg for CT abdominal organ auto-segmentation.',
    href: 'https://doi.org/10.1016/j.intonc.2025.03.003',
    image: imageAssets.aapm2024Auto,
  },
  {
    title: 'Ethos adaptive APBI interobserver variability',
    venue: 'Adaptive RT · in progress',
    text: 'Team-based analysis of how clinical reviewers identify radiation treatment areas during accelerated partial breast irradiation workflows.',
    href: 'https://sites.google.com/view/udbhav-ram/research',
    image: imageAssets.uabRadonc,
  },
]

const publicationRows = [
  ['2025', 'Dosimetric evaluation of Ethos 2.0 high-fidelity mode for single-isocenter SRS', 'Journal of Applied Clinical Medical Physics · DOI 10.1002/acm2.70370'],
  ['2025', 'Assessing quantitative performance and expert review of CT abdominal organ auto-segmentation frameworks', 'Intelligent Oncology · DOI 10.1016/j.intonc.2025.03.003'],
  ['2025', 'AI-based framework to fuse pre-RT brain metastases contours with follow-up MRI', 'Neuro-Oncology Practice · PACS integration and post-RT assessment'],
  ['2020', 'The effects of resveratrol, caffeine, beta-carotene, and EGCG on amyloid aggregation', 'Molecular Nutrition & Food Research · DOI 10.1002/mnfr.202000632'],
]

const researchProjectRows = [
  ['Adaptive radiotherapy', 'Ethos adaptive APBI contour variability; Ethos high-fidelity mode; SRS template validation; 6X vs 10XFFF SBRT commissioning.'],
  ['Clinical AI and LLMs', 'Locally hosted LLM agents for TG-263 naming compliance and radiation-oncology QA workflows.'],
  ['Medical imaging ML', 'CT abdominal organ auto-segmentation, glioblastoma whole-slide image analysis, optical brain measurement ML, and PACS-integrated MRI follow-up tools.'],
  ['Biophysics and surgery tools', 'Amyloid aggregation in synthetic brain membranes, gel electrophoresis smartphone analysis, and AR support for nephrectomy surgical models.'],
]

const originalResearchArchive = [
  'Evaluation of inter-observer variability for Ethos adaptive accelerated partial breast irradiation plans (original portfolio status: submitted to IJROBP).',
  'Dosimetric comparison of 6X and 10X flattening-filter-free photon beams on a TrueBeam linac using Eclipse TPS.',
  'Evaluation of Ethos 2.0 High-Fidelity Mode for multi-met, single-isocentre stereotactic radiotherapy.',
  'Assessment of deep-learning frameworks for abdominal organ auto-segmentation.',
  'Formula One lap-time simulation using ordinary differential equations (completed December 2022).',
  'Deep-learning and computer-vision driving agents in open-world simulation.',
  'Deep-learning models for genomic linear-quadratic radiation dose.',
  '3D abdominal multi-organ segmentation for lower-resource clinical workflows.',
  'Optical brain-measurement machine learning for in-vivo hemoglobin oxygenation (completed December 2022).',
  'Smartphone quantitative analysis of gel electrophoresis (completed July 2021).',
  'Computer-vision and augmented-reality support for chronic-kidney-disease surgical models (completed September 2023).',
  'Nutrition compounds and amyloid aggregation in synthetic brain membranes.',
]

const presentationRows = [
  ['2025', 'AAPM Annual Meeting, Washington, DC', 'Blue Ribbon Poster on locally hosted LLMs for TG-263 target-name compliance.'],
  ['2025', 'AAPM Annual Meeting', 'Therapy poster on 6X vs 10XFFF photon-beam comparison for TrueBeam iTX SBRT applications.'],
  ['2025', 'Society of Physics Students Congress, Denver', 'Invited poster on Ethos 2.0 high-fidelity SRS planning.'],
  ['2024', 'COMP Annual Scientific Meeting, Regina', 'Invited speaker on TG-263 compliance with local LLMs; oral contributor on Ethos high-fidelity SRS.'],
  ['2024', 'AAPM Annual Meeting, Los Angeles', 'Posters on Ethos 2.0 high-fidelity SRS and AutoML segmentation frameworks.'],
  ['2023', 'Canadian Undergraduate Physics Conference', 'Overall best talk for optimizing dose delivery during fractionated radiotherapy.'],
  ['2021-2023', 'CAP, CUMPC, PUC, AAPM', 'Gel electrophoresis ML, AR chronic kidney disease surgery setup, abdominal multi-organ segmentation, and auto-contouring talks/posters.'],
]

const presentationLinks = [
  ['2025', 'SPS Congress invited poster', 'https://sites.google.com/view/udbhav-ram/research'],
  ['2023', 'CUPC overall-winning talk', 'https://youtu.be/7JgRKwVRkEo'],
  ['2023', 'AAPM interactive e-poster', 'https://sites.google.com/view/udbhav-ram/research'],
  ['2023', 'PUC abdominal segmentation talk', 'https://youtu.be/8IKr1QauMGc'],
  ['2022', 'CUMPC abdominal segmentation talk', 'https://youtu.be/A7_TRUWW6EI'],
  ['2022', 'CAP augmented-reality kidney-model talk', 'https://youtu.be/I0ESYlp85Rk'],
  ['2021', 'CAP gel-electrophoresis talk', 'https://youtu.be/xW7umxU6NSM'],
]

const originalSourceLinks = [
  ['6X vs 10XFFF thesis report', 'https://drive.google.com/file/d/1saYGinYp9R6O32lr1l3_n-lGGpNYCVFJ/view?usp=sharing'],
  ['Formula 1 ODE summative paper', 'https://drive.google.com/file/d/1o_fi4mDcXzvgSoI69mB4rgpBkePRnMiC/view'],
  ['Open-world driving-agent paper', 'https://drive.google.com/file/d/1Q6XpC-fciEKAE5b1TU0dF3TTDitGHv8b/view?usp=sharing'],
  ['Computer vision for kidney surgery', 'https://medium.com/@udbhavram41/how-computers-are-saving-mice-and-maybe-humans-7a8561ec6a85'],
  ['Amyloid aggregation publication', 'https://onlinelibrary.wiley.com/doi/10.1002/mnfr.202000632'],
]

const recognitionLinks = [
  ['McMaster visiting-scholar feature', 'https://science.mcmaster.ca/international-visiting-scholar-at-the-university-of-alabama-at-birmingham-the-latest-of-many-achievements-for-mcmaster-science-undergrad/'],
  ['UAB video highlight', 'https://youtu.be/JfKKX6gta-M'],
  ['CUPC 2023 official announcement', 'https://cupc.cap.ca/about/cupc/previous-cupc-conferences/cupc-2023/speakers-events/student-presentations/'],
  ['McMaster CUPC highlight', 'https://sway.cloud.microsoft/MB7Dzn2TI5Lss2nB'],
]

const skillGroups = [
  {
    title: 'Programming & systems',
    items: ['Python', 'TypeScript / React', 'Full-stack engineering', 'DevOps', 'Django / Flask', 'CI/CD', 'Cloud backends', 'DICOM-aware workflows'],
  },
  {
    title: 'AI / imaging',
    items: ['Deep learning', 'Machine learning', 'Computer vision', 'MONAI', 'PyTorch', 'nnU-Net', 'Auto3DSeg', 'Segmentation QA'],
  },
  {
    title: 'Medical physics',
    items: ['Radiation oncology', 'Adaptive RT', 'SRS/SBRT planning', 'Eclipse TPS', 'Ethos workflows', 'TG-263', 'Clinical research', 'Molecular dynamics'],
  },
  {
    title: 'Performance engineering',
    items: ['Race strategy', 'Telemetry', 'Simulation', 'Vehicle controls', 'CAN communication', 'SBG RaceWatch', 'OpenPilot', 'AR/MR/VR'],
  },
]

const projectRows = [
  {
    title: 'Clinical AI workflow systems',
    type: 'Radiation oncology',
    stack: 'Python · LLMs · DICOM · QA workflows',
    text: 'Local AI and workflow software for target naming, segmentation review, treatment planning validation, and clinical QA.',
    outcome: 'AAPM Blue Ribbon work, UAB clinical AI profile, and continuing doctoral direction.',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  {
    image: imageAssets.monaiPr,
    title: 'MONAI tutorials contribution',
    type: 'Open source',
    stack: 'Python · MONAI · PyTorch',
    text: 'Auto3DSeg tutorial contribution and review collaboration for medical-imaging deep-learning users.',
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
    title: 'Glioblastoma whole-slide image analysis',
    type: 'Cancer imaging',
    stack: 'Python · Deep learning · CUDA · WSI pipelines',
    text: 'Repository for detecting glioblastoma characteristics using deep learning and computer-vision methods over whole-slide imagery.',
    outcome: 'Public template repository with preprocessing, web scraping, and multiple training approaches.',
    href: 'https://github.com/udiram/Glioblastoma_analysis',
  },
  {
    title: 'Formula 1 lap-time simulation',
    type: 'Performance modeling',
    stack: 'C++ · ODEs · Vehicle dynamics',
    text: 'Modelled tire degradation and environmental effects for Formula 1 lap-time simulation using ordinary differential equations.',
    outcome: 'Public modelling project connecting race engineering and computational simulation.',
    href: 'https://github.com/udiram/formula1_laptime_simulation',
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
  {
    title: 'OpenPilot / autonomous car conversion',
    type: 'Autonomy',
    stack: 'comma.ai · openpilot · Driver assistance',
    text: 'Implemented a level 2 driver-assistance system using comma.ai and openpilot implementations.',
    outcome: 'Hands-on autonomy project connecting perception, controls, and practical vehicle systems.',
    href: 'https://sites.google.com/view/udbhav-ram/projects',
  },
]

const featuredWork = [
  {
    image: imageAssets.uabPresentation,
    title: 'Local LLMs for clinical naming QA',
    meta: 'AAPM 2025 · Blue Ribbon Poster',
    text: 'A reviewer-controlled workflow for improving TG-263 target-name compliance with locally hosted language models—keeping clinical data and human judgment in the loop.',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
  },
  {
    image: imageAssets.uabRadonc,
    title: 'Adaptive RT and imaging AI',
    meta: 'UAB Radiation Oncology · JACMP · Intelligent Oncology',
    text: 'Validation, segmentation, and follow-up imaging systems designed around the realities of radiotherapy planning, PACS review, and multidisciplinary clinical work.',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  {
    image: imageAssets.arrowMcLaren,
    title: 'Performance engineering under pressure',
    meta: 'Arrow McLaren · Data & Strategy · 2023',
    text: 'Deterministic simulation, telemetry monitoring, and strategy tooling for race weekends—habits that still shape how I build reliable clinical systems.',
    href: 'https://sites.google.com/view/udbhav-ram/motorsports',
  },
]

const proofItems = [
  {
    title: 'McMaster student and UAB mentor drive changes in medicine through AI',
    source: 'UAB Medicine · June 2024',
    text: 'Profile on work with Carlos Cardenas, AI tools for radiation treatment and planning, and the McMaster-UAB partnership.',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  {
    title: 'Undergrad adds international visiting scholar in radiation oncology to résumé',
    source: 'McMaster News · July 2024',
    text: 'Feature covering the UAB co-op, clinical deployment of deep learning systems, radiotherapy QA software, McLaren, and broader research/work history.',
    href: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/',
  },
  {
    title: "Udbhav Ram's co-op supervisors flew in from Alabama to give him an award",
    source: 'McMaster Daily News · March 2026',
    text: 'Feature on Science Co-op Student of the Year, peer-reviewed UAB research, conference visibility, and mentoring other co-op students.',
    href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
  },
  {
    title: 'Convocation countdown with Udbhav Ram',
    source: 'McMaster Science · 2026',
    text: 'Graduation profile covering Medical Physics with Co-op, UAB, mentorship, Health Physics, and the path into graduate training.',
    href: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
  },
  {
    title: 'Cardenas receives McMaster Co-op Emerging Employer of the Year Award',
    source: 'UAB Medicine · 2025',
    text: 'Recognition for Carlos Cardenas and the UAB Radiation Oncology team for mentorship and a rich international co-op experience.',
    href: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award',
  },
  {
    title: 'Recognizing Excellence in Science: Co-op Employer of the Year Awards',
    source: 'McMaster Science · 2024',
    text: 'McMaster recognition of supervisors and employers who created exceptional science co-op experiences.',
    href: 'https://careers.science.mcmaster.ca/recognizing-excellence-in-science-2024-co-op-employer-of-the-year-awards/',
  },
]

const recognitionRows = [
  ['2026', 'Science Co-op Student of the Year', 'McMaster Year 5 award; UAB supervisors travelled to present it in person.'],
  ['2025', 'AAPM Blue Ribbon Poster', 'Highest-scoring abstract designation for locally hosted LLMs and TG-263 target-name compliance.'],
  ['2025', 'Global Experience Award', 'McMaster support for international co-op experience and global research collaboration.'],
  ['2024', 'Outstanding Poster Presentation', 'Society of Physics Students-AAPM undergraduate research competition with full scholarship to SPS PhysCon.'],
  ['2023', 'Best Talk, CUPC', 'First prize for work on optimizing dose delivery during fractionated radiotherapy.'],
  ['2021-2026', 'Dean\'s List / entrance scholarship', 'Academic recognition through McMaster Medical Physics and Faculty of Science.'],
]

const certificationRows = [
  ['2025', 'Ethos Adaptive Radiotherapy Course', 'Credentialing-oriented training in Varian Ethos adaptive radiotherapy workflows.'],
  ['2025', 'Stereotactic Radiosurgery Course', 'UAB training connected to SRS planning and clinical implementation.'],
  ['2025', 'Advanced Open Water Diver', 'PADI advanced open water certification.'],
  ['2023-Present', 'Private Pilot License training', 'Transport Canada pathway in progress.'],
  ['2023', 'Grade C Racing License', 'Federation of Motor Sports Clubs of India.'],
  ['2019', 'RYT-200 Yoga Teacher', 'Yoga Alliance-certified instructor; head yoga instructor roles at McMaster and Anytime Fitness.'],
  ['2019', 'DELF B2 French', 'French language certification; fluent French listed in professional skills.'],
  ['2019', 'RCM music', 'Royal Conservatory Level 8 violin and Level 9 piano.'],
]

const leadershipRows = [
  ['2025-Present', 'International Visiting Scholar / Student Ambassador', 'UAB and Mary Heersink Institute for Global Health; supported the McMaster-UAB institutional relationship.'],
  ['2025-Present', 'President, Hindu YUVA McMaster', 'Community, cultural, and values-based programming.'],
  ['2024-Present', 'Vice President, Cultural Affairs, Hindu YUVA UAB', 'Built community while working away from home during UAB placement.'],
  ['2024-2025', 'Teaching Assistant and student mentor', 'Introductory mechanics, electricity and magnetism, physics mentorship, and co-op document/interview support.'],
  ['2021-2024', 'Humber River Hospital volunteer', 'Medical Imaging, Surgical Inpatient, and Information Services support.'],
]

const activityArchive = [
  ['Clinical & service', 'UAB radiation-oncology and medical-physics shadowing; Humber River Hospital volunteering across medical imaging, surgical inpatient, and information services.'],
  ['Engineering & outreach', "MAC Formula SAE Electric controls and dashboard software; FRC Team 4939 senior programmer; Zone01 lead mentor; Sparkin' STEM French program coordination."],
  ['Movement & outdoors', 'Registered yoga instructor; advanced open-water scuba diver; equestrian experience; school hockey; provincial badminton runner-up.'],
  ['Music & language', 'Western and Carnatic violin, Indian classical vocal performance, Royal Conservatory piano, and DELF B2 French.'],
  ['Flight & driving', 'Private-pilot training, Formula LGB 1300 development driving, VW Polo Cup testing, and an FMSCI Grade C racing license.'],
]

const originalAwardArchive = [
  'Advanced Placement Scholar with Distinction',
  'HOSA national second place',
  'Top 25% in Mathematics',
  'Certified Yoga Teacher',
  'French Language Certification',
  'Provincial Chess Champion',
  'Medical Youth Summer Program',
  'The Mirai Project runner-up',
  'Computer Science Competency',
  'Five-time piano bronze medalist',
  'Three-time piano silver medalist',
  'Three-time piano gold medalist',
  'Robotics Lead Mentor',
  'GRAMEN Spelling Bee semi-finalist',
  'CPR, First Aid, and AED certification',
  'Go-karting provincial runner-up',
  'Badminton provincial runner-up',
  'Robotics provincial runner-up',
  'FIRST Robotics Competition semi-finalist',
]

const parityNotes = [
  ['Affiliations', 'Research Fellow, Hamilton Centre for Kidney Research at St. Joseph’s Healthcare Hamilton; researcher at Western University / Lawson Health Research Institute; Laboratory for Membrane and Protein Dynamics at McMaster Physics and Astronomy.'],
  ['Full-stack practice', 'Published client/server applications; Flask and Django mathematical or deep-learning backends; Android, iOS, and web frontends; Azure, Google Cloud, and AWS CI/CD pipelines; DevOps/backend lead work with WAAW Group.'],
  ['Hackathons', 'Runner-up, SPARK Hackathon 2019 for a computer-vision and machine-learning recycling sorter; runner-up, Mirai Project 2020 medical case study.'],
  ['Community', 'Hindu YUVA programming at UAB and McMaster centered on promoting, practicing, protecting, and preserving Hindu values.'],
  ['Sport & arts detail', 'Member of Equestrian Canada and Ontario Equestrian with 5+ years of English and Western experience; school ice hockey from 2018–2020; 7+ years of Western violin and Central Peel Regional Strings graduation; 10+ years each of Carnatic violin and vocal performance.'],
]

const archiveItems = [
  {
    image: imageAssets.arrowMcLaren,
    title: 'Motorsports',
    text: 'Arrow McLaren data and strategy internship, MAC Formula Electric controls/dashboard work, Formula LGB 1300 development driving, VW Polo Cup testing, and an FMSCI racing license.',
  },
  {
    image: imageAssets.prostheticSite,
    title: 'Robotics & STEM outreach',
    text: "Automated prosthetic limb prototype, senior programming and outreach on FRC Team 4939, Robotique Zone01 lead mentorship, and Sparkin' STEM French curriculum coordination.",
  },
  {
    image: imageAssets.uabPresentation,
    title: 'Clinical service, teaching, and mentorship',
    text: 'Radiation oncology and medical physics shadowing, hospital volunteering, McMaster teaching assistant work, co-op mentoring, and yoga instruction.',
  },
  {
    image: imageAssets.uabPresentation,
    title: 'Creative discipline and languages',
    text: 'Western and Carnatic violin, piano, Indian classical vocal music, English/Tamil/French/Spanish language background, scuba diving, equestrian training, hockey, and badminton.',
  },
]

const hashAliases: Record<string, SectionId> = {
  profile: 'trajectory',
  education: 'trajectory',
  experience: 'trajectory',
  skills: 'trajectory',
  affiliations: 'trajectory',
  presentations: 'research',
  publications: 'research',
  projects: 'work',
  software: 'work',
  openSource: 'work',
  'open-source': 'work',
  proof: 'archive',
  awards: 'archive',
  media: 'archive',
  certifications: 'archive',
  leadership: 'archive',
  activities: 'archive',
  motorsports: 'archive',
}

function Icon({ name }: { name: IconName }) {
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
    youtube: (
      <>
        <path d="M4 6.5c2.8-.5 9.2-.5 12 0 .5 2.1.5 4.9 0 7-2.8.5-9.2.5-12 0-.5-2.1-.5-4.9 0-7z" />
        <path d="m8.5 8.2 3.5 1.8-3.5 1.8z" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6.5h12M4 10h12M4 13.5h12" />
      </>
    ),
    close: (
      <>
        <path d="m5.5 5.5 9 9M14.5 5.5l-9 9" />
      </>
    ),
    moon: <path d="M14.7 13.4A6.2 6.2 0 0 1 6.6 5.3 6.7 6.7 0 1 0 14.7 13.4z" />,
    sun: (
      <>
        <circle cx="10" cy="10" r="3.2" />
        <path d="M10 2.8v1.4M10 15.8v1.4M4.2 4.2l1 1M14.8 14.8l1 1M2.8 10h1.4M15.8 10h1.4M4.2 15.8l1-1M14.8 5.2l1-1" />
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
      const target = document.getElementById(hashAliases[decodedHash] ?? decodedHash)
      if (!target) return false

      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' })

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

    let frameId = 0

    const setFromHash = () => {
      const rawHash = window.location.hash.slice(1)
      const sectionId = hashAliases[rawHash] ?? rawHash
      if (navItems.some((item) => item.id === sectionId)) {
        setActiveSection(sectionId as SectionId)
      }
    }

    const updateFromScroll = () => {
      const isAtPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6
      if (isAtPageEnd) {
        setActiveSection('contact')
        return
      }

      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const rawHash = window.location.hash.slice(1)
      const hashedSectionId = hashAliases[rawHash] ?? rawHash
      const hashedSection = navItems.some((item) => item.id === hashedSectionId) ? document.getElementById(hashedSectionId) : null
      const hashedRect = hashedSection?.getBoundingClientRect()
      if (hashedRect && hashedRect.top < window.innerHeight * 0.48 && hashedRect.bottom > headerHeight) {
        setActiveSection(hashedSectionId as SectionId)
        return
      }

      const targetLine = headerHeight + 96
      const currentSection =
        sections
          .map((section) => ({ id: section.id as SectionId, top: section.getBoundingClientRect().top }))
          .filter((section) => section.top <= targetLine)
          .at(-1)?.id ?? 'home'

      setActiveSection(currentSection)
    }

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(updateFromScroll)
    }

    const handleHashChange = () => {
      setFromHash()
      scheduleUpdate()
      window.setTimeout(updateFromScroll, 240)
      window.setTimeout(updateFromScroll, 700)
    }

    setFromHash()
    updateFromScroll()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('hashchange', handleHashChange)
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
        <a className="header-action" href={resumeHref} download>
          CV <Icon name="download" />
        </a>
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
        <h1>Build for the clinic.<br /><em>Think like a race engineer.</em></h1>
        <p className="role-line">I’m Udbhav Ram—a UW–Madison Medical Physics PhD student building clinical AI, imaging systems, and evidence-backed software for real teams.</p>
        <p className="hero-summary">My work spans adaptive radiotherapy, local LLM workflows, open-source medical imaging, and the performance discipline I learned in motorsports.</p>
        <div className="hero-actions">
          <a className="button primary" href="#work">
            Explore selected work <Icon name="arrow" />
          </a>
          <a className="button secondary" href={resumeHref} download>
            Download CV <Icon name="download" />
          </a>
        </div>
      </div>
      <div className="hero-media">
        <ImageFrame image={imageAssets.heroPortrait} className="hero-image" />
        <div className="hero-note" aria-label="Current position">
          <strong>UW-Madison Medical Physics PhD</strong>
          <p>Clinical AI · Imaging · Adaptive radiotherapy</p>
        </div>
      </div>
      <ul className="hero-proof" aria-label="Profile highlights">
        {[
          ['UW–Madison', 'Medical Physics PhD'],
          ['UAB', 'Radiation Oncology collaborator'],
          ['AAPM', '2025 Blue Ribbon Poster'],
          ['Arrow McLaren', 'Data & Strategy'],
        ].map(([label, value]) => (
          <li key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Profile() {
  return (
    <section className="section" id="trajectory">
      <SectionIntro
        title="Trajectory"
        text="The through-line is clinical translation: systems that survive contact with workflow, evidence, high-pressure operations, and multidisciplinary review."
      />
      <div className="profile-narrative">
        {profileNarrative.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
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
                  {item.logo ? (
                    <img src={item.logo.src} alt={item.logo.alt} />
                  ) : (
                    <span className="logo-wordmark" aria-label={`${item.place} mark`}>
                      {item.mark}
                      <small>{item.markDetail}</small>
                    </span>
                  )}
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
      <div className="skill-matrix" aria-label="Skills">
        {skillGroups.map((group) => (
          <article key={group.title}>
            <h3>{group.title}</h3>
            <div>
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Research() {
  return (
    <section className="section research-section" id="research">
      <SectionIntro
        title="Research"
        text="A fuller research record across clinical AI, adaptive radiotherapy, SRS planning, auto-segmentation, PACS-integrated imaging, biophysics, and computational oncology."
        action={
          <ExternalLink href="https://scholar.google.com/scholar?q=%22Udbhav+Ram%22" className="text-link">
            Google Scholar <Icon name="arrow" />
          </ExternalLink>
        }
      />
      <div className="case-strip" aria-label="Research and engineering montage">
        <ImageFrame image={imageAssets.heroCollage} />
        <div><span>Evidence in motion</span><strong>Imaging → inference → clinical review</strong></div>
      </div>
      <div className="research-list">
        {researchHighlights.map((item) => (
          <ExternalLink href={item.href} className="research-row" key={item.title}>
            <span>{item.venue}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <b>
              Open paper <Icon name="arrow" />
            </b>
          </ExternalLink>
        ))}
      </div>
      <div className="research-tracks">
        {researchProjectRows.map(([title, text]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
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
      <div className="ledger-panel presentation-panel">
        <h3>Presentations & invited talks</h3>
        <div className="timeline-ledger">
          {presentationRows.map(([year, event, detail]) => (
            <article key={`${year}-${event}`}>
              <span>{year}</span>
              <div>
                <strong>{event}</strong>
                <p>{detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <nav className="talk-links" aria-label="Original presentation links">
        {presentationLinks.map(([year, title, href]) => (
          <ExternalLink href={href} key={`${year}-${title}`}><span>{year}</span><strong>{title}</strong><Icon name="arrow" /></ExternalLink>
        ))}
      </nav>
      <details className="archive-drawer">
        <summary>Complete original research archive <span>{originalResearchArchive.length} projects</span></summary>
        <ol>
          {originalResearchArchive.map((item) => <li key={item}>{item}</li>)}
        </ol>
        <nav className="source-links" aria-label="Original research documents">
          {originalSourceLinks.map(([title, href]) => <ExternalLink href={href} key={href}>{title}<Icon name="arrow" /></ExternalLink>)}
        </nav>
      </details>
    </section>
  )
}

function Projects() {
  return (
    <section className="section work-section" id="work">
      <SectionIntro
        title="Selected Work"
        text="Three worlds, one operating principle: make complex systems understandable, testable, and useful when the stakes are real."
        action={
          <ExternalLink href="https://github.com/udiram" className="text-link">
            GitHub <Icon name="arrow" />
          </ExternalLink>
        }
      />
      <div className="featured-work">
        {featuredWork.map((item, index) => (
          <ExternalLink href={item.href} className="featured-chapter" key={item.title}>
            <div className="featured-media"><ImageFrame image={item.image} /></div>
            <div className="featured-copy">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <strong>{item.meta}</strong>
              <p>{item.text}</p>
              <b>Open evidence <Icon name="arrow" /></b>
            </div>
          </ExternalLink>
        ))}
      </div>
      <div className="section-subhead">
        <h3>More software & systems</h3>
        <p>Open-source contributions, research tools, autonomy experiments, and archived engineering work.</p>
      </div>
      <div className="project-grid">
        {projectRows.map((item) => (
          <ExternalLink href={item.href} className="project-card" key={item.title}>
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
          </ExternalLink>
        ))}
      </div>
    </section>
  )
}

function Proof() {
  return (
    <section className="section proof-section" id="archive">
      <SectionIntro
        title="Archive & Range"
        text="External profiles, awards, certifications, leadership, and activities that show the broader shape of the work and the person behind it."
      />
      <div className="proof-hero">
        <ImageFrame image={imageAssets.coopAward} />
        <div>
          <span>Recognition</span>
          <h3>Science Co-op Student of the Year</h3>
          <p>McMaster recognition tied to the UAB Radiation Oncology placement and clinical AI work.</p>
        </div>
      </div>
      <div className="proof-layout">
        <div className="media-list">
          {proofItems.map((item) => (
            <ExternalLink href={item.href} className="media-card" key={item.title}>
              <span>{item.source}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
              <b>
                Read source <Icon name="arrow" />
              </b>
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
      <div className="two-column proof-columns">
        <div className="ledger-panel">
          <h3>Certifications & licenses</h3>
          <div className="timeline-ledger">
            {certificationRows.map(([year, title, detail]) => (
              <article key={title}>
                <span>{year}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="ledger-panel">
          <h3>Leadership & service</h3>
          <div className="timeline-ledger">
            {leadershipRows.map(([year, title, detail]) => (
              <article key={title}>
                <span>{year}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className="archive-list">
        {archiveItems.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <div className="range-archive">
        <div>
          <h3>Beyond the lab</h3>
          <p>The full range preserved from the original portfolio—from clinical service and engineering outreach to music, diving, flight, and competitive sport.</p>
        </div>
        <div className="activity-ledger">
          {activityArchive.map(([title, text]) => (
            <article key={title}><strong>{title}</strong><p>{text}</p></article>
          ))}
        </div>
      </div>
      <details className="archive-drawer awards-drawer">
        <summary>Earlier awards & certifications <span>{originalAwardArchive.length} records</span></summary>
        <ul className="award-cloud">
          {originalAwardArchive.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <nav className="source-links" aria-label="Recognition sources">
          {recognitionLinks.map(([title, href]) => <ExternalLink href={href} key={href}>{title}<Icon name="arrow" /></ExternalLink>)}
        </nav>
      </details>
      <div className="parity-ledger" aria-label="Original portfolio detail">
        {parityNotes.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}
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
          <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Email
          <input autoComplete="email" inputMode="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="message-field">
          Message
          <textarea minLength={12} value={message} onChange={(event) => setMessage(event.target.value)} required rows={5} />
        </label>
        <button className="button primary" type="submit">
          Open email draft <Icon name="mail" />
        </button>
        <p className="form-note">This opens your default email app. You can also email <a href="mailto:ramu@mcmaster.ca">ramu@mcmaster.ca</a> directly.</p>
      </form>
    </section>
  )
}

function App() {
  useHashScroll()
  const activeSection = useActiveSection()
  const footerYear = useMemo(() => new Date().getFullYear(), [])
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(themeStorageKey, theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#080b10' : '#f6f7f8')
  }, [theme])

  return (
    <div className="portfolio-site" data-theme={theme}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header activeSection={activeSection} onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))} theme={theme} />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Projects />
        <Research />
        <Profile />
        <Proof />
        <Contact />
      </main>
      <footer className="site-footer">
        <span>© {footerYear} Udbhav Ram</span>
        <span>Medical physics · clinical AI · software</span>
      </footer>
    </div>
  )
}

export default App
