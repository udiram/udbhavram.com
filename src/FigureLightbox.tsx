import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

/** note follows the credit in the footer; it defaults to the published-figure wording. */
export type LightboxFigure = { src: string; alt: string; width: number; height: number; heading: string; credit: string; note?: string }

const maxZoom = 3
const zoomStep = 1.25

export default function FigureLightbox({ figure, onClose }: { figure: LightboxFigure; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ distance: number; zoom: number } | null>(null)
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const [fit, setFit] = useState(1)
  const [zoom, setZoom] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const scale = zoom ?? fit
  const minZoom = Math.min(fit, 1)

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    if (!element.open) element.showModal()
    closeButton.current?.focus()
    const measure = () => {
      const box = stage.current
      if (!box) return
      const styles = getComputedStyle(box)
      const available = box.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight)
      setFit(Math.min(1, Math.max(.05, available / figure.width)))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('resize', measure)
      root.style.overflow = previousOverflow
      if (element.open) element.close()
    }
  }, [figure.width])

  const zoomTo = useCallback((next: number) => setZoom(Math.min(maxZoom, Math.max(minZoom, next))), [minZoom])

  useEffect(() => {
    const box = stage.current
    if (!box) return
    // Trackpad pinch arrives as ctrl+wheel; plain wheel keeps scrolling the figure.
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      zoomTo(scale * (event.deltaY < 0 ? 1.1 : 1 / 1.1))
    }
    box.addEventListener('wheel', onWheel, { passive: false })
    return () => box.removeEventListener('wheel', onWheel)
  }, [scale, zoomTo])

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      gesture.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom: scale }
      drag.current = null
      setDragging(false)
    } else if (event.pointerType === 'mouse' && event.button === 0) {
      drag.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop }
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointers.current.has(event.pointerId)) pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (gesture.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      zoomTo(gesture.current.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / gesture.current.distance))
    } else if (drag.current) {
      event.currentTarget.scrollLeft = drag.current.left - (event.clientX - drag.current.x)
      event.currentTarget.scrollTop = drag.current.top - (event.clientY - drag.current.y)
    }
  }

  function onPointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) gesture.current = null
    drag.current = null
    setDragging(false)
  }

  return (
    <dialog
      className="figure-lightbox"
      ref={dialog}
      aria-labelledby="figure-lightbox-title"
      onClose={onClose}
      onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close() }}
    >
      <div className="figure-lightbox-panel">
        <div className="figure-lightbox-top">
          <strong id="figure-lightbox-title">{figure.heading}</strong>
          <div className="figure-lightbox-controls">
            <button type="button" aria-label="Zoom out" disabled={scale <= minZoom + .001} onClick={() => zoomTo(scale / zoomStep)}>−</button>
            <button type="button" aria-label={`Zoom level ${Math.round(scale * 100)} percent. Reset to fit`} onClick={() => setZoom(null)}><output>{Math.round(scale * 100)}%</output></button>
            <button type="button" aria-label="Zoom in" disabled={scale >= maxZoom - .001} onClick={() => zoomTo(scale * zoomStep)}>+</button>
            <button type="button" className="figure-lightbox-close" ref={closeButton} onClick={() => dialog.current?.close()}><span>Close</span> <kbd aria-hidden="true">Esc</kbd></button>
          </div>
        </div>
        <div
          className="figure-lightbox-stage"
          ref={stage}
          tabIndex={0}
          role="group"
          aria-label="Figure, scrollable"
          data-dragging={dragging ? 'true' : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} draggable={false} style={{ width: `${Math.round(figure.width * scale)}px` }} />
        </div>
        <div className="figure-lightbox-foot">
          <span>{[figure.credit, figure.note ?? 'Shown unaltered'].filter(Boolean).join(' · ')}</span>
          <span>Pinch or use − and + to zoom · drag to pan</span>
        </div>
      </div>
    </dialog>
  )
}
