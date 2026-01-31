import type { Ending } from './types'

export const ENDINGS: Record<string, Ending> = {
  happy: {
    type: 'happy',
    title: 'HAPPY END',
    text: 'お互いの素顔を認め合い、二人は結婚した。\nMASKの向こうに、本当の愛があった。',
  },
  bad: {
    type: 'bad',
    title: 'BAD END',
    text: '残念ながら、今回はマッチしなかった。\n別の相手を探すか、もう一度挑戦してみよう。',
  },
}
