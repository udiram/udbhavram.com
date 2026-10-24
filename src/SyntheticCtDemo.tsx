import { useId, useState } from 'react'

const SLICE_COUNT = 96

function scaleAt(slice: number) {
  const centered = Math.abs(slice - (SLICE_COUNT - 1) / 2) / ((SLICE_COUNT - 1) / 2)
  return 1 - centered * 0.2
}

export default function SyntheticCtDemo() {
  const [slice, setSlice] = useState(48)
  const [showContour, setShowContour] = useState(true)
  const titleId = useId()
  const descriptionId = useId()
  const scale = scaleAt(slice)
  const phase = (slice - 48) / 48
  const lungWidth = 92 - Math.abs(phase) * 22
  const organShift = phase * 16
  const rightOrganPath = `M374 ${210 - organShift * 0.15} C397 179 448 186 465 223 C450 251 405 263 379 242 Z`
  const leftOrganCx = 274 - organShift * 0.4
  const leftOrganCy = 274 + organShift * 0.1

  return (
    <section className="ct-demo section" aria-labelledby={titleId}>
      <div className="wrap ct-demo-layout">
        <div className="ct-demo-copy">
          <span className="meta">Interactive synthetic volume</span>
          <h2 id={titleId}>Move through a CT slice.</h2>
          <p id={descriptionId}>
            This small, code-generated phantom shows how a stack of cross-sections becomes a volume. It uses no patient information and is not a clinical image or model result.
          </p>
          <a className="text-link" href="/research/organ-segmentation">See the related segmentation research</a>
        </div>

        <div className="ct-viewer home-reveal" aria-describedby={descriptionId}>
          <div className="ct-viewer-heading">
            <div>
              <span>Synthetic anatomy phantom</span>
              <strong>Slice {String(slice + 1).padStart(2, '0')} / {SLICE_COUNT}</strong>
            </div>
            <span className="ct-safety-label">Not patient data</span>
          </div>

          <div className="ct-canvas" data-slice={slice} data-contour={showContour ? 'visible' : 'hidden'}>
            <svg viewBox="0 0 640 420" role="img" aria-label={`Synthetic grayscale phantom, slice ${slice + 1}${showContour ? ', with research contour visible' : ''}`}>
              <defs>
                <radialGradient id="ct-body" cx="50%" cy="45%" r="60%">
                  <stop offset="0%" stopColor="#bfc2bf" />
                  <stop offset="72%" stopColor="#8f9691" />
                  <stop offset="100%" stopColor="#d7d9d6" />
                </radialGradient>
                <filter id="ct-soften" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="2.2" />
                </filter>
              </defs>
              <rect width="640" height="420" fill="#080b09" />
              <g transform={`translate(320 210) scale(${scale}) translate(-320 -210)`}>
                <ellipse cx="320" cy="210" rx="236" ry="166" fill="#4d534f" stroke="#e4e6e2" strokeWidth="4" />
                <ellipse cx="320" cy="210" rx="219" ry="150" fill="url(#ct-body)" opacity=".88" />
                <ellipse cx="320" cy="218" rx="188" ry="118" fill="#858c87" opacity=".55" filter="url(#ct-soften)" />
                <ellipse cx={229 - organShift * 0.25} cy={184 + organShift * 0.1} rx={lungWidth} ry="102" fill="#151a17" stroke="#69706b" strokeWidth="3" />
                <ellipse cx={411 + organShift * 0.25} cy={184 + organShift * 0.1} rx={lungWidth} ry="102" fill="#151a17" stroke="#69706b" strokeWidth="3" />
                <path d={`M188 ${205 + organShift * 0.2} C210 176 245 179 266 206 C250 244 218 262 190 243 Z`} fill="#b5aaa0" opacity=".8" />
                <path data-structure="right-organ" d={rightOrganPath} fill="#aaa59c" opacity=".76" />
                <ellipse data-structure="left-organ" cx={leftOrganCx} cy={leftOrganCy} rx="45" ry="31" fill="#d0d2cd" opacity=".72" />
                <ellipse cx={370 + organShift * 0.4} cy={274 - organShift * 0.1} rx="45" ry="31" fill="#d0d2cd" opacity=".72" />
                <circle cx="320" cy={218 - organShift * 0.35} r="35" fill="#dbddd8" stroke="#fafbf8" strokeWidth="4" />
                <circle cx="320" cy={218 - organShift * 0.35} r="13" fill="#4a504c" />
                <path d={`M292 ${258 - organShift * 0.18} L320 ${238 - organShift * 0.28} L348 ${258 - organShift * 0.18} L337 292 L303 292 Z`} fill="#d9dbd7" opacity=".88" />
                {[-1, 1].map(side => (
                  <g key={side} opacity=".82">
                    <ellipse cx={320 + side * 205} cy="171" rx="14" ry="34" fill="#f1f2ee" transform={`rotate(${side * 24} ${320 + side * 205} 171)`} />
                    <ellipse cx={320 + side * 211} cy="246" rx="13" ry="31" fill="#e8eae6" transform={`rotate(${side * -18} ${320 + side * 211} 246)`} />
                  </g>
                ))}
                {showContour && (
                  <g className="ct-contour" fill="none" stroke="#b7e5c0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                    <path data-contour-structure="right-organ" d={rightOrganPath} />
                    <ellipse data-contour-structure="left-organ" cx={leftOrganCx} cy={leftOrganCy} rx="45" ry="31" />
                  </g>
                )}
              </g>
              <text x="22" y="392" fill="#c8ceca" fontSize="16" fontFamily="Arial, sans-serif">SYNTHETIC PHANTOM · FOR INTERACTION ONLY</text>
            </svg>
          </div>

          <div className="ct-controls">
            <label className="slice-control">
              <span>Slice</span>
              <input
                type="range"
                min="0"
                max={SLICE_COUNT - 1}
                value={slice}
                onChange={event => setSlice(Number(event.currentTarget.value))}
                aria-valuetext={`Slice ${slice + 1} of ${SLICE_COUNT}`}
              />
              <output>{slice + 1}</output>
            </label>
            <label className="contour-control">
              <input type="checkbox" checked={showContour} onChange={event => setShowContour(event.currentTarget.checked)} />
              <span aria-hidden="true" />
              Show contour
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}
