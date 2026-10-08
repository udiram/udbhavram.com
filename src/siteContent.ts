export type ImageAsset = { src: string; alt: string; source?: string; caption?: string }
type LinkItem = { label: string; href: string }
type IconName =
  | 'mail'
  | 'linkedin'
  | 'github'
  | 'article'
  | 'pulse'
  | 'shield'
  | 'cube'
  | 'code'
type WorkStory = {
  title: string
  strap: string
  text: string
  image: ImageAsset
  evidence: { value: string; label: string }[]
  links: LinkItem[]
}
type PublicationItem = {
  year: string
  title: string
  venue: string
  note: string
  href: string
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

export const imageAssets = {
  heroPortrait: {
    src: '/assets/optimized/hero-portrait.webp',
    alt: 'Udbhav Ram outside the McMaster physics building',
    source:
      'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
  },
  heroCollage: {
    src: '/assets/optimized/clinical-imaging-collage.webp',
    alt: 'Collage of MR imaging, code, CT imaging, and radiation dose distribution',
    source: 'https://sites.google.com/view/udbhav-ram/research',
  },
  coopAward: {
    src: '/assets/optimized/coop-award.webp',
    alt: 'Udbhav Ram receiving the McMaster Science Co-op Student of the Year award',
    source:
      'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
  },
  uwMadisonLogo: {
    src: '/assets/sourced/uw-madison-logo.png',
    alt: 'University of Wisconsin-Madison official crest logo',
    source:
      'https://brand.wisc.edu/resource/uw-institutional-logos-for-web-digital-use/',
  },
  mcmasterLogo: {
    src: '/assets/sourced/mcmaster-science.png',
    alt: 'McMaster University Brighter World logo',
    source:
      'https://brand.mcmaster.ca/guidelines_introduction/logos-and-marks/logos-and-marks-cont-mcmaster-logo-minimal-size/',
  },
  uabRadonc: {
    src: '/assets/optimized/uab-radonc.webp',
    alt: 'UAB Radiation Oncology treatment-planning visual',
    source: 'https://www.uab.edu/medicine/radonc/',
  },
  uabPresentation: {
    src: '/assets/optimized/uab-presentation.webp',
    alt: 'Udbhav Ram presenting clinical AI research at UAB Radiation Oncology',
    source:
      'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  tg263Poster: {
    src: '/assets/optimized/aapm-2025-tg263-poster.webp',
    alt: 'AAPM poster describing a locally hosted language-model pipeline for TG-263 naming quality assurance',
    source:
      'https://aapm.confex.com/aapm/2025am/mediafile/Handout/Paper20105/AAPM2025_BRP_LLM.pdf',
  },
  arrowMcLaren: {
    src: '/assets/optimized/arrow-mclaren.webp',
    alt: 'Arrow McLaren IndyCar race car on track',
    source: 'https://www.arrowmclaren.com/',
  },
  formulaLgb: {
    src: '/assets/personal/motorsports-02.webp',
    alt: 'Formula LGB 1300 race car during a test and development program',
    source: 'https://sites.google.com/view/udbhav-ram/motorsports',
  },
  macFormulaSae: {
    src: '/assets/personal/motorsports-01.webp',
    alt: 'McMaster Formula SAE Electric car',
    source: 'https://sites.google.com/view/udbhav-ram/motorsports',
  },
  vwPoloCup: {
    src: '/assets/personal/motorsports-03.webp',
    alt: 'Udi wearing a racing helmet inside a Volkswagen Polo Cup car',
    source: 'https://sites.google.com/view/udbhav-ram/motorsports',
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
    source: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  uabEmployerAward: {
    src: '/assets/sourced/uab-employer-award-1.jpg',
    alt: 'UAB mentor receiving McMaster co-op employer recognition',
  },
  employerAwards: {
    src: '/assets/sourced/mcmaster-employer-awards-hero.jpg',
    alt: 'McMaster Science co-op employer award recipients',
  },
  beyondScuba: {
    src: '/assets/personal/beyond-scuba-2025.webp',
    alt: 'Three scuba divers suspended in open water beneath rising bubbles',
    caption: 'Open-water dive · Personal archive, May 2025',
  },
  beyondEquestrian: {
    src: '/assets/personal/beyond-equestrian-2024.webp',
    alt: 'Udbhav Ram seated on a white horse during horsemanship training',
    caption: 'Horsemanship training · Personal archive, November 2024',
  },
  adaptiveResearch: { src: '/assets/sourced/aapm-2026-adaptive-poster.jpg', alt: 'AAPM 2026 poster on contouring uncertainty in online adaptive partial-breast irradiation', source: 'https://aapm.confex.com/aapm/2026am/mediafile/Handout/Paper27281/AAPM2026_Poster_IOV.pdf' },
  organSegmentationResearch: { src: '/assets/sourced/organ-segmentation-figure-3.jpg', alt: 'Published comparison of abdominal organ contours from nnU-Net, Auto3DSeg, SwinUNETR, and ground truth', source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12462693/figure/F3/' },
  brainFollowupResearch: { src: '/assets/sourced/brain-followup-workflow.svg', alt: 'Original schematic of prior treatment contours registered into follow-up brain MRI', source: 'https://academic.oup.com/nop/article/13/3/497/8382617' },
  lungBeamResearch: { src: '/assets/sourced/aapm-2025-lung-6x10x-poster.webp', alt: 'AAPM 2025 poster comparing 6X-FFF and 10X-FFF for lung SBRT', source: 'https://aapm.confex.com/aapm/2025am/mediafile/Handout/Paper20068/AAPM2025_eposter_6X10X.pdf' },
  amyloidResearch: { src: '/assets/sourced/amyloid-membrane-schematic.svg', alt: 'Original schematic of four dietary compounds studied with amyloid beta in a synthetic brain membrane model', source: 'https://doi.org/10.1002/mnfr.202000632' },
} satisfies Record<string, ImageAsset>

export const selectedWork: WorkStory[] = [
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
      {
        label: 'Read the poster',
        href: 'https://aapm.confex.com/aapm/2025am/mediafile/Handout/Paper20105/AAPM2025_BRP_LLM.pdf',
      },
      {
        label: 'UAB collaboration story',
        href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
      },
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
      {
        label: 'Read the paper',
        href: 'https://pubmed.ncbi.nlm.nih.gov/41272935/',
      },
      {
        label: 'View in JACMP',
        href: 'https://aapm.onlinelibrary.wiley.com/doi/10.1002/acm2.70370',
      },
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
      {
        label: 'Read the paper',
        href: 'https://pubmed.ncbi.nlm.nih.gov/41020282/',
      },
      {
        label: 'Open the free full text',
        href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12462693/',
      },
    ],
  },
]

export const publications: PublicationItem[] = [
  {
    year: '2025',
    title:
      'AI-based framework to fuse pre-RT brain metastases contours with follow-up MRI to improve post-RT assessment',
    venue: 'Neuro-Oncology Practice',
    note: 'Co-authored a 40-patient study integrating prior treatment contours into follow-up MRI; average review time fell from 7.97 to 3.95 minutes. Published online in 2025; journal issue in 2026.',
    href: 'https://academic.oup.com/nop/article/13/3/497/8382617',
  },
  {
    year: '2025',
    title:
      'Dosimetric evaluation of Ethos 2.0 high-fidelity mode for single-isocenter SRS',
    venue: 'Journal of Applied Clinical Medical Physics',
    note: 'First-author, 45-patient evaluation of four template configurations for multi-metastasis SRS planning.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/41272935/',
  },
  {
    year: '2025',
    title:
      'Assessing quantitative performance and expert review of multiple deep learning-based frameworks for CT abdominal organ auto-segmentation',
    venue: 'Intelligent Oncology',
    note: 'First-author comparison of SwinUNETR, nnU-Net, and MONAI Auto3DSeg with quantitative and blinded physician review.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/41020282/',
  },
  {
    year: '2020',
    title:
      'The effects of resveratrol, caffeine, beta-carotene, and EGCG on amyloid aggregation in synthetic brain membranes',
    venue: 'Molecular Nutrition & Food Research',
    note: 'Earlier biophysics publication from McMaster work.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/32981185/',
  },
]

export const currentBuilds: CurrentBuild[] = [
  {
    name: 'RadKev',
    type: 'Radiology decision research',
    status: 'Public · active October 2026',
    description:
      'Exploring how specialized AI models make radiology decisions, with open evaluation code and experiments.',
    boundary:
      'Research system with a pre-registered evaluation; it is not a diagnostic device.',
    href: 'https://github.com/udiram/RadKev',
    icon: 'pulse',
  },
  {
    name: 'MedPhysBench',
    type: 'Evaluation infrastructure',
    status: 'Public · active 2026',
    description:
      'A benchmark for testing AI and agent systems on medical-physics tasks.',
    boundary:
      'Research-only benchmark; scores do not establish clinical readiness.',
    href: 'https://github.com/udiram/MedPhysBench',
    icon: 'shield',
  },
  {
    name: 'VoxelWeave Designer',
    type: 'Imaging-to-fabrication workflow',
    status: 'Public · active 2026',
    description:
      'A macOS tool for turning medical images into 3D-printable research phantoms.',
    boundary:
      'Research-use tooling; output still requires printer, material, and scan validation.',
    href: 'https://github.com/udiram/VoxelWeave-Designer',
    icon: 'cube',
  },
  {
    name: 'Glioblastoma analysis',
    type: 'Imaging research code',
    status: 'Public · updated October 2026',
    description:
      'An active public repository exploring deep-learning methods for imaging characteristics of glioblastoma.',
    boundary:
      'Exploratory code; the repository does not claim validated clinical performance.',
    href: 'https://github.com/udiram/Glioblastoma_analysis',
    icon: 'code',
  },
]

export const socialItems: (LinkItem & { icon: IconName })[] = [
  { label: 'Email', href: 'mailto:ramu@mcmaster.ca', icon: 'mail' },
  {
    label: 'LinkedIn',
    href: 'https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine',
    icon: 'linkedin',
  },
  { label: 'GitHub', href: 'https://github.com/udiram', icon: 'github' },
  {
    label: 'Publications',
    href: 'https://pubmed.ncbi.nlm.nih.gov/?term=Udbhav+S+Ram',
    icon: 'article',
  },
]
