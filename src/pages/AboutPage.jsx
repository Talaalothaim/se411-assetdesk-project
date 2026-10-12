import PageHeader from '../components/PageHeader.jsx'
import team from '../data/team.js'

const FACTS = [
  ['Course', 'SE411 – Course Project'],
  ['University', 'Prince Sultan University'],
  ['Built with', 'React · Spring Boot'],
]

export default function AboutPage() {
  return (
    <section className="screen">
      <PageHeader eyebrow="SE411 · Fall 2026–27" title="About the team" />

      <p className="lede">
        AssetDesk helps a company keep track of its IT equipment: laptops, monitors, desktops and
        accessories. You can see who each device is assigned to, its condition, and whether it is
        available.
      </p>

      <div className="card clip">
        <div className="scroll">
          <table className="compact">
            <caption className="sr-only">Team members</caption>
            <thead>
              <tr>
                <th scope="col" style={{ width: 48 }}>#</th>
                <th scope="col">Name</th>
                <th scope="col">Student ID</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member, i) => (
                <tr key={member.studentId}>
                  <td className="id">{i + 1}</td>
                  <td>{member.name}</td>
                  <td className="serial">{member.studentId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="facts">
        {FACTS.map(([label, value]) => (
          <div className="card" key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
    </section>
  )
}
