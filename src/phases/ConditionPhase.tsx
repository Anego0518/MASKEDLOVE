import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { CONDITION_TAGS } from '../data/conditions'
import { CHARACTERS } from '../data/characters'
import styles from './ConditionPhase.module.css'

export default function ConditionPhase() {
  const navigate = useNavigate()
  const partnerId = useGameStore((s) => s.partnerId)
  const setPlayerConditions = useGameStore((s) => s.setPlayerConditions)
  const [selected, setSelected] = useState<string[]>([])

  const partner = CHARACTERS.find((c) => c.id === partnerId)
  const partnerDesired = CONDITION_TAGS.filter((t) =>
    partner?.desiredConditionIds.includes(t.id)
  )

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const confirm = () => {
    setPlayerConditions(selected)
    navigate('/edit')
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.h2}>条件設定</h2>
      <p className={styles.lead}>相手に求める条件を選んでね（複数可）</p>
      <div className={styles.tagList}>
        {CONDITION_TAGS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tag} ${selected.includes(t.id) ? styles.selected : ''}`}
            onClick={() => toggle(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <section className={styles.partnerSection}>
        <h3 className={styles.h3}>相手があなたに求める条件</h3>
        <div className={styles.partnerTags}>
          {partnerDesired.map((t) => (
            <span key={t.id} className={styles.partnerTag}>
              {t.label}
            </span>
          ))}
        </div>
      </section>
      <button
        type="button"
        className={styles.nextBtn}
        onClick={confirm}
      >
        加工フェーズへ
      </button>
    </div>
  )
}
