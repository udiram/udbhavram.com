# Identity, experience, project, and recognition coverage

Updated October 8, 2026. This is the release ledger for the public `/experience`, `/awards`, and `/beyond` surfaces. The executable coverage checks in `scripts/test-identity.mjs` require every typed record below to have a unique ID, at least one labelled source, a working public registry identity, and an entry in this ledger.

## Experience and affiliation records (30)

Current UW and McMaster education: `uw-medical-physics`, `uw-research-assistant`, `mcmaster-medical-physics`.

Research affiliations and appointments: `uab-research-collaborator`, `uab-visiting-scholar`, `juravinski`, `western-lawson`, `st-josephs-kidney`, `mcmaster-membrane-lab`, `uab-clinical-shadowing`.

Engineering and software roles: `mcmaster-w-booth`, `arrow-mclaren`, `mac-formula-electric`, `synth-med`, `waaw`, `formula-lgb-driver`, `vw-polo-driver`.

Teaching and mentoring: `physics-teaching-assistant`, `physics-society-mentor`, `science-coop-mentor`, `mcmaster-yoga`, `anytime-yoga`, `zone01`, `frc-4939`, `sparkin-stem`.

Service and institutional community: `jspg-ambassador`, `undergraduate-ambassador`, `mhigh`, `humber-river`, `uab-hindu-yuva`.

The ongoing UAB collaboration and completed visiting-scholar appointments are separate records. The public CV supplies exact role dates where available; undated historical roles say so rather than borrowing dates from another appointment.

## Institution-connected project records (30)

Clinical and imaging research: `adaptive-breast`, `tg263`, `ethos-srs`, `auto-segmentation`, `brain-followup`, `beam-energy`, `optical-brain`, `kidney-ar`, `amyloid`, `gel-analysis`, `genomic-dose-model`, `driving-agents`.

Engineering, simulation, and outreach: `f1-lap-simulation`, `strategy-simulator`, `formula-sae`, `prosthetic-hand`, `recycling-sorter`, `openpilot`, `stem-outreach`.

Open-source contributions: `monai-contribution`, `openhands-contribution`.

Canonical software shown in the institution-connected index: `software-ct-forge`, `software-protocoliq`, `software-radkev`, `software-voxelweave-designer`, `software-medphysbench`, `software-glioblastoma-analysis`, `software-rsna-explorer`, `software-oncoscout-2026`, `software-aapm-2026-explorer`.

Those nine software rows save and resolve through their existing `software:<id>` identities. They are not duplicated as `project:software-*` search or reading-list records.

## Recognition, training, and award records (31)

Primary-source personal recognition: `coop-student-year`, `aapm-blue-ribbon`, `sps-poster`, `cupc-talk`.

Institutional features and collaborator recognition: `employer-year`, `mcmaster-feature`, `uab-feature`. `employer-year` names Carlos Cardenas as the recipient and does not present the award as Udbhav's.

Training and qualifications: `ethos-course`, `yoga-teacher`, `french-certification`, `medical-youth`, `computer-science`, `cpr-first-aid`, `padi-advanced-open-water`, `padi-enriched-air`, `ssi-open-water`.

Academic, arts, and competition record: `ap-scholar`, `hosa`, `math-top-quarter`, `chess-champion`, `mirai`, `piano-bronze`, `piano-silver`, `piano-gold`, `robotics-mentor`, `spelling-bee`, `karting-runner-up`, `badminton-runner-up`, `robotics-runner-up`, `frc-semifinalist`, `spark-runner-up`.

Historical items whose public page does not name an issuer retain that uncertainty. Training, participation, and features are categorized separately from personal honors.

## Historical collection reconciliation

- Research affiliations map to the UAB, Juravinski, Western/Lawson, St. Joseph's kidney, and McMaster membrane-lab experience rows.
- All 12 projects in the earlier Research chapter map to a current project row; the abdominal segmentation source is represented by `auto-segmentation` rather than a second 3D-segmentation duplicate. Both named open-source contributions have their own rows.
- The Engineering and Projects chapter maps its prosthetic hand, Zone01, full-stack roles, openpilot, SPARK, Mirai, Sparkin' STEM, and Synth-Med material to experience, project, or recognition records. Its generic GitHub, YouTube, and Medium channel links remain collection navigation rather than employment or project claims.
- All four Motorsport records map to experience and project entries.
- Activities and Service maps clinical shadowing, WaaW, Synth-Med, Humber River, Formula SAE, FRC/Zone01, scuba, and yoga to typed records. Flight school, hockey, equestrian, and music remain on `/beyond` or in the historical collection because they are interests/training rather than institutional appointments. The owner-supplied Alabama barn and American Cowboy Academy context appears only in the equestrian story.
- Every earlier Awards and Certifications item maps to an award record. The ledger also adds the source-backed 2026 Co-op Student of the Year, the SPARK result, and three scuba qualifications.
- Presentation records keep their canonical presentation IDs and remain on `/publications`; they are not duplicated as experience or project records.

## Media and evidence boundaries

- `activities-scuba.webp` is the 225 x 124 image published in the Scuba section of the earlier public Activities page. It is displayed at native dimensions so the interface does not imply higher-resolution evidence.
- `activities-10.webp` is the image published in the Equestrian section of that page. Captions describe source-page context, not facial identification.
- The withdrawn community-music and outdoor-gathering images are absent from both UI references and the static asset payload.
- The rejected `beyond-equestrian-2025.webp` is also absent. Its replacement is a different owner-library image from November 8, 2024 in which the authenticated library identifies Udbhav; the published file is `beyond-equestrian-2024.webp`.
- The existing public Formula LGB onboard recording remains the verified motorsport video. No trustworthy additional scuba or equestrian video was found in the reviewed public source set, so none was added.

## Visual identity coverage

Every experience row renders one adjacent identity treatment. Official parent-organization marks cover UW–Madison, McMaster units and teams, UAB units and programs, Hamilton Health Sciences / Juravinski, Western / Lawson, St. Joseph’s, Arrow McLaren, FIRST, MAC Formula Electric, Synth-Med, JSPG, Anytime Fitness, and the current Humber Health identity. Momentum Motorsports uses an authentic activity photograph. WaaW, Robotique Zone01, Sparkin’ STEM, and MRF / Volkswagen Polo Cup use honest role-specific activity symbols where no safely reusable official mark was established. No experience row uses a generated word tile or an unrelated source-page screenshot.

Every recognition row renders one adjacent issuer, qualification, or activity treatment. Named issuers use an official asset when reuse is supported (McMaster, UAB, AAPM, SPS, HOSA, FIRST, SSI, and PADI) or authentic record evidence (CUPC and SPARK). The historical Varian Clinical School course uses a training symbol rather than a screenshot of a current Siemens education page. College Board’s published third-party trademark restriction is respected with an academic activity symbol. Other records without a reusable issuer asset use an activity symbol and retain the sourced issuer name or explicit evidence gap in adjacent copy; they do not present the symbol as an issuer logo.

The `/beyond` equestrian story uses the exact provider name “The American Cowboy Academy,” its official mark and official site. The site explicitly states that it is unaffiliated with the similarly named `.org` organization; the portfolio links only to `theamericancowboyacademy.com`.

## Stable public identities

- Experience: `experience:<record-id>`
- Non-software projects: `project:<record-id>`
- Software shown in the project index: `software:<software-id>`
- Recognition: `award:<record-id>`

Deep links reveal a filtered-out record, clear the relevant filters, scroll it into view, and move keyboard focus to the record. The same behavior applies when a visitor activates a search result whose fragment is already in the URL, because repeating an unchanged hash does not emit the browser's `hashchange` event.
