import type { EditParams } from '../data/types'
import { CHARACTERS } from '../data/characters'

/** 相手の希望条件とプレイヤーの選択・加工の一致度で第1マッチングの相手OKを判定（簡易） */
export function computePartnerOkMatching1(
  partnerId: string,
  playerConditionIds: string[],
  editParams: EditParams
): boolean {
  const char = CHARACTERS.find((c) => c.id === partnerId)
  if (!char) return false
  const matchCount = char.desiredConditionIds.filter((id) =>
    playerConditionIds.includes(id)
  ).length
  const conditionScore = matchCount / Math.max(1, char.desiredConditionIds.length)
  const editScore =
    (editParams.beauty + editParams.contour + editParams.eyes + editParams.vibe) /
    400
  const total = conditionScore * 0.5 + editScore * 0.5
  return Math.random() < total + 0.2
}

/** デートの相性を加味して第2マッチングの相手OKを判定 */
export function computePartnerOkMatching2(
  partnerId: string,
  dateAffinityKeys: string[]
): boolean {
  const char = CHARACTERS.find((c) => c.id === partnerId)
  if (!char) return false
  let affinity = 0.5
  for (const key of dateAffinityKeys) {
    const w = char.compatibilityWeights[key]
    if (w) affinity += (w - 1) * 0.15
  }
  return Math.random() < Math.min(0.95, Math.max(0.1, affinity))
}
