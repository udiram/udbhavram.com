#!/usr/bin/env python3
"""Rebuild the evidence-backed Formula LGB video companion.

The output deliberately separates observations from estimates. Circuit position
is registered to named, visually matched landmarks on each lap and is absent
during the grass excursion and after the last registered landmark. The signal
traces are normalized video/audio descriptors, never vehicle telemetry.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


DURATION = 839.866
SAMPLE_STEP = 0.5
FLOW_INTERVAL = 0.1
LAP_CROSSINGS = [158.5, 325.5, 465.5, 595.5, 745.5]
EXCURSION = (677.0, 693.0)

# Human-reviewed direction windows. Values are published only around frames
# where the wheel and road direction are both unobscured; all other samples are
# null. The two explicit exclusions guard the reviewer-found helmet failures.
STEERING_REVIEWS = [
    {"time": 278.0, "direction": "left", "status": "usable"},
    {"time": 382.0, "direction": "left", "status": "usable"},
    {"time": 470.0, "direction": "right", "status": "usable"},
    {"time": 471.5, "direction": "right", "status": "usable"},
    {"time": 487.0, "direction": "left", "status": "usable"},
    {"time": 488.0, "direction": "left", "status": "usable"},
    {"time": 498.0, "direction": None, "status": "obscured"},
    {"time": 500.0, "direction": "centered", "status": "usable"},
    {"time": 508.5, "direction": "left", "status": "usable"},
    {"time": 512.5, "direction": "right", "status": "usable"},
    {"time": 518.5, "direction": "left", "status": "usable"},
    {"time": 524.5, "direction": "right", "status": "usable"},
    {"time": 526.0, "direction": "right", "status": "usable"},
    {"time": 545.5, "direction": "right", "status": "usable"},
    {"time": 549.0, "direction": "left", "status": "usable"},
    {"time": 551.0, "direction": None, "status": "obscured"},
    {"time": 568.5, "direction": "right", "status": "usable"},
    {"time": 570.0, "direction": "right", "status": "usable"},
    {"time": 576.0, "direction": "left", "status": "usable"},
    {"time": 585.5, "direction": "right", "status": "usable"},
    {"time": 630.0, "direction": "centered", "status": "usable"},
    {"time": 760.0, "direction": "right", "status": "usable"},
]

# Fractions come from the centerline extracted from the sourced FIA diagram,
# ordered from its start marker through Turns 1..17. They are schematic
# arclength, not physical distance. `referenceTime` is the manually reviewed
# fastest lap. Other laps use piecewise warps between repeated scene matches.
REFERENCE_ANCHORS = [
    ("start-finish", "Start/finish bridge", 0.0000, 465.5, "right"),
    ("turn-1", "Turn 1", 0.0703, 470.0, "right"),
    ("turn-2", "Turn 2", 0.1345, 480.0, "right"),
    ("turn-3", "Turn 3", 0.1741, 488.0, "left"),
    ("turn-4", "Turn 4", 0.2179, 490.0, "left"),
    ("turn-5", "Turn 5", 0.2437, 492.0, "right"),
    ("turn-6", "Turn 6", 0.2737, 495.0, "left"),
    ("white-tower-straight", "White-tower straight", 0.3350, 500.0, "straight"),
    ("turn-7", "Turn 7", 0.3732, 508.5, "left"),
    ("turn-8", "Turn 8", 0.4004, 512.5, "right"),
    ("turn-9", "Turn 9", 0.4498, 520.0, "left"),
    ("turn-10", "Turn 10", 0.4896, 524.5, "right"),
    ("turn-11", "Turn 11", 0.5592, 532.0, "left"),
    ("back-straight", "Back straight", 0.6150, 539.0, "straight"),
    ("turn-12", "Turn 12", 0.6642, 545.5, "right"),
    ("turn-13", "Turn 13", 0.7057, 549.0, "left"),
    ("turn-13-exit", "Turn 13 exit", 0.7200, 551.0, "left"),
    ("post-13-straight", "Straight after Turn 13", 0.7500, 559.0, "straight"),
    ("turn-14", "Turn 14", 0.7882, 568.5, "right"),
    ("turn-15", "Turn 15", 0.8253, 575.0, "left"),
    ("turn-16", "Turn 16", 0.8563, 579.5, "right"),
    ("turn-17", "Turn 17", 0.9236, 585.0, "right"),
    ("timing-straight", "Timing-building straight", 0.9700, 590.0, "straight"),
    ("finish", "Start/finish bridge return", 1.0000, 595.5, "straight"),
]

# Repeated-scene matches used to warp the fastest-lap sequence onto each pass.
# The excursion lap deliberately has no interpolation from 677 through 693.
LAP_TIEPOINTS = [
    [(465.5, 158.5), (470.0, 172.0), (480.0, 183.63), (500.0, 203.75), (524.5, 241.65), (545.5, 268.63), (551.0, 276.33), (559.0, 281.61), (575.0, 303.67), (585.0, 315.01), (595.5, 325.5)],
    [(465.5, 325.5), (470.0, 330.5), (480.0, 341.12), (500.0, 360.0), (524.5, 388.0), (545.5, 410.12), (551.0, 417.08), (559.0, 424.19), (575.0, 442.42), (585.0, 453.69), (595.5, 465.5)],
    [(time, time) for _, _, _, time, _ in REFERENCE_ANCHORS if time in {465.5, 470.0, 480.0, 500.0, 524.5, 545.5, 551.0, 559.0, 575.0, 585.0, 595.5}],
    [(465.5, 595.5), (470.0, 600.0), (480.0, 609.73), (500.0, 628.0), (524.5, 655.0), (545.5, 695.23), (551.0, 699.65), (559.0, 707.38), (575.0, 723.35), (585.0, 733.88), (595.5, 745.5)],
    [(465.5, 745.5), (470.0, 749.5), (480.0, 761.62), (500.0, 780.5), (524.5, 807.0), (545.5, 829.62), (551.0, 836.08)],
]


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def warp_time(reference_time: float, tiepoints: list[tuple[float, float]]) -> float | None:
    if reference_time > tiepoints[-1][0]:
        return None
    before = tiepoints[0]
    for after in tiepoints:
        if after[0] >= reference_time:
            ratio = 0 if after[0] == before[0] else (reference_time - before[0]) / (after[0] - before[0])
            return before[1] + ratio * (after[1] - before[1])
        before = after
    return None


def registration() -> list[dict]:
    rows = []
    for lap, tiepoints in enumerate(LAP_TIEPOINTS):
        matched_reference_times = {point[0] for point in tiepoints}
        for key, label, progress, reference_time, bend in REFERENCE_ANCHORS:
            second = warp_time(reference_time, tiepoints)
            if second is None:
                continue
            filename = f"lap-{lap}-{slug(key)}.webp"
            rows.append({
                "lap": lap,
                "time": round(second, 2),
                "landmark": key,
                "label": label,
                "schematicPathFraction": progress,
                "bend": bend,
                "evidence": f"/assets/media/lap-registration/{filename}",
                "basis": "reviewed-frame-match" if reference_time in matched_reference_times else "sequence-aligned-bend",
            })
    return rows


REGISTRATION = registration()


def lap_for_time(second: float) -> int | None:
    if second < LAP_CROSSINGS[0]:
        return None
    return max(index for index, crossing in enumerate(LAP_CROSSINGS) if second >= crossing)


def position_at(second: float) -> tuple[str, int | None, float | None, float]:
    if second < 153:
        return "garage", None, None, 0.0
    if second < LAP_CROSSINGS[0]:
        return "pit-lane", None, None, 0.0
    lap = lap_for_time(second)
    assert lap is not None
    if EXCURSION[0] <= second <= EXCURSION[1]:
        return "excursion", lap, None, 0.0
    anchors = [row for row in REGISTRATION if row["lap"] == lap]
    if second > anchors[-1]["time"]:
        return "unresolved", lap, None, 0.0
    before = anchors[0]
    for after in anchors:
        if abs(second - after["time"]) <= SAMPLE_STEP / 2:
            return "registered", lap, after["schematicPathFraction"], 0.92
        if after["time"] >= second:
            span = after["time"] - before["time"]
            ratio = 0.0 if span == 0 else (second - before["time"]) / span
            progress = before["schematicPathFraction"] + ratio * (after["schematicPathFraction"] - before["schematicPathFraction"])
            return "interpolated", lap, progress, 0.64
        before = after
    return "unresolved", lap, None, 0.0


def percentile_scale(values: np.ndarray, valid: np.ndarray, low: float = 5, high: float = 95) -> np.ndarray:
    result = np.full(len(values), np.nan)
    finite = valid & np.isfinite(values)
    lo, hi = np.percentile(values[finite], [low, high])
    result[finite] = np.clip((values[finite] - lo) / max(hi - lo, 1e-6), 0, 1)
    return result


def rolling_median(values: np.ndarray, radius: int = 2) -> np.ndarray:
    result = np.full(len(values), np.nan)
    for index in range(len(values)):
        window = values[max(0, index - radius):index + radius + 1]
        finite = window[np.isfinite(window)]
        if len(finite):
            result[index] = np.median(finite)
    return result


def extract_audio(source: Path, sample_rate: int = 8000) -> np.ndarray:
    process = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(source), "-ac", "1", "-ar", str(sample_rate), "-f", "f32le", "-"],
        check=True,
        capture_output=True,
    )
    return np.frombuffer(process.stdout, dtype="<f4")


def audio_signals(source: Path, times: np.ndarray, valid: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    sample_rate = 8000
    audio = extract_audio(source, sample_rate)
    rms, centroid = [], []
    half_window = int(sample_rate * SAMPLE_STEP / 2)
    window = np.hanning(half_window * 2)
    frequencies = np.fft.rfftfreq(len(window), 1 / sample_rate)
    for second in times:
        center = int(second * sample_rate)
        start, stop = center - half_window, center + half_window
        segment = np.zeros(len(window), dtype=np.float32)
        src_start, src_stop = max(0, start), min(len(audio), stop)
        segment[src_start - start:src_stop - start] = audio[src_start:src_stop]
        rms.append(float(np.sqrt(np.mean(segment * segment))))
        spectrum = np.abs(np.fft.rfft(segment * window))
        centroid.append(float(np.sum(frequencies * spectrum) / max(np.sum(spectrum), 1e-9)))
    return percentile_scale(np.array(rms), valid), percentile_scale(np.array(centroid), valid)


def video_signals(source: Path, times: np.ndarray, valid: np.ndarray) -> np.ndarray:
    """Decode once, comparing frames 0.1 s apart in a scenery-only crop."""
    cap = cv2.VideoCapture(str(source))
    fps = cap.get(cv2.CAP_PROP_FPS)
    motion_raw = np.full(len(times), np.nan)
    index, frame_index = 0, 0
    first_crop = None
    while index < len(times):
        ok, frame = cap.read()
        if not ok:
            break
        second = frame_index / fps
        frame_index += 1
        target = times[index]
        if first_crop is None and second + 1 / fps >= target:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # 720p scenery/road region excludes sky, mirror, wheel, bodywork, and helmet.
            first_crop = cv2.resize(gray[120:430, 0:850], (212, 78), interpolation=cv2.INTER_AREA)
        if first_crop is not None and second + 1 / fps >= target + FLOW_INTERVAL:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            second_crop = cv2.resize(gray[120:430, 0:850], (212, 78), interpolation=cv2.INTER_AREA)
            flow = cv2.calcOpticalFlowFarneback(first_crop, second_crop, None, .5, 3, 15, 3, 5, 1.2, 0)
            global_flow = np.median(flow.reshape(-1, 2), axis=0)
            residual = flow - global_flow
            motion_raw[index] = float(np.percentile(np.linalg.norm(residual, axis=2), 75))
            index += 1
            first_crop = None
    cap.release()

    return percentile_scale(rolling_median(motion_raw, 2), valid, 3, 97)


def reviewed_steering(second: float, valid: bool) -> tuple[str | None, float]:
    if not valid:
        return None, 0.0
    match = next((item for item in STEERING_REVIEWS if item["status"] == "usable" and abs(second - item["time"]) <= .5), None)
    return (match["direction"], 1.0) if match else (None, 0.0)


def inferred_cornering(progress: float | None, position_confidence: float) -> tuple[str | None, float]:
    """Classify the registered schematic, never the observed steering wheel.

    Each left/right/straight landmark is a reviewed semantic point on the FIA
    centerline. Midpoints between adjacent points form deterministic zones, so
    every supported map position has a useful label while uncertainty remains
    explicit in the confidence value.
    """
    if progress is None:
        return None, 0.0
    anchors = [(anchor_progress, bend) for _, _, anchor_progress, _, bend in REFERENCE_ANCHORS]
    nearest_index = min(range(len(anchors)), key=lambda index: abs(progress - anchors[index][0]))
    nearest_progress, direction = anchors[nearest_index]
    distance = abs(progress - nearest_progress)
    semantic_confidence = 0.96 if distance <= 0.012 else 0.82 if distance <= 0.03 else 0.68
    return direction, round(position_confidence * semantic_confidence, 2)


def read_frame(cap: cv2.VideoCapture, second: float) -> np.ndarray:
    cap.set(cv2.CAP_PROP_POS_MSEC, second * 1000)
    ok, frame = cap.read()
    if not ok:
        raise RuntimeError(f"Could not read frame at {second:.2f}s")
    return frame


def save_frame(frame: np.ndarray, path: Path, width: int = 768) -> None:
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(rgb)
    height = round(image.height * width / image.width)
    image.resize((width, height), Image.Resampling.LANCZOS).save(path, "WEBP", quality=82, method=6)


CALIBRATION_FRAMES = {
    "left-278": 278.0,
    "left-382": 382.0,
    "straight-500": 500.0,
    "straight-630": 630.0,
    "excursion-684": 684.0,
    "right-760": 760.0,
    "right-471-5": 471.5,
    "left-488": 488.0,
    "right-526": 526.0,
    "left-550": 550.0,
    "right-570": 570.0,
    "left-576": 576.0,
    "obscured-498": 498.0,
    "obscured-551": 551.0,
}

VALIDATION_FRAMES = {
    "right-178-5": 178.5,
    "left-193": 193.0,
    "straight-202-5": 202.5,
    "straight-261": 261.0,
    "straight-283-5": 283.5,
    "right-336": 336.0,
    "left-350": 350.0,
    "straight-361-5": 361.5,
    "straight-404": 404.0,
    "right-605-5": 605.5,
    "left-618": 618.0,
    "straight-708-5": 708.5,
    "right-756": 756.0,
    "left-770-5": 770.5,
    "straight-781-5": 781.5,
    "straight-819": 819.0,
}


def save_evidence(source: Path, registration_dir: Path, calibration_dir: Path | None, validation_dir: Path | None) -> None:
    registration_dir.mkdir(parents=True, exist_ok=True)
    if calibration_dir:
        calibration_dir.mkdir(parents=True, exist_ok=True)
    if validation_dir:
        validation_dir.mkdir(parents=True, exist_ok=True)
    cap = cv2.VideoCapture(str(source))
    for row in REGISTRATION:
        save_frame(read_frame(cap, row["time"]), registration_dir / Path(row["evidence"]).name)
    for name, second in CALIBRATION_FRAMES.items():
        if calibration_dir:
            save_frame(read_frame(cap, second), calibration_dir / f"{name}.webp")
    for name, second in VALIDATION_FRAMES.items():
        if validation_dir:
            save_frame(read_frame(cap, second), validation_dir / f"{name}.webp")
    cap.release()


def nullable(value: float) -> float | None:
    return None if not np.isfinite(value) else round(float(value), 3)


def analyze(source: Path, output: Path, registration_dir: Path | None, calibration_dir: Path | None, validation_dir: Path | None) -> None:
    times = np.arange(0, DURATION + .001, SAMPLE_STEP)
    states = [position_at(float(second)) for second in times]
    valid = np.array([mode in {"registered", "interpolated"} for mode, _, _, _ in states])
    motion = video_signals(source, times, valid)
    loudness, tone = audio_signals(source, times, valid)
    samples = []
    for index, second in enumerate(times):
        mode, lap, progress, confidence = states[index]
        trend = np.nan
        if index >= 7 and np.all(np.isfinite(tone[index - 7:index + 1])):
            trend = float(np.mean(tone[index - 3:index + 1]) - np.mean(tone[index - 7:index - 3]))
        if mode not in {"registered", "interpolated"}:
            drive = "signals unavailable"
        elif np.isfinite(trend) and trend > .055:
            drive = "audio spectral trend rising"
        elif np.isfinite(trend) and trend < -.055:
            drive = "audio spectral trend falling"
        else:
            drive = "audio spectral trend steady"
        observed_wheel, observed_wheel_confidence = reviewed_steering(float(second), bool(valid[index]))
        cornering, cornering_confidence = inferred_cornering(progress, confidence)
        samples.append({
            "t": round(float(second), 1), "mode": mode, "lap": lap,
            "mapProgress": None if progress is None else round(progress, 4),
            "positionConfidence": round(confidence, 2),
            "visualPace": nullable(motion[index]),
            "cornering": cornering,
            "corneringConfidence": cornering_confidence,
            "observedWheel": observed_wheel,
            "observedWheelConfidence": observed_wheel_confidence,
            "audioTone": nullable(tone[index]), "loudness": nullable(loudness[index]), "drive": drive,
        })
    payload = {
        "schemaVersion": 3,
        "source": {"videoId": "GNboj6JfDeI", "duration": DURATION, "sampleStep": SAMPLE_STEP, "analysisSource": "1280x720 59.94fps public YouTube rendition"},
        "method": {
            "position": "Piecewise interpolation between reviewed, named frame matches registered to a clockwise full-circuit schematic. Fractions are schematic arclength, not physical distance or GPS.",
            "visualPace": "Normalized residual optical-flow magnitude over 0.1 seconds in a 720p scenery/road crop after median global-flow removal.",
            "cornering": "Continuous left/right/straight inference from the registered FIA schematic's reviewed semantic zones. It describes track geometry, not observed wheel position or steering angle; confidence falls between registered landmarks.",
            "observedWheel": "A separate calibration-only observation shown in half-second windows around manually reviewed frames where wheel and road are unobscured. Helmet-obscured and modulo-ambiguous frames are null. This is not steering angle.",
            "audioTone": "Normalized whole-recording audio spectral centroid. The recording does not isolate the engine, so this is not RPM or throttle.",
        },
        "steeringReviews": STEERING_REVIEWS,
        "lapCrossings": LAP_CROSSINGS,
        "laps": [{
            "lap": index, "start": start,
            "end": LAP_CROSSINGS[index + 1] if index + 1 < len(LAP_CROSSINGS) else None,
            "duration": round(LAP_CROSSINGS[index + 1] - start, 1) if index + 1 < len(LAP_CROSSINGS) else None,
            "kind": "out lap" if index == 0 else "complete" if index < len(LAP_CROSSINGS) - 1 else "partial",
        } for index, start in enumerate(LAP_CROSSINGS)],
        "registration": REGISTRATION,
        "events": [{"start": EXCURSION[0], "end": EXCURSION[1], "label": "Visible off-circuit excursion", "position": "unavailable"}],
        "samples": samples,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, separators=(",", ":")) + "\n")
    if registration_dir:
        save_evidence(source, registration_dir, calibration_dir, validation_dir)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--registration-dir", type=Path)
    parser.add_argument("--calibration-dir", type=Path)
    parser.add_argument("--validation-dir", type=Path)
    args = parser.parse_args()
    analyze(args.source, args.output, args.registration_dir, args.calibration_dir, args.validation_dir)


if __name__ == "__main__":
    main()
