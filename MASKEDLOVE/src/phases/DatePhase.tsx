import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { CHARACTERS } from '../data/characters'
import styles from './DatePhase.module.css'

export default function DatePhase() {
  const navigate = useNavigate()
  const partnerId = useGameStore((s) => s.partnerId)
  const dateLineIndex = useGameStore((s) => s.dateLineIndex)
  const advanceDate = useGameStore((s) => s.advanceDate)

  const partner = CHARACTERS.find((c) => c.id === partnerId)
  if (!partner) {
    navigate('/')
    return null
  }

  const lines = partner.dateLines
  const current = lines[dateLineIndex]
  const isLastLine = current && current.nextIndex === -1

  const handleChoice = (nextIndex: number, affinityKey?: string) => {
    advanceDate(nextIndex, affinityKey)
  }

  const goToMatching2 = () => navigate('/matching2')

  return (
    <div className={styles.wrap}>
      <h2 className={styles.h2}>デート（アンヴェール）</h2>
      <p className={styles.lead}>素顔で会って、会話しよう。</p>
      <div className={styles.partnerFace}>
        <span className={styles.faceLabel}>{partner.name}（素顔）</span>
      </div>
      <div className={styles.dialogue}>
        {current && (
          <>
            <p className={styles.text}>{current.text}</p>
            {current.choices && current.choices.length > 0 ? (
              <div className={styles.choices}>
                {current.choices.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    className={styles.choiceBtn}
                    onClick={() => handleChoice(c.nextIndex, c.affinityKey)}
                  >
                    {c.text}
                  </button>
                ))}
              </div>
            ) : current.nextIndex !== undefined && current.nextIndex >= 0 ? (
              <button
                type="button"
                className={styles.nextLineBtn}
                onClick={() => handleChoice(current.nextIndex!)}
              >
                次へ
              </button>
            ) : isLastLine ? (
              <button type="button" className={styles.nextBtn} onClick={goToMatching2}>
                第2マッチングへ
              </button>
            ) : null}
          </>
        )}
        {!current && (
          <>
            <p className={styles.text}>デートが終わった。第2マッチングで決めよう。</p>
            <button type="button" className={styles.nextBtn} onClick={goToMatching2}>
              第2マッチングへ
            </button>
          </>
        )}
      </div>
    </div>
  )
}
