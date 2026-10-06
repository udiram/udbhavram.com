import inventory from './presentations.json'
import type { Presentation } from './presentationTypes'

const legacyIds = ['cap-2021-gel-electrophoresis','cap-2022-kidney-ar','cumpc-2022-abdominal-segmentation','phunc-2023-abdominal-segmentation','aapm-2023-5933','cupc-2023-dose-delivery','comp-2024-s3-ethos','comp-2024-workshop-tg263','aapm-2024-12166','aapm-2024-10372','aapm-2025-20105','spscon-2025-poster21-ethos']
const studyPaths: Record<string, string> = {'astro-2026-3104':'adaptive-breast-radiotherapy','aapm-2026-27281':'adaptive-breast-radiotherapy','aapm-2025-20105':'clinical-language-models','aapm-2025-20068':'lung-beam-energy','aapm-2024-12166':'radiosurgery-planning','aapm-2024-10372':'organ-segmentation'}
export function presentationDate(value: string): string {
  if (value.includes('/')) return value.split('/').map(presentationDate).join(' – ')
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T12:00:00Z`).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric', timeZone:'UTC' })
  if (/^\d{4}-\d{2}$/.test(value)) return new Date(`${value}-01T12:00:00Z`).toLocaleDateString('en-US', { month:'long', year:'numeric', timeZone:'UTC' })
  return value
}
export const presentations: Presentation[] = inventory.events.map(p => ({
  id:p.id, title:p.title, date:presentationDate(p.date), sortDate:p.date.match(/\d{4}(?:-\d{2})?(?:-\d{2})?/)?.[0] ?? '', year:Number(p.date.match(/\d{4}/)?.[0]), venue:p.event, location:p.location,
  format:p.type, role:p.role, presenter:p.presenter, status:p.status,
  programCode:typeof p.programCode==='string'?p.programCode:p.programCode?`Session ${p.programCode.session}`:undefined,
  award:p.awards.join(' · '), note:[p.datePrecision,p.countingNote].filter(Boolean).join(' '),
  aggregate:p.recordType==='outreach_aggregate',
  variants:[...new Set([p.artifactTitle,...p.titleVariants].filter((s):s is string=>Boolean(s)&&s!==p.title))],
  sources:p.sources.map((s,i)=>({url:s.url,label:/youtu/.test(s.url)?'Watch recording':/\.pdf(?:#|$)/i.test(s.url)?'Poster or abstract (PDF)':i===0?'Source record':`Additional source ${i+1}`})),
  studyPath:studyPaths[p.id]?`/research/${studyPaths[p.id]}`:undefined,
  legacyAnchors:legacyIds.includes(p.id)?[`entry-2-${legacyIds.indexOf(p.id)}`]:[],
})).sort((a,b)=>b.sortDate.localeCompare(a.sortDate)||a.id.localeCompare(b.id))
export const eventPresentations = presentations.filter(p=>!p.aggregate)
export const outreachPresentations = presentations.filter(p=>p.aggregate)
export const presentationYears = [...new Set(eventPresentations.map(p=>p.year))]
export const homePresentations = presentations.filter(p=>['astro-2026-3104','astro-2026-3044','aapm-2026-27281','aapm-2026-27365','aapm-2025-20105'].includes(p.id))

export const presentationScope = `${eventPresentations.length} event and remarks records, plus ${outreachPresentations.length===1?'one outreach summary':`${outreachPresentations.length} outreach summaries`}, reconciled through October 2026. Scheduled and coauthored contributions are labelled; this is not an exhaustive lifetime record.`
