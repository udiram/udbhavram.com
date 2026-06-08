import { useLayoutEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import './App.css'

type SectionId = 'home' | 'education' | 'experience' | 'research' | 'software' | 'performance' | 'recognition' | 'proof' | 'archive' | 'contact'

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
  category: 'Clinical AI' | 'Open source' | 'Web systems' | 'Research tools' | 'Robotics & Outreach'
  status: 'Public' | 'Open source' | 'Archive' | 'Internal'
  period?: string
  responsibilities?: string[]
  outcome?: string
  href?: string
  linkLabel?: string
}

type ProofItem = LinkItem & {
  sourceName: string
  date: string
  category: string
  summary: string
  highlights: string[]
}

type ArchiveEntry = {
  title: string
  role: string
  period: string
  context: string
  responsibilities: string[]
  outcome?: string
  href?: string
}

type ArchiveGroup = {
  title: string
  summary: string
  entries: ArchiveEntry[]
}

type SocialItem = {
  label: string
  href: string
  icon: 'mail' | 'github' | 'scholar' | 'linkedin' | 'medium'
}

type RecognitionItem = {
  year: string
  title: string
  detail: string
  href: string
  type: string
  source: string
  basis: string
  highlights: string[]
}

type CertificationItem = {
  title: string
  group: string
  period: string
  detail: string
  evidence: string
  href: string
}

type ResumeEntry = {
  title: string
  organization: string
  period: string
  location?: string
  summary?: string
  responsibilities: string[]
}

type EducationEntry = {
  degree: string
  institution: string
  period: string
  location: string
  detail: string
  responsibilities: string[]
  division: string
  visual: ImageAsset
  logo?: ImageAsset
}

type PerformanceRole = {
  title: string
  meta: string
  period: string
  location?: string
  image: ImageAsset
  responsibilities: string[]
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
  mcmasterScienceLogo: {
    src: '/assets/sourced/mcmaster-science.png',
    alt: 'McMaster University Brighter World logo',
    source: 'https://brand.mcmaster.ca/guidelines_introduction/logos-and-marks/logos-and-marks-cont-mcmaster-logo-minimal-size/',
  },
  uwMadisonLogo: {
    src: '/assets/sourced/uw-madison-logo.png',
    alt: 'University of Wisconsin-Madison official crest logo',
    source: 'https://brand.wisc.edu/resource/uw-institutional-logos-for-web-digital-use/',
  },
  uwMedicalPhysics: {
    src: '/assets/sourced/uw-medical-physics-graduates.jpg',
    alt: 'UW-Madison Department of Medical Physics graduates',
    source: 'https://medphysics.wisc.edu/',
  },
  uabRadonc: {
    src: '/assets/sourced/screens/uab-radonc-page.png',
    alt: 'UAB Radiation Oncology official page screenshot',
    source: 'https://www.uab.edu/medicine/radonc/',
  },
  uabRadoncTreatment: {
    src: '/assets/sourced/uab-radonc-treatment-hero.png',
    alt: 'UAB Radiation Oncology treatment planning visual',
    source: 'https://www.uab.edu/medicine/radonc/',
  },
  arrowMcLarenRace: {
    src: '/assets/sourced/arrow-mclaren-race.png',
    alt: 'Arrow McLaren IndyCar on track from the original portfolio motorsports page',
    source: 'https://sites.google.com/view/udbhav-ram/motorsports',
  },
  arrowMcLaren: {
    src: '/assets/sourced/screens/arrow-mclaren-page.png',
    alt: 'Arrow McLaren IndyCar official page screenshot',
    source: 'https://www.mclaren.com/racing/indycar/',
  },
  macFormulaSae: {
    src: '/assets/sourced/motorsports/mac-formula-sae.png',
    alt: 'McMaster Formula SAE Electric race car from the original portfolio motorsports page',
    source: 'https://sites.google.com/view/udbhav-ram/motorsports',
  },
  formulaLgb: {
    src: '/assets/sourced/motorsports/formula-lgb.jpg',
    alt: 'Formula LGB 1300 driver development car from the original portfolio motorsports page',
    source: 'https://sites.google.com/view/udbhav-ram/motorsports',
  },
  vwPoloCup: {
    src: '/assets/sourced/motorsports/vw-polo-cup.jpg',
    alt: 'VW Polo Cup test driver cockpit photo from the original portfolio motorsports page',
    source: 'https://sites.google.com/view/udbhav-ram/motorsports',
  },
} satisfies Record<string, ImageAsset>

const navItems: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'research', label: 'Research' },
  { id: 'software', label: 'Software' },
  { id: 'performance', label: 'Performance' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'proof', label: 'Proof' },
  { id: 'archive', label: 'Archive' },
  { id: 'contact', label: 'Contact' },
]

const resumeHref = '/assets/Udbhav_Ram_resume.pdf'
const oldSiteLinks = {
  awards: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications',
  activities: 'https://sites.google.com/view/udbhav-ram/activities',
  projects: 'https://sites.google.com/view/udbhav-ram/projects',
  motorsports: 'https://sites.google.com/view/udbhav-ram/motorsports',
  research: 'https://sites.google.com/view/udbhav-ram/research',
}

const researchItems: ResearchItem[] = [
  {
    title: 'Improving TG-263 target name compliance using locally hosted large language models',
    status: 'Blue Ribbon Poster',
    venue: 'AAPM 2025',
    summary:
      'Local LLM review flows for target-name compliance, clinical interface automation, and reviewer-controlled workflow checks.',
    methods: ['Local LLM review', 'TG-263 standardization', 'Clinical workflow UI'],
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
    image: imageAssets.uabClinic,
  },
  {
    title: 'Ethos 2.0 high-fidelity SRS validation',
    status: 'Published',
    venue: 'JACMP 2025',
    summary:
      'Validation of high-fidelity Ethos planning for multi-met single-isocentre SRS with semi-automated plan comparison.',
    methods: ['Treatment planning', 'Automation', 'SRS validation'],
    href: 'https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/acm2.70370',
    image: imageAssets.uabPresentation,
  },
  {
    title: 'Assessing deep learning frameworks for CT abdominal organ auto-segmentation',
    status: 'Peer-reviewed',
    venue: 'Intelligent Oncology 2025',
    summary:
      'Quantitative and expert review of abdominal organ segmentation frameworks for clinically relevant model comparison.',
    methods: ['Auto-segmentation', 'Expert review', 'Model evaluation'],
    href: 'https://doi.org/10.1016/j.intonc.2025.03.003',
    image: imageAssets.mcmasterScholar,
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
    status: 'Open source',
    period: 'Open source',
    responsibilities: ['Contributed documentation and tutorial improvements for medical imaging deep-learning users.'],
    outcome: 'Merged contribution to Project MONAI tutorials.',
    href: 'https://github.com/Project-MONAI/tutorials/pull/1129',
    linkLabel: 'View pull request',
  },
  {
    title: 'OpenHands engineering contribution',
    purpose: 'Agent framework improvements for software tasks',
    stack: 'Python, FastAPI, React',
    role: 'Contributor',
    category: 'Open source',
    status: 'Open source',
    period: 'Open source',
    responsibilities: ['Worked in an agent software stack spanning Python backend surfaces and React/FastAPI application code.'],
    outcome: 'Merged contribution to OpenHands.',
    href: 'https://github.com/All-Hands-AI/OpenHands/pull/731',
    linkLabel: 'View pull request',
  },
  {
    title: 'TG-263 local LLM tool',
    purpose: 'Local naming-compliance interface with visible reviewer control',
    stack: 'Local LLM, clinical UI, radiation oncology',
    role: 'Developer',
    category: 'Clinical AI',
    status: 'Public',
    period: '2025',
    responsibilities: ['Designed local LLM review flows for target-name compliance.', 'Built around reviewer-controlled checks for clinical workflow use.'],
    outcome: 'AAPM 2025 Blue Ribbon Poster.',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
    linkLabel: 'View abstract',
  },
  {
    title: 'Clinical UI automation benchmark',
    purpose: 'Objective tests for VLM agents around clinical interfaces',
    stack: 'Python, Playwright, VLM evaluation',
    role: 'Researcher',
    category: 'Research tools',
    status: 'Internal',
    responsibilities: ['Created objective tests for vision-language agents operating around clinical interface tasks.'],
    outcome: 'Internal research tooling for clinical AI evaluation.',
  },
  {
    title: 'AAPM conference explorer',
    purpose: 'Search and schedule workflow for dense conference content',
    stack: 'Flask, SQLAlchemy, Railway',
    role: 'Developer',
    category: 'Web systems',
    status: 'Internal',
    responsibilities: ['Built a search and schedule workflow for navigating dense conference content.', 'Deployed the app with a Flask and SQLAlchemy backend on Railway.'],
    outcome: 'Prototype available on request.',
  },
  {
    title: 'Automated prosthetic limb prototype',
    purpose: 'Mechatronic control and embedded systems project',
    stack: 'C++, Python, ROS',
    role: 'Lead developer',
    category: 'Research tools',
    status: 'Archive',
    responsibilities: ['Led embedded and robotics software work for an automated prosthetic limb prototype.'],
    href: 'https://sites.google.com/view/prostheticlimbprototype/home',
    linkLabel: 'View archive',
  },
  {
    title: 'Synth-Med Biotechnology',
    purpose: 'Company site and technical content system',
    stack: 'Next.js, TypeScript',
    role: 'Founder',
    category: 'Web systems',
    status: 'Public',
    responsibilities: ['Led full-stack web development and technical content for Synth-Med Biotechnology.'],
    href: 'https://synth-med.com/about/',
    linkLabel: 'Open site',
  },
  {
    title: 'Autonomous car conversion',
    purpose: 'Level 2 driver-assistance conversion using comma.ai and openpilot implementations',
    stack: 'Openpilot, vehicle integration, driver assistance',
    role: 'Builder',
    category: 'Research tools',
    status: 'Archive',
    responsibilities: ['Implemented a Level 2 driver-assistance system using comma.ai and openpilot implementations.'],
    href: oldSiteLinks.projects,
    linkLabel: 'View archive',
  },
  {
    title: 'WAAW group infrastructure',
    purpose: 'DevOps infrastructure and backend systems for a team software environment',
    stack: 'Backend systems, DevOps, deployment',
    role: 'Infrastructure lead',
    category: 'Web systems',
    status: 'Internal',
    responsibilities: ['Led DevOps infrastructure and backend work for a team software environment.'],
  },
  {
    title: 'Robotique Zone01 and FRC 4939',
    purpose: 'Robotics programming, outreach, mentoring, and competition support',
    stack: 'Robotics, controls, outreach',
    role: 'Lead mentor and senior programmer',
    category: 'Robotics & Outreach',
    status: 'Archive',
    responsibilities: ['Mentored robotics students through Robotique Zone01.', 'Served as senior programmer and outreach member for FRC Team 4939.'],
    href: oldSiteLinks.projects,
    linkLabel: 'View archive',
  },
  {
    title: "Sparkin' STEM French curriculum",
    purpose: 'Integrated STEM curriculum with a large French school board in Canada',
    stack: 'Curriculum design, STEM outreach, bilingual programming',
    role: 'French program coordinator',
    category: 'Robotics & Outreach',
    status: 'Archive',
    responsibilities: ['Led integration of in-house STEM curriculum with the largest French school board in Canada.'],
    href: oldSiteLinks.projects,
    linkLabel: 'View archive',
  },
  {
    title: 'SPARK recycling sorter',
    purpose: 'Computer vision and machine-learning powered recycling sorter; SPARK hackathon runner-up',
    stack: 'Computer vision, machine learning, prototyping',
    role: 'Hackathon builder',
    category: 'Research tools',
    status: 'Archive',
    period: '2019',
    responsibilities: ['Built a computer vision and machine-learning powered recycling sorter.'],
    outcome: 'SPARK Hackathon runner-up.',
    href: oldSiteLinks.projects,
    linkLabel: 'View archive',
  },
  {
    title: 'The Mirai Project',
    purpose: 'Medical case-study finalist work',
    stack: 'Clinical reasoning, case analysis',
    role: 'Runner-up finalist',
    category: 'Clinical AI',
    status: 'Archive',
    period: '2020',
    responsibilities: ['Developed medical case-study analysis for a finalist competition workflow.'],
    outcome: 'Runner-up finalist.',
    href: oldSiteLinks.projects,
    linkLabel: 'View archive',
  },
]

const proofItems: ProofItem[] = [
  {
    label: 'McMaster student and UAB mentor drive changes in medicine through AI',
    sourceName: 'UAB Medicine',
    date: 'June 2024',
    category: 'Clinical AI profile',
    meta: 'AI and radiation oncology profile',
    summary: 'UAB profile on the McMaster-UAB collaboration with Carlos Cardenas, focused on artificial-intelligence tools for radiation treatment and planning.',
    highlights: ['Worked with UAB collaborators since 2021, first remotely and then on campus in Birmingham.', 'Connected research software, clinical AI, and radiation oncology workflow problems.', 'Positioned the work as part of an international McMaster-UAB medical collaboration.'],
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
    image: imageAssets.uabMentor,
  },
  {
    label: 'McMaster-UAB international visiting scholar',
    sourceName: 'McMaster Science',
    date: '2024',
    category: 'Visiting scholar feature',
    meta: 'International visiting scholar profile',
    summary: 'McMaster coverage of the UAB co-op and visiting-scholar role in radiation oncology, including deep-learning deployment and radiotherapy QA software.',
    highlights: ['Worked on clinical deployment of deep-learning systems.', 'Developed software for radiotherapy quality assurance.', 'Built on earlier UAB Radiation Oncology research in radiomics and CT-image segmentation.'],
    href: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/',
    image: imageAssets.mcmasterScholar,
  },
  {
    label: "Udbhav Ram's co-op supervisors flew in from Alabama to give him an award",
    sourceName: 'McMaster Daily News',
    date: '2025',
    category: 'Award profile',
    meta: 'Science Co-op Student of the Year',
    summary: 'McMaster News profile on receiving Science Co-op Student of the Year recognition after the UAB Radiation Oncology placement.',
    highlights: ['Supervisors from UAB traveled to McMaster to present the recognition in person.', 'Award connected directly to the UAB co-op and international visiting-scholar work.', 'Reinforced the scale of mentorship and trust built during the placement.'],
    href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
    image: imageAssets.coopAward,
  },
  {
    label: 'Carlos Cardenas receives McMaster Co-op Emerging Employer of the Year Award',
    sourceName: 'UAB',
    date: 'June 2025',
    category: 'Mentorship recognition',
    meta: 'Employer award coverage',
    summary: 'UAB coverage of Carlos Cardenas receiving McMaster University Emerging Science Co-op Employer of the Year recognition after the co-op collaboration.',
    highlights: ['Recognition came from a student nomination tied to a rich research and mentorship environment.', 'Article notes AI projects in radiation treatment and planning during the UAB co-op.', 'Frames the collaboration as a model for future McMaster-UAB student exchange.'],
    href: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award',
    image: imageAssets.employerAward,
  },
  {
    label: 'Convocation countdown with Udbhav Ram',
    sourceName: 'McMaster Science',
    date: 'May 2026',
    category: 'Academic profile',
    meta: 'Academic path and next steps',
    summary: 'Faculty of Science convocation profile covering the Medical Physics with Co-op path, mentorship, UAB experience, and next academic steps.',
    highlights: ['Highlights Honours Medical Physics with Co-op at McMaster.', 'Connects the UAB experience to student representation and binational institutional relationships.', 'Captures the transition from undergraduate medical physics toward doctoral work.'],
    href: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
    image: imageAssets.convocation,
  },
  {
    label: 'Recognizing Excellence in Science 2024 Co-op Employer of the Year Awards',
    sourceName: 'McMaster Science',
    date: 'April 2025',
    category: 'Co-op ecosystem',
    meta: 'Co-op award ecosystem',
    summary: 'Faculty of Science context for the co-op employer awards program that recognizes supervisors and employers who create meaningful work terms.',
    highlights: ['Shows the broader McMaster Science co-op recognition structure.', 'Provides institutional context for the UAB employer and student award stories.', 'Links the work to experiential education, mentorship, and professional formation.'],
    href: 'https://careers.science.mcmaster.ca/recognizing-excellence-in-science-2024-co-op-employer-of-the-year-awards/',
    image: imageAssets.employerAwards,
  },
]

const socialItems: SocialItem[] = [
  { label: 'Email', href: 'mailto:ramu@mcmaster.ca', icon: 'mail' },
  { label: 'LinkedIn', href: 'https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/udiram', icon: 'github' },
  { label: 'Google Scholar', href: 'https://scholar.google.com/scholar?q=%22Udbhav+Ram%22', icon: 'scholar' },
  { label: 'Medium', href: 'https://medium.com/@udbhavram41', icon: 'medium' },
]

const profileFacts = [
  ['PhD', 'Medical Physics, University of Wisconsin-Madison'],
  ['Lab', "Ran Zhang's lab"],
  ['Undergrad', 'McMaster Medical & Biological Physics'],
  ['Open source', 'MONAI and OpenHands'],
]

const educationItems: EducationEntry[] = [
  {
    degree: 'PhD in Medical Physics',
    institution: 'University of Wisconsin-Madison',
    period: '2026-Present',
    location: 'Madison, WI',
    detail: "Started doctoral work in Ran Zhang's lab, focused on medical physics, imaging, and clinical AI systems.",
    responsibilities: ['Developing doctoral research direction across medical physics, imaging, and clinical AI.', 'Continuing translational software work for clinical and research workflows.'],
    division: 'Department of Medical Physics · School of Medicine and Public Health',
    visual: imageAssets.uwMedicalPhysics,
    logo: imageAssets.uwMadisonLogo,
  },
  {
    degree: 'BSc Honours Medical & Biological Physics',
    institution: 'McMaster University',
    period: 'Completed 2025',
    location: 'Hamilton, ON',
    detail: 'Built the foundation across medical physics, biophysics, computation, and radiation oncology research.',
    responsibilities: ['Coursework and research foundation across medical physics, biophysics, computer vision, and radiotherapy.', 'Completed co-op and visiting-scholar work connected to radiation oncology and AI.'],
    division: 'Faculty of Science · Department of Physics & Astronomy',
    visual: imageAssets.mcmasterPhysics,
    logo: imageAssets.mcmasterScienceLogo,
  },
  {
    degree: 'International visiting scholar',
    institution: 'UAB Radiation Oncology',
    period: 'Jan-Aug 2024',
    location: 'Birmingham, AL',
    detail: 'Worked on clinical AI, adaptive radiotherapy, treatment planning, and workflow automation with UAB collaborators.',
    responsibilities: ['Worked with UAB collaborators on artificial-intelligence tools for radiation treatment and planning.', 'Contributed to adaptive radiotherapy, treatment-planning validation, and clinical workflow automation projects.'],
    division: 'Department of Radiation Oncology · Heersink School of Medicine',
    visual: imageAssets.uabRadoncTreatment,
  },
]

const experienceItems: ResumeEntry[] = [
  {
    title: 'Medical Physics PhD student',
    organization: 'University of Wisconsin-Madison',
    period: '2026-Present',
    location: 'Madison, WI',
    summary: "Doctoral work in Ran Zhang's lab across medical physics, imaging, clinical AI, and translational software.",
    responsibilities: ['Define doctoral research questions in medical physics and imaging.', 'Build software and AI workflows where clinical precision and human review remain central.'],
  },
  {
    title: 'International visiting scholar',
    organization: 'UAB Radiation Oncology',
    period: 'Jan-Aug 2024; remote collaboration since 2021',
    location: 'Birmingham, AL',
    summary: 'AI, adaptive radiotherapy, treatment planning, clinical workflow automation, and medical physics research.',
    responsibilities: ['Investigated how AI tools can advance radiation treatment and planning.', 'Built and evaluated clinical AI workflows for target naming, auto-segmentation, and adaptive radiotherapy.', 'Presented UAB/McMaster work at AAPM and COMP meetings.'],
  },
  {
    title: 'Researcher',
    organization: 'Hamilton Health Sciences, Juravinski Cancer Centre',
    period: 'Undergraduate research',
    location: 'Hamilton, ON',
    summary: 'Radiotherapy and clinical research context, including treatment-planning work.',
    responsibilities: ['Worked in clinical radiotherapy research contexts.', 'Supported treatment-planning analysis and medical physics research workflows.'],
  },
  {
    title: 'Researcher',
    organization: 'University of Western Ontario, Lawson Health Research Institute',
    period: 'Completed Dec 2022',
    location: 'London, ON',
    summary: 'Machine-learning models using optical brain measurements to predict in vivo hemoglobin oxygenation.',
    responsibilities: ['Developed machine-learning models from optical brain measurement data.', 'Evaluated prediction workflows for in vivo hemoglobin oxygenation.'],
  },
  {
    title: 'Research fellow',
    organization: "Hamilton Centre for Kidney Research, St Joseph's Healthcare Hamilton",
    period: 'Undergraduate research',
    location: 'Hamilton, ON',
    summary: 'Computer vision and augmented-reality work to improve surgical chronic kidney disease model accuracy.',
    responsibilities: ['Built computer-vision and augmented-reality approaches for surgical chronic kidney disease model workflows.', 'Connected technical methods to biomedical research constraints.'],
  },
  {
    title: 'Researcher',
    organization: 'Laboratory for Membrane and Protein Dynamics, McMaster Physics and Astronomy',
    period: 'Completed Jul 2021',
    location: 'Hamilton, ON',
    summary: 'Quantitative analysis of gel electrophoresis on a smartphone and biophysics research foundations.',
    responsibilities: ['Built smartphone-based quantitative analysis workflows for gel electrophoresis.', 'Presented biophysics work through CAP undergraduate research venues.'],
  },
]

const researchArchiveItems = [
  'Evaluation of inter-observer variability for Ethos adaptive accelerated partial breast irradiation plans',
  'Dosimetric comparison of 6X and 10X flattening-filter-free photon beams on a TrueBeam linac using Eclipse TPS',
  'Modelling factors affecting lap-time simulations of Formula One cars using ordinary differential equations',
  'Using deep learning and computer vision models to develop effective driving agents in open-world simulation',
  'Modelling genomic linear-quadratic radiation doses using deep learning and machine-learning techniques',
  '3D abdominal multi-organ segmentation using deep learning and computer vision',
  'Machine-learning models using optical brain measurements to predict in vivo hemoglobin oxygenation',
  'Quantitative gel electrophoresis analysis on a smartphone',
  'Computer vision application to improve accuracy in surgical chronic kidney disease models',
  "The connection between nutrition and Alzheimer's disease",
]

const presentationItems = [
  ['2025', 'AAPM Blue Ribbon Poster, Washington DC: locally hosted LLMs for TG-263 target-name compliance'],
  ['2025', 'SPS invited poster, Denver: Ethos 2.0 high-fidelity SRS validation'],
  ['2024', 'COMP invited speaker, Regina: locally hosted LLMs in radiation oncology'],
  ['2024', 'COMP oral contributor, Regina: Ethos 2.0 high-fidelity mode for multi-met SRS'],
  ['2024', 'AAPM poster, Los Angeles: Ethos high-fidelity SRS comparative analysis'],
  ['2024', 'AAPM poster, Los Angeles: auto-segmentation framework comparison'],
  ['2023', 'CUPC best talk winner: optimizing dose delivery during fractionated radiotherapy'],
  ['2023', 'AAPM interactive e-poster: deep-learning auto-contouring for abdominal normal tissues'],
  ['2022', 'CUMPC and Physics Undergraduate Conference: abdominal multi-organ segmentation workflows'],
  ['2021-2022', 'CAP oral presentations: gel electrophoresis smartphone analysis and AR kidney-model guidance'],
]

const performanceRoles: PerformanceRole[] = [
  {
    title: 'Arrow McLaren IndyCar',
    meta: 'Data and strategy intern',
    period: 'Race-season internship',
    location: 'Indianapolis, IN',
    image: imageAssets.arrowMcLarenRace,
    responsibilities: [
      'Implemented and developed deterministic simulation for strategy prediction during race sessions.',
      'Applied internal race-weekend tools to monitor telemetry and car performance.',
      'Participated in race, performance, and strategy engineering projects.',
    ],
  },
  {
    title: 'MAC Formula SAE Electric',
    meta: 'Software engineering, vehicle controls and dynamics',
    period: 'McMaster Formula SAE',
    image: imageAssets.macFormulaSae,
    responsibilities: ['Worked on vehicle-controls software.', 'Built custom dashboard implementations for the electric race-car program.'],
  },
  {
    title: 'Formula LGB 1300',
    meta: 'Momentum Motorsports',
    period: 'Driver development',
    image: imageAssets.formulaLgb,
    responsibilities: ['Participated in a Formula LGB 1300 test and development driver program.'],
  },
  {
    title: 'VW Polo Cup',
    meta: 'Madras International Circuit, MRF',
    period: 'Test driver',
    image: imageAssets.vwPoloCup,
    responsibilities: ['Completed VW Polo Cup test-driver experience at Madras International Circuit.'],
  },
]

const recognitionItems: RecognitionItem[] = [
  {
    year: '2025',
    title: 'Blue Ribbon Poster',
    detail: 'Highest-scoring AAPM 2025 abstract designation for LLMs in radiation oncology',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
    type: 'Research award',
    source: 'AAPM Annual Meeting',
    basis: 'Awarded to the highest-scoring abstract designation for work on locally hosted LLMs and TG-263 target-name compliance in radiation oncology.',
    highlights: ['Recognizes scientific merit at a major medical physics meeting.', 'Directly tied to clinical AI, target nomenclature, and reviewer-controlled radiation oncology workflows.'],
  },
  {
    year: '2025',
    title: 'Ethos Adaptive Radiotherapy Course',
    detail: 'Two-and-a-half-day Varian Ethos clinical school credentialing program',
    href: 'https://www.uab.edu/medicine/radonc/education/ethos-adaptive-radiotherapy-course',
    type: 'Clinical training',
    source: 'UAB Radiation Oncology',
    basis: 'Completed a focused clinical-school training program around Varian Ethos adaptive radiotherapy workflows.',
    highlights: ['Adds formal adaptive-radiotherapy training to research and software work.', 'Relevant to treatment-planning, online adaptation, and clinical implementation context.'],
  },
  {
    year: '2025',
    title: 'Science Co-op Student of the Year',
    detail: 'McMaster recognition connected to UAB radiation oncology co-op work',
    href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
    type: 'Student award',
    source: 'McMaster Faculty of Science',
    basis: 'Recognized after the UAB Radiation Oncology co-op, with UAB supervisors traveling to McMaster to present the award.',
    highlights: ['Signals unusually strong supervisor support and work-term impact.', 'Connected to international visiting-scholar work, clinical AI, and radiation oncology research.'],
  },
  {
    year: '2025',
    title: 'Co-op Employer of the Year (Emerging)',
    detail: 'UAB mentors recognized for a strong co-op learning environment',
    href: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award',
    type: 'Mentorship recognition',
    source: 'McMaster / UAB',
    basis: 'Recognition for Carlos Cardenas and the UAB mentorship environment following the McMaster-UAB co-op collaboration.',
    highlights: ['Reflects the quality of the research environment and mentor relationship.', 'UAB coverage frames the collaboration as a model for future international student exchange.'],
  },
  {
    year: '2024',
    title: 'Outstanding Poster Presentation',
    detail: 'Society of Physics Students-AAPM undergraduate research competition',
    href: 'https://www.aapm.org/pubs/newsletter/archive/5001.pdf',
    type: 'Poster award',
    source: 'SPS / AAPM',
    basis: 'Undergraduate poster recognition through the Society of Physics Students and AAPM competition context.',
    highlights: ['Evidence of early medical physics research communication.', 'Adds external validation before the later AAPM Blue Ribbon Poster.'],
  },
  {
    year: '2024-2025',
    title: 'Featured Highlight - McMaster University',
    detail: 'International visiting scholar and convocation profile coverage',
    href: 'https://science.mcmaster.ca/international-visiting-scholar-at-the-university-of-alabama-at-birmingham-the-latest-of-many-achievements-for-mcmaster-science-undergrad/',
    type: 'Institutional feature',
    source: 'McMaster University',
    basis: 'McMaster coverage of the UAB visiting-scholar role, student representation, and academic path through Medical Physics with Co-op.',
    highlights: ['Shows institutional recognition beyond a single award moment.', 'Connects research, co-op, international collaboration, and undergraduate leadership arc.'],
  },
  {
    year: '2024-2025',
    title: 'Featured Highlight - UAB',
    detail: 'UAB and Heersink School of Medicine coverage of AI and radiation oncology work',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
    type: 'Institutional feature',
    source: 'UAB Heersink School of Medicine',
    basis: 'UAB profile on the McMaster student and mentor collaboration around AI for radiation treatment and planning.',
    highlights: ['External clinical institution coverage of research and collaboration.', 'Highlights work with Carlos Cardenas and the AI/radiation oncology research line.'],
  },
  {
    year: '2023',
    title: 'Best Talk, CUPC 2023',
    detail: 'First prize for optimizing dose delivery during fractionated radiotherapy',
    href: oldSiteLinks.research,
    type: 'Presentation award',
    source: 'Canadian Undergraduate Physics Conference',
    basis: 'First-prize talk recognition for work on optimizing dose delivery during fractionated radiotherapy.',
    highlights: ['Early public research communication award.', 'Directly connected to medical physics and radiotherapy optimization.'],
  },
]

const certificationItems: CertificationItem[] = [
  { title: 'Advanced Placement Scholar with Distinction', group: 'Academic credentials', period: 'High school archive', detail: 'College Board recognition for AP exam performance across multiple subjects.', evidence: 'Academic breadth and exam performance before university medical physics.', href: 'https://apstudents.collegeboard.org/awards-recognitions/ap-scholar-award' },
  { title: 'Top 25% in Mathematics', group: 'Academic credentials', period: 'Archive', detail: 'Mathematics recognition from the earlier awards archive.', evidence: 'Quantitative preparation feeding later physics, modeling, and software work.', href: oldSiteLinks.awards },
  { title: 'Computer Science Competency', group: 'Academic credentials', period: 'Archive', detail: 'Computer-science competency credential from the older awards archive.', evidence: 'Early software foundation before web systems, clinical AI, and open-source contributions.', href: oldSiteLinks.awards },
  { title: 'French Language Certification', group: 'Academic credentials', period: 'Archive', detail: 'French-language certification from the awards archive.', evidence: "Supports bilingual outreach work such as Sparkin' STEM French curriculum coordination.", href: oldSiteLinks.awards },
  { title: 'HOSA second place, national recognition', group: 'Healthcare and safety', period: 'Archive', detail: 'National HOSA placement listed in the older awards archive.', evidence: 'Early competitive healthcare-interest signal before hospital service and medical physics.', href: oldSiteLinks.awards },
  { title: 'Medical Youth Summer Program', group: 'Healthcare and safety', period: 'Archive', detail: 'Medical youth program participation recorded in the awards archive.', evidence: 'Early exposure to health-care pathways before radiation oncology research.', href: oldSiteLinks.awards },
  { title: 'CPR, First Aid, and AED certification', group: 'Healthcare and safety', period: 'Archive', detail: 'Safety and emergency-response certification.', evidence: 'Baseline practical training for patient-facing and community contexts.', href: oldSiteLinks.awards },
  { title: 'Certified Yoga Teacher', group: 'Teaching and leadership', period: 'Archive', detail: 'Registered yoga instructor; old site lists head yoga instructor at Anytime Fitness Brampton and instructor at McMaster University.', evidence: 'Sustained teaching, group leadership, and public-facing communication.', href: oldSiteLinks.activities },
  { title: 'Robotics Lead Mentor', group: 'Teaching and leadership', period: 'Archive', detail: 'Lead mentor role for robotics students through Robotique Zone01.', evidence: 'Hands-on technical mentorship and STEM education leadership.', href: oldSiteLinks.projects },
  { title: 'Piano bronze, silver, and gold medals', group: 'Arts and performance', period: 'Archive', detail: 'Royal Conservatory-linked piano recognition from the awards archive.', evidence: 'Long-term disciplined performance training outside technical work.', href: oldSiteLinks.awards },
  { title: 'GRAMEN Spelling Bee Semi-Finalist', group: 'Arts and performance', period: 'Archive', detail: 'Language and competition recognition from the awards archive.', evidence: 'Communication-oriented competitive background.', href: oldSiteLinks.awards },
  { title: 'Provincial Chess Champion', group: 'Competition and sport', period: 'Archive', detail: 'Chess recognition listed in the awards archive.', evidence: 'Strategic competition record that complements technical problem-solving.', href: oldSiteLinks.awards },
  { title: 'Go-karting provincial runner-up', group: 'Competition and sport', period: 'Archive', detail: 'Karting recognition connected to the motorsports archive.', evidence: 'Driver-development foundation behind later performance engineering and simulation work.', href: oldSiteLinks.motorsports },
  { title: 'Badminton provincial runner-up', group: 'Competition and sport', period: 'Archive', detail: 'Provincial badminton recognition listed through the activities archive.', evidence: 'Athletic competition record outside academic and research work.', href: oldSiteLinks.activities },
  { title: 'Robotics provincial runner-up', group: 'Competition and sport', period: 'Archive', detail: 'Robotics competition recognition from the projects archive.', evidence: 'Competitive robotics execution and team-based technical delivery.', href: oldSiteLinks.projects },
  { title: 'FIRST Robotics Competition semi-finalist', group: 'Competition and sport', period: 'Archive', detail: 'FRC Team 4939 competition record.', evidence: 'External robotics competition record through The Blue Alliance.', href: 'https://www.thebluealliance.com/team/4939' },
]

const archiveGroups: ArchiveGroup[] = [
  {
    title: 'Clinical and Service',
    summary: 'Older clinical exposure, hospital service, and community-facing work that shaped the patient-care side of the portfolio.',
    entries: [
      {
        title: 'UAB Radiation Oncology shadowing',
        role: 'Clinical observer',
        period: '2024',
        context: 'Radiation oncology and medical physics exposure during the UAB placement.',
        responsibilities: ['Shadowed radiation oncologists and medical physicists.', 'Observed clinical workflow, treatment-planning context, and patient-care constraints that informed later AI/software work.'],
        outcome: 'Helped ground research tooling in the realities of clinical radiation oncology.',
        href: oldSiteLinks.activities,
      },
      {
        title: 'Humber River Hospital',
        role: 'Hospital volunteer',
        period: 'Pre-undergraduate archive',
        context: 'Volunteer support across Medical Imaging, Surgical Inpatient, and Information Services.',
        responsibilities: ['Assisted physicians, staff, and hospital teams with department-level tasks.', 'Built early familiarity with clinical operations and patient-facing environments.'],
        outcome: 'Early healthcare-service foundation before medical physics research roles.',
        href: oldSiteLinks.activities,
      },
      {
        title: 'Yoga instruction and community programming',
        role: 'Registered yoga instructor',
        period: 'Archive',
        context: 'Head Yoga Instructor for Anytime Fitness Brampton and yoga instructor at McMaster University.',
        responsibilities: ['Led group yoga instruction and wellness programming.', 'Supported community events through UAB Hindu YUVA.'],
        outcome: 'Public-facing leadership experience outside the lab and clinic.',
        href: oldSiteLinks.activities,
      },
    ],
  },
  {
    title: 'Robotics and STEM Outreach',
    summary: 'Robotics, bilingual STEM curriculum, and youth mentorship work that connect software to teaching and outreach.',
    entries: [
      {
        title: 'FRC Team 4939',
        role: 'Senior programmer and outreach member',
        period: 'Archive',
        context: 'FIRST Robotics Competition team work across software and outreach.',
        responsibilities: ['Supported robot programming and technical team execution.', 'Participated in outreach work tied to robotics education.'],
        outcome: 'Archived recognition includes robotics provincial runner-up and FRC semi-finalist context.',
        href: 'https://www.thebluealliance.com/team/4939',
      },
      {
        title: 'Robotique Zone01',
        role: 'Lead mentor',
        period: 'Archive',
        context: 'Mentored students through robotics programming and project work.',
        responsibilities: ['Guided student robotics development and technical problem-solving.', 'Translated programming concepts into approachable mentor-led instruction.'],
        outcome: 'Sustained mentorship role connected to STEM access and robotics education.',
        href: oldSiteLinks.projects,
      },
      {
        title: "Sparkin' STEM",
        role: 'French program coordinator',
        period: 'Archive',
        context: 'Bilingual STEM outreach and curriculum integration.',
        responsibilities: ['Led integration of in-house STEM curriculum with the largest French school board in Canada.', 'Helped adapt STEM instruction for French-language learners and school-board delivery.'],
        outcome: 'Expanded technical outreach beyond single-event programming into curriculum adoption.',
        href: oldSiteLinks.projects,
      },
    ],
  },
  {
    title: 'Sport and Technical Hobbies',
    summary: 'High-discipline activities that sit outside research but still explain the broader operator profile.',
    entries: [
      {
        title: 'Motorsport and driving development',
        role: 'Driver and performance-engineering crossover',
        period: 'Archive',
        context: 'Karting, performance engineering, and driver-development experiences that later connected to Arrow McLaren and simulation work.',
        responsibilities: ['Competed in go-karting with provincial runner-up recognition.', 'Completed driver-development and test-driver experiences documented in the performance section.'],
        outcome: 'Bridge between technical simulation, vehicle dynamics, and lived driver feedback.',
        href: oldSiteLinks.motorsports,
      },
      {
        title: 'Flight, diving, and equestrian training',
        role: 'Technical hobbyist',
        period: 'Archive',
        context: 'Private pilot training at Brampton Flight Centre, NAUI/SSI open-water scuba certification, and Equestrian Canada/Ontario Equestrian membership.',
        responsibilities: ['Built procedural and safety-oriented skills through aviation and diving training.', 'Developed English and Western riding experience over multiple years.'],
        outcome: 'Adds evidence of disciplined practice in risk-aware environments.',
        href: oldSiteLinks.activities,
      },
      {
        title: 'School athletics',
        role: 'Team athlete',
        period: '2018-2020',
        context: 'School ice hockey team member with additional badminton recognition.',
        responsibilities: ['Balanced team sport participation with academic and technical commitments.', 'Competed in provincial-level badminton context.'],
        outcome: 'Archived athletics record across individual and team competition.',
        href: oldSiteLinks.activities,
      },
    ],
  },
  {
    title: 'Music',
    summary: 'Long-running performance training across Western classical and Indian Carnatic traditions.',
    entries: [
      {
        title: 'Piano',
        role: 'Royal Conservatory of Music certified pianist',
        period: 'Archive',
        context: 'Formal piano training with archived bronze, silver, and gold medal recognition.',
        responsibilities: ['Completed Royal Conservatory-aligned piano training.', 'Maintained performance discipline alongside STEM and research commitments.'],
        outcome: 'Structured musical training and certification record.',
        href: oldSiteLinks.awards,
      },
      {
        title: 'Western classical violin',
        role: 'Strings program graduate',
        period: '7+ years',
        context: 'Central Peel Regional Strings Program graduate.',
        responsibilities: ['Studied Western classical violin in a structured regional strings program.', 'Built ensemble and performance experience over more than seven years.'],
        outcome: 'Long-term musicianship and collaborative performance foundation.',
        href: oldSiteLinks.activities,
      },
      {
        title: 'Indian Carnatic music',
        role: 'Violinist and vocalist',
        period: '10+ years',
        context: 'Indian Carnatic violin and vocal performance training.',
        responsibilities: ['Performed and trained as a Carnatic violinist.', 'Developed Carnatic vocal performance experience over more than ten years.'],
        outcome: 'Cross-tradition musical depth beyond Western classical training.',
        href: oldSiteLinks.activities,
      },
    ],
  },
]

function Icon({ name }: { name: 'arrow' | 'download' | SocialItem['icon'] | 'search' }) {
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

function SocialLinks() {
  return (
    <nav className="social-links" aria-label="Social links">
      {socialItems.map((item) => (
        <ExternalLink href={item.href} className="social-link" key={item.label}>
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </ExternalLink>
      ))}
    </nav>
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
  const loading = className.includes('hero-image') || className.includes('role-card-image') ? 'eager' : 'lazy'

  return (
    <figure className={`image-frame ${className}`.trim()}>
      <img src={image.src} alt={image.alt} loading={loading} />
    </figure>
  )
}

function useHashScroll() {
  useLayoutEffect(() => {
    const scrollToHash = () => {
      const rawHash = window.location.hash.slice(1)

      if (!rawHash) {
        return true
      }

      const targetId = decodeURIComponent(rawHash)
      const target = document.getElementById(targetId)

      if (!target) {
        return false
      }

      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16
      const html = document.documentElement
      const previousScrollBehavior = html.style.scrollBehavior

      html.style.scrollBehavior = 'auto'
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' })
      html.style.scrollBehavior = previousScrollBehavior

      return Math.abs(target.getBoundingClientRect().top - headerHeight - 16) < 4
    }

    const intervalIds = new Set<number>()

    const scheduleScroll = () => {
      window.requestAnimationFrame(scrollToHash)
      window.setTimeout(scrollToHash, 250)
      window.setTimeout(scrollToHash, 1000)
      let attempts = 0
      const intervalId = window.setInterval(() => {
        attempts += 1

        if (scrollToHash() || attempts >= 10) {
          window.clearInterval(intervalId)
          intervalIds.delete(intervalId)
        }
      }, 300)

      intervalIds.add(intervalId)
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
      intervalIds.forEach((intervalId) => window.clearInterval(intervalId))
      pendingImages.forEach((image) => {
        image.removeEventListener('load', scrollToHash)
        image.removeEventListener('error', scrollToHash)
      })
    }
  }, [])
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
          <div className="education-primary-media">
            <img src={educationItems[0].visual.src} alt={educationItems[0].visual.alt} />
            <div>
              {educationItems[0].logo ? <img src={educationItems[0].logo.src} alt={educationItems[0].logo.alt} /> : null}
              <strong>{educationItems[0].division}</strong>
            </div>
          </div>
          <span>{educationItems[0].period} · {educationItems[0].location}</span>
          <h3>PhD student in Medical Physics at the University of Wisconsin-Madison.</h3>
          <p>
            I recently started doctoral work in Ran Zhang's lab, continuing my path across medical physics, imaging, clinical AI, and translational software systems.
          </p>
          <ul>
            {educationItems[0].responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <div className="education-list" aria-label="Education and training">
          {educationItems.map((item) => (
            <article key={`${item.degree}-${item.institution}`}>
              <div className="education-mark">
                <img src={(item.logo ?? item.visual).src} alt={(item.logo ?? item.visual).alt} />
              </div>
              <div>
                <span>{item.period} · {item.location}</span>
                <strong>{item.degree}</strong>
                <em>{item.institution}</em>
                <small>{item.division}</small>
                <p>{item.detail}</p>
                <ul>
                  {item.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section className="section" id="experience">
      <SectionHeading title="Experience & Affiliations" />
      <div className="resume-list">
        {experienceItems.map((item) => (
          <article key={`${item.title}-${item.organization}`}>
            <div className="resume-meta">
              <span>{item.period}</span>
              {item.location ? <span>{item.location}</span> : null}
            </div>
            <div>
              <h3>{item.title}</h3>
              <strong>{item.organization}</strong>
              {item.summary ? <p>{item.summary}</p> : null}
              <ul>
                {item.responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Research() {
  const [selectedTitle, setSelectedTitle] = useState(researchItems[0].title)
  const selected = researchItems.find((item) => item.title === selectedTitle) ?? researchItems[0]

  return (
    <section className="section" id="research">
      <SectionHeading title="Featured Research" />
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
      <div className="research-archive">
        <article>
          <h3>Research Archive</h3>
          <ol>
            {researchArchiveItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
        <article>
          <h3>Presentations</h3>
          <div className="timeline-list">
            {presentationItems.map(([year, detail]) => (
              <div key={`${year}-${detail}`}>
                <span>{year}</span>
                <p>{detail}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

function Software() {
  const categories = ['All', 'Clinical AI', 'Open source', 'Web systems', 'Research tools', 'Robotics & Outreach'] as const
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
      <div className="project-grid">
        {visibleItems.map((item) => (
          <article className="project-card" key={item.title}>
            <div className="project-card-head">
              <div>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
              </div>
              <em>{item.period ?? item.status}</em>
            </div>
            <p>{item.purpose}</p>
            <div className="project-card-body">
              {item.responsibilities ? (
                <ul>
                  {item.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
              ) : null}
              <dl>
                <div>
                  <dt>Stack</dt>
                  <dd>{item.stack}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{item.role}</dd>
                </div>
              </dl>
            </div>
            <div className="project-card-foot">
              <span>{item.outcome ?? item.status}</span>
              {item.href ? (
                <ExternalLink href={item.href} className="project-action">
                  {item.linkLabel ?? 'Open project'} <Icon name="arrow" />
                </ExternalLink>
              ) : (
                <span className="project-action muted">Internal project</span>
              )}
            </div>
          </article>
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
        <ImageFrame image={imageAssets.arrowMcLarenRace} />
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
      <div className="role-grid">
        {performanceRoles.map((item) => (
          <article key={item.title}>
            <ImageFrame image={item.image} className="role-card-image" />
            <div className="role-card-copy">
              <span>{item.period}{item.location ? ` · ${item.location}` : ''}</span>
              <strong>{item.title}</strong>
              <em>{item.meta}</em>
            </div>
            <ul>
              {item.responsibilities.map((responsibility) => (
                <li key={responsibility}>{responsibility}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function Recognition() {
  const certificationGroups = useMemo(() => {
    return certificationItems.reduce<Record<string, CertificationItem[]>>((groups, item) => {
      groups[item.group] = [...(groups[item.group] ?? []), item]
      return groups
    }, {})
  }, [])

  return (
    <section className="section" id="recognition">
      <SectionHeading title="Recognition" />
      <div className="recognition-layout">
        <div className="recognition-ledger">
          {recognitionItems.map((item) => (
            <ExternalLink href={item.href} className="recognition-card" key={item.title}>
              <div className="recognition-meta">
                <span>{item.year}</span>
                <em>{item.type}</em>
              </div>
              <div className="recognition-copy">
                <strong>{item.title}</strong>
                <small>{item.source}</small>
                <p>{item.detail}</p>
                <p>{item.basis}</p>
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <b>
                  View source <Icon name="arrow" />
                </b>
              </div>
            </ExternalLink>
          ))}
        </div>
        <aside className="certification-panel">
          <h3>Awards & Certifications Archive</h3>
          <p>Older credentials grouped by what they signal: academic preparation, healthcare exposure, leadership, arts training, and competition.</p>
          <div className="certification-groups">
            {Object.entries(certificationGroups).map(([group, items]) => (
              <section className="certification-group" key={group}>
                <h4>{group}</h4>
                <div>
                  {items.map((item) => (
                    <ExternalLink href={item.href} className="certification-entry" key={item.title}>
                      <span>{item.period}</span>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                      <small>{item.evidence}</small>
                      <b>
                        View evidence <Icon name="arrow" />
                      </b>
                    </ExternalLink>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

function Proof() {
  const [query, setQuery] = useState('')
  const filteredProof = useMemo(() => {
    const target = query.trim().toLowerCase()
    if (!target) return proofItems
    return proofItems.filter((item) => `${item.label} ${item.meta ?? ''} ${item.sourceName} ${item.category} ${item.date} ${item.summary} ${item.highlights.join(' ')}`.toLowerCase().includes(target))
  }, [query])

  return (
    <section className="section" id="proof">
      <SectionHeading title="Proof & Press" />
      <label className="search-box">
        <Icon name="search" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search publications, news, awards, and profiles" />
      </label>
      <div className="proof-ledger" aria-live="polite">
        {filteredProof.length ? (
          filteredProof.map((item) => (
            <ExternalLink href={item.href} className="proof-card" key={item.href}>
              <div className="proof-media">
                {item.image ? <ImageFrame image={item.image} /> : <div className="proof-placeholder">{item.sourceName.slice(0, 2)}</div>}
              </div>
              <div className="proof-copy">
                <span>{item.date} · {item.sourceName}</span>
                <strong>{item.label}</strong>
                <em>{item.category}</em>
                <p>{item.summary}</p>
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <b>
                  Read source <Icon name="arrow" />
                </b>
              </div>
            </ExternalLink>
          ))
        ) : (
          <p className="empty-state">No proof links match that search.</p>
        )}
      </div>
    </section>
  )
}

function Archive() {
  return (
    <section className="section" id="archive">
      <SectionHeading
        title="Activities Archive"
        action={
          <ExternalLink href="https://sites.google.com/view/udbhav-ram/home" className="text-link">
            Old site <Icon name="arrow" />
          </ExternalLink>
        }
      />
      <div className="archive-ledger">
        {archiveGroups.map((group) => (
          <section className="archive-group" key={group.title}>
            <div className="archive-group-head">
              <h3>{group.title}</h3>
              <p>{group.summary}</p>
            </div>
            <div className="archive-entry-list">
              {group.entries.map((entry) => {
                const content = (
                  <>
                    <div className="archive-entry-meta">
                      <span>{entry.period}</span>
                      <em>{entry.role}</em>
                    </div>
                    <div className="archive-entry-copy">
                      <strong>{entry.title}</strong>
                      <p>{entry.context}</p>
                      <ul>
                        {entry.responsibilities.map((responsibility) => (
                          <li key={responsibility}>{responsibility}</li>
                        ))}
                      </ul>
                      {entry.outcome ? <small>{entry.outcome}</small> : null}
                      {entry.href ? (
                        <b>
                          View context <Icon name="arrow" />
                        </b>
                      ) : null}
                    </div>
                  </>
                )

                return entry.href ? (
                  <ExternalLink href={entry.href} className="archive-entry" key={entry.title}>
                    {content}
                  </ExternalLink>
                ) : (
                  <article className="archive-entry" key={entry.title}>
                    {content}
                  </article>
                )
              })}
            </div>
          </section>
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
        <h2>Let’s Work Together</h2>
        <p>Reach out for research collaboration, clinical AI tooling, software projects, conference speaking, or performance-engineering crossover work.</p>
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
        <Education />
        <Experience />
        <Research />
        <Software />
        <Performance />
        <Recognition />
        <Proof />
        <Archive />
        <Contact />
      </main>
      <footer className="site-footer">
        <span>© 2026 Udbhav Ram</span>
        <SocialLinks />
      </footer>
    </div>
  )
}

export default App
