export type SoftwareProject = {
  id: string
  name: string
  meta: string
  image: string
  width: number
  height: number
  imageLabel: string
  copy: string
  boundary: string
  href?: string
  cta?: string
}

export const scoutCaption = 'Demo data. Simulated Scout, invented numbers.'
export const scoutPaperCredit = 'Paper shown: Vecsey-Nagy M et al., Eur Radiol 2026, PMC13793304, CC BY 4.0.'

export const scoutProject: SoftwareProject = {
  id: 'scout',
  name: 'Scout',
  meta: 'Zhang Lab · UW–Madison / UW Health radiology',
  image: '/assets/software/scout/scout-hero-light-1440.webp',
  width: 2332,
  height: 2500,
  imageLabel: scoutCaption,
  copy: "Scout is a private chat for UW Health radiology staff, inside Lattice, the Zhang Lab's operating app. Ask a plain question about the department's thousands of CT orders and Scout answers with a table or chart, says exactly what it counted, and lets you open example exams. It also searches published papers and the department's CT protocol wiki, and opens them in a reader beside the chat at the sentence the answer used. Two checks run behind it: every figure is checked against what Scout looked up, and a second independent count checks the main number. It runs on the lab's own computer and AI model inside the hospital network. Only paper search terms and paper IDs go out.",
  boundary: 'A private lab tool for approved UW Health and UW–Madison staff, reachable only on the hospital network. Not a diagnostic device. The screenshots use demo data, with invented names and numbers.',
}

export const ctForgeProject: SoftwareProject = {
  id: 'ct-forge',
  name: 'CT Forge',
  meta: 'Research operations workspace · active 2026',
  image: '/assets/software/ct-forge-live.webp',
  width: 1440,
  height: 922,
  imageLabel: 'Application interface · July 2026',
  copy: 'A workspace for lab computing, research jobs, imaging workflows, and fabrication, with explicit service and device state.',
  boundary: 'Historical interface; device status shown reflects the capture.',
}

export const workbenchProjects: SoftwareProject[] = [
  { id: 'protocoliq', name: 'ProtocolIQ', meta: 'Research workflow · synthetic demonstration', image: '/assets/software/protocoliq-reviewed-demo.webp', width: 1440, height: 960, imageLabel: 'Local synthetic success-state demonstration · source capture, August 2026', copy: 'A clinician-reviewed protocol-candidate workflow with explicit deferral, ranked alternatives, audit, and rollback boundaries. This source-built demonstration shows a synthetic chest-angiography request and a matching recommended-protocol state.', boundary: 'Synthetic local demonstration—not a clinical record, autonomous protocol selector, production-health claim, or medical device.' },
  { id: 'radkev', name: 'RadKev', meta: 'UW–Madison · radiology decision research', image: '', width: 0, height: 0, imageLabel: '', copy: 'Work with Dr. Ran Zhang on radiology-specialized 9B and 27B models, continued training, and constrained-option probability outputs. Public model cards and evaluation artifacts show both gains and weaknesses.', boundary: 'A pre-registered research evaluation, not a diagnostic device; external checks did not establish a clear 27B advantage.', href: 'https://github.com/udiram/RadKev', cta: 'View code' },
  { id: 'voxelweave-designer', name: 'VoxelWeave Designer', meta: 'Open imaging-to-fabrication software · active 2026', image: '/assets/software/voxelweave-prepare.webp', width: 1440, height: 960, imageLabel: 'Interface concept', copy: 'A six-stage macOS workspace—Design, DICOM, Calibrate, Prepare, Send, and Verify—for producing inspectable multi-material fabrication run packages.', boundary: 'Preview and G-code come before printing, material calibration, and scan-back validation.', href: 'https://github.com/udiram/VoxelWeave-Designer', cta: 'View code' },
  { id: 'medphysbench', name: 'MedPhysBench', meta: 'Open evaluation infrastructure · active 2026', image: '/assets/software/medphysbench-reference.webp', width: 1440, height: 960, imageLabel: 'Interface concept', copy: 'Deterministic graders, safety gates, sealed task views, and versioned packs for evaluating medical-physics AI and agent systems within a declared tool-and-policy setup.', boundary: 'Benchmark performance does not establish clinical competence.', href: 'https://github.com/udiram/MedPhysBench', cta: 'View code' },
  { id: 'glioblastoma-analysis', name: 'Glioblastoma analysis', meta: 'Open imaging-research code · updated 2026', image: '', width: 0, height: 0, imageLabel: '', copy: 'An exploratory repository for studying deep-learning methods and imaging characteristics in glioblastoma.', boundary: 'Exploratory code; the repository does not claim validated clinical performance.', href: 'https://github.com/udiram/Glioblastoma_analysis', cta: 'View code' },
]

export const conferenceProjects: SoftwareProject[] = [
  { id: 'rsna-explorer', name: 'RSNA Explorer', meta: 'Independent software · 2026 public-program snapshot', image: '/assets/software/rsna-explorer-live.webp', width: 1440, height: 1000, imageLabel: 'Application interface · local build captured October 6, 2026', copy: 'Search and planning across 946 sessions and 6,931 presentations, with source-backed venue guidance and a 128,237-record public research archive spanning 2003–2025.', boundary: 'The app uses frozen public snapshots with visible retrieval cutoffs; it is independent and not affiliated with RSNA.', href: 'https://rsna-explorer-production.up.railway.app/', cta: 'Explore the app' },
  { id: 'oncoscout-2026', name: 'OncoScout2026', meta: 'Independent software · ASTRO 2026 program edition', image: '/assets/software/onscout-live.webp', width: 1440, height: 2451, imageLabel: 'Production application capture · October 2026', copy: 'Session search, topic filters, a browser-local agenda and private notes, conflict checks, and calendar export for a large meeting program.', boundary: 'Independent and not affiliated with ASTRO; the official organizer remains authoritative.', href: 'https://astro2026-explorer-production.up.railway.app/', cta: 'Explore the app' },
  { id: 'aapm-2026-explorer', name: 'AAPM 2026 Explorer', meta: 'Independent software · AAPM 2026 program edition', image: '/assets/software/aapm-2026-explorer-live.webp', width: 1440, height: 1080, imageLabel: 'Live application capture · October 26, 2026 · 3,098 program records', copy: 'A searchable meeting-program companion with session discovery, institution maps, schedule signals, saved planning, and calendar tools for the 2026 annual meeting.', boundary: 'Point-in-time live interface capture; independent and not affiliated with AAPM. Confirm meeting details with the official program.', href: 'https://aapm2026explorer-production.up.railway.app/', cta: 'Explore the app' },
]

export const softwareProjects = [scoutProject, ctForgeProject, ...workbenchProjects, ...conferenceProjects]
