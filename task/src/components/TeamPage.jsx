import teamData from '../assets/Agora_web_developer_team_data.json'
import TeamListClient from './TeamListClient'
import styles from './TeamPage.module.css'

export default function TeamPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>The Team</h1>
      {/* Data island: serialized JSON for client-side hydration */}
      <script
        id="team-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamData) }}
      />

      <div id="team-list-root">
        <TeamListClient />
      </div>
    </main>
  )
}
