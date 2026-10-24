const deskItems = [
  {
    label: 'Building',
    title: 'VoxelWeave Designer',
    copy: 'A public 2026 imaging-to-fabrication workspace with explicit prepare, send, and verify stages.',
    href: '/software#software-voxelweave-designer',
  },
  {
    label: 'Research',
    title: 'RadKev',
    copy: 'A source-linked preprint story and open evaluation record for radiology-specialized decision models.',
    href: '/research/radkev',
  },
  {
    label: 'Exploring',
    title: 'MedPhysBench',
    copy: 'Open evaluation infrastructure for testing AI and agent systems on medical-physics tasks.',
    href: '/software#software-medphysbench',
  },
]

export default function OnMyDesk() {
  return (
    <section className="desk-strip" aria-labelledby="desk-title">
      <div className="wrap">
        <div className="desk-heading">
          <div>
            <span className="meta">Editorial snapshot · October 24, 2026</span>
            <h2 id="desk-title">On my desk</h2>
          </div>
          <p>A selection of public projects, as of October 2026.</p>
        </div>
        <div className="desk-items home-reveal">
          {deskItems.map(item => (
            <a href={item.href} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
