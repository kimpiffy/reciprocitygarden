import { PLANTS } from '../config/plants'
import type { GardenState } from '../types'
import { initialState } from './garden'

const KEY = 'reciprocity-garden-progress-v1'

/** Reads saved progress, falling back to a fresh garden if anything looks wrong. */
export function loadState(): GardenState {
  const fresh = initialState()
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (!raw || raw.version !== 1 || typeof raw.plants !== 'object' || raw.plants === null) return fresh
    const plants = { ...fresh.plants }
    for (const p of PLANTS) {
      const s = raw.plants[p.id]
      if (!s) continue
      const stepsDone = Math.max(0, Math.min(p.care.length + 1, Math.floor(Number(s.stepsDone) || 0)))
      const planted = Boolean(s.planted)
      const watered = planted && Boolean(s.watered)
      plants[p.id] = {
        planted,
        watered,
        stepsDone: watered ? stepsDone : 0,
        harvested: watered && stepsDone === p.care.length + 1 && Boolean(s.harvested),
      }
    }
    return { version: 1, started: Boolean(raw.started), plants }
  } catch {
    return fresh
  }
}

export function saveState(state: GardenState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage unavailable (private mode etc.) – the garden still works */
  }
}
