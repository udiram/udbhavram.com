import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
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
  period?: string
  responsibilities?: string[]
  outcome?: string
  href?: string
}

type ProofItem = LinkItem & {
  sourceName: string
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
    period: 'Open source',
    responsibilities: ['Contributed documentation and tutorial improvements for medical imaging deep-learning users.'],
    outcome: 'Merged contribution to Project MONAI tutorials.',
    href: 'https://github.com/Project-MONAI/tutorials/pull/1129',
  },
  {
    title: 'OpenHands engineering contribution',
    purpose: 'Agent framework improvements for software tasks',
    stack: 'Python, FastAPI, React',
    role: 'Contributor',
    category: 'Open source',
    period: 'Open source',
    responsibilities: ['Worked in an agent software stack spanning Python backend surfaces and React/FastAPI application code.'],
    outcome: 'Merged contribution to OpenHands.',
    href: 'https://github.com/All-Hands-AI/OpenHands/pull/731',
  },
  {
    title: 'TG-263 local LLM tool',
    purpose: 'Local naming-compliance interface with visible reviewer control',
    stack: 'Local LLM, clinical UI, radiation oncology',
    role: 'Developer',
    category: 'Clinical AI',
    period: '2025',
    responsibilities: ['Designed local LLM review flows for target-name compliance.', 'Built around reviewer-controlled checks for clinical workflow use.'],
    outcome: 'AAPM 2025 Blue Ribbon Poster.',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
  },
  {
    title: 'Clinical UI automation benchmark',
    purpose: 'Objective tests for VLM agents around clinical interfaces',
    stack: 'Python, Playwright, VLM evaluation',
    role: 'Researcher',
    category: 'Research tools',
    responsibilities: ['Created objective tests for vision-language agents operating around clinical interface tasks.'],
    outcome: 'Internal research tooling for clinical AI evaluation.',
  },
  {
    title: 'AAPM conference explorer',
    purpose: 'Search and schedule workflow for dense conference content',
    stack: 'Flask, SQLAlchemy, Railway',
    role: 'Developer',
    category: 'Web systems',
    responsibilities: ['Built a search and schedule workflow for navigating dense conference content.', 'Deployed the app with a Flask and SQLAlchemy backend on Railway.'],
  },
  {
    title: 'Automated prosthetic limb prototype',
    purpose: 'Mechatronic control and embedded systems project',
    stack: 'C++, Python, ROS',
    role: 'Lead developer',
    category: 'Research tools',
    responsibilities: ['Led embedded and robotics software work for an automated prosthetic limb prototype.'],
    href: 'https://sites.google.com/view/prostheticlimbprototype/home',
  },
  {
    title: 'Synth-Med Biotechnology',
    purpose: 'Company site and technical content system',
    stack: 'Next.js, TypeScript',
    role: 'Founder',
    category: 'Web systems',
    responsibilities: ['Led full-stack web development and technical content for Synth-Med Biotechnology.'],
    href: 'https://synth-med.com/about/',
  },
  {
    title: 'Autonomous car conversion',
    purpose: 'Level 2 driver-assistance conversion using comma.ai and openpilot implementations',
    stack: 'Openpilot, vehicle integration, driver assistance',
    role: 'Builder',
    category: 'Research tools',
    responsibilities: ['Implemented a Level 2 driver-assistance system using comma.ai and openpilot implementations.'],
  },
  {
    title: 'WAAW group infrastructure',
    purpose: 'DevOps infrastructure and backend systems for a team software environment',
    stack: 'Backend systems, DevOps, deployment',
    role: 'Infrastructure lead',
    category: 'Web systems',
    responsibilities: ['Led DevOps infrastructure and backend work for a team software environment.'],
  },
  {
    title: 'Robotique Zone01 and FRC 4939',
    purpose: 'Robotics programming, outreach, mentoring, and competition support',
    stack: 'Robotics, controls, outreach',
    role: 'Lead mentor and senior programmer',
    category: 'Robotics & Outreach',
    responsibilities: ['Mentored robotics students through Robotique Zone01.', 'Served as senior programmer and outreach member for FRC Team 4939.'],
  },
  {
    title: "Sparkin' STEM French curriculum",
    purpose: 'Integrated STEM curriculum with a large French school board in Canada',
    stack: 'Curriculum design, STEM outreach, bilingual programming',
    role: 'French program coordinator',
    category: 'Robotics & Outreach',
    responsibilities: ['Led integration of in-house STEM curriculum with the largest French school board in Canada.'],
  },
  {
    title: 'SPARK recycling sorter',
    purpose: 'Computer vision and machine-learning powered recycling sorter; SPARK hackathon runner-up',
    stack: 'Computer vision, machine learning, prototyping',
    role: 'Hackathon builder',
    category: 'Research tools',
    period: '2019',
    responsibilities: ['Built a computer vision and machine-learning powered recycling sorter.'],
    outcome: 'SPARK Hackathon runner-up.',
  },
  {
    title: 'The Mirai Project',
    purpose: 'Medical case-study finalist work',
    stack: 'Clinical reasoning, case analysis',
    role: 'Runner-up finalist',
    category: 'Clinical AI',
    period: '2020',
    responsibilities: ['Developed medical case-study analysis for a finalist competition workflow.'],
    outcome: 'Runner-up finalist.',
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

const educationItems: EducationEntry[] = [
  {
    degree: 'PhD in Medical Physics',
    institution: 'University of Wisconsin-Madison',
    period: '2026-Present',
    location: 'Madison, WI',
    detail: "Started doctoral work in Ran Zhang's lab, focused on medical physics, imaging, and clinical AI systems.",
    responsibilities: ['Developing doctoral research direction across medical physics, imaging, and clinical AI.', 'Continuing translational software work for clinical and research workflows.'],
  },
  {
    degree: 'BSc Honours Medical & Biological Physics',
    institution: 'McMaster University',
    period: 'Completed 2025',
    location: 'Hamilton, ON',
    detail: 'Built the foundation across medical physics, biophysics, computation, and radiation oncology research.',
    responsibilities: ['Coursework and research foundation across medical physics, biophysics, computer vision, and radiotherapy.', 'Completed co-op and visiting-scholar work connected to radiation oncology and AI.'],
  },
  {
    degree: 'International visiting scholar',
    institution: 'UAB Radiation Oncology',
    period: 'Jan-Aug 2024',
    location: 'Birmingham, AL',
    detail: 'Worked on clinical AI, adaptive radiotherapy, treatment planning, and workflow automation with UAB collaborators.',
    responsibilities: ['Worked with UAB collaborators on artificial-intelligence tools for radiation treatment and planning.', 'Contributed to adaptive radiotherapy, treatment-planning validation, and clinical workflow automation projects.'],
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

const performanceRoles = [
  {
    title: 'Arrow McLaren IndyCar',
    meta: 'Data and strategy intern',
    period: 'Race-season internship',
    location: 'Indianapolis, IN',
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
    responsibilities: ['Worked on vehicle-controls software.', 'Built custom dashboard implementations for the electric race-car program.'],
  },
  {
    title: 'Formula LGB 1300',
    meta: 'Momentum Motorsports',
    period: 'Driver development',
    responsibilities: ['Participated in a Formula LGB 1300 test and development driver program.'],
  },
  {
    title: 'VW Polo Cup',
    meta: 'Madras International Circuit, MRF',
    period: 'Test driver',
    responsibilities: ['Completed VW Polo Cup test-driver experience at Madras International Circuit.'],
  },
]

const recognitionItems = [
  ['2025', 'Blue Ribbon Poster', 'Highest-scoring AAPM 2025 abstract designation for LLMs in radiation oncology'],
  ['2025', 'Ethos Adaptive Radiotherapy Course', 'Two-and-a-half-day Varian Ethos clinical school credentialing program'],
  ['2025', 'Science Co-op Student of the Year', 'McMaster recognition connected to UAB radiation oncology co-op work'],
  ['2025', 'Co-op Employer of the Year (Emerging)', 'UAB mentors recognized for a strong co-op learning environment'],
  ['2024', 'Outstanding Poster Presentation', 'Society of Physics Students-AAPM undergraduate research competition'],
  ['2024-2025', 'Featured Highlight - McMaster University', 'International visiting scholar and convocation profile coverage'],
  ['2024-2025', 'Featured Highlight - UAB', 'UAB and Heersink School of Medicine coverage of AI and radiation oncology work'],
  ['2023', 'Best Talk, CUPC 2023', 'First prize for optimizing dose delivery during fractionated radiotherapy'],
]

const certificationItems = [
  'Advanced Placement Scholar with Distinction',
  'HOSA second place, national recognition',
  'Top 25% in Mathematics',
  'Certified Yoga Teacher',
  'French Language Certification',
  'Provincial Chess Champion',
  'Medical Youth Summer Program',
  'Computer Science Competency',
  'Piano bronze, silver, and gold medals',
  'Robotics Lead Mentor',
  'GRAMEN Spelling Bee Semi-Finalist',
  'CPR, First Aid, and AED certification',
  'Go-karting provincial runner-up',
  'Badminton provincial runner-up',
  'Robotics provincial runner-up',
  'FIRST Robotics Competition semi-finalist',
]

const archiveGroups = [
  {
    title: 'Clinical and Service',
    items: [
      '2024: Shadowed radiation oncologists and medical physicists at UAB Radiation Oncology.',
      'Volunteer: Assisted physicians and teams at Humber River Hospital across Medical Imaging, Surgical Inpatient, and Information Services.',
      'UAB Hindu YUVA: Helped promote, practice, protect, and preserve Hindu values through activities and events.',
      'Registered Yoga Instructor: Head Yoga Instructor for Anytime Fitness Brampton and yoga instructor at McMaster University.',
    ],
  },
  {
    title: 'Robotics and STEM Outreach',
    items: [
      'Senior programmer and outreach member for FRC Team 4939.',
      'Lead mentor for Robotique Zone01 robotics students.',
      "French program coordinator for Sparkin' STEM; led curriculum integration with a large French school board.",
    ],
  },
  {
    title: 'Sport and Technical Hobbies',
    items: [
      'NAUI/SSI certified open-water scuba diver',
      'Private pilot training at Brampton Flight Centre; old-site target completion listed July 2022.',
      'Equestrian Canada and Ontario Equestrian member with English and Western experience',
      'School ice hockey team member, 2018-2020',
    ],
  },
  {
    title: 'Music',
    items: [
      'Royal Conservatory of Music certified pianist',
      'Central Peel Regional Strings Program graduate with more than 7 years of Western classical violin experience',
      'Indian Carnatic violinist and vocalist with more than 10 years of performance experience',
    ],
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
              <span>{item.period} · {item.location}</span>
              <strong>{item.degree}</strong>
              <em>{item.institution}</em>
              <p>{item.detail}</p>
              <ul>
                {item.responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
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
            <strong>
              {item.title}
              {item.period ? <em>{item.period}</em> : null}
            </strong>
            <span data-label="Purpose">
              {item.purpose}
              {item.responsibilities ? (
                <ul>
                  {item.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
              ) : null}
              {item.outcome ? <em>{item.outcome}</em> : null}
            </span>
            <span data-label="Stack">{item.stack}</span>
            <span data-label="Role">{item.role}</span>
            <span data-label="Link">
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
            <span>{item.period}{item.location ? ` · ${item.location}` : ''}</span>
            <strong>{item.title}</strong>
            <em>{item.meta}</em>
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
  return (
    <section className="section" id="recognition">
      <SectionHeading title="Recognition" />
      <div className="recognition-layout">
        <div className="recognition-list">
          {recognitionItems.map(([year, title, detail]) => (
            <article key={title}>
              <span>{year}</span>
              <strong>{title}</strong>
              <p>{detail}</p>
            </article>
          ))}
        </div>
        <aside className="certification-panel">
          <h3>Awards & Certifications Archive</h3>
          <ul>
            {certificationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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
      <div className="archive-grid">
        {archiveGroups.map((group) => (
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
        <a href={resumeHref} download>
          Download CV
        </a>
      </footer>
    </div>
  )
}

export default App
