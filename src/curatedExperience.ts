import { experienceRecords } from './identityContent'

export type CuratedExperience = {
  id: string
  title: string
  institution: string
  period: string
  summary: string
  sourceIds: string[]
}

const curatedExperienceMap: CuratedExperience[] = [
  {
    id: 'uw-phd',
    title: 'Medical Physics PhD student with Dr. Ran Zhang',
    institution: 'University of Wisconsin–Madison',
    period: '2026–present',
    summary: 'Doctoral research on AI for medical imaging and radiation oncology.',
    sourceIds: ['uw-medical-physics', 'uw-research-assistant'],
  },
  {
    id: 'uab-radiation-oncology',
    title: 'Radiation-oncology researcher and visiting scholar',
    institution: 'University of Alabama at Birmingham',
    period: '2021–present · in person 2024–25',
    summary: 'A remote collaboration that grew into two visiting appointments, clinical shadowing, publications, and conference work.',
    sourceIds: ['uab-research-collaborator', 'uab-visiting-scholar', 'uab-clinical-shadowing'],
  },
  {
    id: 'mcmaster-degree',
    title: 'Honours BSc, Medical Physics with Co-op',
    institution: 'McMaster University',
    period: '2021–2026',
    summary: 'Undergraduate training across physics, computation, research, teaching, and co-op placements.',
    sourceIds: ['mcmaster-medical-physics'],
  },
  {
    id: 'arrow-mclaren',
    title: 'Data and strategy intern',
    institution: 'Arrow McLaren IndyCar',
    period: 'Summer 2023',
    summary: 'Built race-strategy simulations and worked with race-weekend telemetry and performance tools.',
    sourceIds: ['arrow-mclaren'],
  },
  {
    id: 'juravinski',
    title: 'Undergraduate thesis researcher',
    institution: 'Juravinski Cancer Centre',
    period: '2024–2025',
    summary: 'Compared 6X-FFF and 10X-FFF beam configurations for lung SBRT in a multi-institution study.',
    sourceIds: ['juravinski'],
  },
  {
    id: 'western-lawson',
    title: 'Medical-physics researcher',
    institution: 'Western University · Lawson Health Research Institute',
    period: '2022–2023',
    summary: 'Used optical measurements and deep learning to model cerebral hemoglobin oxygenation.',
    sourceIds: ['western-lawson'],
  },
  {
    id: 'kidney-research',
    title: 'Clinical research fellow',
    institution: 'St. Joseph’s Healthcare Hamilton',
    period: '2021–2022',
    summary: 'Worked on computer-vision and augmented-reality tools for chronic-kidney-disease surgical models.',
    sourceIds: ['st-josephs-kidney'],
  },
  {
    id: 'membrane-lab',
    title: 'High-school research fellow',
    institution: 'McMaster Physics & Astronomy',
    period: '2019–2022',
    summary: 'Studied amyloid aggregation and built quantitative imaging tools, leading to an early co-authored paper.',
    sourceIds: ['mcmaster-membrane-lab'],
  },
  {
    id: 'teaching-mentoring',
    title: 'Teaching and peer mentorship',
    institution: 'McMaster University',
    period: '2024–2025',
    summary: 'Supported introductory physics and helped students navigate courses, co-op searches, applications, and interviews.',
    sourceIds: ['physics-teaching-assistant', 'physics-society-mentor', 'science-coop-mentor'],
  },
  {
    id: 'engineering',
    title: 'Vehicle software and full-stack engineering',
    institution: 'MAC Formula Electric · McMaster University',
    period: '2021–2024',
    summary: 'Built vehicle-control, analytics, dashboard, and academic software systems.',
    sourceIds: ['mac-formula-electric', 'mcmaster-w-booth'],
  },
]

const sourceIds = new Set(experienceRecords.map(record => record.id))
export const curatedExperiences = curatedExperienceMap.map(item => ({
  ...item,
  sourceIds: item.sourceIds.filter(id => sourceIds.has(id)),
}))

export const curatedExperienceSourceIds = new Set(curatedExperiences.flatMap(item => item.sourceIds))
