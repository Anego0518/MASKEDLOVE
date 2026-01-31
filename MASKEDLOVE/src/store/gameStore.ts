import { create } from 'zustand'
import type { Phase, EditParams, EndingType } from '../data/types'

interface GameState {
  phase: Phase
  partnerId: string | null
  playerConditionIds: string[]
  editParams: EditParams
  playerChoiceMatching1: boolean | null
  partnerOkMatching1: boolean | null
  dateLineIndex: number
  dateAffinityKeys: string[]
  playerChoiceMatching2: boolean | null
  partnerOkMatching2: boolean | null
  endingType: EndingType | null
  setPhase: (p: Phase) => void
  setPartner: (id: string | null) => void
  setPlayerConditions: (ids: string[]) => void
  setEditParams: (p: EditParams | Partial<EditParams>) => void
  setMatching1: (player: boolean, partner: boolean) => void
  advanceDate: (nextIndex: number, affinityKey?: string) => void
  setMatching2: (player: boolean, partner: boolean) => void
  setEnding: (t: EndingType) => void
  retry: () => void
  reset: () => void
}

const defaultEditParams: EditParams = {
  beauty: 50,
  contour: 50,
  eyes: 50,
  vibe: 50,
}

const initialState = {
  phase: 'title' as Phase,
  partnerId: null as string | null,
  playerConditionIds: [] as string[],
  editParams: defaultEditParams,
  playerChoiceMatching1: null as boolean | null,
  partnerOkMatching1: null as boolean | null,
  dateLineIndex: 0,
  dateAffinityKeys: [] as string[],
  playerChoiceMatching2: null as boolean | null,
  partnerOkMatching2: null as boolean | null,
  endingType: null as EndingType | null,
}

export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  setPhase: (phase) => set({ phase }),
  setPartner: (partnerId) => set({ partnerId }),
  setPlayerConditions: (playerConditionIds) => set({ playerConditionIds }),
  setEditParams: (p) =>
    set((s) => ({ editParams: { ...s.editParams, ...p } })),
  setMatching1: (playerChoiceMatching1, partnerOkMatching1) =>
    set({ playerChoiceMatching1, partnerOkMatching1 }),
  advanceDate: (nextIndex, affinityKey) =>
    set((s) => ({
      dateLineIndex: nextIndex,
      dateAffinityKeys: affinityKey
        ? [...s.dateAffinityKeys, affinityKey]
        : s.dateAffinityKeys,
    })),
  setMatching2: (playerChoiceMatching2, partnerOkMatching2) =>
    set({ playerChoiceMatching2, partnerOkMatching2 }),
  setEnding: (endingType) => set({ endingType }),
  retry: () =>
    set((s) => ({
      ...initialState,
      phase: 'condition',
      partnerId: s.partnerId ?? null,
    })),
  reset: () => set(initialState),
}))
