import { ArrowUpRight } from '@phosphor-icons/react'

const deskItems = [
  {
    label: 'Public build',
    title: 'VoxelWeave Designer',
    copy: 'An imaging-to-fabrication workspace with explicit prepare, send, and verify stages.',
    href: '/software#software-voxelweave-designer',
  },
  {
    label: 'Preprint',
    title: 'RadKev',
    copy: 'An open evaluation record for radiology-specialized decision models.',
    href: '/research/radkev',
  },
  {
    label: 'Evaluation',
    title: 'MedPhysBench',
    copy: 'Infrastructure for testing AI and agent systems on medical-physics tasks.',
    href: '/software#software-medphysbench',
  },
]

export default function OnMyDesk() {
  return (
    <section className="desk-strip" aria-labelledby="desk-title">
      <div className="wrap">
        <div className="desk-heading">
          <div>
            <h2 id="desk-title">Current projects</h2>
            <p className="desk-date">Public project snapshot, October 24, 2026</p>
          </div>
        </div>
        <div className="desk-items home-reveal">
          {deskItems.map(item => (
            <a href={item.href} key={item.label}>
              <span>{item.label}</span>
              <div><strong>{item.title}</strong><p>{item.copy}</p></div>
              <ArrowUpRight />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
