import { useEffect, useState } from 'react'
import './App.css'

type SiteMode = 'general' | 'radonc' | 'racing' | 'research'

const modes: Record<SiteMode, { label: string; title: string; text: string }> = {
  general: {
    label: 'General',
    title: 'Full spectrum',
    text: 'Clinical AI, medical physics, software, and performance systems.',
  },
  radonc: {
    label: 'Rad Onc',
    title: 'Radiation oncology',
    text: 'Planning, QA, segmentation, adaptive workflows, and reviewable AI.',
  },
  racing: {
    label: 'Racing',
    title: 'Motorsports',
    text: 'Telemetry, race strategy, simulation, and performance engineering.',
  },
  research: {
    label: 'Research',
    title: 'Research profile',
    text: 'Publications, talks, collaborations, and the academic thread.',
  },
}

const modeOrder = Object.keys(modes) as SiteMode[]
const storageKey = 'udbhavram-site-mode'

const profileFacts = [
  ['Current focus', 'Clinical AI, medical physics software, radiation oncology workflows, and race strategy systems.'],
  ['McMaster', 'Fifth-year Medical & Biological Physics student and Science Co-op Student of the Year winner.'],
  ['UAB', 'International Visiting Scholar in Radiation Oncology and UAB-McMaster Ambassador.'],
  ['Clinical translation', 'Work spans adaptive radiotherapy, SRS planning, auto-segmentation, QA, and human-reviewed AI.'],
]

const researchPapers = [
  [
    '2025',
    'Dosimetric evaluation of Ethos 2.0 high-fidelity mode for single-isocenter SRS',
    'Journal of Applied Clinical Medical Physics',
  ],
  [
    '2025',
    'Assessing quantitative performance and expert review of deep learning frameworks for CT abdominal organ auto-segmentation',
    'Intelligent Oncology',
  ],
  ['2025', 'Improving TG-263 target name compliance using locally hosted large language models', 'AAPM Blue Ribbon Poster'],
  ['2020', "The effects of resveratrol, caffeine, beta-carotene, and EGCG on amyloid aggregation", 'Molecular Nutrition & Food Research'],
]

const radOncChecks = [
  ['TG-263 harmonization', 'Local LLM pipelines that convert messy target names into rule-checked clinical nomenclature.'],
  ['Ethos 2.0 SRS planning', 'Published high-fidelity mode evaluation for multi-met, single-isocenter stereotactic workflows.'],
  ['Adaptive APBI contours', 'Interobserver variability work around Ethos adaptive accelerated partial breast irradiation.'],
  ['TrueBeam SBRT commissioning', 'Multi-institution 6X versus 10X FFF comparisons for SBRT plan behavior.'],
]

const racePrograms = [
  ['Arrow McLaren IndyCar', 'Data and strategy internship: deterministic simulation, race-weekend tooling, telemetry, and car performance monitoring.'],
  ['McMaster Formula SAE Electric', 'Software engineering for vehicle controls, dynamics, and custom dashboard implementations.'],
  ['Formula LGB 1300', 'Test and development driver program with Momentum Motorsports.'],
  ['VW Polo Cup testing', 'MRF test driver work at Madras International Circuit.'],
]

const projectRows = [
  ['Clinical software', 'Flask/Django backends, research apps, automated review flows, and deployment pipelines.'],
  ['Open source', 'Contributions around MONAI and OpenHands, plus small utilities for medical imaging workflows.'],
  ['Robotics and autonomy', 'FRC programming, Zone01 robotics mentoring, openpilot experimentation, and control systems.'],
  ['STEM + teaching', 'Sparkin STEM French program coordination, yoga instruction, and volunteer clinical exposure.'],
]

const awards = [
  ['2026', 'McMaster Science Co-op Student of the Year for UAB radiation oncology work'],
  ['2025', 'AAPM Blue Ribbon Poster for locally hosted LLMs in radiation oncology naming workflows'],
  ['2025', 'UAB-McMaster Ambassador supporting institutional partnership and student advising'],
  ['2025', 'Carlos Cardenas received McMaster Emerging Science Co-op Employer of the Year after Udbhav nomination'],
  ['2024', 'Society of Physics Students / AAPM undergraduate research poster recognition'],
  ['2023', 'CUPC Overall Winner, Best Talk, for optimizing dose delivery during fractionated radiotherapy'],
  ['2024', 'Featured by McMaster University and UAB Heersink School of Medicine'],
  ['2024', 'Ethos adaptive radiotherapy clinical school training'],
  ['2021', 'Advanced Placement Scholar with Distinction'],
  ['2020', 'HOSA national second place recognition'],
  ['2020', 'Top 25 percent in mathematics recognition'],
  ['2020', 'French language certification'],
  ['2019', 'SPARK Hackathon runner-up for a computer vision recycling sorter'],
  ['2020', 'The Mirai Project runner-up for a medical case study'],
  ['Music', 'Royal Conservatory piano bronze, silver, and gold medals'],
  ['Sport', 'Provincial chess champion, go-karting runner-up, badminton runner-up, robotics awards'],
  ['Safety', 'CPR, first aid, and AED certification'],
]

const presentationRows = [
  ['AAPM 2025', 'Blue Ribbon Poster: Improving TG-263 target name compliance using locally hosted LLMs'],
  ['COMP 2024', 'Invited talk: locally hosted LLMs for TG-263 target-name compliance'],
  ['AAPM 2024', 'Posters on Ethos 2.0 SRS planning and AutoML segmentation workflows'],
  ['CUPC 2023', 'Best Talk: Optimizing dose delivery during fractionated radiotherapy'],
  ['AAPM 2023', 'Interactive e-poster on deep learning auto-contouring for abdominal normal tissues'],
  ['CAP 2021', 'Oral undergraduate presentation on smartphone gel electrophoresis analysis'],
]

const affiliations = [
  ['University of Alabama at Birmingham', 'International Visiting Scholar, Department of Radiation Oncology.'],
  ['McMaster University', 'Medical & Biological Physics, co-op ambassador and UAB-McMaster partnership advocate.'],
  ['Juravinski Cancer Centre / Hamilton Health Sciences', 'Radiation oncology and medical physics research collaboration.'],
  ['Lawson Health Research Institute', 'Research experience around imaging, biomedical workflows, and clinical translation.'],
  ['Hamilton Centre for Kidney Research', 'Research fellow work intersecting imaging, surgery, and computer vision.'],
  ['Laboratory for Membrane and Protein Dynamics', 'Early biophysics work in McMaster Physics and Astronomy.'],
]

const researchProjects = [
  ['Adaptive APBI contours', 'Interobserver variability for Ethos adaptive accelerated partial breast irradiation plans.'],
  ['TrueBeam SBRT commissioning', 'Dosimetric comparison of 6X and 10X FFF photon beams using Eclipse TPS.'],
  ['Ethos SRS high-fidelity mode', 'Semi-automated comparative analysis for multi-met, single-isocenter stereotactic radiotherapy.'],
  ['Auto-segmentation benchmark', 'Auto3DSeg, nnU-Net, and SwinUNETR comparison for abdominal organ segmentation.'],
  ['Formula car lap simulation', 'Ordinary differential equation models for formula car lap-time simulation.'],
  ['Open-world driving agents', 'Deep learning and computer vision models for simulated driving behavior.'],
  ['Genomic LQ modeling', 'Machine learning models for genomic linear-quadratic radiation dose behavior.'],
  ['Optical brain measurements', 'Models predicting in vivo hemoglobin oxygenation from optical measurements.'],
  ['Gel electrophoresis analysis', 'Smartphone and cloud workflow for quantitative gel electrophoresis sizing.'],
  ['Surgical computer vision', 'Computer vision application for chronic kidney disease surgical model accuracy.'],
  ['Amyloid aggregation', 'Food ingredient effects on amyloid-beta aggregation in synthetic brain membranes.'],
]

const softwareProjects = [
  ['AAPM Explorer', 'Fast conference browser for abstracts, sessions, authors, institutions, favorites, schedules, and mobile workflows.'],
  ['Radiology and RT demos', 'Clinical AI workbenches, DICOM safety flows, local LLM review, and report QA prototypes.'],
  ['Full-stack research apps', 'Flask/Django backends, cloud ML services, Android/iOS/web frontends, and CI/CD pipelines.'],
  ['Synth-Med Biotechnologies', 'Full-stack and research development work around biomedical software and translational tools.'],
  ['WAAW Group', 'DevOps infrastructure and backend leadership.'],
  ['Robotics and autonomy', 'FRC programming, Zone01 mentoring, openpilot driver assistance experiments, and vehicle controls.'],
]

const activityRows = [
  ['Clinical exposure', 'Shadowed radiation oncologists and medical physicists at UAB Radiation Oncology.'],
  ['UAB Hindu YUVA', 'Community involvement around cultural programming and student support.'],
  ['Volunteer work', 'Humber River Hospital medical imaging, surgical inpatient, and information services volunteering.'],
  ['Yoga', 'Registered yoga instructor; taught at Anytime Fitness Brampton and McMaster University.'],
  ['Aviation', 'Private pilot training through Brampton Flight Centre.'],
  ['Hackathons', 'SPARK 2019 computer vision recycling sorter and The Mirai Project 2020 medical case study finalist work.'],
  ['STEM education', "French program coordination for Sparkin' STEM with in-house curriculum integration."],
  ['Biomedical software', 'Synth-Med full-stack development, WAAW DevOps/backend work, and biomedical research software.'],
  ['Music', 'Western classical violin, Carnatic violin, Carnatic vocal training, and Royal Conservatory piano awards.'],
  ['Sport', 'Scuba, equestrian experience, hockey, badminton, chess, go-karting, and motorsport testing.'],
]

const sourceLinks = [
  ['McMaster profile', 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/'],
  ['UAB profile', 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor'],
  ['Co-op award', 'https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/'],
  ['LinkedIn', 'https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine'],
  ['Google Scholar', 'https://scholar.google.com/citations?hl=en&user=5NGyc78AAAAJ'],
]

function getInitialMode() {
  const urlMode = new URLSearchParams(window.location.search).get('mode')
  if (modeOrder.includes(urlMode as SiteMode)) return urlMode as SiteMode

  const saved = window.localStorage.getItem(storageKey)
  return modeOrder.includes(saved as SiteMode) ? (saved as SiteMode) : null
}

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h10.5M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  )
}

function LensGate({ onChoose }: { onChoose: (mode: SiteMode) => void }) {
  return (
    <main className="lens-gate">
      <section className="gate-intro">
        <p>udbhavram.com</p>
        <h1>Pick the version that matches why you are here.</h1>
      </section>
      <section className="gate-grid" aria-label="Choose site version">
        {modeOrder.map((mode) => (
          <button className={`gate-card gate-card-${mode}`} key={mode} type="button" onClick={() => onChoose(mode)}>
            <span>{modes[mode].label}</span>
            <strong>{modes[mode].title}</strong>
            <em>{modes[mode].text}</em>
          </button>
        ))}
      </section>
    </main>
  )
}

function ModeSwitcher({ active, onChoose }: { active: SiteMode; onChoose: (mode: SiteMode) => void }) {
  return (
    <aside className={`lens-switcher mode-${active}`} aria-label="Switch site version">
      <span>Lens</span>
      {modeOrder.map((mode) => (
        <button
          className={active === mode ? 'active' : ''}
          key={mode}
          type="button"
          aria-pressed={active === mode}
          onClick={() => onChoose(mode)}
        >
          {modes[mode].label}
        </button>
      ))}
    </aside>
  )
}

function GeneralAtlas() {
  return (
    <div className="general-atlas" aria-label="General profile map">
      <div className="atlas-orbit" aria-hidden="true">
        <svg viewBox="0 0 420 420">
          <path d="M72 212C72 128 128 76 210 76s138 52 138 136-56 132-138 132S72 296 72 212Z" />
          <path d="M118 118 302 302" />
          <path d="M304 116 116 304" />
          <circle cx="210" cy="210" r="22" />
          <circle cx="116" cy="116" r="7" />
          <circle cx="304" cy="116" r="7" />
          <circle cx="304" cy="304" r="7" />
          <circle cx="116" cy="304" r="7" />
        </svg>
        <strong>UR</strong>
      </div>
      <div className="atlas-quadrants">
        {[
          ['Clinic', 'Radiation oncology and clinical AI'],
          ['Code', 'Research software and deployed tools'],
          ['Physics', 'Medical and biological systems'],
          ['Speed', 'Motorsport strategy and telemetry'],
        ].map(([title, text]) => (
          <article key={title}>
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function RtWorkstation() {
  return (
    <div className="rt-workstation">
      <div className="rt-monitor">
        <div className="rt-monitor-head">
          <span>case_review.ts</span>
          <span>non-PHI</span>
        </div>
        <pre>{`targetName.check()
  input:   GTVp_7000
  rule:    TG-263
  status:  aligned

plan.compare()
  dose:    readable
  review:  physician + physics
  trace:   attached`}</pre>
      </div>
      <div className="rt-console">
        <p>RT_CHECKLIST</p>
        <span>Plan compare</span>
        <span>Contour review</span>
        <span>Dose QA</span>
      </div>
    </div>
  )
}

function RacingPitWall() {
  const laps = ['P01 1:28.420', 'P02 +0.118', 'P03 +0.406', 'P04 +0.911', 'BOX L18']

  return (
    <div className="pit-wall" aria-label="Racing telemetry pit wall">
      <div className="track-map">
        <svg viewBox="0 0 360 220" aria-hidden="true">
          <path className="track-base" d="M52 138 C36 72 108 28 178 42 C268 60 332 94 309 148 C286 202 208 179 169 154 C128 127 75 188 52 138Z" />
          <path className="track-fast" d="M52 138 C36 72 108 28 178 42 C268 60 332 94 309 148 C286 202 208 179 169 154 C128 127 75 188 52 138Z" />
          <circle cx="177" cy="42" r="5" />
          <circle cx="309" cy="148" r="5" />
          <circle cx="52" cy="138" r="5" />
        </svg>
      </div>
      <div className="strategy-board">
        <div>
          <span>stint</span>
          <strong>L18-L34</strong>
        </div>
        <div>
          <span>delta</span>
          <strong>+0.083</strong>
        </div>
        <div>
          <span>risk</span>
          <strong>hold</strong>
        </div>
      </div>
      <div className="timing-tower">
        {laps.map((row) => (
          <p key={row}>{row}</p>
        ))}
      </div>
    </div>
  )
}

function ResearchDossier() {
  return (
    <div className="research-dossier" aria-label="Research dossier preview">
      <div className="dossier-spine">
        <span>Selected work</span>
        <strong>2020-2026</strong>
      </div>
      <div className="dossier-pages">
        {researchPapers.slice(0, 3).map(([year, title, venue]) => (
          <article key={title}>
            <span>{year}</span>
            <h2>{title}</h2>
            <p>{venue}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function GeneralSite() {
  return (
    <main className="site-page general-site">
      <header className="site-nav">
        <a href="#top">Udbhav Ram</a>
        <nav>
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <section className="general-hero" id="top">
        <div>
          <p className="mode-line">clinical ai / medical physics / software / performance systems</p>
          <h1>
            Builder across
            <br />
            clinic, code,
            <br />
            and physics.
          </h1>
          <p>
            I work on clinical AI, radiation oncology workflows, research software, and technical systems that need to be fast,
            inspectable, and useful under pressure.
          </p>
          <a className="action-link" href="#work">
            View work <Arrow />
          </a>
        </div>
        <GeneralAtlas />
      </section>
      <GeneralContent />
      <ContactPanel accent="general" />
    </main>
  )
}

function RadOncSite() {
  return (
    <main className="site-page rt-site">
      <header className="rt-topline">
        <span>udbhav@rt-workstation</span>
        <span>plan-review --ai --qa --human-signoff</span>
      </header>
      <section className="rt-hero" id="top">
        <div className="terminal-panel">
          <p className="prompt">$ load clinical_workflow.md</p>
          <h1>
            Clinic-ready
            <br />
            radiation
            <br />
            oncology
            <br />
            software.
          </h1>
          <div className="terminal-output">
            <p>structure names... aligned</p>
            <p>synthetic case... non-PHI</p>
            <p>dose overlay... readable</p>
            <p>source trace... attached</p>
            <p>physician / physicist review ready</p>
          </div>
          <a className="action-link" href="#research">
            Review clinical work <Arrow />
          </a>
        </div>
        <RtWorkstation />
      </section>
      <RadOncContent />
      <ContactPanel accent="rt" />
    </main>
  )
}

function RacingSite() {
  return (
    <main className="site-page racing-site">
      <header className="race-bar">
        <span>pit wall</span>
        <span>sector delta +0.083</span>
        <span>window open lap 18</span>
      </header>
      <section className="race-hero" id="top">
        <div className="race-copy">
          <p className="mode-line">telemetry / strategy / simulation / performance engineering</p>
          <h1>
            Race systems
            <br />
            for decisions
            <br />
            at speed.
          </h1>
          <p>
            Turning noisy telemetry and race context into strategy: stint windows, lap-time models, pit timing, and tools an
            engineer can trust while the clock is running.
          </p>
        </div>
        <RacingPitWall />
      </section>
      <section className="race-cards" id="work">
        {racePrograms.slice(0, 3).map(([title, text]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <RacingContent />
      <ContactPanel accent="race" />
    </main>
  )
}

function ResearchSite() {
  return (
    <main className="site-page research-site">
      <header className="paper-nav">
        <a href="#top">Udbhav Ram</a>
        <span>research index</span>
      </header>
      <section className="paper-hero" id="top">
        <div>
          <p className="mode-line">publications / talks / collaborations / research software</p>
          <h1>
            Research, talks,
            <br />
            and tools become
            <br />
            inspectable systems.
          </h1>
          <p>
            A publication-first view of work across medical physics, clinical AI, segmentation, treatment planning, and
            workflow-aware software.
          </p>
        </div>
        <ResearchDossier />
      </section>
      <ResearchContent />
      <ContactPanel accent="paper" />
    </main>
  )
}

function GeneralContent() {
  return (
    <>
      <section className="general-strip" id="work">
        <p>profile</p>
        <h2>McMaster medical physics, UAB radiation oncology, clinical AI software, and motorsport engineering.</h2>
      </section>
      <section className="info-grid facts-grid" aria-label="Profile facts">
        {profileFacts.map(([title, text]) => (
          <article key={title}>
            <span>{title}</span>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="project-matrix" aria-label="General work areas">
        {projectRows.map(([title, text]) => (
          <article key={title}>
            <span>{title}</span>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="compact-ledger" aria-label="Software and project work">
        <h2>Software and projects</h2>
        <div>
          {softwareProjects.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="award-ribbon" id="research">
        {awards.map(([year, title]) => (
          <article key={title}>
            <strong>{year}</strong>
            <p>{title}</p>
          </article>
        ))}
      </section>
      <section className="source-strip" aria-label="Source links">
        {sourceLinks.map(([title, href]) => (
          <a key={title} href={href} target="_blank" rel="noreferrer">
            {title} <Arrow />
          </a>
        ))}
      </section>
    </>
  )
}

function RadOncContent() {
  return (
    <>
      <section className="rt-flow" id="work" aria-label="Radiation oncology workflow">
        {radOncChecks.map(([title, text], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="rt-evidence" id="research">
        <div>
          <p>translation target</p>
          <h2>Build the tool, validate the output, publish the work, keep a human in the loop.</h2>
        </div>
        <div className="dose-readout">
          {['non-PHI inputs', 'source-traced outputs', 'physician review', 'physics signoff', 'clinical deployment'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
      <section className="compact-ledger rt-ledger" aria-label="Radiation oncology evidence">
        <h2>Clinical research thread</h2>
        <div>
          {researchProjects.slice(0, 5).map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function RacingContent() {
  return (
    <>
      <section className="race-ledger" id="research">
        {racePrograms.map(([title, text]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="race-transfer">
        <div className="delta-board">
          {['signal', 'model', 'decision', 'feedback'].map((item, index) => (
            <span key={item}>
              {index + 1} / {item}
            </span>
          ))}
        </div>
        <p>
          The racing version is about pressure-tested engineering: noisy inputs, limited time, and decisions that need to be
          explainable after the fact.
        </p>
      </section>
      <section className="compact-ledger race-ledger-extra" aria-label="Motorsport transfer work">
        <h2>Transferable systems</h2>
        <div>
          {[
            ['Strategy tooling', 'Deterministic simulations, timing windows, stint comparisons, and race-weekend decision support.'],
            ['Vehicle software', 'Controls, dynamics, dashboards, and data review for McMaster Formula SAE Electric.'],
            ['Driver context', 'Formula LGB 1300 development testing and VW Polo Cup testing at Madras International Circuit.'],
            ['Technical bridge', 'The same habits carry into clinical software: traceable inputs, fast review, and calm interfaces.'],
          ].map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function ResearchContent() {
  return (
    <>
      <section className="publication-index" id="work">
        {researchPapers.map(([year, title, venue]) => (
          <article key={title}>
            <span>{year}</span>
            <h2>{title}</h2>
            <p>{venue}</p>
          </article>
        ))}
      </section>
      <section className="compact-ledger research-ledger" aria-label="Research affiliations and projects">
        <h2>Affiliations</h2>
        <div>
          {affiliations.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="compact-ledger research-ledger" aria-label="Project index">
        <h2>Project index</h2>
        <div>
          {researchProjects.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="talk-timeline" id="research">
        {presentationRows.map(([event, title]) => (
          <article key={title}>
            <strong>{event}</strong>
            <p>{title}</p>
          </article>
        ))}
      </section>
      <section className="compact-ledger research-ledger" aria-label="Activities and teaching">
        <h2>Activities</h2>
        <div>
          {activityRows.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function ContactPanel({ accent }: { accent: 'general' | 'rt' | 'race' | 'paper' }) {
  return (
    <section className={`contact-panel contact-${accent}`} id="contact">
      <h2>Get in touch</h2>
      <p>Research collaborations, clinical AI projects, medical physics software, racing analytics, and technical systems.</p>
      <div>
        <a href="mailto:ramu@mcmaster.ca">ramu@mcmaster.ca</a>
        <a href="https://x.com/UdbhavRam" target="_blank" rel="noreferrer">
          x.com/UdbhavRam
        </a>
        <a href="https://ca.linkedin.com/in/udbhav-ram-engineering-and-medicine" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="https://github.com/udiram" target="_blank" rel="noreferrer">
          github.com/udiram
        </a>
      </div>
    </section>
  )
}

function App() {
  const [mode, setMode] = useState<SiteMode | null>(() => getInitialMode())

  const chooseMode = (nextMode: SiteMode) => {
    setMode(nextMode)
    window.localStorage.setItem(storageKey, nextMode)
    window.history.replaceState(null, '', `?mode=${nextMode}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    document.documentElement.dataset.mode = mode ?? 'gate'
  }, [mode])

  if (!mode) {
    return <LensGate onChoose={chooseMode} />
  }

  return (
    <>
      <ModeSwitcher active={mode} onChoose={chooseMode} />
      {mode === 'general' && <GeneralSite />}
      {mode === 'radonc' && <RadOncSite />}
      {mode === 'racing' && <RacingSite />}
      {mode === 'research' && <ResearchSite />}
    </>
  )
}

export default App
