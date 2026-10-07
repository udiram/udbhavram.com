import { ArrowUpRight } from '@phosphor-icons/react'

type Project = { name: string; meta: string; image: string; width: number; height: number; imageLabel: string; copy: string; boundary: string; href?: string; cta?: string }

const workbench: Project[] = [
  { name: 'ProtocolIQ', meta: 'Research workflow · synthetic demonstration', image: '/assets/software/protocoliq-demo.webp', width: 1440, height: 810, imageLabel: 'Synthetic product demonstration', copy: 'A clinician-reviewed protocol-candidate workflow with explicit deferral, audit, and rollback boundaries. The demonstration uses placeholder input rather than a clinical record.', boundary: 'Research software—not an autonomous protocol selector or a clinical device.' },
  { name: 'RadKev', meta: 'UW–Madison · radiology decision research', image: '', width: 0, height: 0, imageLabel: '', copy: 'Work with Dr. Ran Zhang on radiology-specialized 9B and 27B models, continued training, and constrained-option probability outputs. Public model cards and evaluation artifacts show both gains and weaknesses.', boundary: 'A pre-registered research evaluation, not a diagnostic device; external checks did not establish a clear 27B advantage.', href: 'https://github.com/udiram/RadKev', cta: 'View code' },
  { name: 'VoxelWeave Designer', meta: 'Open imaging-to-fabrication software · active 2026', image: '/assets/software/voxelweave-prepare.webp', width: 1440, height: 960, imageLabel: 'Interface concept', copy: 'A six-stage macOS workspace—Design, DICOM, Calibrate, Prepare, Send, and Verify—for producing inspectable multi-material fabrication run packages.', boundary: 'Preview and G-code come before printing, material calibration, and scan-back validation.', href: 'https://github.com/udiram/VoxelWeave-Designer', cta: 'View code' },
  { name: 'MedPhysBench', meta: 'Open evaluation infrastructure · active 2026', image: '/assets/software/medphysbench-reference.webp', width: 1440, height: 960, imageLabel: 'Interface concept', copy: 'Deterministic graders, safety gates, sealed task views, and versioned packs for evaluating medical-physics AI and agent systems within a declared tool-and-policy setup.', boundary: 'Benchmark performance does not establish clinical competence.', href: 'https://github.com/udiram/MedPhysBench', cta: 'View code' },
  { name: 'Glioblastoma analysis', meta: 'Open imaging-research code · updated 2026', image: '', width: 0, height: 0, imageLabel: '', copy: 'An exploratory repository for studying deep-learning methods and imaging characteristics in glioblastoma.', boundary: 'Exploratory code; the repository does not claim validated clinical performance.', href: 'https://github.com/udiram/Glioblastoma_analysis', cta: 'View code' },
]

const conferenceTools: Project[] = [
  { name: 'RSNA Explorer', meta: 'Independent software · 2026 public-program snapshot', image: '/assets/software/rsna-explorer-live.webp', width: 1440, height: 1000, imageLabel: 'Application interface · local build captured October 6, 2026', copy: 'Search and planning across 946 sessions and 6,931 presentations, with source-backed venue guidance and a 128,237-record public research archive spanning 2003–2025.', boundary: 'The app uses frozen public snapshots with visible retrieval cutoffs; it is independent and not affiliated with RSNA.', href: 'https://rsna-explorer-production.up.railway.app/', cta: 'Explore the app' },
  { name: 'OncoScout2026', meta: 'Independent software · ASTRO 2026 program edition', image: '/assets/software/onscout-live.webp', width: 1440, height: 2451, imageLabel: 'Production application capture · October 2026', copy: 'Session search, topic filters, a browser-local agenda and private notes, conflict checks, and calendar export for a large meeting program.', boundary: 'Independent and not affiliated with ASTRO; the official organizer remains authoritative.', href: 'https://astro2026-explorer-production.up.railway.app/', cta: 'Explore the app' },
  { name: 'AAPM 2026 Explorer', meta: 'Independent software · AAPM 2026 program edition', image: '', width: 0, height: 0, imageLabel: '', copy: 'A searchable meeting-program companion with session discovery, saved planning, and calendar tools for the 2026 annual meeting.', boundary: 'Independent and not affiliated with AAPM; meeting details should be confirmed with the official program.', href: 'https://aapm2026explorer-production.up.railway.app/', cta: 'Explore the app' },
]

function Preview({ project, featured = false }: { project: Project; featured?: boolean }) {
  return <article className={featured ? 'software-preview is-featured' : 'software-preview'}>
    {project.image && <figure><img src={project.image} alt={`${project.name} interface preview`} width={project.width} height={project.height} loading="lazy" onError={event => { event.currentTarget.closest('figure')?.setAttribute('hidden', '') }} /><figcaption>{project.imageLabel}</figcaption></figure>}
    <div><span className="meta">{project.meta}</span><h3>{project.name}</h3><p>{project.copy}</p><p className="project-boundary">{project.boundary}</p>{project.href && project.cta && <a className="text-link" href={project.href}>{project.cta} <ArrowUpRight /></a>}</div>
  </article>
}

export default function SoftwareShowcase() {
  return <>
    <section className="wrap software-showcase" aria-labelledby="showcase-title">
      <div className="section-heading"><h2 id="showcase-title">Tools for<br /><em>the work I do.</em></h2><p>From running experiments to finding a conference session, I build software around the practical work of research.</p></div>
      <article className="ct-forge-story" id="ct-forge">
        <figure><img src="/assets/software/ct-forge-live.webp" alt="CT Forge operations interface with compute, model, and printer status panels" width="1440" height="922" loading="eager" /><figcaption>Application interface · July 2026</figcaption></figure>
        <div><span className="meta">Research operations workspace · active 2026</span><h3>CT Forge</h3><p>CT Forge brings lab computing, research jobs, imaging workflows, and fabrication into one workspace.</p><ol><li><strong>Check compute and jobs</strong><span>See which services are available, what is running, and where attention is needed.</span></li><li><strong>Work with permitted files</strong><span>Move research files between approved node-backed roots through the web desktop while keeping the destination visible.</span></li><li><strong>See printers and enroll nodes</strong><span>Review printer visibility and connect a new compute node through a guided enrollment flow before using it.</span></li></ol><p className="project-boundary">Historical interface; device status shown reflects the capture.</p></div>
      </article>
      <div className="software-subheading"><span className="meta">Clinical and research systems</span><h2>From decisions<br /><em>to fabrication.</em></h2></div>
      <div className="software-showcase-grid workbench-grid">{workbench.map((project, index) => <Preview key={project.name} project={project} featured={index === 0} />)}</div>
    </section>
    <section className="detail-band conference-product-band" id="conference-tools"><div className="wrap"><div className="section-heading"><h2>Finding a path<br /><em>through a program.</em></h2><p>Independent discovery tools for large scientific meetings. Their program snapshots, privacy boundaries, and organizer relationships are explicit.</p></div><div className="conference-product-grid">{conferenceTools.map(project => <Preview key={project.name} project={project} />)}</div></div></section>
  </>
}
