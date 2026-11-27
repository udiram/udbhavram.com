import { ArrowUpRight } from '@phosphor-icons/react'
import { conferenceProjects, ctForgeProject, workbenchProjects, type SoftwareProject } from './softwareContent'

const featuredProjects = [
  { ...ctForgeProject, href: '/software#ct-forge', cta: 'View the project' },
  workbenchProjects.find(project => project.id === 'voxelweave-designer')!,
  conferenceProjects.find(project => project.id === 'rsna-explorer')!,
]
const homeDescriptions: Record<string, { category: string; copy: string }> = {
  'ct-forge': { category: 'Research operations', copy: 'A workspace for research jobs, lab computing, medical imaging, and fabrication.' },
  'voxelweave-designer': { category: 'Imaging and fabrication', copy: 'Prepare medical-imaging data for multi-material fabrication, with calibration and verification built into the workflow.' },
  'rsna-explorer': { category: 'Conference planning', copy: 'Search the RSNA program, find presentations, and plan a personal meeting schedule.' },
}

function ProjectPreview({ project, lead = false }: { project: SoftwareProject; lead?: boolean }) {
  return (
    <article className={lead ? 'home-software-project home-reveal is-lead' : 'home-software-project home-reveal'}>
      <figure>
        <a className="home-software-image" href={project.href} aria-label={`${project.cta ?? 'View project'}: ${project.name}`}>
          <img src={project.image} alt={`${project.name} interface preview`} width={project.width} height={project.height} loading="lazy" />
        </a>
        <figcaption>{project.imageLabel}</figcaption>
      </figure>
      <div className="home-software-copy">
        <span className="home-project-category">{homeDescriptions[project.id].category}</span>
        <h3>{project.name}</h3>
        <p>{homeDescriptions[project.id].copy}</p>
        <p className="home-project-boundary">{project.boundary.replaceAll('—', ', ').replaceAll('–', '-')}</p>
        <a className="text-link" href={project.href}>{project.cta ?? 'View project'} <ArrowUpRight /></a>
      </div>
    </article>
  )
}

export default function HomeSoftware() {
  return (
    <section className="home-software section wrap" id="featured-work" aria-labelledby="featured-work-title" tabIndex={-1}>
      <div className="home-software-heading">
        <h2 id="featured-work-title">Selected software</h2>
        <p>Tools I build for research workflows, medical imaging, and conference planning.</p>
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
