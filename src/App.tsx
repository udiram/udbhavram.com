import { useEffect, useMemo, useState, type ReactNode } from 'react'
import './App.css'

type SectionId = 'home' | 'research' | 'media' | 'projects' | 'activities' | 'awards' | 'motorsports'

type LinkItem = {
  label: string
  href: string
  meta?: string
}

type Entry = {
  title: string
  text: string
  meta?: string
  href?: string
}

const navItems: { id: SectionId; label: string; tone: string }[] = [
  { id: 'home', label: 'Home', tone: 'neutral' },
  { id: 'research', label: 'Research', tone: 'research' },
  { id: 'media', label: 'Media', tone: 'media' },
  { id: 'projects', label: 'Projects', tone: 'projects' },
  { id: 'activities', label: 'Activities', tone: 'activities' },
  { id: 'awards', label: 'Awards', tone: 'awards' },
  { id: 'motorsports', label: 'Motorsports', tone: 'motorsports' },
]

const socialLinks: LinkItem[] = [
  { label: 'Email', href: 'mailto:ramu@mcmaster.ca' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/udbhav-ramamurthy-clinical-software-engineer/' },
  { label: 'GitHub', href: 'https://github.com/udiram' },
  { label: 'Google Scholar', href: 'https://scholar.google.com/citations?hl=en&user=5NGyc78AAAAJ' },
  { label: 'Medium', href: 'https://medium.com/@udbhavram41' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCTn6NYNbV55T4zs9v1nHOwA' },
  { label: 'X', href: 'https://x.com/UdbhavRam' },
]

const proofLinks: LinkItem[] = [
  {
    label: 'McMaster profile',
    href: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/',
    meta: 'International visiting scholar profile',
  },
  {
    label: 'UAB profile',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
    meta: 'McMaster-UAB AI/radiation oncology feature',
  },
  {
    label: 'Co-op award',
    href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
    meta: 'Science Co-op Student of the Year',
  },
  {
    label: 'Convocation profile',
    href: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
    meta: 'McMaster Science feature',
  },
]

const homeHighlights: Entry[] = [
  {
    title: 'Clinical AI and radiation oncology',
    text: 'International Visiting Scholar at UAB Radiation Oncology, working on clinical AI, adaptive radiotherapy workflows, plan evaluation, naming compliance, and reviewable software.',
    meta: 'UAB + McMaster',
  },
  {
    title: 'Software that reaches users',
    text: 'Full-stack builder across Flask, Django, cloud ML services, Android, iOS, web frontends, CI/CD, research apps, and conference tools.',
    meta: 'Backend + frontend + deployment',
  },
  {
    title: 'Performance engineering',
    text: 'Arrow McLaren IndyCar data and strategy internship, McMaster Formula SAE Electric software, vehicle controls, telemetry, and deterministic race-session simulation.',
    meta: 'Motorsport systems',
  },
  {
    title: 'Research breadth',
    text: 'Eight years of computational and clinical research experience across medical physics, segmentation, treatment planning, computer vision, optical measurement, and biophysics.',
    meta: 'Publications + presentations',
  },
]

const currentResearch: Entry[] = [
  {
    title: 'LLM agent integration in clinical workflows',
    text: 'Clinical workflow research at UAB focused on how local, reviewable AI systems can support radiation oncology teams without hiding the source trail.',
    meta: 'UAB Radiation Oncology',
  },
  {
    title: 'Ethos 2.0 treatment planning for single-isocentre SRS',
    text: 'Validation of high-fidelity treatment planning for multi-met, single-isocentre stereotactic radiosurgery, including semi-automated comparative analysis.',
    meta: 'UAB',
    href: 'https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/acm2.70370',
  },
  {
    title: 'Adaptive APBI contour variability',
    text: 'Evaluation of interobserver variability for Ethos adaptive accelerated partial breast irradiation plans.',
    meta: 'Submitted to IJROBP',
  },
  {
    title: 'TrueBeam SBRT commissioning',
    text: 'Multi-institution commissioning study comparing 6X and 10X flattening filter-free beams for SBRT on TrueBeam iTX using Eclipse TPS.',
    meta: 'JCC + UAB',
  },
]

const publications: Entry[] = [
  {
    title: 'Dosimetric evaluation of Ethos 2.0 high-fidelity mode for single-isocenter SRS',
    text: 'Journal of Applied Clinical Medical Physics publication on high-fidelity mode evaluation for multi-met stereotactic radiotherapy.',
    meta: '2025, JACMP',
    href: 'https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/acm2.70370',
  },
  {
    title: 'Assessing quantitative performance and expert review of deep learning frameworks for CT abdominal organ auto-segmentation',
    text: 'Intelligent Oncology paper comparing state-of-the-art deep learning frameworks for abdominal organ segmentation.',
    meta: '2025, Intelligent Oncology',
    href: 'https://doi.org/10.1016/j.intonc.2025.03.003',
  },
  {
    title: 'Improving TG-263 target name compliance using locally hosted large language models',
    text: 'AAPM Blue Ribbon Poster on locally hosted LLMs for radiation oncology target-name compliance.',
    meta: '2025, AAPM Blue Ribbon Poster',
    href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105',
  },
  {
    title: 'The effects of resveratrol, caffeine, beta-carotene, and EGCG on amyloid aggregation',
    text: 'Early biophysics publication studying food ingredient effects on amyloid-beta aggregation in synthetic brain membranes.',
    meta: '2020, Molecular Nutrition & Food Research',
    href: 'https://onlinelibrary.wiley.com/doi/10.1002/mnfr.202000632',
  },
]

const researchProjects: Entry[] = [
  { title: 'Auto-segmentation benchmark', text: 'Auto3DSeg, nnU-Net, SwinUNETR, and public data comparisons for abdominal organ segmentation.', meta: 'Deep learning + medical imaging' },
  { title: 'Formula car lap-time modeling', text: 'Ordinary differential equation models for lap-time simulation and performance analysis.', meta: 'Completed December 2022' },
  { title: 'Open-world driving agents', text: 'Deep learning and computer vision models for effective driving agents in simulated open-world environments.', meta: 'Autonomy' },
  { title: 'Genomic LQ modeling', text: 'Deep learning and machine learning models for genomic linear-quadratic radiation dose behavior.', meta: 'Radiobiology' },
  { title: 'Optical brain measurements', text: 'Machine learning models using optical measurements to predict in vivo hemoglobin oxygenation.', meta: 'Completed December 2022' },
  { title: 'Gel electrophoresis analysis', text: 'Smartphone and cloud workflow for quantitative gel electrophoresis analysis.', meta: 'Completed July 2021' },
  { title: 'Surgical computer vision', text: 'Computer vision application to improve accuracy in surgical chronic kidney disease models.', meta: 'Completed September 2023' },
  { title: 'Nutrition and Alzheimer’s disease', text: 'Biophysics work connecting nutrition-related compounds and amyloid aggregation.', meta: 'Published 2020' },
]

const presentations: Entry[] = [
  { title: 'AAPM 2025', text: 'Blue Ribbon Poster: Improving TG-263 target name compliance using locally hosted LLMs.', meta: 'Washington, DC', href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105' },
  { title: 'COMP 2024', text: 'Invited speaker: Improving TG-263 target name compliance using locally hosted large language models.', meta: 'Regina, SK' },
  { title: 'COMP 2024', text: 'Oral contributor: Ethos 2.0 high-fidelity mode for multi-met single-isocenter stereotactic radiotherapy.', meta: 'Regina, SK' },
  { title: 'AAPM 2024', text: 'Poster: Ethos 2.0 high-fidelity mode for multi-met single-isocenter stereotactic radiotherapy.', meta: 'Los Angeles, CA', href: 'https://aapm.confex.com/aapm/2024am/meetingapp.cgi/Paper/10372' },
  { title: 'AAPM 2024', text: 'Poster: Head-to-head comparison of state-of-the-art AutoML segmentation frameworks using public data.', meta: 'Los Angeles, CA', href: 'https://aapm.confex.com/aapm/2024am/meetingapp.cgi/Paper/12166' },
  { title: 'CUPC 2023', text: 'Overall Winner and Best Talk: Optimizing dose delivery during fractionated radiotherapy.', meta: 'Waterloo, ON' },
  { title: 'AAPM 2023', text: 'Interactive e-poster: Assessing efficacy of deep learning-based auto-contouring for abdominal normal tissues.', meta: 'Houston, TX', href: 'https://virtual.aapm.org/aapm/2023/eposters/383664/udbhav.ram.assessing.efficacy.of.deep.learning-based.auto-contouring.for.html?f=listing%3D0%2Abrowseby%3D8%2Asortby%3D1%2Asearch%3Dram' },
  { title: 'CAP 2021', text: 'Oral contributor: The quantitative analysis of gel electrophoresis on a smartphone.', meta: 'Virtual' },
]

const affiliations: Entry[] = [
  { title: 'University of Alabama at Birmingham', text: 'International Visiting Scholar, Department of Radiation Oncology.', meta: 'Clinical AI + radiation oncology' },
  { title: 'Hamilton Health Sciences, Juravinski Cancer Centre', text: 'Researcher in medical physics and radiation oncology workflows.', meta: 'Clinical collaboration' },
  { title: 'University of Western Ontario, Lawson Health Research Institute', text: 'Researcher working across imaging, biomedical workflows, and clinical translation.', meta: 'Research' },
  { title: 'Hamilton Centre for Kidney Research', text: 'Research fellow intersecting imaging, surgery, and computer vision.', meta: 'Computer vision' },
  { title: 'McMaster Physics and Astronomy', text: 'Laboratory for Membrane and Protein Dynamics biophysics research.', meta: 'Biophysics' },
]

const mediaItems: Entry[] = [
  {
    title: 'McMaster student and UAB mentor drive changes in medicine through AI',
    text: 'UAB feature on the McMaster-UAB collaboration and AI projects in radiation treatment and planning.',
    meta: 'UAB Heersink School of Medicine',
    href: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor',
  },
  {
    title: 'Udbhav Ram’s co-op supervisors flew in from Alabama to give him an award',
    text: 'McMaster profile on the UAB radiation oncology collaboration and Science Co-op Student of the Year recognition.',
    meta: 'McMaster Daily News',
    href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/',
  },
  {
    title: 'McMaster-UAB international visiting scholar',
    text: 'Profile on becoming an international visiting scholar and building the institutional research connection.',
    meta: 'McMaster Daily News',
    href: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/',
  },
  {
    title: 'Carlos Cardenas receives McMaster Co-op Emerging Employer of the Year Award',
    text: 'UAB article on the McMaster employer award connected to mentorship and the international co-op research experience.',
    meta: 'UAB',
    href: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award',
  },
  {
    title: 'Recognizing Excellence in Science 2024 Co-op Employer of the Year Awards',
    text: 'McMaster Science careers coverage of the co-op employer award ecosystem.',
    meta: 'McMaster Science',
    href: 'https://careers.science.mcmaster.ca/recognizing-excellence-in-science-2024-co-op-employer-of-the-year-awards/',
  },
  {
    title: 'Convocation countdown with Udbhav Ram',
    text: 'McMaster Science profile covering academic path, research direction, and next steps.',
    meta: 'McMaster Science',
    href: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/',
  },
]

const softwareProjects: Entry[] = [
  { title: 'AAPM Explorer', text: 'Conference browser for abstracts, sessions, authors, institutions, favorites, schedules, and mobile workflows.', meta: 'Research software' },
  { title: 'Radiology and radiation oncology demos', text: 'Clinical AI workbenches, DICOM safety flows, local LLM review, report QA, and documentation consolidation prototypes.', meta: 'Clinical software' },
  { title: 'Full-stack research applications', text: 'Flask and Django backends, cloud ML services, Android/iOS/web frontends, and CI/CD pipelines on Azure, GCS, AWS, Railway, and GitHub.', meta: 'Full-stack' },
  { title: 'Synth-Med Biotechnologies', text: 'Full-stack and research development work around biomedical software and translational workflows.', meta: 'R&D', href: 'https://synth-med.com/about/' },
  { title: 'WAAW Group', text: 'Lead DevOps infrastructure and backend work.', meta: 'Backend + infrastructure' },
  { title: 'Open source', text: 'Contributor to MONAI tutorials and OpenHands.', meta: 'Public contributions' },
]

const projectLinks: LinkItem[] = [
  { label: 'GitHub profile', href: 'https://github.com/udiram', meta: 'Code and repositories' },
  { label: 'MONAI contribution', href: 'https://github.com/Project-MONAI/tutorials/pull/1129', meta: 'Medical AI open source' },
  { label: 'OpenHands contribution', href: 'https://github.com/All-Hands-AI/OpenHands/pull/731', meta: 'AI engineering open source' },
  { label: 'Automated prosthetic limb prototype', href: 'https://sites.google.com/view/prostheticlimbprototype/home', meta: 'Robotics project archive' },
  { label: 'Sparkin STEM organizers', href: 'https://www.sparkinstem.ca/organizers', meta: 'STEM outreach' },
  { label: 'YouTube channel', href: 'https://www.youtube.com/channel/UCTn6NYNbV55T4zs9v1nHOwA', meta: 'Videos and demos' },
]

const activities: Entry[] = [
  { title: 'Clinical shadowing', text: 'Shadowed radiation oncologists and medical physicists at UAB Radiation Oncology.', meta: 'Clinical exposure' },
  { title: 'UAB Hindu YUVA', text: 'Community involvement promoting, practicing, protecting, and preserving Hindu values through events and activities.', meta: 'Community' },
  { title: 'McMaster Formula SAE Electric', text: 'Software engineering subteam work on vehicle controls, dynamics, and custom dashboard implementations.', meta: 'Vehicle software' },
  { title: 'Biomedical research', text: 'Research fellow and software contributor across UAB, UWO, McMaster, and St. Joseph’s Healthcare Hamilton.', meta: 'Research' },
  { title: 'Hospital volunteering', text: 'Volunteer at Humber River Hospital, assisting in medical imaging, surgical inpatient, and information services departments.', meta: 'Healthcare' },
  { title: 'Yoga instruction', text: 'Certified yoga instructor; taught at Anytime Fitness Brampton and McMaster University.', meta: 'Teaching' },
  { title: 'Robotics', text: 'Senior programmer and outreach member for FRC Team 4939; lead mentor for Zone01 Robotics.', meta: 'Mentorship' },
  { title: 'Flight training', text: 'Private pilot training through Brampton Flight Centre.', meta: 'Aviation' },
  { title: 'Scuba diving', text: 'Certified NAUI/SSI open water diver.', meta: 'Certification' },
  { title: 'Equestrian sports', text: 'Member of Equestrian Canada and Ontario Equestrian with over five years of English and Western riding experience.', meta: 'Sport' },
  { title: 'Music', text: 'Western classical violin, Carnatic violin, Carnatic vocal training, and Royal Conservatory piano certification.', meta: 'Music' },
]

const awards: Entry[] = [
  { title: 'McMaster Science Co-op Student of the Year', text: 'Recognized for UAB radiation oncology research and international collaboration.', meta: '2026', href: 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/' },
  { title: 'AAPM Blue Ribbon Poster', text: 'Improving TG-263 target name compliance using locally hosted LLMs.', meta: '2025', href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105' },
  { title: 'UAB-McMaster Ambassador', text: 'Supported institutional partnership and student advising around the UAB-McMaster research path.', meta: '2025' },
  { title: 'Emerging Science Co-op Employer nomination', text: 'Carlos Cardenas received McMaster recognition after Udbhav nomination and mentorship experience.', meta: '2025', href: 'https://www.uab.edu/medicine/news/latest-news/cardenas-receives-mcmaster-co-op-emerging-employer-of-the-year-award' },
  { title: 'Society of Physics Students recognition', text: 'Undergraduate research poster recognition around Ethos 2.0 SRS work.', meta: '2024', href: 'https://spscon2025.up.railway.app/poster/263' },
  { title: 'Canadian Undergraduate Physics Conference', text: 'Overall Winner and Best Talk for optimizing dose delivery during fractionated radiotherapy.', meta: '2023' },
  { title: 'Advanced Placement Scholar with honors', text: 'Academic recognition from secondary school coursework.', meta: '2021' },
  { title: 'HOSA national recognition', text: 'Second place national recognition.', meta: '2020' },
  { title: 'SPARK Hackathon runner-up', text: 'Computer vision and machine learning powered recycling sorter.', meta: '2019' },
  { title: 'The Mirai Project runner-up', text: 'Medical case study finalist work.', meta: '2020' },
  { title: 'Royal Conservatory piano medals', text: 'Bronze, silver, and gold medals plus certified pianist recognition.', meta: 'Music' },
  { title: 'Sport and robotics awards', text: 'Provincial chess champion, go-karting runner-up, badminton runner-up, and robotics awards.', meta: 'Activities' },
  { title: 'CPR, first aid, and AED certification', text: 'Safety training certification.', meta: 'Certification' },
  { title: 'French language certification', text: 'French language achievement.', meta: 'Certification' },
]

const motorsports: Entry[] = [
  {
    title: 'Arrow McLaren IndyCar',
    text: 'Data and strategy intern in Indianapolis. Implemented deterministic simulation for strategy prediction during race sessions, learned internal race-weekend tools, monitored telemetry and car performance, and contributed to race, performance, and strategy engineering projects.',
    meta: 'Data + strategy',
  },
  {
    title: 'McMaster Formula SAE Electric',
    text: 'Software engineering in vehicle controls and dynamics, including custom dashboard implementations and engineering support for electric race-car systems.',
    meta: 'Vehicle controls',
  },
  {
    title: 'Formula LGB 1300',
    text: 'Test and development driver program with Momentum Motorsports.',
    meta: 'Driver development',
  },
  {
    title: 'VW Polo Cup',
    text: 'MRF test driver work at Madras International Circuit.',
    meta: 'Track testing',
  },
]

const videos: LinkItem[] = [
  { label: 'Research video 1', href: 'https://youtu.be/7JgRKwVRkEo' },
  { label: 'Research video 2', href: 'https://youtu.be/I0ESYlp85Rk' },
  { label: 'Research video 3', href: 'https://youtu.be/xW7umxU6NSM' },
  { label: 'Video archive', href: 'https://youtu.be/8IKr1QauMGc' },
  { label: 'Video archive', href: 'https://youtu.be/A7_TRUWW6EI' },
]

const allExternalLinks = [
  ...socialLinks,
  ...proofLinks,
  ...publications.filter((item) => item.href).map((item) => ({ label: item.title, href: item.href as string, meta: item.meta })),
  ...presentations.filter((item) => item.href).map((item) => ({ label: item.title, href: item.href as string, meta: item.text })),
  ...mediaItems.map((item) => ({ label: item.title, href: item.href as string, meta: item.meta })),
  ...projectLinks,
  ...videos,
]

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h10.5M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  )
}

function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

function EntryList({ items, compact = false }: { items: Entry[]; compact?: boolean }) {
  return (
    <div className={compact ? 'entry-list compact' : 'entry-list'}>
      {items.map((item, index) => (
        <article className="entry-row" key={`${item.title}-${item.meta ?? ''}-${index}`}>
          <div>
            {item.meta ? <p className="entry-meta">{item.meta}</p> : null}
            <h3>{item.title}</h3>
          </div>
          <div>
            <p>{item.text}</p>
            {item.href ? (
              <ExternalLink className="inline-link" href={item.href}>
                Open link <Arrow />
              </ExternalLink>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}

function LinkGrid({ items }: { items: LinkItem[] }) {
  return (
    <div className="link-grid">
      {items.map((item, index) => (
        <ExternalLink href={item.href} key={`${item.label}-${item.href}-${index}`}>
          <strong>{item.label}</strong>
          {item.meta ? <span>{item.meta}</span> : null}
          <Arrow />
        </ExternalLink>
      ))}
    </div>
  )
}

function useActiveSection() {
  const [active, setActive] = useState<SectionId>('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) setActive(visible.target.id as SectionId)
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: [0.08, 0.2, 0.35] },
    )

    navItems.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return { active, setActive }
}

function SectionShell({
  id,
  title,
  children,
}: {
  id: SectionId
  title: string
  children: ReactNode
}) {
  const tone = navItems.find((item) => item.id === id)?.tone ?? 'neutral'

  return (
    <section className={`section-shell tone-${tone}`} id={id}>
      <div className="section-heading">
        <span>{navItems.find((item) => item.id === id)?.label}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function App() {
  const { active, setActive } = useActiveSection()
  const activeTone = navItems.find((item) => item.id === active)?.tone ?? 'neutral'

  const sourceCounts = useMemo(
    () => [
      ['Publications', publications.length],
      ['Research projects', researchProjects.length + currentResearch.length],
      ['Talks/posters', presentations.length],
      ['External links', allExternalLinks.length],
    ],
    [],
  )

  return (
    <main className={`portfolio-site active-${activeTone}`}>
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => setActive('home')}>
          Udbhav Ram
        </a>
        <nav className="tabs" aria-label="Main sections">
          {navItems.map((item) => (
            <a
              className={active === item.id ? 'active' : ''}
              href={`#${item.id}`}
              key={item.id}
              aria-current={active === item.id ? 'page' : undefined}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="intro-section" id="home">
        <div className="intro-copy">
          <p>McMaster Medical & Biological Physics · UAB Radiation Oncology · Arrow McLaren data/strategy</p>
          <h1>I build reviewable clinical AI, research software, and race strategy tools.</h1>
          <p>
            I am a McMaster Medical & Biological Physics student, UAB Radiation Oncology international visiting scholar,
            software engineer, researcher, and motorsport data/strategy intern. This site is organized like a portfolio
            an employer can scan: proof first, details one tab away, sources linked directly.
          </p>
          <div className="hero-actions">
            {proofLinks.slice(0, 3).map((link) => (
              <ExternalLink className="text-button" href={link.href} key={link.label}>
                {link.label} <Arrow />
              </ExternalLink>
            ))}
          </div>
        </div>
        <aside className="fit-panel" aria-label="Employer summary">
          <div className="fit-title">
            <span>Portfolio signal</span>
            <strong>Clinical judgment, software execution, and engineering under pressure.</strong>
          </div>
          <div className="fit-grid">
            {homeHighlights.map((item) => (
              <article key={item.title}>
                <span>{item.meta}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="source-band" aria-label="Evidence counts">
        {sourceCounts.map(([label, count]) => (
          <div key={label}>
            <strong>{count}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <SectionShell id="research" title="Radiation oncology, AI, medical physics, and computational research.">
        <div className="theme-panel research-terminal">
          <pre>{`clinical_workflow.load()
  target: reviewable AI for radiation oncology
  current: LLM agents, Ethos SRS, adaptive APBI, SBRT commissioning
  guardrails: source-traced outputs + human signoff`}</pre>
        </div>
        <h3 className="subsection-title">Current research</h3>
        <EntryList items={currentResearch} />
        <h3 className="subsection-title">Publications and papers</h3>
        <EntryList items={publications} />
        <h3 className="subsection-title">Research projects</h3>
        <EntryList compact items={researchProjects} />
        <h3 className="subsection-title">Presentations</h3>
        <EntryList compact items={presentations} />
        <h3 className="subsection-title">Affiliations</h3>
        <EntryList compact items={affiliations} />
      </SectionShell>

      <SectionShell id="media" title="News coverage and external validation.">
        <div className="theme-panel media-strip">
          <p>News, profiles, source pages, and public proof points are linked directly. No hidden resume scavenger hunt.</p>
        </div>
        <EntryList items={mediaItems} />
        <h3 className="subsection-title">Core profiles</h3>
        <LinkGrid items={proofLinks} />
      </SectionShell>

      <SectionShell id="projects" title="Software, robotics, infrastructure, and practical builds.">
        <div className="theme-panel project-console">
          <div>
            <strong>stack</strong>
            <span>Flask / Django / React / mobile / cloud ML / CI/CD</span>
          </div>
          <div>
            <strong>habit</strong>
            <span>Build the demo, test the workflow, deploy the thing.</span>
          </div>
        </div>
        <EntryList items={softwareProjects} />
        <h3 className="subsection-title">Project and code links</h3>
        <LinkGrid items={projectLinks} />
      </SectionShell>

      <SectionShell id="activities" title="Clinical exposure, service, teaching, sport, and creative discipline.">
        <EntryList items={activities} />
      </SectionShell>

      <SectionShell id="awards" title="Awards, certifications, and recognition.">
        <EntryList compact items={awards} />
      </SectionShell>

      <SectionShell id="motorsports" title="Motorsport data, race strategy, vehicle software, and driver context.">
        <div className="theme-panel race-board">
          <div className="track-line" aria-hidden="true" />
          <dl>
            <div>
              <dt>Signal</dt>
              <dd>Telemetry</dd>
            </div>
            <div>
              <dt>Model</dt>
              <dd>Deterministic simulation</dd>
            </div>
            <div>
              <dt>Decision</dt>
              <dd>Race strategy</dd>
            </div>
          </dl>
        </div>
        <EntryList items={motorsports} />
      </SectionShell>

      <section className="section-shell tone-neutral" id="links">
        <div className="section-heading">
          <span>Links</span>
          <h2>Everything linked in one place.</h2>
        </div>
        <LinkGrid items={allExternalLinks} />
        <footer className="site-footer">
          <p>
            Built from the original Google Site content, expanded for employer review, and organized around evidence:
            publications, public profiles, project links, and direct social links.
          </p>
          <ExternalLink className="inline-link" href="https://sites.google.com/view/udbhav-ram/home">
            Original Google Site <Arrow />
          </ExternalLink>
          <LinkGrid items={socialLinks} />
        </footer>
      </section>
    </main>
  )
}

export default App
