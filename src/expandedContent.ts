import cvManifest from '../public/downloads/public-cv-manifest.json'
import { imageAssets, type ImageAsset } from './siteContent'

export type Study = {
  slug: string; title: string; subtitle: string; year: string; status: string;
  intro: string; image: ImageAsset; caption: string;
  facts: { value: string; label: string }[];
  sections: { heading: string; paragraphs: string[] }[];
  sources: { label: string; href: string }[];
}
export const cvPath = `/downloads/Udbhav_Ram_Public_CV_October_2026.pdf?v=${cvManifest.pdfSha256.slice(0, 12)}`
export const studies: Study[] = [
  {
    slug: 'adaptive-breast-radiotherapy', title: 'The human side of adaptive radiotherapy.',
    subtitle: 'Characterizing contouring uncertainty across clinical specialties in CBCT-guided online adaptive partial breast irradiation',
    year: 'September 29, 2026', status: 'ASTRO 2026 · Poster 3104 · Boston',
    intro: 'Adaptive radiotherapy adjusts treatment to the anatomy seen on the day. But before a plan can adapt, a person has to decide where the treatment target begins and ends. This work examines how those decisions vary across clinical specialties.',
    image: imageAssets.uabRadonc, caption: 'Radiation-oncology research at UAB · Institutional treatment-planning imagery',
    facts: [{ value: '14', label: 'patients' }, { value: '14', label: 'observers across 4 professions' }, { value: '1–5 mm', label: 'margins evaluated' }],
    sections: [
      { heading: 'The clinical question', paragraphs: ['Partial-breast irradiation focuses treatment on a smaller part of the breast. In an online adaptive workflow, the clinical team reviews the day’s images and contours before adapting the plan. Variation in those contours is therefore a practical uncertainty in the workflow.', 'The project studies contouring uncertainty across clinical specialties using cone-beam computed tomography (CBCT), the imaging used to guide the online adaptation. It connects image interpretation, clinical judgment, and treatment planning rather than treating contours as a purely geometric problem.'] },
      { heading: 'Study design and findings', paragraphs: ['In this retrospective, single-institution study, 14 observers reviewed 14 patients: five radiation oncologists, three physicists, three dosimetrists, and three therapists. Observers edited propagated lumpectomy-cavity contours on treatment fractions 1 and 5.', 'The analysis compared the resulting coverage and treated volume at margins from 1 to 5 mm, using majority-vote physician contours as the reference. Small margins substantially improved overlap; median coverage of the physician-consensus reference approached 100% around 3 mm across groups.', 'The finding is a coverage–volume tradeoff, not a universal margin prescription. Physician consensus is a practical reference rather than known biological ground truth, and the retrospective single-institution design limits generalization.'] },
      { heading: 'Where it fits in my work', paragraphs: ['This project grew from my medical-physics and radiation-oncology research at UAB. It continues a broader thread in my work: evaluating computational tools in the context of the people who have to use them.', 'My related projects compare physician assessments of automatically generated contours, evaluate planning configurations, and explore how clinical information can be carried more clearly from one stage of care to another.'] },
      { heading: 'Latest public record', paragraphs: ['As first author and presenter, I shared this work at the 2026 American Society for Radiation Oncology (ASTRO) Annual Meeting in Boston on September 29, 2026. The official program lists it as poster 3104.', 'The conference presentation is the current public record linked here. A separate full journal article is not listed as published on this page.'] },
    ],
    sources: [{ label: 'ASTRO presentation and abstract', href: 'https://amportal.astro.org/sessions/pqa-05-22824/characterizing-contouring-uncertainty-across-clinical-specialties-in-cbct-guided-online-adapt-112788' }, { label: 'ASTRO presenter profile', href: 'https://amportal.astro.org/udbhav-ram-bs-135368427' }],
  },
  {
    slug: 'clinical-language-models', title: 'Teaching a model the clinic’s language.',
    subtitle: 'Locally hosted language models for radiation-oncology naming quality assurance',
    year: '2025', status: 'AAPM Blue Ribbon Poster',
    intro: 'A treatment-target name is a small piece of text with a large job: it has to preserve clinical intent while fitting a shared naming convention. This project explores where local language models can help, and where a clinician still needs to look closely.',
    image: imageAssets.tg263Poster, caption: 'Original AAPM 2025 research poster · Open the full poster below for readable figures',
    facts: [{ value: '1,000', label: 'clinical names evaluated' }, { value: '<8%', label: 'baseline ruleset compliance' }, { value: '22 sec', label: 'average multi-model correction' }],
    sections: [
      { heading: 'Why naming matters', paragraphs: ['Radiation-oncology teams work with treatment targets and organs that need consistent, interpretable labels. The American Association of Physicists in Medicine (AAPM) Task Group 263 provides a standard nomenclature, but real clinical names can still vary widely.', 'The research question was whether locally hosted large language models could help bring clinical target names into that convention without relying on an external model service.'] },
      { heading: 'The approach', paragraphs: ['The pipeline combined structured prompting, a naming ruleset, and language-model processing. It compared a Qwen3:8B workflow with a Phi4:14B / Qwen3:8B mixture-of-prompting-experts approach. It evaluated 1,000 clinical names and used explicit rule checks to assess whether each output followed the TG-263 naming requirements.', 'Locally hosted models make deployment location an explicit part of the design. This is distinct from demonstrating the privacy, reliability, or readiness of a complete clinical product.'] },
      { heading: 'The result, and the important caveat', paragraphs: ['All evaluated outputs passed the implemented TG-263 ruleset after correction. Reported mean response time decreased from 89 to 22 seconds. The poster also documents examples in which a corrected name changed the author’s intended meaning.', 'Syntactic compliance and semantic correctness are different outcomes. A technically valid name is not necessarily the right clinical name. The result supports a reviewed quality-assurance workflow, with clinical interpretation kept in the loop.'] },
      { heading: 'Sharing the work', paragraphs: ['The study received a Blue Ribbon Poster designation at the AAPM 2025 Annual Meeting. The full poster provides the methods, examples, and limitations behind the summary.'] },
    ],
    sources: [{ label: 'Read the full poster (PDF)', href: 'https://aapm.confex.com/aapm/2025am/mediafile/Handout/Paper20105/AAPM2025_BRP_LLM.pdf' }, { label: 'AAPM presentation record', href: 'https://aapm.confex.com/aapm/2025am/meetingapp.cgi/Paper/20105' }],
  },
  {
    slug: 'radiosurgery-planning', title: 'A closer look at the treatment plan.',
    subtitle: 'Dosimetric evaluation of Ethos 2.0 high-fidelity mode for single-isocenter SRS',
    year: '2025', status: 'First-author journal article · JACMP',
    intro: 'For people with multiple brain metastases, a radiation plan needs to cover the targets while limiting dose outside them. This study asks how high-fidelity planning and control rings change that balance on Ethos 2.0.',
    image: imageAssets.uabPresentation, caption: 'Presenting clinical-AI research at UAB · UAB Heersink School of Medicine',
    facts: [{ value: '45', label: 'patients studied' }, { value: '4', label: 'planning configurations' }, { value: '15 / 30', label: 'tuning / validation split' }],
    sections: [
      { heading: 'The planning question', paragraphs: ['Stereotactic radiosurgery (SRS) delivers focused radiation to small targets. A single-isocenter approach treats multiple metastases around one common planning center, making the dose distribution around each target especially important.', 'This study compared four Ethos planning configurations to separate the effects of high-fidelity mode and control rings, rather than treating a planning system as a single fixed intervention.'] },
      { heading: 'Study design', paragraphs: ['The study included 45 patients: 15 used for tuning and 30 for validation. Plans were evaluated for target conformity, dose falloff, normal-tissue exposure, and complexity.', 'Plans were generated in a non-clinical emulator with 30 Gy delivered in five fractions and a 2 mm planning-target-volume margin. Using a separate validation group tested the configuration beyond the tuning cases.', 'I co-designed the study, tuned and evaluated the templates, assembled the results, and wrote the manuscript, as documented in the published author-contributions statement.'] },
      { heading: 'What changed', paragraphs: ['High-fidelity mode combined with control rings improved conformity and dose falloff, reduced normal-tissue dose, and lowered plan complexity in this evaluation.', 'The finding is about treatment-plan configuration and dosimetric performance. It does not establish improved survival, reduced clinical toxicity, or the outcome of a clinical trial.', 'Only the high-fidelity-plus-rings template was tuned before the other variants were created. That creates possible template-calibration bias: the comparison does not establish the best achievable performance of independently optimized alternatives.'] },
      { heading: 'Publication and presentations', paragraphs: ['The final peer-reviewed article appeared in the Journal of Applied Clinical Medical Physics in 2025. Earlier conference presentations used a longer project title; the title here matches the published paper.'] },
    ],
    sources: [{ label: 'Read the published article', href: 'https://aapm.onlinelibrary.wiley.com/doi/10.1002/acm2.70370' }, { label: 'PubMed record', href: 'https://pubmed.ncbi.nlm.nih.gov/41272935/' }],
  },
  {
    slug: 'organ-segmentation', title: 'A contour has to work for a person.',
    subtitle: 'Quantitative performance and expert review of deep-learning frameworks for abdominal-organ segmentation',
    year: '2025', status: 'First-author journal article · Intelligent Oncology',
    intro: 'Good overlap scores are useful, but they do not tell the whole story of an automatically drawn organ. This head-to-head study pairs quantitative evaluation with blinded physician review.',
    image: imageAssets.heroCollage, caption: 'Medical-imaging research · CT, MR, code, and radiation-dose visualizations',
    facts: [{ value: '122', label: 'training CT images' }, { value: '72', label: 'holdout CT images' }, { value: '3 × 30', label: 'physicians × reviewed cases' }],
    sections: [
      { heading: 'Comparing approaches fairly', paragraphs: ['The project compared nnU-Net, MONAI Auto3DSeg, and SwinUNETR on a shared abdominal computed-tomography (CT) segmentation task. The two automated machine-learning (AutoML) frameworks and the transformer-based model were evaluated on the same data.', 'Automating organ segmentation can reduce repetitive work, but a useful comparison needs to address both the geometry of an output and its acceptability to a clinical reader.'] },
      { heading: 'Beyond a single score', paragraphs: ['The study used 122 training images and 72 holdout images. Three physicians performed a blinded review of 30 cases, complementing the quantitative analysis.', 'That second layer matters because an aggregate metric can hide differences that become obvious when a physician inspects a contour in context.'] },
      { heading: 'What the comparison found', paragraphs: ['Both AutoML frameworks outperformed SwinUNETR in the reported evaluation. Average Dice scores were 0.924 for nnU-Net, 0.902 for Auto3DSeg, and 0.837 for SwinUNETR. Dice measures spatial overlap; the evaluation also used surface Dice and the 95th-percentile Hausdorff distance.', 'Physicians preferred nnU-Net over MONAI Auto3DSeg. That expert-review result adds a different kind of evidence to the geometric measurements.', 'These findings describe the evaluated dataset, implementations, and review protocol. They should not be read as a universal ranking for every anatomy, acquisition protocol, or clinical setting.'] },
      { heading: 'Publication', paragraphs: ['The first-author article was published in Intelligent Oncology in 2025, volume 1, issue 2, pages 160–171. A free full-text version is available through PubMed Central.'] },
    ],
    sources: [{ label: 'Read the free full text', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12462693/' }, { label: 'Publisher record', href: 'https://www.sciencedirect.com/science/article/pii/S2950261625000238' }],
  },
  {
    slug: 'brain-metastases-follow-up', title: 'Keeping the treatment history in view.',
    subtitle: 'Fusing pre-radiotherapy brain-metastasis contours with follow-up MRI',
    year: '2026 issue · Online 2025', status: 'Co-authored journal article · Neuro-Oncology Practice',
    intro: 'Follow-up imaging asks clinicians to understand what has changed since treatment. This project brings earlier treatment contours into the follow-up magnetic-resonance image so that history is easier to review.',
    image: imageAssets.heroCollage, caption: 'Imaging and radiation-oncology research · Illustrative research imagery',
    facts: [{ value: '40', label: 'patients in the study' }, { value: '7.97 min', label: 'average review time before' }, { value: '3.95 min', label: 'average review time with framework' }],
    sections: [
      { heading: 'The information gap', paragraphs: ['After radiotherapy, a follow-up magnetic resonance imaging (MRI) examination needs to be interpreted in light of what was previously treated. Treatment contours and current images can be separate pieces of the clinical record.', 'The co-authored framework brings pre-radiotherapy brain-metastasis contours into follow-up MRI to support that assessment.'] },
      { heading: 'Evaluation in a review workflow', paragraphs: ['The framework registered planning CT to follow-up MRI, propagated treated-lesion contours, and exported DICOM data compatible with a picture archiving and communication system (PACS). The study involved 40 patients, divided between geometric and physician-review studies, and evaluated review with the fused information. Average review time decreased from 7.97 to 3.95 minutes in the reported comparison.', 'The paper also examines agreement between physicians. Inter-physician agreement is a measure of consistency among readers, not a direct measurement of diagnostic accuracy against ground truth.'] },
      { heading: 'What the evidence supports', paragraphs: ['This was a retrospective single-centre evaluation. Anatomical change and image quality can affect registration. The result points to the value of presenting prior treatment information clearly during follow-up review. It is a workflow study, and the reported review-time change should be interpreted within that study’s setting and design.', 'The article was published online in December 2025 and appears in the June 2026 issue of Neuro-Oncology Practice.'] },
    ],
    sources: [{ label: 'Read the published article', href: 'https://academic.oup.com/nop/article/13/3/497/8382617' }],
  },
{
  "slug": "lung-beam-energy",
  "title": "Choosing a beam means choosing a tradeoff.",
  "subtitle": "Dosimetry and delivery efficiency of 6X-FFF versus 10X-FFF for lung SBRT",
  "year": "2025",
  "status": "First-author AAPM poster",
  "intro": "Beam energy affects more than delivery speed. This planning-and-phantom study asks how the choice between two flattening-filter-free photon beams changes lung-treatment dosimetry and efficiency.",
  "caption": "Radiation-oncology planning research · Institutional treatment-planning imagery",
  "facts": [
    {
      "value": "2",
      "label": "beam energies compared"
    },
    {
      "value": "72.3 sec",
      "label": "mean delivery time, 6X-FFF"
    },
    {
      "value": "43.1 sec",
      "label": "mean delivery time, 10X-FFF"
    }
  ],
  "sections": [
    {
      "heading": "The question",
      "paragraphs": [
        "Stereotactic body radiotherapy (SBRT) delivers highly focused treatment outside the brain. For lung targets, the surrounding anatomy and the target’s location can influence which beam characteristics are useful.",
        "This work compared 6X-FFF and 10X-FFF beams, two flattening-filter-free photon-beam options, in Eclipse treatment planning and delivery measurements."
      ]
    },
    {
      "heading": "From plan to phantom",
      "paragraphs": [
        "The evaluation included a custom heterogeneous lung phantom made from cork and acrylic. A phantom allows a physical measurement to complement the computer-generated dose plan.",
        "The work was presented as a first-author AAPM 2025 poster with Carlos E. Cardenas and Marcin Wierzbicki."
      ]
    },
    {
      "heading": "What the comparison showed",
      "paragraphs": [
        "The reported central-tumour organ-at-risk sparing favored 6X-FFF. Peripheral skin-dose and delivery-time measures favored 10X-FFF; mean delivery times were 72.3 and 43.1 seconds, respectively.",
        "These are configuration-dependent planning and phantom findings. They do not establish one universally preferable beam energy or demonstrate a patient-outcome benefit."
      ]
    }
  ],
  "sources": [
    {
      "label": "Read the AAPM poster (PDF)",
      "href": "https://aapm.confex.com/aapm/2025am/mediafile/Handout/Paper20068/AAPM2025_eposter_6X10X.pdf"
    }
  ],
  "image": imageAssets.uabRadonc
},
{
  "slug": "amyloid-membranes",
  "title": "An early question about membranes.",
  "subtitle": "Dietary compounds and amyloid aggregation in synthetic brain membranes",
  "year": "2020",
  "status": "Co-authored journal article · Molecular Nutrition & Food Research",
  "intro": "Before the clinical-AI projects, biophysics offered a way to study complex biological questions through a controlled model system. This paper investigates interactions between selected compounds, synthetic membranes, and amyloid aggregates.",
  "caption": "A research thread spanning biophysics and medical imaging · Illustrative research imagery",
  "facts": [
    {
      "value": "4",
      "label": "compounds studied"
    },
    {
      "value": "2020",
      "label": "publication year"
    },
    {
      "value": "Co-author",
      "label": "contribution"
    }
  ],
  "sections": [
    {
      "heading": "A model system for a molecular question",
      "paragraphs": [
        "The study investigated resveratrol, caffeine, beta-carotene, and epigallocatechin gallate (EGCG) in synthetic brain membranes with amyloid-β25–35.",
        "Different compounds affected membrane properties and aggregation in different ways. The work explored a membrane-mediated mechanism in a biophysical model system."
      ]
    },
    {
      "heading": "Scope of the evidence",
      "paragraphs": [
        "Synthetic membranes make it possible to isolate aspects of a complex biological process. They are not a substitute for the physiology of a person.",
        "This is not a clinical trial, and the paper does not establish that these compounds prevent or treat Alzheimer’s disease."
      ]
    },
    {
      "heading": "The published record",
      "paragraphs": [
        "The article by Isabella P. Gastaldo, Sebastian Himbert, Udbhav Ram, and Maikel C. Rheinstädter was first published on September 27, 2020, in Molecular Nutrition & Food Research, volume 64, issue 22, article e2000632."
      ]
    }
  ],
  "sources": [
    {
      "label": "Read the publication",
      "href": "https://doi.org/10.1002/mnfr.202000632"
    },
    {
      "label": "PubMed record",
      "href": "https://pubmed.ncbi.nlm.nih.gov/32981185/"
    }
  ],
  "image": imageAssets.heroCollage
}
]

export const careerTimeline = [
  { date: '2026–present', title: 'Doctoral research at UW–Madison', place: 'Department of Medical Physics · Dr. Ran Zhang', text: 'Medical Physics PhD student working at the intersection of AI, medical imaging, segmentation, vision-language models, and radiation treatment planning.', source: 'https://medphysics.wisc.edu/graduate-program/meet-our-students/' },
  { date: '2026', title: 'McMaster graduation & co-op recognition', place: 'Honours Medical Physics with Co-op', text: 'Completed the undergraduate chapter at McMaster and received the Science Co-op Student of the Year award for Year 5. Institutional coverage also describes the UAB–McMaster ambassadorship and mentorship work.', source: 'https://science.mcmaster.ca/convocation-countdown-with-udbhav-ram/' },
  { date: '2024–2025', title: 'International visiting-scholar experience', place: 'UAB Department of Radiation Oncology', text: 'Visiting-scholar research built on an earlier remote collaboration with Dr. Carlos Cardenas. Work connected clinical AI, treatment planning, physician review, and student opportunities between UAB and McMaster.', source: 'https://www.uab.edu/medicine/news/latest-news/mcmaster-student-and-mentor' },
  { date: '2023', title: 'Race strategy & data engineering', place: 'Arrow McLaren IndyCar · Indianapolis', text: 'Developed deterministic strategy-prediction simulation and worked with race-weekend telemetry, performance tools, and race-engineering projects during a data-and-strategy internship.', source: 'https://www.linkedin.com/posts/udbhav-ram-engineering-and-medicine_mclaren-indycar-datascience-activity-7099432415638548481-wRsm' },
  { date: '2021–2026', title: 'Medical physics at McMaster', place: 'McMaster University', text: 'Honours Medical Physics with Co-op, alongside research, software engineering, Formula SAE, outreach, and teaching. Research collaboration with UAB began in 2021.', source: 'https://news.mcmaster.ca/udbhav-ram-mcmaster-uab-international-visiting-scholar/' },
  { date: '2020', title: 'An early biophysics publication', place: 'Molecular Nutrition & Food Research', text: 'Co-authored work on the effects of resveratrol, caffeine, beta-carotene, and EGCG on amyloid aggregation in synthetic brain membranes.', source: 'https://pubmed.ncbi.nlm.nih.gov/32981185/' },
]
