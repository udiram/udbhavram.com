import { presentations } from './presentationData'

export type RecordItem = {
  title: string
  id?: string
  presentationId?: string
  detail?: string
  meta?: string
  href?: string
  note?: string
}

export type RecordGroup = {
  title: string
  items: RecordItem[]
}

export type PortfolioCollection = {
  id: string
  title: string
  summary: string
  source: string
  groups: RecordGroup[]
}

const googleSiteRoot = 'https://sites.google.com/view/udbhav-ram/'

export const portfolioCollections: PortfolioCollection[] = [
  {
    id: 'profile-foundations',
    title: 'Profile and foundations',
    summary: 'The earlier experiences, strengths, and goals that explain how the current medical-physics and engineering practice took shape.',
    source: googleSiteRoot,
    groups: [
      {
        title: 'How the earlier site introduced me',
        items: [
          {
            title: 'Undergraduate ambassador - UAB / McMaster relations',
            detail: 'An institutional bridge role connected to the cross-border undergraduate research relationship.',
          },
          {
            title: 'International visiting scholar - University of Alabama at Birmingham',
            detail: 'The earlier homepage paired this role with an undergraduate research focus in medical physics and radiation oncology.',
          },
          {
            title: 'Undergraduate-era biography',
            detail: 'The old copy described me as a 22-year-old college senior researching AI and machine learning applications in clinical medical physics and radiation oncology.',
            note: 'Historical wording retained for context; age and student stage are no longer current.',
          },
        ],
      },
      {
        title: 'Research listed as current on that snapshot',
        items: [
          { title: 'LLM-agent integration in clinical workflows', meta: 'UAB' },
          { title: 'Ethos 2.0 validation for single-isocenter stereotactic radiosurgery', meta: 'UAB' },
          { title: 'Interobserver contour variability in Ethos adaptive partial-breast irradiation', meta: 'UAB' },
          { title: 'Multi-institution commissioning study of 6X-FFF versus 10X-FFF for SBRT on TrueBeam iTX', meta: 'JCC + UAB' },
        ],
      },
      {
        title: 'Strengths and achievements named there',
        items: [
          { title: 'Software engineering' },
          { title: 'Deep learning, machine learning, and computer vision' },
          { title: 'Race and performance engineering' },
          { title: 'Certified yoga instructor' },
          {
            title: 'Eight years of computational and clinical research experience',
            note: 'Self-described duration on the earlier homepage; retained as historical wording rather than a current headline claim.',
          },
        ],
      },
      {
        title: 'Goals recorded on the earlier homepage',
        items: [
          { title: 'Apply software advances toward clinical endpoints' },
          { title: 'Publish additional work in high-impact journals' },
          { title: 'Work toward a private pilot license', note: 'Preserved as an earlier goal, not presented as a completed credential.' },
        ],
      },
    ],
  },
  {
    id: 'research-record',
    title: 'Research record',
    summary: 'Affiliations, projects, presentations, and open-source contributions across clinical medical physics, imaging, computational work, and earlier biophysics.',
    source: `${googleSiteRoot}research`,
    groups: [
      {
        title: 'Research affiliations',
        items: [
          { title: 'International Visiting Scholar', meta: 'UAB Department of Radiation Oncology' },
          { title: 'Researcher', meta: 'Hamilton Health Sciences - Juravinski Cancer Centre' },
          { title: 'Researcher', meta: 'Western University - Lawson Health Research Institute' },
          { title: 'Research Fellow', meta: "Hamilton Centre for Kidney Research - St. Joseph's Healthcare Hamilton" },
          { title: 'Researcher', meta: 'Laboratory for Membrane and Protein Dynamics - McMaster Physics and Astronomy' },
        ],
      },
      {
        title: 'Clinical, imaging, and computational projects',
        items: [
          {
            title: 'Ethos adaptive partial-breast irradiation contour variability',
            detail: 'Evaluation of interobserver variability for accelerated partial-breast irradiation contours in the Ethos adaptive workflow.',
            href: 'https://amportal.astro.org/udbhav-ram-bs-135368427',
            note: 'The earlier page described this as submitted to IJROBP; the current public record lists related ASTRO 2026 work.',
          },
          {
            title: '6X-FFF versus 10X-FFF on TrueBeam',
            detail: 'Dosimetric comparison of flattening-filter-free photon beams in Eclipse.',
            href: 'https://drive.google.com/file/d/1saYGinYp9R6O32lr1l3_n-lGGpNYCVFJ/view?usp=sharing',
          },
          {
            title: 'Ethos 2.0 high-fidelity multi-met SRS',
            detail: 'Semi-automated comparative analysis for multi-metastasis, single-isocenter stereotactic radiotherapy.',
            href: 'https://pubmed.ncbi.nlm.nih.gov/41272935/',
          },
          {
            title: 'Abdominal-organ auto-segmentation',
            detail: 'Comparison of state-of-the-art deep-learning and AutoML frameworks with quantitative and physician review.',
            href: 'https://pubmed.ncbi.nlm.nih.gov/41020282/',
          },
          {
            title: 'Formula One lap-time simulation',
            detail: 'Ordinary-differential-equation modelling of factors affecting Formula One lap times; completed December 2022.',
            href: 'https://drive.google.com/file/d/1o_fi4mDcXzvgSoI69mB4rgpBkePRnMiC/view',
          },
          {
            title: 'Driving agents in open-world simulation',
            detail: 'Deep-learning and computer-vision models for effective driving agents.',
            href: 'https://drive.google.com/file/d/1Q6XpC-fciEKAE5b1TU0dF3TTDitGHv8b/view?usp=sharing',
          },
          { title: 'Genomic linear-quadratic radiation-dose modelling', detail: 'Exploratory deep-learning and machine-learning work connecting genomic inputs with radiation-dose modelling.' },
          { title: '3D abdominal multi-organ segmentation', detail: 'Deep-learning and computer-vision techniques for abdominal organ segmentation.' },
          { title: 'Optical brain measurement modelling', detail: 'Machine-learning models using optical measurements to predict in-vivo hemoglobin oxygenation; completed December 2022.' },
          {
            title: 'Smartphone gel-electrophoresis analysis',
            detail: 'Quantitative image analysis of gel electrophoresis on a smartphone; completed July 2021.',
            href: 'https://www.youtube.com/watch?v=xW7umxU6NSM',
          },
          {
            title: 'Augmented reality for chronic-kidney-disease surgery models',
            detail: 'Computer-vision application intended to improve accuracy in surgical chronic-kidney-disease models; completed September 2023.',
            href: 'https://medium.com/@udbhavram41/how-computers-are-saving-mice-and-maybe-humans-7a8561ec6a85',
          },
          {
            title: "Nutrition, Alzheimer's disease, and amyloid aggregation",
            detail: 'Earlier biophysics work on resveratrol, caffeine, beta-carotene, EGCG, and amyloid aggregation; published October 2020.',
            href: 'https://pubmed.ncbi.nlm.nih.gov/32981185/',
          },
        ],
      },
      {
        title: 'Presentations and posters',
        items: presentations.map(p => ({ id:p.id, presentationId:p.id, title:p.title, meta:`${p.date} · ${p.venue} · ${p.format}`, detail:`${p.role} · Presenter: ${p.presenter}. ${p.status}`, note:[p.award,p.note,...p.variants].filter(Boolean).join(' · '), href:`/publications#${p.id}` })),
      },
      {
        title: 'Open-source contributions named there',
        items: [
          {
            title: 'Project MONAI',
            meta: 'NVIDIA Medical Open Network for AI',
            detail: 'Contribution to the public MONAI tutorials repository.',
            href: 'https://github.com/Project-MONAI/tutorials/pull/1129',
          },
          {
            title: 'OpenHands',
            meta: 'formerly All-Hands-AI',
            detail: 'Public contribution to the OpenHands project.',
            href: 'https://github.com/OpenHands/OpenHands/pull/731',
          },
        ],
      },
    ],
  },
  {
    id: 'engineering-projects',
    title: 'Engineering and projects',
    summary: 'Robotics, product engineering, hackathons, autonomous driving, outreach, and earlier biotechnology work from the Projects page.',
    source: `${googleSiteRoot}projects`,
    groups: [
      {
        title: 'Robotics and software systems',
        items: [
          {
            title: 'Automated prosthetic hand',
            detail: 'An early prosthetic-limb prototype documented on a separate Google Site.',
            href: 'https://sites.google.com/view/prostheticlimbprototype/home',
          },
          { title: 'Lead mentor - Robotique Zone01', detail: 'Robotics mentorship and programming leadership.' },
          {
            title: 'Full-stack application development',
            detail: 'Published client/server applications, Flask and Django mathematical or deep-learning backends, Android/iOS/web frontends, and CI/CD work across Azure, Google Cloud, and AWS.',
          },
          {
            title: 'Level 2 driver-assistance conversion',
            detail: 'Vehicle conversion work using comma.ai and openpilot implementations.',
            href: 'https://github.com/udiram/openpilot',
          },
        ],
      },
      {
        title: 'Competitions, outreach, and biotechnology',
        items: [
          { title: 'SPARK Hackathon runner-up', meta: '2019', detail: 'Computer-vision and machine-learning recycling sorter.' },
          { title: 'The Mirai Project runner-up', meta: '2020', detail: 'Medical case-study competition.' },
          {
            title: "French Program Coordinator - Sparkin' STEM",
            detail: 'Led integration of an in-house STEM curriculum with Canada’s largest French-language school board.',
            note: 'The organization link preserved by the older site no longer resolves.',
          },
          { title: 'Research and development - Synth-Med Biotechnologies', detail: 'Earlier biotechnology research and full-stack development work.' },
        ],
      },
      {
        title: 'Project channels',
        items: [
          { title: 'Public GitHub', detail: 'Code and repositories referenced by the original Projects page.', href: 'https://github.com/udiram' },
          { title: 'YouTube channel', detail: 'Earlier talks, demos, and project videos.', href: 'https://www.youtube.com/channel/UCTn6NYNbV55T4zs9v1nHOwA' },
          { title: 'Medium writing', detail: 'Earlier public technical writing.', href: 'https://medium.com/@udbhavram41' },
        ],
      },
    ],
  },
  {
    id: 'motorsports',
    title: 'Motorsports',
    summary: 'Race strategy, vehicle controls, and test-driving experience that shaped an engineering approach grounded in timing, telemetry, and decisions under pressure.',
    source: `${googleSiteRoot}motorsports`,
    groups: [
      {
        title: 'Race engineering and vehicle programs',
        items: [
          {
            title: 'Data and Strategy Intern - Arrow McLaren IndyCar',
            meta: 'Indianapolis, Indiana',
            detail: 'Developed deterministic strategy-prediction simulation, used race-weekend telemetry and performance tools, and contributed to race, performance, and strategy-engineering projects.',
          },
          {
            title: 'MAC Formula SAE Electric',
            detail: 'Software engineering, vehicle controls, dynamics, and custom dashboard work.',
          },
          {
            title: 'Formula LGB 1300',
            detail: 'Test and development driver program with Momentum Motorsports.',
          },
          {
            title: 'Volkswagen Polo Cup',
            detail: 'Test-driver experience with MRF at Madras International Circuit.',
          },
        ],
      },
    ],
  },
  {
    id: 'activities-service',
    title: 'Activities and service',
    summary: 'Clinical exposure, volunteering, teaching, sport, music, and community work from the earlier Activities page.',
    source: `${googleSiteRoot}activities`,
    groups: [
      {
        title: 'Clinical, research, software, and service',
        items: [
          { title: 'UAB Hindu YUVA', detail: 'Participation in activities centered on promoting, practicing, protecting, and preserving Hindu values.' },
          { title: 'Clinical shadowing - UAB Radiation Oncology', detail: 'Shadowed radiation oncologists and medical physicists.' },
          {
            title: 'Earlier software-engineering roles',
            detail: "Biomedical researcher at St. Joseph's Healthcare Hamilton; independent deep-learning researcher with UAB Radiation Oncology; DevOps infrastructure and backend lead for WaaW Group; lead full-stack developer at Synth-Med Biotechnologies.",
          },
          { title: 'Research activity', detail: 'Earlier public material grouped research-fellow work across UAB, Western University, and McMaster.' },
          {
            title: 'Humber River Hospital volunteer',
            detail: 'Volunteer experience across medical imaging, surgical inpatient, and information-services departments.',
          },
          { title: 'MAC Formula SAE Electric', detail: 'Software subteam work focused on vehicle controls and custom dashboard implementations.' },
          { title: 'Robotics', detail: 'Senior programmer and outreach member for FRC Team 4939; lead mentor for Zone01 Robotics.' },
        ],
      },
      {
        title: 'Training, sport, and instruction',
        items: [
          { title: 'Scuba diving qualifications', detail: 'PADI Advanced Open Water Diver and Enriched Air Diver (Nitrox), confirmed May 2025. Earlier SSI Open Water Diver qualification issued June 3, 2023, through SaltyBoneDivers in Chennai.' },
          { title: 'Registered yoga instructor', detail: 'Head yoga instructor at Anytime Fitness Brampton and yoga instructor at McMaster University.' },
          {
            title: 'Flight school',
            detail: 'Training at Brampton Flight Centre.',
            note: 'The old page listed a July 2022 private-pilot-license target; it is preserved as a historical goal, not a confirmed completion.',
          },
          { title: 'Equestrian sport', detail: 'Membership in Equestrian Canada and Ontario Equestrian; more than five years of English and Western riding experience listed on the earlier site.' },
          { title: 'Ice hockey', detail: 'School team member from 2018 to 2020.' },
        ],
      },
      {
        title: 'Music',
        items: [
          { title: 'Western classical violin', detail: 'More than seven years of experience and completion of the Central Peel Regional Strings Program.' },
          { title: 'Piano', detail: 'Royal Conservatory of Music pianist certification listed on the earlier site.' },
          { title: 'Indian classical violin', detail: 'More than ten years of Carnatic violin experience listed on the earlier site.' },
          { title: 'Indian classical vocal music', detail: 'More than ten years of Carnatic vocal performance experience listed on the earlier site.' },
        ],
      },
    ],
  },
  {
    id: 'recognition',
    title: 'Awards and certifications',
    summary: 'Research recognition, academic and service credentials, arts, mentoring, and competition results, with external documentation and ownership made explicit.',
    source: `${googleSiteRoot}awards-and-certifications`,
    groups: [
      {
        title: 'Research and institutional recognition',
        items: [
          {
            title: 'AAPM Blue Ribbon Poster',
            detail: 'Designation for one of the highest-scoring AAPM 2025 abstracts, on locally hosted language models for radiation-oncology naming QA.',
            href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
          },
          {
            title: 'Ethos Adaptive Radiotherapy Course',
            detail: 'A two-and-a-half-day Varian Ethos Clinical School training program for adaptive-radiotherapy workflows.',
          },
          {
            title: 'McMaster Emerging Science Co-op Employer of the Year',
            detail: 'Carlos Cardenas received the 2025 employer award after a nomination by Udbhav Ram.',
            href: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award',
            note: 'This is collaboration and mentorship recognition, not a personal award to Udbhav.',
          },
          {
            title: 'Outstanding Poster Presentation',
            detail: '2024 Society of Physics Students-AAPM undergraduate research competition recognition for the Ethos high-fidelity work.',
            href: 'https://www.aapm.org/pubs/newsletter/archive/5001.pdf',
          },
          {
            title: 'McMaster feature',
            detail: 'Institutional profile of the international visiting-scholar and UAB collaboration experience.',
            href: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/',
          },
          {
            title: 'UAB feature',
            detail: 'Heersink School of Medicine profile and video coverage of the cross-border clinical-AI collaboration.',
            href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
          },
          {
            title: 'CUPC 2023 Best Talk - first place',
            detail: 'Recognition for the presentation on optimizing dose delivery during fractionated radiotherapy.',
            href: 'https://www.youtube.com/watch?v=7JgRKwVRkEo',
          },
        ],
      },
      {
        title: 'Academic, service, and training credentials listed earlier',
        items: [
          { title: 'AP Scholar with Distinction' },
          { title: 'HOSA - second place nationally' },
          { title: 'Top 25% in Mathematics' },
          { title: 'Certified yoga teacher' },
          { title: 'French-language certification' },
          { title: 'Provincial chess champion' },
          { title: 'Medical Youth Summer Program' },
          { title: 'The Mirai Project' },
          { title: 'Computer Science competency' },
          { title: 'CPR, First Aid, and AED certification' },
        ],
      },
      {
        title: 'Arts, mentoring, and competition recognition listed earlier',
        items: [
          { title: 'Five-time piano bronze medalist' },
          { title: 'Three-time piano silver medalist' },
          { title: 'Three-time piano gold medalist' },
          { title: 'Robotics lead mentor' },
          { title: 'GRAMEN Spelling Bee semifinalist' },
          { title: 'Go-karting provincial runner-up' },
          { title: 'Badminton provincial runner-up' },
          { title: 'Robotics provincial runner-up' },
          { title: 'FIRST Robotics Competition semifinalist' },
        ],
      },
    ],
  },
  {
    id: 'media',
    title: 'Media and institutional profiles',
    summary: 'Institutional coverage of research, collaboration, mentoring, and co-op work, with recognition belonging to mentors labelled accurately.',
    source: `${googleSiteRoot}media`,
    groups: [
      {
        title: 'Institutional profiles and features',
        items: [
          {
            title: "Undergrad adds ‘international visiting scholar in radiation oncology’ to a jam-packed résumé",
            meta: 'McMaster University',
            href: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/',
          },
          {
            title: "Udbhav Ram’s co-op supervisors flew in from Alabama to give him an award",
            meta: 'McMaster University',
            href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
          },
          {
            title: 'Convocation countdown with Udbhav Ram',
            meta: 'McMaster Faculty of Science',
            href: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
          },
          {
            title: 'International student and mentor drive changes in medicine through AI',
            meta: 'UAB Heersink School of Medicine',
            href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
          },
        ],
      },
      {
        title: 'Mentorship and employer recognition',
        items: [
          {
            title: 'Cardenas receives McMaster Co-op Emerging Employer of the Year Award',
            meta: 'UAB Heersink School of Medicine, 2025',
            detail: 'The story documents Udbhav’s nomination of mentor Carlos Cardenas and the continuing UAB-McMaster collaboration.',
            href: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award',
          },
          {
            title: 'Recognizing Excellence in Science: 2024 Co-op Employer of the Year Awards',
            meta: 'McMaster Science Careers & Experience',
            detail: 'Employer and supervisor recognition presented as context for the broader co-op program.',
            href: 'https://careers.science.mcmaster.ca/recognizing-excellence-in-science-2024-co-op-employer-of-the-year-awards/',
          },
        ],
      },
    ],
  },
]

export const portfolioItemCount = portfolioCollections.reduce(
  (collectionTotal, collection) => collectionTotal + collection.groups.reduce((groupTotal, group) => groupTotal + group.items.length, 0),
  0,
)

export const originalSiteLinks = [
  { label: 'Earlier profile page', href: googleSiteRoot },
  { label: 'Media references', href: `${googleSiteRoot}media` },
  { label: 'Research references', href: `${googleSiteRoot}research` },
  { label: 'Motorsports references', href: `${googleSiteRoot}motorsports` },
  { label: 'Project references', href: `${googleSiteRoot}projects` },
  { label: 'Activities references', href: `${googleSiteRoot}activities` },
  { label: 'Awards references', href: `${googleSiteRoot}awards-and-certifications` },
]
