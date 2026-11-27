import { lazy, Suspense, useRef, useState } from 'react'
import type { LightboxFigure } from './FigureLightbox'
import { scoutCaption, scoutPaperCredit } from './softwareContent'

const FigureLightbox = lazy(() => import('./FigureLightbox'))

export type ScoutScene = 'hero' | 'reader-paper' | 'evidence'

const base = '/assets/software/scout'
// Pixel sizes of the cropped captures. Light and dark twins share a size.
const scenes: Record<ScoutScene, { name: string; alt: string; wide: [number, number]; phone: [number, number] }> = {
  hero: {
    name: 'Chat answer',
    alt: 'Scout chat answering which providers ordered a thoracic outlet protocol, with a simulated table and bar chart.',
    wide: [1608, 1900],
    phone: [780, 1336],
  },
  'reader-paper': {
    name: 'Paper reader',
    alt: 'Scout paper reader open beside the chat, showing a highlighted passage from a published article. The chat data is simulated.',
    wide: [1152, 1066],
    phone: [780, 1188],
  },
  evidence: {
    name: 'Evidence table',
    alt: 'Scout evidence table comparing studies, with every value linked to its source sentence. The data is simulated.',
    wide: [1608, 996],
    phone: [780, 1194],
  },
}
// There is no light phone capture of the hero, so the dark one serves both themes.
const phoneTheme = (scene: ScoutScene, theme: 'light' | 'dark') => (scene === 'hero' ? 'dark' : theme)

/** A Scout demo screenshot that follows the site theme, swaps to the phone capture on small screens, and opens in the figure lightbox. */
export default function ScoutShot({ scene, className = '' }: { scene: ScoutScene; className?: string }) {
  const { name, alt, wide, phone } = scenes[scene]
  const caption = scene === 'hero' ? scoutCaption : `${scoutCaption} ${scoutPaperCredit}`
  const [figure, setFigure] = useState<LightboxFigure | null>(null)
  const opener = useRef<HTMLButtonElement | null>(null)

  // Enlarge the capture that is on screen: the one for this theme and screen width.
  function open(button: HTMLButtonElement) {
    const image = button.querySelector('img')
    if (!image) return
    const isPhone = /-390\.webp$/.test(image.currentSrc)
    const [width, height] = image.naturalWidth ? [image.naturalWidth, image.naturalHeight] : isPhone ? phone : wide
    opener.current = button
    setFigure({ src: image.currentSrc || image.src, alt, width, height, heading: `Scout · ${name}`, credit: caption, note: '' })
  }

  return (
    <figure className={`scout-shot ${className}`.trim()} data-scene={scene}>
      {(['light', 'dark'] as const).map(theme => (
        <button key={theme} type="button" className={`scout-shot-frame is-${theme}`} aria-label={`Open the Scout ${name.toLowerCase()} screenshot full size`} onClick={event => open(event.currentTarget)}>
          <picture>
            <source media="(max-width: 600px)" srcSet={`${base}/scout-${scene}-${phoneTheme(scene, theme)}-390.webp`} width={phone[0]} height={phone[1]} />
            <img src={`${base}/scout-${scene}-${theme}-1440.webp`} alt={alt} width={wide[0]} height={wide[1]} loading="lazy" decoding="async" />
          </picture>
        </button>
      ))}
      <figcaption>{caption}</figcaption>
      {figure && (
        <Suspense fallback={null}>
          <FigureLightbox figure={figure} onClose={() => { setFigure(null); opener.current?.focus() }} />
        </Suspense>
      )}
    </figure>
  )
}
