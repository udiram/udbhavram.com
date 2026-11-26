import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import viewerData from './ctViewerData.json'

const CT_INTRO_FIRST_LINE = 'Most of my research starts with images like this one.'

type PresetId = keyof (typeof viewerData.frames)[number]['sources']
type Contour = { d: string }
type Probe = { x: number; y: number; hu: number | null; inLabel: boolean }

const frames = viewerData.frames
const { display } = viewerData
const presets = display.presets as { id: PresetId; label: string; windowWidthHu: number; windowLevelHu: number }[]
const crop = display.crop
const scaleBarMm = 50
const scaleBarPercent = (scaleBarMm / display.pixelSpacingMm / crop.w) * 100
const tickCount = frames.length

// Only the default slice's contour ships with the page; the rest come from the public manifest.
let contourRequest: Promise<Contour[][]> | null = null
function loadContours() {
  contourRequest ??= fetch(viewerData.manifest)
    .then(response => {
      if (!response.ok) throw new Error(`CT manifest request failed: ${response.status}`)
      return response.json() as Promise<{ frames: { contours: Contour[] }[] }>
    })
    .then(manifest => manifest.frames.map(item => item.contours.map(contour => ({ d: contour.d }))))
    .catch(error => { contourRequest = null; throw error })
  return contourRequest
}

export default function RealCtViewer() {
  const [slice, setSlice] = useState(display.defaultIndex)
  const [presetId, setPresetId] = useState<PresetId>(display.defaultPreset as PresetId)
  const [showContour, setShowContour] = useState(true)
  const [loading, setLoading] = useState(false)
  const [slowLoading, setSlowLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [retry, setRetry] = useState(0)
  const [contourSets, setContourSets] = useState<Contour[][] | null>(null)
  const [probe, setProbe] = useState<Probe | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const titleId = useId()
  const descriptionId = useId()
  const presetName = useId()
  const viewer = useRef<HTMLDivElement>(null)
  const probeRequest = useRef(0)
  const holdTimer = useRef(0)
  const lastAnnouncement = useRef(0)
  const frame = frames[slice]
  const contours = contourSets?.[slice] ?? (slice === display.defaultIndex ? viewerData.defaultContours : null)
  const preset = presets.find(item => item.id === presetId) ?? presets[0]
  const baseSrc = frame.sources[presetId]
  const imageSrc = retry ? `${baseSrc}?retry=${retry}` : baseSrc

  useEffect(() => {
    for (const neighbor of [frames[slice - 1], frames[slice + 1]]) {
      if (neighbor) new Image().src = neighbor.sources[presetId]
    }
  }, [slice, presetId])

  useEffect(() => {
    let active = true
    const fetchContours = () => { loadContours().then(sets => { if (active) setContourSets(sets) }).catch(() => undefined) }
    // Wait for the page to settle, or for the first sign of interest in the viewer.
    const timer = window.setTimeout(fetchContours, 2500)
    const element = viewer.current
    const events = ['pointerenter', 'focusin', 'touchstart'] as const
    events.forEach(name => element?.addEventListener(name, fetchContours, { once: true, passive: true }))
    return () => { active = false; window.clearTimeout(timer); events.forEach(name => element?.removeEventListener(name, fetchContours)) }
  }, [])

  // Only mention loading when it is slow enough to notice.
  useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => setSlowLoading(true), 150)
    return () => { window.clearTimeout(timer); setSlowLoading(false) }
  }, [loading])

  useEffect(() => () => window.clearTimeout(holdTimer.current), [])

  function hideProbe() {
    probeRequest.current += 1
    window.clearTimeout(holdTimer.current)
    setProbe(null)
  }

  function show(nextSlice: number, nextPreset: PresetId) {
    if (nextSlice === slice && nextPreset === presetId) return
    hideProbe()
    setSlice(nextSlice)
    setPresetId(nextPreset)
    setFailed(false)
    setLoading(true)
    if (!contourSets) loadContours().then(setContourSets).catch(() => undefined)
  }

  function probeAt(clientX: number, clientY: number, target: HTMLElement) {
    const box = target.getBoundingClientRect()
    if (!box.width || !box.height || !contours) return
    const x = Math.min(crop.w - 1, Math.max(0, ((clientX - box.left) / box.width) * crop.w))
    const y = Math.min(crop.h - 1, Math.max(0, ((clientY - box.top) / box.height) * crop.h))
    const request = ++probeRequest.current
    setProbe(current => ({ x, y, hu: current?.hu ?? null, inLabel: current?.inLabel ?? false }))
    void import('./ctProbe')
      .then(module => module.readHu({ hu: frame.hu, contours }, display.hu, crop.y0, x, y))
      .then(reading => {
        if (request !== probeRequest.current) return
        setProbe({ x, y, ...reading })
        const now = Date.now()
        if (viewer.current?.contains(document.activeElement) && now - lastAnnouncement.current >= 250) {
          lastAnnouncement.current = now
          setAnnouncement(`${reading.hu} HU${reading.inLabel ? ', inside the spleen reference label' : ''}`)
        }
      })
      .catch(() => { if (request === probeRequest.current) setProbe(null) })
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch' || failed) return
    probeAt(event.clientX, event.clientY, event.currentTarget)
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'touch' || failed) return
    const { clientX, clientY, currentTarget } = event
    window.clearTimeout(holdTimer.current)
    holdTimer.current = window.setTimeout(() => probeAt(clientX, clientY, currentTarget), 300)
  }

  function onViewerKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    if (event.key === 'Escape' && probe) { hideProbe(); return }
    const chosen = presets[Number(event.key) - 1]
    if (/^[1-9]$/.test(event.key) && chosen) { event.preventDefault(); show(slice, chosen.id) }
  }

  function onSliderKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'PageUp' && event.key !== 'PageDown') return
    event.preventDefault()
    show(Math.min(frames.length - 1, Math.max(0, slice + (event.key === 'PageUp' ? 5 : -5))), presetId)
  }

  const probeLeft = probe ? (probe.x / crop.w) * 100 : 0
  const probeTop = probe ? (probe.y / crop.h) * 100 : 0
  const probeY = probe ? probe.y + crop.y0 : 0

  return (
    <section className="ct-demo section" aria-labelledby={titleId}>
      <div className="wrap ct-demo-layout">
        <div className="ct-demo-copy">
          <span className="ct-eyebrow">Imaging</span>
          <h2 id={titleId}>Explore a CT scan.</h2>
          <p id={descriptionId}>
            {CT_INTRO_FIRST_LINE} Scrub through {frames.length} axial slices of a public abdominal CT, change the window, and toggle the spleen outline.
          </p>
          <p className="ct-data-note">The outline is the dataset’s reference label, not a model prediction.</p>
          <a className="text-link" href="/research/organ-segmentation"><span>Related imaging research</span> <span aria-hidden="true">→</span></a>
        </div>

        <figure className="ct-figure home-reveal">
          <div className="ct-viewer" ref={viewer} role="group" aria-label="CT viewer" aria-describedby={descriptionId} onKeyDown={onViewerKeyDown}>
            <div className="ct-viewer-heading">
              <div>
                <strong>Abdominal CT, axial</strong>
                <span className="ct-readout">Slice {slice + 1} / {frames.length} · z {frame.zMm.toFixed(1)} mm</span>
              </div>
              <div className="ct-presets" role="radiogroup" aria-label="Window preset">
                {presets.map(item => (
                  <label key={item.id}>
                    <input type="radio" name={presetName} value={item.id} checked={item.id === presetId} onChange={() => show(slice, item.id)} />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="ct-canvas" data-slice={slice} data-source-slice={frame.sourceSlice} data-preset={presetId} data-contour={showContour ? 'visible' : 'hidden'} data-loading={loading || !contours ? 'true' : 'false'}>
              <div className="ct-image-stage" onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={event => { if (event.pointerType === 'touch') hideProbe() }} onPointerCancel={hideProbe} onPointerLeave={hideProbe}>
                <img
                  src={imageSrc}
                  width={display.width}
                  height={display.height}
                  draggable={false}
                  alt={`Axial abdominal CT, slice ${slice + 1} of ${frames.length}, ${preset.label.toLowerCase()} window${showContour ? ', with the reference spleen contour shown in green' : ''}`}
                  onLoad={() => { setLoading(false); setFailed(false) }}
                  onError={() => { setLoading(false); setFailed(true) }}
                />
                {!failed && (
                  <svg className="ct-overlay" viewBox={`${crop.x0} ${crop.y0} ${crop.w} ${crop.h}`} aria-hidden="true" focusable="false">
                    {showContour && contours && <g className="ct-contour">{contours.map((contour, index) => <path d={contour.d} key={`${slice}-${index}`} />)}</g>}
                    {probe && (
                      <g className="ct-crosshair">
                        <line x1={probe.x} y1={probeY - 12} x2={probe.x} y2={probeY - 5} />
                        <line x1={probe.x} y1={probeY + 5} x2={probe.x} y2={probeY + 12} />
                        <line x1={probe.x - 12} y1={probeY} x2={probe.x - 5} y2={probeY} />
                        <line x1={probe.x + 5} y1={probeY} x2={probe.x + 12} y2={probeY} />
                      </g>
                    )}
                  </svg>
                )}
                <span className="ct-mark ct-mark-window">W {preset.windowWidthHu} · L {preset.windowLevelHu}</span>
                <span className="ct-mark ct-orientation ct-orientation-right" aria-hidden="true">R</span>
                <span className="ct-mark ct-orientation ct-orientation-left" aria-hidden="true">L</span>
                <span className="ct-scale" style={{ width: `${scaleBarPercent.toFixed(2)}%` }}><span>{scaleBarMm / 10} cm</span></span>
                {probe && probe.hu !== null && !failed && (
                  <span className="ct-hu" data-side={probeLeft > 65 ? 'left' : 'right'} style={probeLeft > 65 ? { right: `${100 - probeLeft}%`, top: `${probeTop}%` } : { left: `${probeLeft}%`, top: `${probeTop}%` }}>
                    {probe.hu} HU{probe.inLabel ? ' · spleen' : ''}
                  </span>
                )}
                {slowLoading && <span className="ct-image-status" role="status">Loading slice…</span>}
                {failed && <div className="ct-image-error" role="alert"><span>That slice could not load.</span><button type="button" onClick={() => { setFailed(false); setLoading(true); setRetry(value => value + 1) }}>Try again</button></div>}
              </div>
            </div>

            <label className="slice-control">
              <span className="slice-label">Slice</span>
              <span className="ct-scrub" style={{ '--ct-progress': slice / (frames.length - 1) } as React.CSSProperties}>
                <span className="ct-scrub-track" aria-hidden="true" />
                <span className="ct-scrub-fill" aria-hidden="true" />
                <span className="ct-scrub-ticks" aria-hidden="true">
                  {Array.from({ length: tickCount }, (_, index) => <i key={index} data-current={index === slice ? 'true' : undefined} style={{ '--ct-tick': index / (tickCount - 1) } as React.CSSProperties} />)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={frames.length - 1}
                  step="1"
                  value={slice}
                  onChange={event => show(Number(event.currentTarget.value), presetId)}
                  onKeyDown={onSliderKeyDown}
                  aria-label="Slice"
                  aria-valuetext={`Slice ${slice + 1} of ${frames.length}, source axial index ${frame.sourceSlice}`}
                />
              </span>
              <output>{slice + 1} / {frames.length}</output>
            </label>

            <div className="ct-options">
              <label className="contour-control">
                <input type="checkbox" role="switch" checked={showContour} onChange={event => setShowContour(event.currentTarget.checked)} />
                <span className="contour-switch" aria-hidden="true" />
                <span>Show contour</span>
              </label>
              <span className="ct-legend"><i aria-hidden="true" /><span>Spleen, reference label</span></span>
              <span className="ct-keys" aria-hidden="true">← → slice · 1 2 3 window</span>
            </div>
            <span className="visually-hidden" aria-live="polite">{announcement}</span>
          </div>
          <figcaption>
            <strong>Axial abdominal CT with the reference spleen label.</strong> Case spleen_8, Medical Segmentation Decathlon (Task09 Spleen). De-identified public research data, not for diagnosis. Cropped to the body; display windows are fixed presets.
          </figcaption>
          <p className="ct-credit"><span>{viewerData.license}</span><a href="/assets/ct-spleen/PROVENANCE.md">Source, license and preparation</a></p>
        </figure>
      </div>
    </section>
  )
}
