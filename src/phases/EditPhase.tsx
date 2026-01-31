import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import styles from './EditPhase.module.css'

const SLIDERS = [
  { key: 'beauty' as const, label: '美肌' },
  { key: 'contour' as const, label: '輪郭' },
  { key: 'eyes' as const, label: '目の大きさ' },
  { key: 'vibe' as const, label: '雰囲気' },
]

export default function EditPhase() {
  const navigate = useNavigate()
  const editParams = useGameStore((s) => s.editParams)
  const setEditParams = useGameStore((s) => s.setEditParams)

  const change = (key: keyof typeof editParams, value: number) => {
    setEditParams({ [key]: Math.max(0, Math.min(100, value)) })
  }

  const confirm = () => navigate('/matching1')

  return (
    <div className={styles.wrap}>
      <h2 className={styles.h2}>加工フェーズ</h2>
      <p className={styles.lead}>
        相手の希望に合わせて、自分の見た目を調整しよう。
      </p>
      <div className={styles.avatar}>
        <div
          className={styles.avatarInner}
          style={{
            filter: `brightness(${0.85 + (editParams.beauty / 100) * 0.25}) contrast(${0.95 + (editParams.contour / 100) * 0.1}) blur(${0.1 - (editParams.beauty / 100) * 0.08}px)`,
            transform: `scale(${0.95 + (editParams.eyes / 100) * 0.1})`,
          }}
        >
          <span className={styles.avatarPlaceholder}>あなた</span>
        </div>
      </div>
      <div className={styles.sliders}>
        {SLIDERS.map(({ key, label }) => (
          <label key={key} className={styles.sliderRow}>
            <span className={styles.sliderLabel}>{label}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={editParams[key]}
              onChange={(e) => change(key, Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.sliderValue}>{editParams[key]}</span>
          </label>
        ))}
      </div>
      <button type="button" className={styles.nextBtn} onClick={confirm}>
        第1マッチングへ
      </button>
    </div>
  )
}
