import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { CHARACTERS } from '../data/characters'
import { computePartnerOkMatching1 } from '../utils/matching'
import styles from './MatchingPhase.module.css'

export default function Matching1Phase() {
  const navigate = useNavigate()
  const partnerId = useGameStore((s) => s.partnerId)
  const playerConditionIds = useGameStore((s) => s.playerConditionIds)
  const editParams = useGameStore((s) => s.editParams)
  const setMatching1 = useGameStore((s) => s.setMatching1)
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
    const partnerOk = computePartnerOkMatching1(partnerId!, playerConditionIds, editParams)
    setMatching1(ok, partnerOk)
    if (ok && partnerOk) setResult('matched')
    else setResult('rejected')
  }

  const goNext = () => {
    if (result === 'matched') navigate('/date')
    else navigate('/condition')
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.h2}>第1マッチング（加工写真）</h2>
      <p className={styles.lead}>相手の写真をチェックして、OK か NG を選んでね。</p>
      <div className={styles.card}>
        <div className={styles.cardAvatar}>
          <span className={styles.avatarText}>{partner.name}, {partner.age}</span>
        </div>
        <p className={styles.cardDesc}>
          相手の加工されたプロフィール写真です。
        </p>
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
              <p className={styles.matched}>マッチ！ デートに進もう。</p>
            )}
            {result === 'rejected' && (
              <p className={styles.rejected}>
                {playerChoice ? 'あなたはOK、でも相手はNGだった…' : 'あなたはNGを選んだ。'}
                条件を変えてやり直そう。
              </p>
            )}
            <button type="button" className={styles.nextBtn} onClick={goNext}>
              {result === 'matched' ? 'デートへ' : '条件設定に戻る'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
