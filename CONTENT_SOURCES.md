# Content sources

The portfolio separates current facts, published results, active public work, and historical material. This note records the public sources checked for the October 5, 2026 refresh.

## Current identity and training

- [UW–Madison Medical Physics student directory](https://medphysics.wisc.edu/graduate-program/meet-our-students/) — lists Udbhav Ram as a 2026 PhD student advised by Dr. Ran Zhang.
- [ASTRO 2026 speaker page](https://amportal.astro.org/udbhav-ram-bs-135368427) — identifies the UW–Madison PhD, prior McMaster and UAB training, current research areas, disclosures, and the September 29 poster.
- [McMaster 2026 convocation profile](https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/) — documents the Honours Medical Physics with Co-op program and institutional advocacy work.
- [McMaster Science Co-op Student of the Year story](https://news.mcmaster.ca/udbhav-rams-co-op-supervisors-flew-in-from-alabama-to-give-him-an-award/) — documents the 2026 award and UAB collaboration.

## Publications

- [PubMed author results](https://pubmed.ncbi.nlm.nih.gov/?term=Udbhav+S+Ram) — two indexed first-author 2025 papers, PMID 41020282 and PMID 41272935.
- [Neuro-Oncology Practice article](https://academic.oup.com/nop/article/13/3/497/8382617) — collaborative brain-metastasis follow-up study.
- [AAPM 2025 TG-263 poster](https://aapm.confex.com/aapm/2025am/mediafile/Handout/Paper20105/AAPM2025_BRP_LLM.pdf) — source for the naming-QA methods, sample size, results, and review limitations.

## Active public software

Repository descriptions and public update dates were checked through GitHub’s public API on October 5, 2026:

- [RadKev](https://github.com/udiram/RadKev)
- [MedPhysBench](https://github.com/udiram/MedPhysBench)
- [VoxelWeave Designer](https://github.com/udiram/VoxelWeave-Designer)
- [Glioblastoma analysis](https://github.com/udiram/Glioblastoma_analysis)

Active repositories are presented as research or engineering work with explicit limitations. Public code, a repository description, or an update date does not establish clinical performance or readiness.

## Historical record

The earlier Google Site remains the source for the historical record preserved in the searchable collection. Time-bound goals, former affiliations, earlier self-descriptions, credentials, and mentor or employer recognition stay labelled so they cannot be mistaken for current facts or personal awards.

## Expanded editorial edition

The October 2026 expanded edition adds seven source-linked research case studies, full citations in `src/bibliography.json`, eight authentic personal photographs indexed in `src/personalPhotos.json`, and a public-facing CV in `public/downloads/`. Research summaries distinguish published articles, conference presentations, findings, and limitations. The public CV excludes private contact details.

Production integration uses the verified expanded source revision `eb84d30d3c420e0a3fd10c75c554275340fddae9`, with production-specific routing, indexing, and server regression checks.

## Presentation reconciliation — October 6, 2026

`src/presentations.json` holds 26 discrete event/remarks records and one aggregate outreach account, with stable IDs and source URLs. It supersedes separate selected and historical talk arrays. Nine AAPM contributions and two ASTRO contributions are distinguished from institutional, thesis, and outreach work. Coauthored work names the listed presenter. Meeting date ranges for digital posters are not individual physical sessions.

The AIIMS research seminar remains scheduled, with delivery not independently verified. The SCEC aggregate records four completed talks reported by the speaker without inventing their individual titles or dates. The HCKR invitation, recorded thesis talk, and approximate-year partnership remarks retain their evidence/date qualifications. Unresolved candidate talks are excluded pending confirmation.

The public CV uses the same 27 record IDs and all four verified journal articles. Two secondary CAP program PDF links returning404 were omitted while retaining each event and its other program or recording links. Official source hosts may restrict automated access; these restrictions do not establish that an event is absent.


## October 6 media and personal-profile expansion

The public URLs, publisher names, dates, original/adapted relationships, video titles/durations and contextual links are recorded in `src/mediaContent.json`. Nine article editions or mentions are grouped into six stories; they are not nine independent interviews. Cardenas received the employer award; Udi nominated him. The January/February 2025 AAPM newsletter reports the 2024 competition. The four institutional listings include an undergraduate-era MHIGH Trainee Scholar role, not a faculty appointment.

The three additional local motorsport photographs (`motorsports-01.webp` through `motorsports-03.webp`) come from Udi’s [existing public portfolio](https://sites.google.com/view/udbhav-ram/motorsports). Existing institutional photography is reused; no newly scraped publisher imagery was added. Video posters use local images or text, with a user-initiated YouTube privacy-enhanced embed.

Conference tools: [AAPM 2026 Explorer retrospective](https://x.com/UdbhavRam/status/2080675842980557111) and [OncoScout2026 launch](https://x.com/UdbhavRam/status/2103868337612857350). Both are independent personal projects, not organizer-operated or endorsed tools. [Personal automation notes](https://x.com/UdbhavRam/status/2071427843754463536) support the small everyday-building example; no actual telemetry or private trip information is published.

The owner verified PADI Advanced Open Water Diver and Enriched Air Diver (Nitrox), confirmed May 2025, and the earlier SSI Open Water Diver qualification issued June 3, 2023. These are consistent across biography, interests, collection, and public CV. Private issuing correspondence and credential identifiers are excluded from the repository.

## October 6 interactive and visual evidence pass

The Formula LGB companion uses the public first-run recording (`GNboj6JfDeI`) as its sole timing and signal source. Five visually reviewed passes beneath the same bridge (2:38.5, 5:25.5, 7:45.5, 9:55.5, and 12:25.5) define an out lap, three complete laps, and one partial lap. Repeated 720p scene matches warp the fully reviewed fastest-lap sequence onto the other passes. `scripts/lap-validation-evidence.json` labels the original 12 frame/map and wheel checks as calibration because some coincide with reference anchors or wheel-review windows. A separate set of 16 reviewed left/right/straight frames was frozen without using those timestamps as scene anchors, tiepoints, or wheel labels; it checks the geometry-derived cornering channel out of sample. Two helmet-occluded calibration cases ensure direct wheel observations are withheld. The checked-in evidence also documents the visible grass excursion from 11:17 through the 11:33 rejoin.

The circuit centerline and all 17 labels are traced from page 36 of the [FIA 2015 circuit guide](https://www.fia.com/sites/default/files/l10_04_circuits_2015.pdf#page=36), rather than approximated from a handful of turns. The [Madras Motor Sports Club circuit page](https://madrasmotorsports.com/mic) independently identifies the main circuit as 3.717 km and clockwise. The marker interpolates only between adjacent sequence anchors. Its displayed fraction is SVG arclength on the schematic—not physical distance, GPS, or a surveyed racing line. No marker is drawn during the excursion or after the final partial lap's last Turn 13 exit match.

`scripts/analyze-lap-video.py` reproducibly extracts nullable descriptors from the 1280×720, 59.94 fps public rendition into `src/lapTelemetry.json`: residual optical-flow magnitude over 0.1-second frame pairs after median global-flow removal; continuous left/right/straight cornering inferred from the registered FIA schematic; and whole-recording audio spectral centroid. Twenty manually reviewed direct wheel directions are retained separately as sparse calibration observations and are never interpolated. The failed fixed-center spoke estimator was removed because helmet occlusion and threefold rotational ambiguity made it unreliable. The audio is not engine-isolated. These signals are not speed, steering angle, RPM, pedal, or GPS channels, and they are suppressed for the garage, the excursion, and unresolved spatial intervals.

Software-image provenance is recorded in `public/assets/software/PROVENANCE.md`. RSNA Explorer corpus counts come from its frozen `data/source-manifest.json` and README: 946 current sessions, 6,931 current presentations, and 128,237 public archive records spanning 2003–2025. The RSNA and OncoScout cards now use actual application captures rather than concept renders. The CT Forge image is labelled as a July 2026 application capture and is not combined with October status evidence; a new authenticated workspace capture was not published because the current local app requires a private operator session.

Two personal-story images selected on October 6 were withdrawn on October 8 after the site owner reported that the pictured people were not them. Both files were removed from the interface and public static payload. They are not identity evidence.

The expanded Beyond page instead uses media from the matching Scuba and Equestrian sections of the owner’s earlier public Activities page. The scuba image was converted to a metadata-free local WebP; the existing equestrian WebP is a resized copy of the source-page image. The page labels each image by the portfolio section that supplied it and explicitly avoids facial identity inference.

The authenticated photo-library source pass also searched UW–Madison, Madison, UAB, printer, poster, AAPM, and ASTRO. It did not yield a clearly attributable new lab, printer/phantom, or Udi presentation photograph suitable for a project card. Existing source-backed UAB presentation and AAPM poster images remain attached to their research stories; unrelated search matches were not published to fill space.

## October 8 identity, experience, and recognition expansion

`src/identityContent.ts` is the typed public ledger for `/experience` and `/awards`: 30 experience and affiliation records, 30 institution-connected project records, and 31 recognition, training, competition, arts, and feature records. Every record has a stable ID and at least one labelled public source. `IDENTITY_SOURCE_COVERAGE.md` reconciles the typed ledger against the earlier Research, Projects, Motorsport, Activities, and Awards chapters.

The October 2026 public CV supports the exact date ranges published for the UW research assistantship (June 2026–present), Juravinski thesis (September 2024–May 2025), Western/Lawson (August 2022–January 2023), St. Joseph's kidney research (September 2021–August 2022), McMaster membrane lab (September 2019–August 2022), W Booth (January–June 2023), Arrow McLaren (June–August 2023), MAC Formula Electric (October 2021–January 2024), and McMaster teaching or mentoring appointments (September 2024–May 2025). It also supports the earlier Synth-Med, WaaW, JSPG, and McMaster yoga roles without inventing more precise dates than the public document provides. The public edition excludes private contact information.

The continuing UAB research collaboration is separate from the completed 2024 and 2025 visiting-scholar appointments. Historical roles with no public month range are labelled as such.

The project index connects each project to an institution, timeframe, category, documented outcome, and source. It includes the full current software catalog but reuses each software project's canonical search and reading-list identity rather than creating duplicate saved records. Exploratory work is not presented as deployed or clinically validated.

The awards ledger contains every item in the earlier Awards page, restores the full `AP Scholar with Distinction` title, and adds the source-backed 2026 McMaster Science Co-op Student of the Year, the project-documented SPARK result, and the three public scuba qualifications. Personal honors are distinguished from training, participation/features, and the 2025 mentor/employer award received by Carlos Cardenas.

The equestrian narrative uses site-owner-supplied context: English and Western riding; about two years helping at an Alabama lesson barn focused on Western riding and barrel racing; and American Cowboy Academy horsemanship and horse-care training. This context is not used to claim professional rodeo experience.

The retained scuba image is the 225 x 124 source image from the Scuba section of the earlier public Activities page and is intentionally shown at native size. The retained equestrian image is a local WebP of the Equestrian-section image. The Yoga, Western classical violin, Carnatic violin, Carnatic vocal, and Motorsport images likewise retain their original section-level attribution in `src/personalPhotos.json`. No new scuba or equestrian video met the reviewed public-source and identity threshold; the existing verified Formula LGB onboard recording remains the motorsport video.

## October 8 discovery registry and reading list

`src/contentRegistry.ts` derives its search and reading-list entries from the existing case studies, software records, bibliography, presentation inventory, media ledger, and historical collection. It adds no biographical or scientific claims. Media editions in the same `story_group` resolve to one discovery entry, presentation copies in the historical collection are omitted, and historical records whose source URL already belongs to a current study, paper, presentation, media item, or software project are suppressed as search echoes while remaining available in their original collection chapter.

Study-page connections are declared by stable registry ID in `src/contentRelations.ts`. Each reason identifies the evidence relationship already supported by the linked paper, presentation, recording, or profile; no software relationship is inferred from topic similarity. Reading-list share URLs contain only those public registry IDs and do not transmit notes, browser history, or other local data.
