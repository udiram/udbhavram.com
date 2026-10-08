export type CuratedRelation = { id: string; reason: string }

export const studyRelations: Record<string, CuratedRelation[]> = {
  'adaptive-breast-radiotherapy': [
    { id: 'presentation:astro-2026-3104', reason: 'The ASTRO 2026 presentation record for this contouring-uncertainty study.' },
    { id: 'media:article:coop-award-2026', reason: 'A profile about the people, exchange, and mentorship surrounding this UAB research chapter.' },
  ],
  'clinical-language-models': [
    { id: 'presentation:aapm-2025-20105', reason: 'The AAPM presentation and Blue Ribbon record for the TG-263 evaluation.' },
    { id: 'media:video:video-ITW86kDzaNQ', reason: 'A short recorded explanation of the target-name adherence work.' },
  ],
  'radiosurgery-planning': [
    { id: 'paper:ethos-2025', reason: 'The peer-reviewed article that reports the final planning comparison.' },
    { id: 'media:video:video-NMcoTPjPJ1g', reason: 'A recorded overview of the invited poster and its planning question.' },
  ],
  'organ-segmentation': [
    { id: 'paper:amos-2025', reason: 'The full peer-reviewed comparison, including physician review.' },
    { id: 'media:video:video-8IKr1QauMGc', reason: 'An earlier talk that shows how the abdominal-contouring thread developed.' },
  ],
  'brain-metastases-follow-up': [
    { id: 'paper:brain-followup', reason: 'The peer-reviewed report of the registration and follow-up review workflow.' },
  ],
  'lung-beam-energy': [
    { id: 'presentation:aapm-2025-20068', reason: 'The AAPM poster record for the beam-energy and phantom comparison.' },
    { id: 'media:video:video-jlnFADrlgfM', reason: 'The recorded thesis presentation of the 6X/10X comparison.' },
  ],
  'amyloid-membranes': [
    { id: 'paper:biophysics-2020', reason: 'The peer-reviewed article for this early biophysics study.' },
  ],
}
