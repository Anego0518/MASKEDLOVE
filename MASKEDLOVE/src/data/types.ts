export type Phase =
  | 'title'
  | 'condition'
  | 'edit'
  | 'matching1'
  | 'date'
  | 'matching2'
  | 'ending'

export type EndingType = 'happy' | 'bad'

export interface ConditionTag {
  id: string
  label: string
  category: 'appearance' | 'personality' | 'vibe'
}

export interface EditParams {
  beauty: number      // 美肌 0-100
  contour: number     // 輪郭 0-100
  eyes: number        // 目の大きさ 0-100
  vibe: number        // 雰囲気 0-100
}

export interface Character {
  id: string
  name: string
  age: number
  /** 相手がプレイヤーに求める条件のID */
  desiredConditionIds: string[]
  /** デート台詞・選択肢 */
  dateLines: DateLine[]
  /** 素顔マッチングでOKしやすさの基準（プレイヤーの選択肢との一致度） */
  compatibilityWeights: Record<string, number>
}

export interface DateLine {
  text: string
  choices?: { text: string; nextIndex: number; affinityKey?: string }[]
  nextIndex?: number
}

export interface Ending {
  type: EndingType
  title: string
  text: string
}
