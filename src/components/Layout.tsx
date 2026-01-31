import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isTitle = location.pathname === '/'

  return (
    <div className={styles.layout}>
      {!isTitle && (
        <header className={styles.header}>
          <button
            type="button"
            className={styles.logo}
            onClick={() => navigate('/')}
            aria-label="タイトルへ"
          >
            MASKED <span className={styles.logoLove}>LOVE</span>
          </button>
        </header>
      )}
      <main className={styles.main}>{children}</main>
    </div>
  )
}
