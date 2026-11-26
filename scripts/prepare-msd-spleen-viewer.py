#!/usr/bin/env python3
"""Build the homepage CT viewer from one matched MSD Task09 Spleen pair.

The script downloads only the two members needed from the public uncompressed
tar using HTTP byte ranges, verifies their hashes and NIfTI geometry, then
creates windowed WebP frames plus mask-derived SVG path data.

Build dependency setup (not needed by the website at runtime):
  python3 -m venv tmp/real-ct-venv
  tmp/real-ct-venv/bin/pip install nibabel numpy pillow scikit-image

Example:
  tmp/real-ct-venv/bin/python scripts/prepare-msd-spleen-viewer.py --fetch
"""

from __future__ import annotations

import argparse
import hashlib
import json
import urllib.request
from pathlib import Path

import nibabel as nib
import numpy as np
from PIL import Image, ImageDraw
from skimage.measure import find_contours


ARCHIVE_URL = "https://msd-for-monai.s3-us-west-2.amazonaws.com/Task09_Spleen.tar"
ARCHIVE_MD5 = "410d4a301da4e5b2f6f86ec3ddba524e"
SUBJECT = "spleen_8"
CT_RANGE = (1_410_060_800, 1_419_872_031)
LABEL_RANGE = (1_610_126_336, 1_610_140_264)
CT_SHA256 = "a490abc81e9bfbcc2bbb45a962575ca063dac94efd8082db9636fca77eb8fc2f"
LABEL_SHA256 = "c9ffc9b44b37d02d9280e41a46e208d3e532c555c5eb5a5c28c442c4c94ddb44"
WINDOW_LEVEL = 40
WINDOW_WIDTH = 400


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def fetch_range(start: int, end: int, output: Path) -> None:
    request = urllib.request.Request(
        ARCHIVE_URL,
        headers={"Range": f"bytes={start}-{end}", "User-Agent": "udbhavram.com asset preparation"},
    )
    with urllib.request.urlopen(request, timeout=90) as response:  # noqa: S310 - fixed official URL
        expected = end - start + 1
        payload = response.read()
        if response.status != 206 or len(payload) != expected:
            raise RuntimeError(f"Expected HTTP 206 with {expected} bytes, got {response.status} and {len(payload)} bytes")
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(payload)


def verify_file(path: Path, expected: str) -> None:
    actual = sha256(path)
    if actual != expected:
        raise RuntimeError(f"Hash mismatch for {path}: {actual} != {expected}")


def display_plane(volume: np.ndarray, source_slice: int) -> np.ndarray:
    """RAS axial plane -> radiological display: anterior up, patient right left."""
    return volume[:, :, source_slice].T[::-1, ::-1]


def window_ct(plane: np.ndarray) -> np.ndarray:
    lower = WINDOW_LEVEL - WINDOW_WIDTH / 2
    upper = WINDOW_LEVEL + WINDOW_WIDTH / 2
    normalized = np.clip((plane.astype(np.float32) - lower) / (upper - lower), 0, 1)
    return np.rint(normalized * 255).astype(np.uint8)


def contour_paths(mask: np.ndarray) -> list[dict[str, object]]:
    paths: list[dict[str, object]] = []
    for contour in find_contours(mask.astype(np.float32), 0.5, fully_connected="high"):
        if len(contour) < 3:
            continue
        # skimage points are row, column. SVG coordinates are x, y.
        points = [(float(column), float(row)) for row, column in contour]
        command = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in points) + " Z"
        paths.append({"d": command, "pointCount": len(points)})
    return paths


def make_contact_sheet(frames: list[tuple[int, Image.Image, list[dict[str, object]]]], output: Path) -> None:
    columns, tile = 5, 256
    rows = int(np.ceil(len(frames) / columns))
    sheet = Image.new("RGB", (columns * tile, rows * (tile + 24)), "#0a0d0b")
    draw = ImageDraw.Draw(sheet)
    for index, (source_slice, image, paths) in enumerate(frames):
        x0 = (index % columns) * tile
        y0 = (index // columns) * (tile + 24)
        sheet.paste(image.resize((tile, tile), Image.Resampling.LANCZOS).convert("RGB"), (x0, y0))
        for path in paths:
            coords = [float(value) * tile / 512 for value in str(path["d"]).replace("M", "").replace("L", "").replace("Z", "").split()]
            points = [(x0 + coords[i], y0 + coords[i + 1]) for i in range(0, len(coords), 2)]
            if len(points) > 1:
                draw.line(points + [points[0]], fill="#8ff0a4", width=2)
        draw.text((x0 + 7, y0 + tile + 5), f"source slice {source_slice}", fill="#e8eee9")
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ct", type=Path, default=Path("tmp/real-ct/spleen_8.nii.gz"))
    parser.add_argument("--label", type=Path, default=Path("tmp/real-ct/spleen_8-label.nii.gz"))
    parser.add_argument("--out", type=Path, default=Path("public/assets/ct-spleen"))
    parser.add_argument("--evidence", type=Path, default=Path("output/real-ct/msd-spleen-8-contact-sheet.png"))
    parser.add_argument("--fetch", action="store_true")
    args = parser.parse_args()

    if args.fetch:
        fetch_range(*CT_RANGE, args.ct)
        fetch_range(*LABEL_RANGE, args.label)

    verify_file(args.ct, CT_SHA256)
    verify_file(args.label, LABEL_SHA256)

    ct_image = nib.load(args.ct)
    label_image = nib.load(args.label)
    if ct_image.shape != label_image.shape:
        raise RuntimeError(f"CT/label shape mismatch: {ct_image.shape} vs {label_image.shape}")
    if not np.allclose(ct_image.affine, label_image.affine, atol=1e-6):
        raise RuntimeError("CT and reference label affines differ")
    if not np.allclose(ct_image.header.get_zooms(), label_image.header.get_zooms(), atol=1e-6):
        raise RuntimeError("CT and reference label voxel spacing differs")
    if nib.aff2axcodes(ct_image.affine) != ("R", "A", "S"):
        raise RuntimeError(f"Expected RAS input, got {nib.aff2axcodes(ct_image.affine)}")

    ct = np.asanyarray(ct_image.dataobj)
    label = np.asanyarray(label_image.dataobj)
    unique_labels = np.unique(label)
    if not np.array_equal(unique_labels, np.array([0, 1], dtype=unique_labels.dtype)):
        raise RuntimeError(f"Expected binary reference label, got {unique_labels.tolist()}")

    mask = label == 1
    source_slices = np.where(mask.any(axis=(0, 1)))[0].tolist()
    if source_slices != list(range(8, 27)):
        raise RuntimeError(f"Unexpected labeled slice span: {source_slices}")

    args.out.mkdir(parents=True, exist_ok=True)
    frame_records: list[dict[str, object]] = []
    evidence_frames: list[tuple[int, Image.Image, list[dict[str, object]]]] = []
    areas: list[int] = []
    for viewer_index, source_slice in enumerate(source_slices):
        ct_plane = display_plane(ct, source_slice)
        mask_plane = display_plane(mask, source_slice)
        pixels = window_ct(ct_plane)
        image = Image.fromarray(pixels, mode="L")
        filename = f"slice-{viewer_index + 1:02d}.webp"
        image.save(args.out / filename, "WEBP", quality=88, method=6)
        paths = contour_paths(mask_plane)
        pixel_count = int(mask_plane.sum())
        areas.append(pixel_count)
        evidence_frames.append((source_slice, image, paths))
        frame_records.append(
            {
                "index": viewer_index,
                "sourceSlice": source_slice,
                "positionMm": float(ct_image.affine[2, 2] * source_slice + ct_image.affine[2, 3]),
                "src": f"/assets/ct-spleen/{filename}",
                "maskPixelCount": pixel_count,
                "contours": paths,
            }
        )

    default_index = int(np.argmax(areas))
    manifest = {
        "schemaVersion": 1,
        "dataset": "Medical Segmentation Decathlon Task09 Spleen",
        "subject": SUBJECT,
        "source": {
            "registry": "https://registry.opendata.aws/msd/",
            "archive": ARCHIVE_URL,
            "archiveMd5": ARCHIVE_MD5,
            "accessed": "2026-10-26",
            "license": "CC BY-SA 4.0",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
            "ctSha256": CT_SHA256,
            "labelSha256": LABEL_SHA256,
        },
        "geometry": {
            "shape": list(ct_image.shape),
            "spacingMm": [float(value) for value in ct_image.header.get_zooms()],
            "affine": [[float(value) for value in row] for row in ct_image.affine],
            "orientation": "RAS input; axial radiological display with anterior up and patient right on image left",
            "ctLabelShapeEqual": True,
            "ctLabelAffineEqual": True,
        },
        "display": {
            "windowLevelHu": WINDOW_LEVEL,
            "windowWidthHu": WINDOW_WIDTH,
            "width": 512,
            "height": 512,
            "defaultIndex": default_index,
            "frameCount": len(frame_records),
        },
        "reference": {
            "label": 1,
            "name": "spleen",
            "maskVoxelCount": int(mask.sum()),
            "sourceSliceRangeInclusive": [source_slices[0], source_slices[-1]],
            "boundaryMethod": "skimage.measure.find_contours at the 0.5 binary-mask boundary",
        },
        "frames": frame_records,
    }
    (args.out / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    make_contact_sheet(evidence_frames, args.evidence)
    print(f"Wrote {len(frame_records)} matched CT/label frames; default viewer index {default_index}")


if __name__ == "__main__":
    main()
