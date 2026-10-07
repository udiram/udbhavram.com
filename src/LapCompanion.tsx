import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, X } from '@phosphor-icons/react'

type PlayerState = -1 | 0 | 1 | 2 | 3 | 5
type YTPlayer = { destroy: () => void; getCurrentTime: () => number; seekTo: (time: number, allowSeekAhead: boolean) => void }
type YTNamespace = { Player: new (element: HTMLElement, options: { videoId: string; playerVars: Record<string, number | string>; events: { onReady: (event: { target: YTPlayer }) => void; onStateChange: (event: { data: PlayerState; target: YTPlayer }) => void; onError: () => void } }) => YTPlayer }

declare global { interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void; __YT_API_TIMEOUT_MS?: number } }

let apiPromise: Promise<YTNamespace> | null = null
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve, reject) => {
    const prior = window.onYouTubeIframeAPIReady
    const script = document.createElement('script')
    let settled = false
    const restore = () => {
      if (window.onYouTubeIframeAPIReady === ready) window.onYouTubeIframeAPIReady = prior
    }
    const fail = (message: string) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      restore()
      script.remove()
      apiPromise = null
      reject(new Error(message))
    }
    const ready = () => {
      if (settled) return
      prior?.()
      if (!window.YT?.Player) { fail('YouTube player API unavailable'); return }
      settled = true
      window.clearTimeout(timeout)
      restore()
      resolve(window.YT)
    }
    window.onYouTubeIframeAPIReady = ready
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.dataset.lapCompanionApi = 'true'
    script.onerror = () => fail('YouTube player API failed to load')
    const timeout = window.setTimeout(() => fail('YouTube player API timed out'), window.__YT_API_TIMEOUT_MS ?? 10000)
    document.head.append(script)
  })
  return apiPromise
}

const duration = 840
const moments = [
  { time: 0, label: 'Garage preparation', image: 'garage', note: 'The camera is already rolling while the car and driver are prepared. The opening is session context, not a timed lap.' },
  { time: 152, label: 'Leaving the garage', image: 'pit-exit', note: 'The car rolls toward the bright pit exit. The exact circuit position after this point is not reconstructed.' },
  { time: 215, label: 'Open track', image: 'open-track', note: 'The building and guardrail become visible as the onboard view opens onto the circuit.' },
  { time: 278, label: 'Left-hand curve', image: 'left-curve', note: 'A sustained left steering input and inside curb are visible; no steering-angle channel is available.' },
  { time: 382, label: 'Curb reference', image: 'curb-reference', note: 'Painted curb and edge markings provide a visual reference without implying a surveyed position.' },
  { time: 498, label: 'Straightened wheel', image: 'long-corner', note: 'The wheel returns closer to center as the white building comes back into view.' },
  { time: 630, label: 'Track-edge approach', image: 'track-edge', note: 'Guardrail, grass, and the building frame the approach. Speed and braking remain unknown.' },
  { time: 760, label: 'Late-run right-hander', image: 'late-run', note: 'A right-hand steering input is visible with another car in the distance.' },
]
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
const safeTime = (value: number) => Number.isFinite(value) && value >= 0 && value <= duration + 2

export default function LapCompanion() {
  const [consented, setConsented] = useState(false)
  const [ready, setReady] = useState(false)
  const [time, setTime] = useState(0)
  const [state, setState] = useState<PlayerState>(-1)
  const [queuedTime, setQueuedTime] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const host = useRef<HTMLDivElement>(null)
  const player = useRef<YTPlayer | null>(null)
  const queuedRef = useRef<number | null>(null)
  const active = useMemo(() => [...moments].reverse().find(moment => time >= moment.time) ?? moments[0], [time])
  const elapsed = Math.min(1, Math.max(0, time / duration))

  useEffect(() => {
    if (!consented || !host.current) return
    let cancelled = false
    let interval = 0
    loadYouTubeApi().then(YT => {
      if (cancelled || !host.current) return
      player.current = new YT.Player(host.current, {
        videoId: 'GNboj6JfDeI',
        playerVars: { playsinline: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return
            setReady(true)
            const requested = queuedRef.current
            if (requested !== null) { target.seekTo(requested, true); queuedRef.current = null; setQueuedTime(null) }
            interval = window.setInterval(() => {
              const observed = target.getCurrentTime()
              if (safeTime(observed)) setTime(Math.min(duration, observed))
            }, 250)
          },
          onStateChange: ({ data, target }) => {
            setState(data)
            const observed = data === 0 ? duration : target.getCurrentTime()
            if (safeTime(observed)) setTime(Math.min(duration, observed))
          },
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
  const close = () => {
    player.current?.destroy(); player.current = null; queuedRef.current = null
    setConsented(false); setReady(false); setTime(0); setState(-1); setQueuedTime(null); setError('')
  }
  const retry = () => { setError(''); setReady(false); setRetryKey(value => value + 1) }

  return <section className="wrap lap-companion" id="lap-companion" aria-labelledby="lap-title">
    <div className="section-heading"><h2 id="lap-title">Come along<br /><em>for a run.</em></h2><p>A video-led field notebook for the first Formula LGB 1300 onboard recording from Madras International Circuit, filmed in May 2023.</p></div>
    <div className="lap-grid">
      <div className="lap-video">
        {consented ? <><div ref={host} className="lap-player-host" aria-label="Formula LGB 1300 onboard YouTube player" />{!ready && !error && <div className="lap-loading">Connecting to YouTube…</div>}<button type="button" className="lap-close" onClick={close}><X /> Close video</button></> : <button type="button" className="lap-load" onClick={() => setConsented(true)}><img src="/assets/media/video-thumbnails/GNboj6JfDeI.jpg" alt="Onboard view from a Formula LGB race car" width="480" height="360" /><span><Play weight="fill" /> Load the onboard video<small>YouTube connects only after this click</small></span></button>}
      </div>
      <div className="lap-map-panel">
        <div className="track-map" aria-label="Static schematic of the Madras circuit"><svg viewBox="0 0 430 275" role="img" aria-labelledby="track-title track-desc"><title id="track-title">Schematic Madras circuit outline</title><desc id="track-desc">A static outline redrawn from the FIA circuit guide. It does not show the car’s position.</desc><path id="track-outline" d="M235 250 C205 254 183 235 174 203 L164 174 L207 156 L191 124 L135 92 L96 69 C81 82 57 77 54 59 C50 46 55 30 68 24 C83 17 97 27 103 39 C111 53 118 56 138 58 L263 72 C281 74 283 83 275 99 L267 116 C262 126 268 134 280 142 L326 171 C338 179 339 201 350 204 C363 208 365 181 378 180 C390 180 409 194 419 203 C427 214 419 226 405 233 L294 266 C270 273 251 266 235 250 Z" /></svg><span>Static redraw · <a href="https://www.fia.com/sites/default/files/l10_04_circuits_2015.pdf#page=36">FIA circuit guide</a></span></div>
        <div className="lap-now"><span className="meta">Observed at {formatTime(time)} · {state === 1 ? 'playing' : state === 2 ? 'paused' : state === 0 ? 'ended' : ready ? 'ready' : 'not connected'}</span><h3>{active.label}</h3><p>{active.note}</p>{queuedTime !== null && !error && <p className="lap-queued" role="status">Player loading; {formatTime(queuedTime)} is queued.</p>}{error && <div className="lap-error" role="alert"><p>{error}</p><button type="button" onClick={retry}>Try loading again</button><a href="https://www.youtube.com/watch?v=GNboj6JfDeI">Watch directly on YouTube.</a></div>}</div>
      </div>
    </div>
    <div className="lap-progress" aria-hidden="true"><span style={{ width: `${elapsed * 100}%` }} /></div>
    <div className="lap-timeline" aria-label="Observed video moments">{moments.map(moment => <button type="button" key={moment.time} className={`${active.time === moment.time ? 'is-active' : ''}${queuedTime === moment.time ? ' is-queued' : ''}`} onClick={() => seek(moment.time)}><img src={`/assets/media/lap-run-1/${moment.image}.webp`} alt="" width="960" height="540" loading="lazy" /><span>{formatTime(moment.time)}</span>{moment.label}</button>)}</div>
    <p className="lap-method"><strong>Method:</strong> each card is a frame extracted at the displayed timestamp from the public onboard video and reviewed visually. The circuit outline is redrawn from the FIA’s 2015 guide; the configuration used in this run was not independently verified, so the interface does not place the car on the map. No GPS, speed, throttle, brake, or lap-time telemetry is claimed.</p>
  </section>
}
