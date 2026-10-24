import { ArrowUpRight } from '@phosphor-icons/react'
import { conferenceProjects, ctForgeProject, workbenchProjects, type SoftwareProject } from './softwareContent'

const featuredProjects = [
  { ...ctForgeProject, href: '/software#ct-forge', cta: 'View the project' },
  workbenchProjects.find(project => project.id === 'voxelweave-designer')!,
  conferenceProjects.find(project => project.id === 'rsna-explorer')!,
]

function ProjectPreview({ project, lead = false }: { project: SoftwareProject; lead?: boolean }) {
  return (
    <article className={lead ? 'home-software-project home-reveal is-lead' : 'home-software-project home-reveal'}>
      <a className="home-software-image" href={project.href} aria-label={`${project.cta ?? 'View project'}: ${project.name}`}>
        <img src={project.image} alt={`${project.name} interface preview`} width={project.width} height={project.height} loading="lazy" />
      </a>
      <div className="home-software-copy">
        <span className="meta">{project.meta}</span>
        <h3>{project.name}</h3>
        <p>{project.copy}</p>
        <span className="software-capture-note">{project.imageLabel}. {project.boundary}</span>
        <a className="text-link" href={project.href}>{project.cta ?? 'View project'} <ArrowUpRight /></a>
      </div>
    </article>
  )
}

export default function HomeSoftware() {
  return (
    <section className="home-software section wrap" id="featured-work" aria-labelledby="featured-work-title" tabIndex={-1}>
      <div className="home-software-heading">
        <div>
          <span className="meta">Featured software</span>
          <h2 id="featured-work-title">Tools built around real research work.</h2>
        </div>
        <p>Three tools for research operations, imaging-to-fabrication, and scientific-meeting discovery.</p>
      </div>
      <div className="home-software-layout">
        <ProjectPreview project={featuredProjects[0]} lead />
        <div className="home-software-supporting">
          <ProjectPreview project={featuredProjects[1]} />
          <ProjectPreview project={featuredProjects[2]} />
        </div>
      </div>
      <a className="button home-software-all" href="/software">Explore all software <ArrowUpRight /></a>
    </section>
  )
}
