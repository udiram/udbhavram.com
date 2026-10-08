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
  { id: 'protocoliq', name: 'ProtocolIQ', meta: 'Research workflow · synthetic demonstration', image: '/assets/software/protocoliq-demo.webp', width: 1440, height: 810, imageLabel: 'Synthetic product demonstration', copy: 'A clinician-reviewed protocol-candidate workflow with explicit deferral, audit, and rollback boundaries. The demonstration uses placeholder input rather than a clinical record.', boundary: 'Research software—not an autonomous protocol selector or a clinical device.' },
  { id: 'radkev', name: 'RadKev', meta: 'UW–Madison · radiology decision research', image: '', width: 0, height: 0, imageLabel: '', copy: 'Work with Dr. Ran Zhang on radiology-specialized 9B and 27B models, continued training, and constrained-option probability outputs. Public model cards and evaluation artifacts show both gains and weaknesses.', boundary: 'A pre-registered research evaluation, not a diagnostic device; external checks did not establish a clear 27B advantage.', href: 'https://github.com/udiram/RadKev', cta: 'View code' },
  { id: 'voxelweave-designer', name: 'VoxelWeave Designer', meta: 'Open imaging-to-fabrication software · active 2026', image: '/assets/software/voxelweave-prepare.webp', width: 1440, height: 960, imageLabel: 'Interface concept', copy: 'A six-stage macOS workspace—Design, DICOM, Calibrate, Prepare, Send, and Verify—for producing inspectable multi-material fabrication run packages.', boundary: 'Preview and G-code come before printing, material calibration, and scan-back validation.', href: 'https://github.com/udiram/VoxelWeave-Designer', cta: 'View code' },
  { id: 'medphysbench', name: 'MedPhysBench', meta: 'Open evaluation infrastructure · active 2026', image: '/assets/software/medphysbench-reference.webp', width: 1440, height: 960, imageLabel: 'Interface concept', copy: 'Deterministic graders, safety gates, sealed task views, and versioned packs for evaluating medical-physics AI and agent systems within a declared tool-and-policy setup.', boundary: 'Benchmark performance does not establish clinical competence.', href: 'https://github.com/udiram/MedPhysBench', cta: 'View code' },
  { id: 'glioblastoma-analysis', name: 'Glioblastoma analysis', meta: 'Open imaging-research code · updated 2026', image: '', width: 0, height: 0, imageLabel: '', copy: 'An exploratory repository for studying deep-learning methods and imaging characteristics in glioblastoma.', boundary: 'Exploratory code; the repository does not claim validated clinical performance.', href: 'https://github.com/udiram/Glioblastoma_analysis', cta: 'View code' },
]

export const conferenceProjects: SoftwareProject[] = [
  { id: 'rsna-explorer', name: 'RSNA Explorer', meta: 'Independent software · 2026 public-program snapshot', image: '/assets/software/rsna-explorer-live.webp', width: 1440, height: 1000, imageLabel: 'Application interface · local build captured October 6, 2026', copy: 'Search and planning across 946 sessions and 6,931 presentations, with source-backed venue guidance and a 128,237-record public research archive spanning 2003–2025.', boundary: 'The app uses frozen public snapshots with visible retrieval cutoffs; it is independent and not affiliated with RSNA.', href: 'https://rsna-explorer-production.up.railway.app/', cta: 'Explore the app' },
  { id: 'oncoscout-2026', name: 'OncoScout2026', meta: 'Independent software · ASTRO 2026 program edition', image: '/assets/software/onscout-live.webp', width: 1440, height: 2451, imageLabel: 'Production application capture · October 2026', copy: 'Session search, topic filters, a browser-local agenda and private notes, conflict checks, and calendar export for a large meeting program.', boundary: 'Independent and not affiliated with ASTRO; the official organizer remains authoritative.', href: 'https://astro2026-explorer-production.up.railway.app/', cta: 'Explore the app' },
  { id: 'aapm-2026-explorer', name: 'AAPM 2026 Explorer', meta: 'Independent software · AAPM 2026 program edition', image: '', width: 0, height: 0, imageLabel: '', copy: 'A searchable meeting-program companion with session discovery, saved planning, and calendar tools for the 2026 annual meeting.', boundary: 'Independent and not affiliated with AAPM; meeting details should be confirmed with the official program.', href: 'https://aapm2026explorer-production.up.railway.app/', cta: 'Explore the app' },
]

export const softwareProjects = [ctForgeProject, ...workbenchProjects, ...conferenceProjects]
