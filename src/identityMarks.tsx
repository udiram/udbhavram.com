import { BookOpen, Calculator, Car, Code, FirstAid, Heartbeat, Lightbulb, Medal, MicrophoneStage, PersonSimpleTaiChi, PianoKeys, Robot, Trophy, Translate } from '@phosphor-icons/react'

type ActivityIcon = 'book' | 'calculator' | 'car' | 'code' | 'first-aid' | 'health' | 'idea' | 'medal' | 'microphone' | 'piano' | 'robot' | 'trophy' | 'translate' | 'yoga'
type MarkDefinition = {
  id: string
  label: string
  src?: string
  compactSrc?: string
  activityIcon?: ActivityIcon
  visualKind?: 'official' | 'evidence' | 'activity'
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
    src: '/assets/brands/padi.svg',
    requiresLightGround: true,
    source: 'https://pros-blog.padi.com/padi-online-business-service-3-image-logo-and-video-gallery/',
    matches: ['padi'],
  },
  {
    id: 'college-board',
    label: 'College Board',
    activityIcon: 'book',
    visualKind: 'activity',
    source: 'https://privacy.collegeboard.org/copyright-trademark/guidelines',
    matches: ['college board'],
  },
  {
    id: 'american-cowboy-academy',
    label: 'The American Cowboy Academy',
    src: '/assets/brands/american-cowboy-academy.webp',
    requiresLightGround: true,
    source: 'https://theamericancowboyacademy.com/',
    matches: ['american cowboy academy'],
  },
  { id: 'mac-formula-electric', label: 'MAC Formula Electric', src: '/assets/brands/mac-formula-electric.png', requiresLightGround: true, source: 'https://macformularacing.com/', matches: ['mac formula electric'] },
  { id: 'synth-med', label: 'Synth-Med Biotechnologies', src: '/assets/brands/synth-med.png', requiresLightGround: true, source: 'https://synth-med.com/', matches: ['synth-med'] },
  { id: 'waaw', label: 'WaaW Global Inc.', activityIcon: 'code', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/activities', matches: ['waaw global'] },
  { id: 'jspg', label: 'Journal of Science Policy & Governance', src: '/assets/brands/jspg.png', requiresLightGround: true, source: 'https://www.sciencepolicyjournal.org/', matches: ['journal of science policy'] },
  { id: 'anytime-fitness', label: 'Anytime Fitness', src: '/assets/brands/anytime-fitness.svg', requiresLightGround: true, source: 'https://www.anytimefitness.com/', matches: ['anytime fitness'] },
  { id: 'humber-river', label: 'Humber River Hospital', src: '/assets/brands/humber-health.svg', requiresLightGround: true, source: 'https://www.hrh.ca/', matches: ['humber river hospital'] },
  { id: 'zone01', label: 'Robotique Zone01', activityIcon: 'robot', visualKind: 'activity', source: 'https://zone01.ca/index.php/fr-ca/', matches: ['robotique zone01'] },
  { id: 'sparkin-stem', label: 'Sparkin’ STEM', activityIcon: 'translate', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/projects', matches: ['sparkin'] },
  { id: 'momentum-motorsports', label: 'Momentum Motorsports', src: '/assets/personal/motorsports-02.webp', visualKind: 'evidence', source: 'https://sites.google.com/view/udbhav-ram/motorsports', matches: ['momentum motorsports'] },
  { id: 'mrf', label: 'MRF · Volkswagen Polo Cup', activityIcon: 'car', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/motorsports', matches: ['mrf ', 'volkswagen polo cup'] },
  { id: 'varian', label: 'Varian Clinical School', activityIcon: 'book', visualKind: 'activity', source: 'https://www.siemens-healthineers.com/en-in/education/education-offerings-varian', matches: ['varian clinical school'] },
  { id: 'cupc', label: 'Canadian Undergraduate Physics Conference', src: '/assets/media/video-thumbnails/7JgRKwVRkEo.jpg', visualKind: 'evidence', source: 'https://www.youtube.com/watch?v=7JgRKwVRkEo', matches: ['canadian undergraduate physics conference'] },
  { id: 'mirai', label: 'The Mirai Project', activityIcon: 'idea', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/projects', matches: ['mirai project'] },
  { id: 'gramen', label: 'GRAMEN Spelling Bee', activityIcon: 'microphone', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['gramen spelling bee'] },
  { id: 'spark-hackathon', label: 'SPARK Hackathon', src: '/assets/personal/projects-02.webp', visualKind: 'evidence', source: 'https://sites.google.com/view/udbhav-ram/projects', matches: ['spark hackathon'] },
  { id: 'math-record', label: 'Mathematics recognition · issuer not public', activityIcon: 'calculator', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['top 25% in mathematics'] },
  { id: 'yoga-training', label: 'Yoga teacher training · issuer not public', activityIcon: 'yoga', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/activities', matches: ['certified yoga teacher'] },
  { id: 'french-training', label: 'French-language certification · issuer not public', activityIcon: 'translate', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['french-language certification'] },
  { id: 'chess-record', label: 'Provincial chess result · organizer not public', activityIcon: 'trophy', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['provincial chess champion'] },
  { id: 'medical-youth', label: 'Medical Youth Summer Program · issuer not public', activityIcon: 'health', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['medical youth summer program'] },
  { id: 'computer-science', label: 'Computer Science competency · issuer not public', activityIcon: 'code', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['computer science competency'] },
  { id: 'cpr-aed', label: 'CPR, First Aid, and AED training · issuer not public', activityIcon: 'first-aid', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['cpr, first aid'] },
  { id: 'piano-record', label: 'Piano competition record · organizer not public', activityIcon: 'piano', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['piano bronze', 'piano silver', 'piano gold'] },
  { id: 'robotics-record', label: 'Robotics recognition · organizer not public', activityIcon: 'robot', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['robotics lead mentor', 'robotics provincial'] },
  { id: 'karting-record', label: 'Provincial karting result · organizer not public', activityIcon: 'car', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['go-karting provincial'] },
  { id: 'badminton-record', label: 'Provincial badminton result · organizer not public', activityIcon: 'medal', visualKind: 'activity', source: 'https://sites.google.com/view/udbhav-ram/awards-and-certifications', matches: ['badminton provincial'] },
]

const normalize = (value: string) => value.toLowerCase().replaceAll('–', '-').replaceAll('’', "'")

function resolveIdentityMark(label: string) {
  const normalized = normalize(label)
  return marks.find(mark => mark.matches.some(match => normalized.includes(normalize(match))))
}

function ActivityVisual({ name }: { name: ActivityIcon }) {
  const icons = { book: BookOpen, calculator: Calculator, car: Car, code: Code, 'first-aid': FirstAid, health: Heartbeat, idea: Lightbulb, medal: Medal, microphone: MicrophoneStage, piano: PianoKeys, robot: Robot, trophy: Trophy, translate: Translate, yoga: PersonSimpleTaiChi }
  const Icon = icons[name]
  return <Icon size={30} weight="duotone" aria-hidden="true" />
}

export function IdentityMark({ label, compact = false, contextual = false }: { label: string; compact?: boolean; contextual?: boolean }) {
  const mark = resolveIdentityMark(label)
  const wide = mark && ['uab', 'hamilton-health-sciences', 'western', 'st-josephs', 'mclaren-racing', 'first', 'hosa', 'jspg', 'anytime-fitness', 'humber-river'].includes(mark.id)
  const type = mark?.visualKind ?? (mark?.src ? 'official' : mark?.activityIcon ? 'activity' : 'missing')
  return <span className={`identity-mark${compact ? ' is-compact' : ''}${wide ? ' is-wide' : ''}${contextual ? ' is-contextual' : ''}${mark?.requiresLightGround ? ' requires-light-ground' : ''}${type === 'activity' ? ' is-activity' : ''}${type === 'evidence' ? ' is-evidence' : ''}`} data-mark-id={mark?.id ?? 'fallback'} data-mark-type={type} title={mark?.label ?? label}>
    {mark?.src ? <picture>{mark.compactSrc && <source media="(max-width: 520px)" srcSet={mark.compactSrc} />}<img src={mark.src} alt="" loading="lazy" /></picture> : mark?.activityIcon ? <ActivityVisual name={mark.activityIcon} /> : <span aria-hidden="true">?</span>}
  </span>
}
