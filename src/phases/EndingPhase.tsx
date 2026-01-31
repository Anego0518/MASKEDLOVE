import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { ENDINGS } from '../data/endings'
import styles from './EndingPhase.module.css'

export default function EndingPhase() {
  const navigate = useNavigate()
  const endingType = useGameStore((s) => s.endingType)
  const retry = useGameStore((s) => s.retry)
  const reset = useGameStore((s) => s.reset)

  const ending = endingType ? ENDINGS[endingType] : ENDINGS.bad
  const isHappy = ending?.type === 'happy'

  const handleRetry = () => {
    retry()
    navigate('/condition')
  }

  const handleTitle = () => {
    reset()
    navigate('/')
  }

  return (
    <div className={styles.wrap}>
      <h2 className={isHappy ? styles.titleHappy : styles.titleBad}>
        {ending?.title ?? 'BAD END'}
      </h2>
      <div className={styles.textWrap}>
        <p className={styles.text}>
          {ending?.text?.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>
      <div className={styles.actions}>
        {!isHappy && (
          <button type="button" className={styles.retryBtn} onClick={handleRetry}>
            RETRY（条件設定から）
          </button>
        )}
        <button type="button" className={styles.titleBtn} onClick={handleTitle}>
          タイトルへ
        </button>
      </div>
    </div>
  )
}
