import type { Character } from './types'

export const CHARACTERS: Character[] = [
  {
    id: 'anna',
    name: 'アンナ',
    age: 28,
    desiredConditionIds: ['cute', 'gentle', 'warm'],
    dateLines: [
      { text: '初めまして。写真より…いい意味で緊張してる。', nextIndex: 1 },
      {
        text: 'どんな人に惹かれる？',
        choices: [
          { text: '笑顔が素敵な人', nextIndex: 2, affinityKey: 'smile' },
          { text: '話を聞いてくれる人', nextIndex: 2, affinityKey: 'listen' },
          { text: '一緒にいて楽な人', nextIndex: 2, affinityKey: 'easy' },
        ],
      },
      { text: 'そうだね、それ大事だよね。私もそう思う。', nextIndex: 3 },
      { text: '今日は会えてよかった。また話そう。', nextIndex: -1 },
    ],
    compatibilityWeights: { smile: 1, listen: 1.2, easy: 0.8 },
  },
]
