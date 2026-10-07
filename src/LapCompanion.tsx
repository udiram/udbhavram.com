import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, X } from '@phosphor-icons/react'
import telemetryJson from './lapTelemetry.json'

type PlayerState = -1 | 0 | 1 | 2 | 3 | 5
type YTPlayer = { destroy: () => void; getCurrentTime: () => number; seekTo: (time: number, allowSeekAhead: boolean) => void }
type YTNamespace = { Player: new (element: HTMLElement, options: { videoId: string; playerVars: Record<string, number | string>; events: { onReady: (event: { target: YTPlayer }) => void; onStateChange: (event: { data: PlayerState; target: YTPlayer }) => void; onError: () => void } }) => YTPlayer }
type Direction = 'left' | 'right' | 'straight'
type TelemetrySample = { t: number; mode: string; lap: number | null; mapProgress: number | null; positionConfidence: number; visualPace: number | null; cornering: Direction | null; corneringConfidence: number; observedWheel: 'left' | 'right' | 'centered' | null; observedWheelConfidence: number; audioTone: number | null; loudness: number | null; drive: string }
type Registration = { lap: number; time: number; landmark: string; label: string; schematicPathFraction: number; bend: 'left' | 'right' | 'straight'; evidence: string; basis: string }
type Point = { x: number; y: number; angle: number }

declare global { interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void; __YT_API_TIMEOUT_MS?: number } }

let apiPromise: Promise<YTNamespace> | null = null
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve, reject) => {
    const prior = window.onYouTubeIframeAPIReady
    const script = document.createElement('script')
    let settled = false
    const restore = () => { if (window.onYouTubeIframeAPIReady === ready) window.onYouTubeIframeAPIReady = prior }
    const fail = (message: string) => {
      if (settled) return
      settled = true; window.clearTimeout(timeout); restore(); script.remove(); apiPromise = null; reject(new Error(message))
    }
    const ready = () => {
      if (settled) return
      prior?.()
      if (!window.YT?.Player) { fail('YouTube player API unavailable'); return }
      settled = true; window.clearTimeout(timeout); restore(); resolve(window.YT)
    }
    window.onYouTubeIframeAPIReady = ready
    script.src = 'https://www.youtube.com/iframe_api'; script.async = true; script.dataset.lapCompanionApi = 'true'
    script.onerror = () => fail('YouTube player API failed to load')
    const timeout = window.setTimeout(() => fail('YouTube player API timed out'), window.__YT_API_TIMEOUT_MS ?? 10000)
    document.head.append(script)
  })
  return apiPromise
}

const telemetry = telemetryJson as { source: { duration: number; sampleStep: number; analysisSource: string }; laps: { lap: number; start: number; end: number | null; duration: number | null; kind: string }[]; registration: Registration[]; samples: TelemetrySample[] }
const duration = telemetry.source.duration
const trackPath = 'M334.9 277.9 L326.3 283.2 L318.1 288.2 L309.8 293.1 L301.2 297.7 L292.3 301.6 L283.1 304.4 L273.2 305.0 L263.6 302.8 L255.1 298.1 L248.5 291.4 L244.0 283.3 L240.2 275.0 L236.5 266.6 L232.8 258.2 L229.4 249.6 L228.4 240.7 L235.3 234.6 L244.5 231.2 L253.9 227.9 L263.1 224.9 L271.7 220.3 L271.4 212.0 L267.1 203.5 L263.3 195.4 L257.7 187.7 L250.4 182.0 L241.1 178.1 L232.1 174.3 L224.5 168.9 L218.1 161.7 L213.4 153.9 L207.5 146.5 L199.2 141.4 L190.2 137.5 L181.4 133.3 L172.7 129.0 L164.1 124.7 L155.1 120.5 L146.5 116.7 L137.4 112.5 L128.7 108.1 L120.3 103.3 L111.4 99.6 L101.5 100.1 L93.1 104.6 L85.7 110.9 L77.2 114.9 L67.6 113.7 L59.5 108.4 L56.0 99.9 L55.6 90.9 L55.7 81.9 L54.1 73.0 L49.8 64.9 L43.4 57.9 L37.7 50.4 L36.6 41.5 L40.2 33.0 L46.5 26.4 L55.3 22.1 L65.3 21.6 L74.4 24.6 L82.3 30.4 L88.7 37.1 L94.6 44.2 L101.8 50.6 L110.6 54.5 L120.3 56.7 L130.2 58.4 L140.1 59.8 L149.6 61.0 L159.6 62.4 L169.5 63.9 L179.4 65.4 L188.9 66.8 L198.8 68.2 L208.8 69.6 L218.4 70.8 L228.0 72.9 L235.1 79.2 L235.5 87.9 L231.5 96.4 L227.2 104.6 L222.5 112.3 L218.5 120.7 L219.3 129.5 L225.0 137.1 L233.1 142.3 L241.9 146.7 L250.4 151.3 L258.6 156.1 L266.9 160.9 L275.6 165.5 L284.4 170.1 L291.4 176.0 L295.5 184.6 L297.4 193.3 L301.8 201.2 L311.1 203.7 L318.9 198.8 L323.4 190.9 L329.6 183.8 L339.0 183.3 L347.6 188.0 L355.7 193.3 L363.7 198.7 L371.7 203.9 L379.9 208.9 L388.5 213.8 L395.7 219.6 L400.0 227.8 L399.3 236.9 L393.3 243.6 L385.1 248.7 L376.7 253.7 L368.5 258.6 L359.9 263.6 L351.4 268.4 L343.0 273.2 Z'
const turns = [{ label: '1', x: 260.4, y: 301.4 }, { label: '2', x: 228.2, y: 240.5 }, { label: '3', x: 269.6, y: 222.6 }, { label: '4', x: 251.2, y: 182.8 }, { label: '5', x: 224.7, y: 169.1 }, { label: '6', x: 202.9, y: 143.9 }, { label: '7', x: 98.2, y: 100.9 }, { label: '8', x: 70.6, y: 114.5 }, { label: '9', x: 51.1, y: 67.2 }, { label: '10', x: 43, y: 29.4 }, { label: '11', x: 110.9, y: 54.6 }, { label: '12', x: 234, y: 76.7 }, { label: '13', x: 220.2, y: 117.6 }, { label: '14', x: 288, y: 172.2 }, { label: '15', x: 309.8, y: 203.8 }, { label: '16', x: 335.2, y: 181.7 }, { label: '17', x: 399.5, y: 224.8 }]
const moments = [
  { time: 25, label: 'Garage preparation', image: '/assets/media/lap-run-1/garage.webp', note: 'Session context; the car remains in the garage.' },
  { time: 158.5, label: 'Out lap begins', image: '/assets/media/lap-registration/lap-0-start-finish.webp', note: 'The car passes beneath the bridge at the first start/finish reference.' },
  { time: 325.5, label: 'Lap 1 · 2:20', image: '/assets/media/lap-registration/lap-1-start-finish.webp', note: 'First complete bridge-to-bridge lap begins.' },
  { time: 465.5, label: 'Lap 2 · 2:10', image: '/assets/media/lap-registration/lap-2-start-finish.webp', note: 'Second complete lap begins; it is the fastest observed lap.' },
  { time: 595.5, label: 'Lap 3 · 2:30', image: '/assets/media/lap-registration/lap-3-start-finish.webp', note: 'Third complete lap begins.' },
  { time: 677, label: 'Excursion begins', image: '/assets/media/lap-analysis/excursion-entry.webp', note: 'The car visibly leaves the circuit; schematic position and derived signals are withheld.' },
  { time: 693, label: 'Rejoins circuit', image: '/assets/media/lap-analysis/excursion-rejoin.webp', note: 'The car visibly returns to the paved circuit.' },
  { time: 745.5, label: 'Partial lap', image: '/assets/media/lap-registration/lap-4-start-finish.webp', note: 'Final bridge crossing; the recording ends after the Turn 13 registration.' },
]
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
const safeTime = (value: number) => Number.isFinite(value) && value >= 0 && value <= duration + 2
const lapName = (lap: number | null) => lap === null ? 'No lap' : lap === 0 ? 'Out lap' : `Lap ${lap}`
const lineSegments = (key: 'visualPace' | 'audioTone' | 'cornering', row: number) => {
  const segments: string[] = []; let points: string[] = []
  telemetry.samples.filter((_, index) => index % 4 === 0).forEach(sample => {
    const raw = key === 'cornering' ? sample.cornering === 'left' ? .18 : sample.cornering === 'right' ? .82 : sample.cornering === 'straight' ? .5 : null : sample[key]
    if (raw === null) { if (points.length > 1) segments.push(points.join(' ')); points = []; return }
    points.push(`${(sample.t / duration * 800).toFixed(1)},${(row + 28 - raw * 24).toFixed(1)}`)
  })
  if (points.length > 1) segments.push(points.join(' '))
  return segments
}
const registrationCards = telemetry.registration.filter(item => item.lap === 2 && ['start-finish', 'turn-2', 'white-tower-straight', 'turn-9', 'turn-13', 'turn-17', 'finish'].includes(item.landmark))
const validationCases = [
  { time: 178.5, label: 'Right', image: '/assets/media/lap-validation/right-178-5.webp' },
  { time: 193, label: 'Left', image: '/assets/media/lap-validation/left-193.webp' },
  { time: 202.5, label: 'Straight', image: '/assets/media/lap-validation/straight-202-5.webp' },
  { time: 261, label: 'Straight', image: '/assets/media/lap-validation/straight-261.webp' },
  { time: 283.5, label: 'Straight', image: '/assets/media/lap-validation/straight-283-5.webp' },
  { time: 336, label: 'Right', image: '/assets/media/lap-validation/right-336.webp' },
  { time: 350, label: 'Left', image: '/assets/media/lap-validation/left-350.webp' },
  { time: 361.5, label: 'Straight', image: '/assets/media/lap-validation/straight-361-5.webp' },
  { time: 404, label: 'Straight', image: '/assets/media/lap-validation/straight-404.webp' },
  { time: 605.5, label: 'Right', image: '/assets/media/lap-validation/right-605-5.webp' },
  { time: 618, label: 'Left', image: '/assets/media/lap-validation/left-618.webp' },
  { time: 708.5, label: 'Straight', image: '/assets/media/lap-validation/straight-708-5.webp' },
  { time: 756, label: 'Right', image: '/assets/media/lap-validation/right-756.webp' },
  { time: 770.5, label: 'Left', image: '/assets/media/lap-validation/left-770-5.webp' },
  { time: 781.5, label: 'Straight', image: '/assets/media/lap-validation/straight-781-5.webp' },
  { time: 819, label: 'Straight', image: '/assets/media/lap-validation/straight-819.webp' },
]

export default function LapCompanion() {
  const [consented, setConsented] = useState(false)
  const [ready, setReady] = useState(false)
  const [time, setTime] = useState(0)
  const [state, setState] = useState<PlayerState>(-1)
  const [queuedTime, setQueuedTime] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [marker, setMarker] = useState<Point | null>(null)
  const [pathLength, setPathLength] = useState(1)
  const host = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const player = useRef<YTPlayer | null>(null)
  const queuedRef = useRef<number | null>(null)
  const active = useMemo(() => [...moments].reverse().find(moment => time >= moment.time) ?? moments[0], [time])
  const sample = telemetry.samples[Math.min(telemetry.samples.length - 1, Math.round(time / telemetry.source.sampleStep))]

  useEffect(() => {
    const path = pathRef.current
    if (!path) { setMarker(null); return }
    const length = path.getTotalLength(); setPathLength(length)
    if (sample.mapProgress === null) { setMarker(null); return }
    const position = path.getPointAtLength(sample.mapProgress * length)
    const ahead = path.getPointAtLength(Math.min(length, sample.mapProgress * length + 2))
    const angle = Math.atan2(ahead.y - position.y, ahead.x - position.x) * 180 / Math.PI
    setMarker({ x: position.x, y: position.y, angle })
  }, [sample.mapProgress])

  useEffect(() => {
    if (!consented || !host.current) return
    let cancelled = false; let interval = 0
    loadYouTubeApi().then(YT => {
      if (cancelled || !host.current) return
      player.current = new YT.Player(host.current, {
        videoId: 'GNboj6JfDeI', playerVars: { playsinline: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return
            setReady(true)
            const requested = queuedRef.current
            if (requested !== null) { target.seekTo(requested, true); queuedRef.current = null; setQueuedTime(null) }
            interval = window.setInterval(() => { const observed = target.getCurrentTime(); if (safeTime(observed)) setTime(Math.min(duration, observed)) }, 250)
          },
          onStateChange: ({ data, target }) => { setState(data); const observed = data === 0 ? duration : target.getCurrentTime(); if (safeTime(observed)) setTime(Math.min(duration, observed)) },
          onError: () => setError('The YouTube player could not start. The direct video link remains available.'),
        },
      })
    }).catch(() => setError('The YouTube player could not load. The direct video link remains available.'))
    return () => { cancelled = true; window.clearInterval(interval); player.current?.destroy(); player.current = null }
  }, [consented, retryKey])

  const seek = (next: number) => {
    setError('')
    if (!consented) { queuedRef.current = next; setQueuedTime(next); setConsented(true); return }
    if (!ready || !player.current) { queuedRef.current = next; setQueuedTime(next); return }
    player.current.seekTo(next, true)
  }
  const close = () => { player.current?.destroy(); player.current = null; queuedRef.current = null; setConsented(false); setReady(false); setTime(0); setState(-1); setQueuedTime(null); setError('') }
  const retry = () => { setError(''); setReady(false); setRetryKey(value => value + 1) }

  return <section className="wrap lap-companion" id="lap-companion" aria-labelledby="lap-title">
    <div className="section-heading"><h2 id="lap-title">Come along<br /><em>for a run.</em></h2><p>A footage-registered companion to the first Formula LGB 1300 onboard recording from Madras International Circuit, filmed in May 2023.</p></div>
    <div className="lap-grid">
      <div className="lap-video">
        {consented ? <><div ref={host} className="lap-player-host" aria-label="Formula LGB 1300 onboard YouTube player" />{!ready && !error && <div className="lap-loading">Connecting to YouTube…</div>}<button type="button" className="lap-close" onClick={close}><X /> Close video</button></> : <button type="button" className="lap-load" onClick={() => setConsented(true)}><img src="/assets/media/video-thumbnails/GNboj6JfDeI.jpg" alt="Onboard view from a Formula LGB race car" width="480" height="360" /><span><Play weight="fill" /> Load the onboard video<small>YouTube connects only after this click</small></span></button>}
      </div>
      <div className="lap-map-panel">
        <div className="track-map" aria-label="Track position estimated from the video">
          <svg viewBox="0 0 430 330" role="img" aria-labelledby="track-title track-desc">
            <title id="track-title">Estimated track position</title><desc id="track-desc">A marker is shown only where reviewed video landmarks support an estimate. Position is unavailable during the grass excursion and after the last matched landmark.</desc>
            <path className="track-base" d={trackPath} /><path className="track-registration" d={trackPath} style={{ strokeDasharray: pathLength, strokeDashoffset: pathLength * (1 - (sample.mapProgress ?? 0)) }} /><path ref={pathRef} className="track-measure" d={trackPath} />
            <circle className="start-line" cx="334.9" cy="277.9" r="5"><title>Start/finish bridge reference</title></circle>
            {turns.map(turn => <g className="turn-label" key={turn.label} transform={`translate(${turn.x} ${turn.y})`}><circle r="6" /><text y="2">{turn.label}</text></g>)}
            <g className="direction-arrow" transform="translate(318 288) rotate(150)"><path d="M-7 -4 L5 0 L-7 4 Z" /></g>
            {marker && <g className="track-marker" data-mode={sample.mode} data-lap={sample.lap ?? ''} data-progress={sample.mapProgress?.toFixed(4)} transform={`translate(${marker.x} ${marker.y}) rotate(${marker.angle})`}><circle r="10" /><path d="M-4 -5 L7 0 L-4 5 Z" /></g>}
            {!marker && sample.lap !== null && <g className="position-unavailable"><rect x="116" y="119" width="198" height="42" rx="4" /><text x="215" y="145" textAnchor="middle">POSITION UNAVAILABLE</text></g>}
          </svg>
          <span>Clockwise full circuit · estimated from video · <a href="https://www.fia.com/sites/default/files/l10_04_circuits_2015.pdf#page=36">FIA outline</a></span>
        </div>
        <div className="lap-now">
          <span className="meta">Observed at {formatTime(time)} · {state === 1 ? 'playing' : state === 2 ? 'paused' : state === 0 ? 'ended' : ready ? 'ready' : 'not connected'}</span>
          <div className="lap-readout"><div><small>Run state</small><strong>{sample.mode === 'excursion' ? 'Off-circuit excursion' : sample.mode.replace('-', ' ')}</strong></div><div><small>Lap</small><strong>{lapName(sample.lap)}</strong></div><div><small>Video estimate</small><strong>{sample.mapProgress === null ? 'Unavailable' : sample.mode === 'registered' ? 'At a matched landmark' : 'Between landmarks'}</strong></div></div>
          <h3>{active.label}</h3><p>{active.note}</p>{queuedTime !== null && !error && <p className="lap-queued" role="status">Player loading; {formatTime(queuedTime)} is queued.</p>}{error && <div className="lap-error" role="alert"><p>{error}</p><button type="button" onClick={retry}>Try loading again</button><a href="https://www.youtube.com/watch?v=GNboj6JfDeI">Watch directly on YouTube.</a></div>}
        </div>
      </div>
    </div>
    <div className="telemetry-panel" aria-label="Footage-derived normalized signals">
      <div className="telemetry-head"><div><span className="meta">Estimated from video</span><h3>What the recording can support</h3></div><div className="telemetry-values"><span><i className="motion-dot" />Visual pace {sample.visualPace === null ? '—' : Math.round(sample.visualPace * 100)}</span><span><i className="tone-dot" />Audio tone {sample.audioTone === null ? '—' : Math.round(sample.audioTone * 100)}</span><span><i className="steering-dot" />Cornering {sample.cornering ?? '—'}</span></div></div>
      <svg className="telemetry-chart" viewBox="0 0 800 112" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="32" x2="800" y2="32" /><line x1="0" y1="68" x2="800" y2="68" /><line x1="0" y1="104" x2="800" y2="104" />{lineSegments('visualPace', 4).map((points, index) => <polyline key={`motion-${index}`} className="motion-line" points={points} />)}{lineSegments('audioTone', 40).map((points, index) => <polyline key={`tone-${index}`} className="tone-line" points={points} />)}{lineSegments('cornering', 76).map((points, index) => <polyline key={`cornering-${index}`} className="steering-line" points={points} />)}<line className="telemetry-cursor" x1={time / duration * 800} y1="0" x2={time / duration * 800} y2="112" /></svg>
      <p>{sample.drive}. Visual pace and whole-recording audio spectrum are normalized descriptors from the 720p source. Cornering is a qualitative inference from the registered circuit geometry—not a wheel measurement or calibrated probability. None are speed, steering angle, RPM, throttle, or brake channels; gaps mean unavailable evidence.</p>
      <p className="wheel-observation">Direct wheel review: {sample.observedWheel === null ? 'not sampled at this frame' : `${sample.observedWheel} · manually observed calibration window`}.</p>
    </div>
    <div className="lap-results" aria-label="Observed lap crossings">{telemetry.laps.map(lap => <div key={lap.lap}><span>{lapName(lap.lap)}</span><strong>{lap.duration === null ? `${formatTime(duration - lap.start)} partial` : formatTime(lap.duration)}</strong><small>{formatTime(lap.start)} bridge crossing</small></div>)}</div>
    <div className="lap-timeline" aria-label="Observed video moments">{moments.map(moment => <button type="button" key={moment.time} className={`${active.time === moment.time ? 'is-active' : ''}${queuedTime === moment.time ? ' is-queued' : ''}`} onClick={() => seek(moment.time)}><img src={moment.image} alt="" width="768" height="432" loading="lazy" /><span>{formatTime(moment.time)}</span>{moment.label}</button>)}</div>
    <section className="registration-evidence" aria-labelledby="registration-title">
      <div className="registration-heading"><div><span className="meta">Approximate track position</span><h3 id="registration-title">One lap, seven visible anchors</h3></div><p>The fastest lap is matched to visible sections of the circuit. The marker moves only between reviewed landmarks, never from total video time alone.</p></div>
      <div className="registration-grid">{registrationCards.map(item => <figure key={item.landmark}><button type="button" onClick={() => seek(item.time)} aria-label={`Seek to ${item.label} at ${formatTime(item.time)}`}><img src={item.evidence} alt={`Onboard evidence for ${item.label}`} width="768" height="432" loading="lazy" /></button><figcaption><strong>{item.label}</strong><span>{formatTime(item.time)} · about {Math.round(item.schematicPathFraction * 100)}% around the drawn lap</span></figcaption></figure>)}</div>
      <details className="registration-table"><summary>Technical frame-to-map ledger</summary><div role="table" aria-label="Frame-to-map registration ledger"><div role="row" className="registration-row registration-header"><span role="columnheader">Lap</span><span role="columnheader">Video</span><span role="columnheader">Landmark</span><span role="columnheader">Map fraction</span></div>{telemetry.registration.map(item => <div role="row" className="registration-row" key={`${item.lap}-${item.landmark}`}><span role="cell">{lapName(item.lap)}</span><a role="cell" href={item.evidence}>{formatTime(item.time)}</a><span role="cell">{item.label} · {item.bend}</span><span role="cell">{item.schematicPathFraction.toFixed(3)}</span></div>)}</div></details>
    </section>
    <figure className="excursion-evidence"><div><img src="/assets/media/lap-analysis/excursion-entry.webp" alt="The car leaving the paved circuit at 11 minutes 17 seconds" width="768" height="432" loading="lazy" /><img src="/assets/media/lap-analysis/excursion-field.webp" alt="The car travelling across grass at 11 minutes 24 seconds" width="768" height="432" loading="lazy" /><img src="/assets/media/lap-analysis/excursion-rejoin.webp" alt="The car returning to pavement at 11 minutes 33 seconds" width="768" height="432" loading="lazy" /></div><figcaption>Visible evidence for the unavailable-position interval: circuit exit at 11:17, grass at 11:24, and rejoin at 11:33. No off-track route is drawn.</figcaption></figure>
    <details className="heldout-evidence"><summary>Calibration and validation frames</summary><div className="registration-heading"><div><span className="meta">Out-of-sample check</span><h3>16 unused frames · 100% semantic agreement</h3></div><p>These reviewed left, right, and straight frames were not used as registration anchors, tiepoints, or wheel labels. All 16 agree with the frozen geometry-derived cornering channel. The separate wheel calibration contains 20 clear windows and two explicitly suppressed helmet occlusions.</p></div><div>{validationCases.map(item => <figure key={item.time}><button type="button" onClick={() => seek(item.time)} aria-label={`Seek to validation check at ${formatTime(item.time)}`}><img src={item.image} alt={`Out-of-sample ${item.label.toLowerCase()} frame at ${formatTime(item.time)}`} width="768" height="432" loading="lazy" /></button><figcaption><strong>{formatTime(item.time)} · {item.label}</strong><span>Reviewed after the geometry zones were frozen</span></figcaption></figure>)}</div></details>
    <details className="lap-method"><summary>Method, limits, and reproducibility</summary><p>Five passes beneath the same overhead bridge define the out lap, three complete laps, and one partial lap. The drawn centerline follows the sourced FIA diagram and its 17 numbered bends. Repeated visible scenes align each pass to the fully reviewed fastest-lap sequence; intervening bends and straights are time-warped only between adjacent scene matches. The displayed fraction is schematic SVG arclength, not physical distance, GPS, or a surveyed racing line.</p><p>No location is drawn from 11:17 through 11:33 while the car is visibly off circuit. The final partial lap becomes unavailable after its last matched Turn 13 exit frame at 13:56. Position never advances from a guessed lap duration.</p><p>The other traces are descriptors from the {telemetry.source.analysisSource}: stabilized 0.1-second residual optical flow for visual pace, geometry-derived left/right/straight cornering, and whole-recording spectral centroid for audio tone. The audio is not engine-isolated. Twenty direct wheel observations are retained only as a separate calibration record and are not interpolated. None are speed, steering angle, RPM, throttle, or brake channels.</p></details>
  </section>
}
