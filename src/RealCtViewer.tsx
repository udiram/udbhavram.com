import { useEffect, useId, useState } from 'react'
import manifest from '../public/assets/ct-spleen/manifest.json'

const frames = manifest.frames
const defaultIndex = manifest.display.defaultIndex

export default function RealCtViewer() {
  const [slice, setSlice] = useState(defaultIndex)
  const [showContour, setShowContour] = useState(true)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [retry, setRetry] = useState(0)
  const titleId = useId()
  const descriptionId = useId()
  const frame = frames[slice]

  useEffect(() => {
    for (const neighbor of [frames[slice - 1], frames[slice + 1]]) {
      if (neighbor) new Image().src = neighbor.src
    }
  }, [slice])

  function moveTo(next: number) {
    setSlice(next)
    setFailed(false)
    setLoading(true)
  }

  const imageSrc = retry ? `${frame.src}?retry=${retry}` : frame.src

  return (
    <section className="ct-demo section" aria-labelledby={titleId}>
      <div className="wrap ct-demo-layout">
        <div className="ct-demo-copy">
          <h2 id={titleId}>Explore a CT scan.</h2>
          <p id={descriptionId}>
            Move the slider through 19 slices of the abdomen. Switch the green reference outline on or off to locate the spleen.
          </p>
          <p className="ct-data-note">Public Medical Segmentation Decathlon data, with its matched reference spleen contour. The outline is a dataset label, not a model prediction.</p>
          <a className="text-link" href="/research/organ-segmentation">Related imaging research</a>
        </div>

        <div className="ct-viewer home-reveal" aria-describedby={descriptionId}>
          <div className="ct-viewer-heading">
            <div>
              <span>Abdominal CT</span>
              <strong>Slice {slice + 1} of {frames.length}</strong>
            </div>
            <span className="ct-safety-label">Reference contour</span>
          </div>

          <div className="ct-canvas" data-slice={slice} data-source-slice={frame.sourceSlice} data-contour={showContour ? 'visible' : 'hidden'} data-loading={loading ? 'true' : 'false'}>
            <div className="ct-image-stage">
              <img
                key={imageSrc}
                src={imageSrc}
                width={manifest.display.width}
                height={manifest.display.height}
                alt={`Axial abdominal CT, viewer slice ${slice + 1} of ${frames.length}${showContour ? ', with the reference spleen contour shown in green' : ''}`}
                onLoad={() => { setLoading(false); setFailed(false) }}
                onError={() => { setLoading(false); setFailed(true) }}
              />
              {showContour && !failed && (
                <svg className="ct-contour" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
                  {frame.contours.map((contour, index) => <path d={contour.d} key={`${slice}-${index}`} />)}
                </svg>
              )}
              <span className="ct-orientation ct-orientation-right" aria-hidden="true">R</span>
              <span className="ct-orientation ct-orientation-left" aria-hidden="true">L</span>
              {loading && <span className="ct-image-status" role="status">Loading slice…</span>}
              {failed && <div className="ct-image-error" role="alert"><span>That slice could not load.</span><button type="button" onClick={() => { setFailed(false); setLoading(true); setRetry(value => value + 1) }}>Try again</button></div>}
            </div>
          </div>

          <div className="ct-controls">
            <label className="slice-control">
              <span>Slice</span>
              <input
                type="range"
                min="0"
                max={frames.length - 1}
                value={slice}
                onChange={event => moveTo(Number(event.currentTarget.value))}
                aria-valuetext={`Slice ${slice + 1} of ${frames.length}, source axial index ${frame.sourceSlice}`}
              />
              <output>{slice + 1}</output>
            </label>
            <label className="contour-control">
              <input type="checkbox" checked={showContour} onChange={event => setShowContour(event.currentTarget.checked)} />
              <span aria-hidden="true" />
              Reference contour
            </label>
          </div>
          <div className="ct-viewer-note">
            <span>Public research data</span>
            <a href="/assets/ct-spleen/PROVENANCE.md">Source, license &amp; preparation</a>
          </div>
        </div>
      </div>
    </section>
  )
}
