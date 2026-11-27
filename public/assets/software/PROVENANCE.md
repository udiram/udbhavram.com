# Software preview provenance

Checked October 6, 2026. These files are compressed presentation copies; their labels on `/software` define what each image proves.

- `protocoliq-demo.webp` — source: `ProtocolIQ/presentation/ProtocolIQ_Product_Demo_2026-08-13-poster.png`; synthetic product demonstration, not a clinical record or deployed-system claim.
- `voxelweave-prepare.webp` — source: `VoxelWeave/apps/site/public/assets/workspace-prepare.png`; interface concept, not proof of a completed print or scan-back.
- `medphysbench-reference.webp` — source: `MedPhysBench/web/public/design/medphysbench-ui-reference.png`; interface design reference, not a live benchmark result.
- `ct-forge-live.webp` — source: `Lab ideas/design/command-live-1568x1003.png`; application capture from July 2026. It is a historical UI state, not a current device-health report. A new authenticated workspace capture was not used because the current local app requires a private operator session.
- `onscout-live.webp` — source: `Astro2026/output/playwright/production-desktop.png`; safe production application capture from October 2026. OncoScout2026 is independent and not affiliated with ASTRO.
- `rsna-explorer-live.webp` — source: a fresh local build of `RSNAexplorer`, captured October 6, 2026 at 1440 × 1000. Corpus counts come from that project’s frozen source manifest and README.
- `scout/scout-*.webp`: demo-mode captures of Lattice Scout, the Zhang Lab's private CT-orders chat, supplied for this site in November 2026 as tighter crops of those captures (each scene has its own pixel size). Date windows, speed readouts and thinking timings are covered with solid boxes, and the jump-to-latest pill is cropped out or covered; nothing else is painted over. The phone hero has no bar chart because the source capture had none, and there is no light phone hero. Simulated data, with invented names and numbers. The reader and evidence shots include a real CC BY 4.0 paper (Vecsey-Nagy M et al., Eur Radiol 2026, PMC13793304). No production patient or operational data. Every image is captioned "Demo data. Simulated Scout, invented numbers."; the reader and evidence shots also carry the paper credit. Scout is separate from OncoScout2026.
- `onscout-render.webp` and `rsna-explorer-concept.webp` remain in the asset folder for source history but are no longer displayed on `/software`; the page now uses application captures.

All conversions used local `cwebp` at quality 78, with a maximum width of 1440 px. No image is used to imply a stronger evidence class than its source supports.
