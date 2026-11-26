# Real CT viewer provenance

## Source

- Dataset: Medical Segmentation Decathlon, Task09 Spleen
- Subject: `spleen_8`
- Registry: https://registry.opendata.aws/msd/
- Official archive: https://msd-for-monai.s3-us-west-2.amazonaws.com/Task09_Spleen.tar
- Archive MD5 published by MONAI: `410d4a301da4e5b2f6f86ec3ddba524e`
- Accessed: 2026-10-26
- Dataset license: Creative Commons Attribution-ShareAlike 4.0 International, https://creativecommons.org/licenses/by-sa/4.0/

The Medical Segmentation Decathlon is maintained by the MONAI development team. These website derivatives remain available under CC BY-SA 4.0. No endorsement by the dataset authors, MONAI, or the original imaging institution is implied.

## Exact matched inputs

- `Task09_Spleen/imagesTr/spleen_8.nii.gz`: archive bytes `1410060800-1419872031`, SHA-256 `a490abc81e9bfbcc2bbb45a962575ca063dac94efd8082db9636fca77eb8fc2f`
- `Task09_Spleen/labelsTr/spleen_8.nii.gz`: archive bytes `1610126336-1610140264`, SHA-256 `c9ffc9b44b37d02d9280e41a46e208d3e532c555c5eb5a5c28c442c4c94ddb44`

The CT and reference label have identical `512 × 512 × 31` shapes, `0.785156 × 0.785156 × 7.5 mm` voxel spacing, RAS orientation, and affines. The reference spleen label occupies source slices 8 through 26 inclusive.

## Changes made for the website

The reproducible preparation script is [`scripts/prepare-msd-spleen-viewer.py`](../../../scripts/prepare-msd-spleen-viewer.py). It:

1. verifies both input hashes and the CT/label geometry;
2. extracts the 19 axial slices containing the reference label;
3. applies a fixed abdominal soft-tissue window of level 40 HU and width 400 HU;
4. converts RAS planes to a radiological display with anterior at the top and the patient's right on the image left;
5. encodes each grayscale slice as WebP; and
6. traces the exact binary reference mask at its 0.5 boundary into SVG path coordinates.

The green line is the dataset's reference segmentation boundary. It is not a model prediction and was not drawn by hand. The images are de-identified research data, not a diagnostic viewer or clinical recommendation.
