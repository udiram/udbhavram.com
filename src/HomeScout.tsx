import ScoutShot from './ScoutShot'

export default function HomeScout() {
  return (
    <section className="home-scout section" id="home-scout" aria-labelledby="home-scout-title" tabIndex={-1}>
      <div className="wrap">
        <div className="home-scout-layout">
          <div className="home-scout-copy">
            <span className="ct-eyebrow">Zhang Lab</span>
            <h2 id="home-scout-title">Scout</h2>
            <p>Scout sits inside Lattice, the Zhang Lab's operating app. It is a private chat for UW Health radiology staff. Ask a plain question about the department's thousands of CT orders, such as "who orders the thoracic outlet protocol?", and Scout answers with a table or chart, says exactly what it counted, and lets you open example exams.</p>
            <p>It also searches published papers and the department's CT protocol wiki. Papers, PDFs and wiki pages open in a reader beside the chat, at the sentence the answer used. Scout can compare studies in an evidence table, show how one protocol differs between scanners, draw study cohort flow diagrams, build a Table 1, and make slides.</p>
            <p>Two checks run behind it: every figure is checked against what Scout looked up, and a second independent count checks the main number. Scout runs on the lab's own computer and AI model inside the hospital network, not the public internet. Only paper search terms and paper IDs go out.</p>
            <a className="text-link" href="/software#software-scout"><span>More about Scout</span> <span aria-hidden="true">→</span></a>
          </div>
          <ScoutShot scene="hero" className="home-reveal" />
        </div>
        <div className="home-scout-supporting">
          <ScoutShot scene="reader-paper" className="home-reveal" />
          <ScoutShot scene="evidence" className="home-reveal" />
        </div>
      </div>
    </section>
  )
}
