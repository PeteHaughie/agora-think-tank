import { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      try { localStorage.setItem('theme', theme) } catch (e) { void e }
    }
  }, [theme])

  return (
    <div className={styles.toggle}>
      <label className={styles.switch}>
        <input
          aria-label="Toggle dark mode"
          type="checkbox"
          checked={theme === 'dark'}
          onChange={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        />
        <span className={styles.slider} />
      </label>
    </div>
  )
}
