# Archive source coverage

This document records the source-level parity contract for the curated-site redesign. The underlying arrays remain the source of truth; `archiveData.ts` only adapts them for presentation.

## Immutable source inventories

| Source | Records | Archive identity |
| --- | ---: | --- |
| Historical portfolio collections | 124 | `collection:<chapter>:<slug>` or an explicitly reviewed same-entity canonical record |
| Experience | 30 | `experience:<id>` |
| Projects | 30 | `project:<id>`; the 9 software-backed records retain `software:<id>` as their canonical identity |
| Awards and recognition | 31 | `award:<id>` |
| Presentations and talks | 27 | `presentation:<id>` |
| Media | 26 deduplicated public records | `media:<type>:<id>` |
| Software | 9 | `software:<id>` |
| Papers | 4 | `paper:<id>` |
| Research case studies | 8 | `study:<slug>` |

After explicit semantic equivalence mapping, the Archive renders **234 stable public records**: 8 studies, 9 software projects, 4 papers, 27 presentations, 26 media records, 30 experience records, 21 non-software projects, 31 awards, and 78 historical-only collection records. The generated facets contain **9 year values** and **42 normalized institution values** as of October 14, 2026. Shared evidence URLs never establish identity by themselves.

## Curated experience merge map

The About page shows ten cards assembled from sixteen of the thirty source roles. `curatedExperience.ts` holds the executable mapping; it remains an internal coverage contract rather than public-facing database copy.

- UW–Madison PhD: `uw-medical-physics` + `uw-research-assistant`
- UAB Radiation Oncology: `uab-research-collaborator` + `uab-visiting-scholar` + `uab-clinical-shadowing`
- McMaster degree: `mcmaster-medical-physics`
- Arrow McLaren IndyCar: `arrow-mclaren`
- Juravinski Cancer Centre: `juravinski`
- Western / Lawson: `western-lawson`
- St. Joseph’s kidney research: `st-josephs-kidney`
- McMaster membrane lab: `mcmaster-membrane-lab`
- Teaching and mentorship: `physics-teaching-assistant` + `physics-society-mentor` + `science-coop-mentor`
- Vehicle and full-stack engineering: `mac-formula-electric` + `mcmaster-w-booth`

The remaining fourteen experience roles are Archive-only. This includes both yoga roles, the UAB Hindu YUVA entry, Humber River Hospital volunteering, Sparkin’ STEM, Robotique Zone01, FIRST Robotics 4939, the Journal of Science Policy & Governance ambassadorship, and the other historical engineering or service records. No source entry is deleted or rewritten.

## Compatibility and indexing

- `/experience`, `/awards`, `/media`, `/collection`, `/collection/*`, and item-specific `/publications` fragments remain valid legacy routes and canonicalize into the Archive. The unfragmented `/publications` route resolves to Research.
- Existing experience, award, presentation, and collection fragment links are mapped to stable Archive records.
- `/archive` is included in route metadata and the sitemap and remains indexable.
- Archive filters, search, sort, and view state are URL-addressable; discrete changes use browser history and reload from the current URL.
