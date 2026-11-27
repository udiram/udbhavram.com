import { lazy, Suspense, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { figureCredit, type PublishedFigureAsset } from './siteContent'

const FigureLightbox = lazy(() => import('./FigureLightbox'))

type Props = {
  asset: PublishedFigureAsset
  caption?: ReactNode
  /** side: caption beside a wide plate on large screens. stack: caption under the plate. */
  layout?: 'stack' | 'side'
  priority?: boolean
  className?: string
}

export default function PublishedFigure({ asset, caption, layout = 'stack', priority = false, className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const plate = useRef<HTMLButtonElement>(null)
  const heading = `${asset.figureNumber} · ${asset.title}`
  const credit = figureCredit(asset)
  // Never upscale: the plate stops at the image's own width (16px mat each side plus the border).
  // Wide strips (about 5:2 and wider) may use more of the column so their panels stay legible.
  const plateMax = Math.min(asset.width, asset.width / asset.height >= 2.5 ? 900 : 720) + 34

  return (
    <figure className={`pub-figure ${className}`.trim()} data-layout={layout} style={{ '--pub-plate-max': `${plateMax}px` } as React.CSSProperties}>
      <div className="pub-head">
        <strong>{heading}</strong>
        <span className="pub-tag">{asset.kind ?? 'Published figure'}</span>
      </div>
      <button type="button" className="pub-plate" ref={plate} aria-label={`Open ${asset.figureNumber} full size`} onClick={() => setOpen(true)}>
        <img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} loading={priority ? 'eager' : 'lazy'} />
      </button>
      <figcaption className="pub-caption">
        {caption && <p className="pub-text">{caption}</p>}
        <p className="pub-credit">{credit}</p>
        <a className="pub-open" href={asset.src} onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return; event.preventDefault(); setOpen(true) }}>Open full figure</a>
      </figcaption>
      {open && (
        <Suspense fallback={null}>
          <FigureLightbox
            figure={{ src: asset.src, alt: asset.alt, width: asset.width, height: asset.height, heading, credit }}
            onClose={() => { setOpen(false); plate.current?.focus() }}
          />
        </Suspense>
      )}
    </figure>
  )
}
