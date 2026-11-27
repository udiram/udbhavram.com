import { scoutCaption, scoutPaperCredit } from './softwareContent'

export type ScoutScene = 'hero' | 'reader-paper' | 'evidence'

const base = '/assets/software/scout'
const alts: Record<ScoutScene, string> = {
  hero: 'Scout chat answering which providers ordered a thoracic outlet protocol, with a simulated table and bar chart.',
  'reader-paper': 'Scout paper reader open beside the chat, showing a highlighted passage from a published article. The chat data is simulated.',
  evidence: 'Scout evidence table comparing studies, with every value linked to its source sentence. The data is simulated.',
}
// There is no light phone capture of the hero, so the dark one serves both themes.
const phoneTheme = (scene: ScoutScene, theme: 'light' | 'dark') => (scene === 'hero' ? 'dark' : theme)

/** A Scout demo screenshot that follows the site theme and swaps to the phone capture on small screens. */
export default function ScoutShot({ scene, className = '' }: { scene: ScoutScene; className?: string }) {
  return (
    <figure className={`scout-shot ${className}`.trim()}>
      {(['light', 'dark'] as const).map(theme => (
        <picture key={theme} className={`scout-shot-frame is-${theme}`}>
          <source media="(max-width: 600px)" srcSet={`${base}/scout-${scene}-${phoneTheme(scene, theme)}-390.webp`} width="780" height="1688" />
          <img src={`${base}/scout-${scene}-${theme}-1440.webp`} alt={alts[scene]} width="2332" height="2500" loading="lazy" decoding="async" />
        </picture>
      ))}
      <figcaption>{scoutCaption}{scene !== 'hero' && <> {scoutPaperCredit}</>}</figcaption>
    </figure>
  )
}
