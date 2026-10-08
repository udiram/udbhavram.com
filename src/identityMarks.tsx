type MarkDefinition = {
  id: string
  label: string
  src?: string
  compactSrc?: string
  fallbackLabel?: string
  requiresLightGround?: boolean
  source: string
  matches: string[]
}

const marks: MarkDefinition[] = [
  {
    id: 'uw-madison',
    label: 'University of Wisconsin–Madison',
    src: '/assets/sourced/uw-madison-logo.png',
    requiresLightGround: true,
    source: 'https://brand.wisc.edu/resource/uw-institutional-logos-for-web-digital-use/',
    matches: ['university of wisconsin', 'uw–madison', 'uw-madison'],
  },
  {
    id: 'mcmaster',
    label: 'McMaster University',
    src: '/assets/brands/mcmaster.png',
    requiresLightGround: true,
    source: 'https://brand.mcmaster.ca/logos-and-marks/logos-and-marks-cont-mcmaster-logo-minimal-size/',
    matches: ['mcmaster'],
  },
  {
    id: 'uab',
    label: 'University of Alabama at Birmingham',
    src: '/assets/brands/uab.svg',
    compactSrc: '/assets/brands/uab-monogram.svg',
    requiresLightGround: true,
    source: 'https://www.uab.edu/brandguide',
    matches: ['university of alabama at birmingham', 'uab ', 'uab·', 'uab radiation', 'uab heersink', 'mary heersink'],
  },
  {
    id: 'hamilton-health-sciences',
    label: 'Hamilton Health Sciences',
    src: '/assets/brands/hamilton-health-sciences.png',
    requiresLightGround: true,
    source: 'https://www.hamiltonhealthsciences.ca/',
    matches: ['hamilton health sciences', 'juravinski cancer'],
  },
  {
    id: 'western',
    label: 'Western University',
    src: '/assets/brands/western.svg',
    requiresLightGround: true,
    source: 'https://www.communications.uwo.ca/web_design/components/icons-logos.html',
    matches: ['western university', 'western ·', 'western /', 'western lawson'],
  },
  {
    id: 'st-josephs',
    label: 'St. Joseph’s Healthcare Hamilton',
    src: '/assets/brands/st-josephs-healthcare-hamilton.png',
    requiresLightGround: true,
    source: 'https://www.stjoes.ca/',
    matches: ['st. joseph', 'st joseph', 'hamilton centre for kidney research'],
  },
  {
    id: 'mclaren-racing',
    label: 'McLaren Racing',
    src: '/assets/brands/mclaren-racing.svg',
    requiresLightGround: true,
    source: 'https://www.arrowmclaren.com/',
    matches: ['arrow mclaren', 'mclaren racing'],
  },
  {
    id: 'sps',
    label: 'Society of Physics Students',
    src: '/assets/brands/sps.webp',
    source: 'https://students.aip.org/sps',
    matches: ['society of physics students'],
  },
  {
    id: 'aapm',
    label: 'American Association of Physicists in Medicine',
    src: '/assets/brands/aapm.png',
    requiresLightGround: true,
    source: 'https://www.aapm.org/',
    matches: ['american association of physicists in medicine', 'aapm'],
  },
  {
    id: 'first',
    label: 'FIRST',
    src: '/assets/brands/first.svg',
    requiresLightGround: true,
    source: 'https://www.firstinspires.org/brand/logos-guidelines',
    matches: ['first robotics', 'frc 4939', 'frc team'],
  },
  {
    id: 'hosa',
    label: 'HOSA–Future Health Professionals',
    src: '/assets/brands/hosa.webp',
    source: 'https://hosa.org/hosa-logos/',
    matches: ['hosa'],
  },
  {
    id: 'ssi',
    label: 'Scuba Schools International',
    src: '/assets/brands/ssi.webp',
    source: 'https://www.divessi.com/',
    matches: ['ssi ·', 'ssi -', 'scuba schools international'],
  },
  {
    id: 'padi',
    label: 'PADI',
    fallbackLabel: 'PADI',
    source: 'https://pros-blog.padi.com/padi-online-business-service-3-image-logo-and-video-gallery/',
    matches: ['padi'],
  },
  {
    id: 'college-board',
    label: 'College Board',
    fallbackLabel: 'College Board',
    source: 'https://privacy.collegeboard.org/copyright-trademark/guidelines',
    matches: ['college board'],
  },
]

const normalize = (value: string) => value.toLowerCase().replaceAll('–', '-').replaceAll('’', "'")

function resolveIdentityMark(label: string) {
  const normalized = normalize(label)
  return marks.find(mark => mark.matches.some(match => normalized.includes(normalize(match))))
}

export function IdentityMark({ label, compact = false, contextual = false }: { label: string; compact?: boolean; contextual?: boolean }) {
  const mark = resolveIdentityMark(label)
  const contextualLabel = contextual && mark && ({
    'uw-madison': 'UW–Madison',
    mcmaster: 'McMaster',
    uab: 'UAB',
    aapm: 'AAPM',
  } as Record<string, string>)[mark.id]
  const wide = mark && ['uab', 'hamilton-health-sciences', 'western', 'st-josephs', 'mclaren-racing', 'first', 'hosa'].includes(mark.id)
  const type = contextualLabel ? 'named' : mark?.src ? 'official' : mark?.fallbackLabel ? 'named' : 'typographic'
  const requiresLightGround = mark?.requiresLightGround && !contextual
  return <span className={`identity-mark${compact ? ' is-compact' : ''}${wide ? ' is-wide' : ''}${contextual ? ' is-contextual' : ''}${requiresLightGround ? ' requires-light-ground' : ''}${type === 'named' ? ' is-named' : ''}${type === 'typographic' ? ' is-typographic' : ''}`} data-mark-id={mark?.id ?? 'fallback'} data-mark-type={type} title={mark?.label ?? label}>
    {contextualLabel ? <span>{contextualLabel}</span> : mark?.src ? <picture>{mark.compactSrc && <source media="(max-width: 520px)" srcSet={mark.compactSrc} />}<img src={mark.src} alt="" loading="lazy" /></picture> : <span>{mark?.fallbackLabel ?? label}</span>}
  </span>
}
