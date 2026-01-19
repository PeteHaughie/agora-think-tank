import { useEffect, useState } from "react";
import styles from "./TeamListClient.module.css";

function isEmailLike(s) {
  if (!s) return false;
  if (s.startsWith("mailto:")) return true;
  // simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function normalizeHref(s) {
  if (!s) return "#";
  if (s.startsWith("mailto:") || s.startsWith("http") || s.startsWith("/"))
    return s;
  if (isEmailLike(s)) return `mailto:${s}`;
  return s.startsWith("www.") ? `https://${s}` : s;
}

export default function TeamListClient() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const el = document.getElementById("team-data");
    if (!el) return;
    try {
      const parsed = JSON.parse(el.textContent || "{}");
      // Defer state update to avoid synchronous setState inside effect
      setTimeout(() => setTeam(parsed.team || []), 0);
    } catch (err) {
      console.error("Error parsing team data:", err);
    }
  }, []);

  if (!team || team.length === 0) return <div>Loading...</div>;

  return (
    <ul className={styles.list}>
      {team.map((m) => {
        const href = normalizeHref(m.link);
        const email = href.startsWith("mailto:");
        const isLinkedIn = !email && /(^|https?:\/\/)?(www\.)?linkedin\.com/i.test(href);

        // choose class: linkedin > email > link
        const linkClass = isLinkedIn ? styles.linkedin : email ? styles.email : styles.link;

        return (
          <li key={m.id} className={styles.item}>
            <img
              className={styles.avatar}
              src={m.image}
              alt={m.name}
              style={{ ['--avatar-pos']: m.focal || undefined }}
            />
            <div className={styles.meta}>
              <h2 className={styles.name}>{m.name}</h2>
              <p className={styles.role}>{m.role}</p>
              <a
                className={linkClass}
                href={href}
                aria-label={
                  email ? `Email ${m.name}` : `Open ${m.name}'s profile`
                }
                {...(!email
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >{email ? "Mail" : isLinkedIn ? "LinkedIn" : "Link"}</a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
