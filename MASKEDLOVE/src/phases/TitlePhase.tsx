import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { CHARACTERS } from '../data/characters'
import styles from './TitlePhase.module.css'

export default function TitlePhase() {
  const navigate = useNavigate()
  const setPartner = useGameStore((s) => s.setPartner)
  const setPhase = useGameStore((s) => s.setPhase)

  const start = () => {
    setPartner(CHARACTERS[0].id)
    setPhase('condition')
    navigate('/condition')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.maskIcon}>❤</div>
      <h1 className={styles.title}>
        MASKED <span className={styles.love}>LOVE</span>
      </h1>
      <p className={styles.sub}>
        ［加工］が当たり前の時代、本当の愛はどこにある？
      </p>
      <p className={styles.desc}>
        マッチングアプリで結婚相手を見つけ、Happy END を迎えよう。
      </p>
      <button type="button" className={styles.startBtn} onClick={start}>
        はじめる
      </button>
    </div>
  )
}
