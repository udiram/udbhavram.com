import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

const telemetry = JSON.parse(await fs.readFile('src/lapTelemetry.json', 'utf8'))
const evidence = JSON.parse(await fs.readFile('scripts/lap-validation-evidence.json', 'utf8'))

assert.equal(telemetry.schemaVersion, 3)
assert.equal(telemetry.samples.length, 1680)
assert.deepEqual(telemetry.lapCrossings, evidence.crossings)
assert.deepEqual(telemetry.laps.filter(lap => lap.kind === 'complete').map(lap => lap.duration), evidence.completeLapDurations)
assert.ok(telemetry.registration.length >= 100, 'all 17 bends and intervening straights are represented across available laps')

for (const crossing of evidence.crossings) {
  const sample = telemetry.samples.reduce((nearest, item) => Math.abs(item.t - crossing) < Math.abs(nearest.t - crossing) ? item : nearest)
  assert.ok(Math.abs(sample.t - crossing) <= evidence.crossingToleranceSeconds)
  assert.ok(sample.mapProgress <= .01, `bridge crossing ${crossing} resets at the registered start point`)
}

for (let lap = 0; lap <= 4; lap += 1) {
  const anchors = telemetry.registration.filter(item => item.lap === lap)
  for (let index = 1; index < anchors.length; index += 1) {
    assert.ok(anchors[index].time > anchors[index - 1].time, `lap ${lap} anchor times increase`)
    assert.ok(anchors[index].schematicPathFraction > anchors[index - 1].schematicPathFraction, `lap ${lap} map positions increase`)
  }
  assert.ok(anchors.every(item => ['left', 'right', 'straight'].includes(item.bend)))
  assert.ok(anchors.every(item => ['reviewed-frame-match', 'sequence-aligned-bend'].includes(item.basis)))
  assert.ok(anchors.every(item => item.evidence.startsWith('/assets/media/lap-registration/')))
  for (const anchor of anchors) {
    const stat = await fs.stat(`public${anchor.evidence}`)
    assert.ok(stat.size > 10_000, `${anchor.evidence} contains a real evidence frame`)
  }
}

for (const testCase of evidence.occlusionCases) {
  const sample = telemetry.samples.find(item => item.t === testCase.time)
  assert.equal(sample.observedWheel, null, `${testCase.time}s helmet occlusion is suppressed`)
  const stat = await fs.stat(`public${testCase.evidence}`)
  assert.ok(stat.size > 10_000, `${testCase.evidence} contains an occlusion-review frame`)
}
assert.equal(telemetry.steeringReviews.filter(item => item.status === 'usable').length, evidence.steeringCalibrationSummary.usableWindows)
assert.equal(telemetry.steeringReviews.filter(item => item.status === 'obscured').length, evidence.steeringCalibrationSummary.obscuredExclusions)

for (const testCase of evidence.calibrationCases) {
  const sample = telemetry.samples.find(item => item.t === testCase.time)
  assert.equal(sample.lap, testCase.expectedLap, `calibration ${testCase.time}s lap`)
  if (testCase.expectedProgress === null) {
    assert.equal(sample.mapProgress, null, `calibration ${testCase.time}s position is absent`)
  } else {
    assert.ok(sample.mapProgress >= testCase.expectedProgress[0] && sample.mapProgress <= testCase.expectedProgress[1], `calibration ${testCase.time}s piecewise map registration`)
  }
  assert.equal(sample.cornering, testCase.expectedCornering, `calibration ${testCase.time}s geometry semantics`)
  assert.equal(sample.observedWheel, testCase.expectedWheel, `calibration ${testCase.time}s wheel observation`)
  const stat = await fs.stat(`public${testCase.evidence}`)
  assert.ok(stat.size > 10_000, `${testCase.evidence} contains a calibration frame`)
}

const fitTimes = new Set([
  ...telemetry.registration.map(item => item.time),
  ...telemetry.steeringReviews.map(item => item.time),
])
let validationMatches = 0
for (const testCase of evidence.outOfSampleCases) {
  assert.ok(!fitTimes.has(testCase.time), `${testCase.time}s is unused by anchors, tiepoints, and wheel calibration`)
  const sample = telemetry.samples.find(item => item.t === testCase.time)
  assert.ok(sample.mapProgress !== null, `${testCase.time}s has registered geometry`)
  assert.equal(sample.cornering, testCase.expectedCornering, `out-of-sample ${testCase.time}s cornering`)
  validationMatches += Number(sample.cornering === testCase.expectedCornering)
  const stat = await fs.stat(`public${testCase.evidence}`)
  assert.ok(stat.size > 10_000, `${testCase.evidence} contains a validation frame`)
}
assert.equal(validationMatches / evidence.outOfSampleCases.length, 1, 'out-of-sample semantic agreement is 100%')

const mapped = telemetry.samples.filter(item => item.mapProgress !== null)
const corneringCoverage = mapped.filter(item => item.cornering !== null).length / mapped.length
assert.ok(corneringCoverage >= .99, `cornering coverage is useful (${(corneringCoverage * 100).toFixed(1)}%)`)

for (const second of [677, 684, 693]) {
  const sample = telemetry.samples.find(item => item.t === second)
  assert.equal(sample.mode, 'excursion')
  assert.equal(sample.mapProgress, null)
  assert.equal(sample.visualPace, null)
  assert.equal(sample.audioTone, null)
  assert.equal(sample.cornering, null)
  assert.equal(sample.observedWheel, null)
}

const garage = telemetry.samples.find(item => item.t === evidence.garageCase.time)
assert.equal(garage.mapProgress, null)
assert.equal(garage.visualPace, null)
assert.equal(garage.audioTone, null)
assert.equal(garage.cornering, null)
assert.equal(garage.observedWheel, null)

const final = telemetry.samples.at(-1)
assert.equal(final.lap, 4)
assert.equal(final.mode, 'unresolved')
assert.equal(final.mapProgress, evidence.partialLap.expectedProgressAfterLastAnchor)
assert.ok(telemetry.samples.find(item => item.t === 836).mapProgress > .7, 'partial lap uses its own Turn 13 anchor')
assert.ok(!telemetry.samples.some(item => Object.hasOwn(item, 'phase')), 'uniform lap phase is not emitted')

for (const sample of telemetry.samples) {
  if (sample.visualPace !== null) assert.ok(sample.visualPace >= 0 && sample.visualPace <= 1)
  if (sample.audioTone !== null) assert.ok(sample.audioTone >= 0 && sample.audioTone <= 1)
  assert.ok(['left', 'right', 'straight', null].includes(sample.cornering))
  assert.ok(['left', 'right', 'centered', null].includes(sample.observedWheel))
}

console.log(`PASS lap analysis: ${telemetry.registration.length} anchors, ${(corneringCoverage * 100).toFixed(1)}% mapped cornering coverage, ${evidence.outOfSampleCases.length}/${evidence.outOfSampleCases.length} out-of-sample semantic checks, 20 wheel-calibration windows, and unavailable excursion/garage/tail.`)
