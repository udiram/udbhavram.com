import { ArrowUpRight } from '@phosphor-icons/react'
import { conferenceProjects, workbenchProjects, type SoftwareProject } from './softwareContent'
import SaveButton from './SaveButton'

function Preview({ project, featured = false }: { project: SoftwareProject; featured?: boolean }) {
  return <article className={featured ? 'software-preview is-featured' : 'software-preview'} id={`software-${project.id}`}>
    {project.image && <figure><img src={project.image} alt={`${project.name} interface preview`} width={project.width} height={project.height} loading="lazy" onError={event => { event.currentTarget.closest('figure')?.setAttribute('hidden', '') }} /><figcaption>{project.imageLabel}</figcaption></figure>}
    <div><span className="meta">{project.meta}</span><h3>{project.name}</h3><p>{project.copy}</p><p className="project-boundary">{project.boundary}</p><div className="card-actions">{project.href && project.cta && <a className="text-link" href={project.href}>{project.cta} <ArrowUpRight /></a>}<SaveButton id={`software:${project.id}`} /></div></div>
  </article>
}

export default function SoftwareShowcase() {
  return <>
    <section className="wrap software-showcase" aria-labelledby="showcase-title">
      <div className="section-heading"><h2 id="showcase-title">Research tools</h2><p>Software for running experiments, evaluating models, handling imaging workflows, and finding conference sessions.</p></div>
      <article className="ct-forge-story" id="ct-forge">
        <figure><img src="/assets/software/ct-forge-live.webp" alt="CT Forge operations interface with compute, model, and printer status panels" width="1440" height="922" loading="eager" /><figcaption>Application interface · July 2026</figcaption></figure>
        <div><span className="meta">Research operations workspace · active 2026</span><h3>CT Forge</h3><p>CT Forge brings lab computing, research jobs, imaging workflows, and fabrication into one workspace.</p><ol><li><strong>Check compute and jobs</strong><span>See which services are available, what is running, and where attention is needed.</span></li><li><strong>Work with permitted files</strong><span>Move research files between approved node-backed roots through the web desktop while keeping the destination visible.</span></li><li><strong>See printers and enroll nodes</strong><span>Review printer visibility and connect a new compute node through a guided enrollment flow before using it.</span></li></ol><p className="project-boundary">Historical interface; device status shown reflects the capture.</p><SaveButton id="software:ct-forge" /></div>
      </article>
      <div className="software-subheading"><span className="meta">Clinical and research systems</span><h2>Model evaluation and fabrication</h2></div>
      <div className="software-showcase-grid workbench-grid">{workbenchProjects.map((project, index) => <Preview key={project.name} project={project} featured={index === 0} />)}</div>
    </section>
    <section className="detail-band conference-product-band" id="conference-tools"><div className="wrap"><div className="section-heading"><h2>Conference tools</h2><p>Independent search and planning tools for large scientific meetings, with explicit data snapshots and privacy boundaries.</p></div><div className="conference-product-grid">{conferenceProjects.map(project => <Preview key={project.name} project={project} />)}</div></div></section>
  </>
}
