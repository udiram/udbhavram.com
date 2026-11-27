# Research visual and recording coverage

Updated November 26, 2026. The `/research` first screen leads with the RadKev preprint figure and study summary. The remaining index and explanatory material follow it.

## Study visuals

Every published figure and conference poster is shown unaltered in the shared `PublishedFigure` frame (`src/PublishedFigure.tsx`): a head row with the figure number and title, a white plate in both themes that hugs the image, a caption, a credit line, and a lightbox with zoom. Figure metadata lives beside each image in `src/siteContent.ts`. A license is printed only where it has been verified.

- `radkev`: preprint Figure 5 (task accuracy and latency) from the public RadKev repository. Credit: medRxiv preprint, doi:10.64898/2026.10.07.26364991, not peer reviewed.
- `adaptive-breast-radiotherapy`: the ASTRO 2026 poster 3104, exact Boston presentation version.
- `clinical-language-models`: original AAPM 2025 TG-263 poster.
- `radiosurgery-planning`: UAB presentation photograph from the linked UAB profile (a photograph, so it is not in the figure frame).
- `organ-segmentation`: published Figures 2, 3 and 4 from the article in Intelligent Oncology, doi:10.1016/j.intonc.2025.03.003.
- `brain-metastases-follow-up`: published Figure 5 (planning CT with treated GTVs, follow-up MRI, and the fused follow-up) from Neuro-Oncology Practice, doi:10.1093/nop/npaf126, PMC13161908, CC BY-NC 4.0. The file is the journal's own 1800 × 600 figure from Oxford Academic (same paper, same license), shown unaltered: not upscaled, padded or regenerated. The lightbox opens it at full size.
- `lung-beam-energy`: metadata-free WebP rendering of the original AAPM 2025 6X/10X-FFF poster (SHA-256 `2271818dd3101185da6e6cab7b7a7f951f779b8cba32a75b2b9c8088028f1f63`).
- `amyloid-membranes`: no reproduced figure. The article (Mol Nutr Food Res 2020, doi:10.1002/mnfr.202000632) is under Wiley standard terms, so the study shows a citation card in the published-figure frame, tagged "Publication": title, authors, a "Read the paper" link to the DOI, and a site-authored reading guide (compound, where it is found, what the paper reports) summarising the abstract. It has no lightbox.

The earlier redrawn schematics for the brain follow-up and amyloid studies (`brain-followup-workflow.svg`, `amyloid-membrane-schematic.svg`) were removed; the brain follow-up study uses its published figure and the amyloid study uses the citation card.

No study uses the generic homepage collage or an unrelated institutional page. The automated test hashes every study visual and rejects content duplicates.

## Direct recording placement

- Research index context: `JfKKX6gta-M` (2:50), labelled collaboration overview, and `7JgRKwVRkEo` (12:43), labelled as an earlier related dose-delivery talk.
- `clinical-language-models`: `ITW86kDzaNQ` (3:49).
- `radiosurgery-planning`: `NMcoTPjPJ1g` (5:04).
- `organ-segmentation`: `8IKr1QauMGc` (14:46), `iubpGRBjZN0` (12:24), and `A7_TRUWW6EI` (4:18), each labelled as an earlier project recording rather than a recording of the 2025 paper.
- `lung-beam-energy`: `jlnFADrlgfM` (9:14).

Each applicable recording appears as a compact thumbnail/title/duration/play row on `/research` and as a full card after the study artwork on its detail page. Preview images are local. The YouTube iframe is created only after the visitor activates “Load video,” and each card retains a normal “Watch on YouTube” fallback link.
