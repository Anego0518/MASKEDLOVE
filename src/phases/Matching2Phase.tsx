import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { CHARACTERS } from '../data/characters'
import { computePartnerOkMatching2 } from '../utils/matching'
import { ENDINGS } from '../data/endings'
import styles from './MatchingPhase.module.css'

export default function Matching2Phase() {
  const navigate = useNavigate()
  const partnerId = useGameStore((s) => s.partnerId)
  const dateAffinityKeys = useGameStore((s) => s.dateAffinityKeys)
  const setMatching2 = useGameStore((s) => s.setMatching2)
  const setEnding = useGameStore((s) => s.setEnding)
  const [playerChoice, setPlayerChoice] = useState<boolean | null>(null)
  const [result, setResult] = useState<'pending' | 'matched' | 'rejected'>('pending')

  const partner = CHARACTERS.find((c) => c.id === partnerId)
  if (!partner) {
    navigate('/')
    return null
  }

  const decide = (ok: boolean) => {
    if (playerChoice !== null) return
    setPlayerChoice(ok)
    const partnerOk = computePartnerOkMatching2(partnerId!, dateAffinityKeys)
    setMatching2(ok, partnerOk)
    if (ok && partnerOk) {
      setResult('matched')
      setEnding('happy')
    } else {
      setResult('rejected')
      setEnding('bad')
    }
  }

  const goNext = () => navigate('/ending')

  return (
    <div className={styles.wrap}>
      <h2 className={styles.h2}>第2マッチング（素顔）</h2>
      <p className={styles.lead}>
        素顔を知った上で、もう一度 OK / NG を選んでね。
      </p>
      <div className={styles.card}>
        <div className={styles.cardAvatar}>
          <span className={styles.avatarText}>{partner.name}, {partner.age}</span>
        </div>
        <p className={styles.cardDesc}>相手の素顔です。</p>
        {playerChoice === null ? (
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.ngBtn}
              onClick={() => decide(false)}
            >
              ✕ NG
            </button>
            <button
              type="button"
              className={styles.okBtn}
              onClick={() => decide(true)}
            >
              ♡ OK
            </button>
          </div>
        ) : (
          <div className={styles.result}>
            {result === 'matched' && (
              <p className={styles.matched}>
                {ENDINGS.happy.title} へ！ 結婚だ。
              </p>
            )}
            {result === 'rejected' && (
              <p className={styles.rejected}>
                {playerChoice
                  ? 'あなたはOK、でも相手はNGだった…'
                  : 'あなたはNGを選んだ。'}
                残念、BAD END。
              </p>
            )}
            <button type="button" className={styles.nextBtn} onClick={goNext}>
              エンディングへ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
