import { PLANTS } from '../config/plants'
import type { CareAction, GardenState, PlantConfig, PlantProgress } from '../types'

export const READY_STAGE = 5

export type CurrentStep = { kind: 'care'; action: CareAction } | { kind: 'challenge' }

export type Phase = 'planting' | 'watering' | 'growing' | 'harvesting' | 'complete'

export type Action =
  | { type: 'start' }
  | { type: 'plant'; id: string }
  | { type: 'water'; id: string }
  | { type: 'completeStep'; id: string; step: CurrentStep }
  | { type: 'harvest'; id: string }
  | { type: 'reset' }

const emptyProgress = (): PlantProgress => ({ planted: false, watered: false, stepsDone: 0, harvested: false })

export function initialState(plants: PlantConfig[] = PLANTS): GardenState {
  return {
    version: 1,
    started: false,
    plants: Object.fromEntries(plants.map((p) => [p.id, emptyProgress()])),
  }
}

/** Care steps plus the final challenge. */
export const totalSteps = (p: PlantConfig) => p.care.length + 1

/** Challenge complete and fully grown: the harvest can be collected. */
export const isReady = (p: PlantConfig, g: PlantProgress) => g.watered && g.stepsDone >= totalSteps(p)

/**
 * Which growth illustration to show: -1 = nothing planted, 0 = seed,
 * 1–4 = sprout…mature (spread across the steps), 5 = ready to harvest.
 */
export function stageFor(p: PlantConfig, g: PlantProgress): number {
  if (!g.planted) return -1
  if (!g.watered) return 0
  const total = totalSteps(p)
  if (g.stepsDone >= total) return READY_STAGE
  return Math.min(READY_STAGE - 1, 1 + Math.ceil((g.stepsDone * 3) / total))
}

/** The next thing this plant needs, or null if it needs nothing (yet / any more). */
export function currentStep(p: PlantConfig, g: PlantProgress): CurrentStep | null {
  if (!g.planted || !g.watered) return null
  if (g.stepsDone < p.care.length) return { kind: 'care', action: p.care[g.stepsDone] }
  if (g.stepsDone === p.care.length) return { kind: 'challenge' }
  return null
}

export function phaseOf(state: GardenState, plants: PlantConfig[] = PLANTS): Phase {
  const all = plants.map((p) => state.plants[p.id])
  if (all.some((g) => !g.planted)) return 'planting'
  if (all.some((g) => !g.watered)) return 'watering'
  if (all.every((g) => g.harvested)) return 'complete'
  if (all.some((g, i) => isReady(plants[i], g) && !g.harvested)) return 'harvesting'
  return 'growing'
}

export function gardenReducer(state: GardenState, action: Action): GardenState {
  if (action.type === 'start') return { ...state, started: true }
  if (action.type === 'reset') return initialState()

  const plant = PLANTS.find((p) => p.id === action.id)
  const progress = state.plants[action.id]
  if (!plant || !progress) return state

  let next: PlantProgress = progress
  switch (action.type) {
    case 'plant':
      if (!progress.planted) next = { ...progress, planted: true }
      break
    case 'water':
      if (progress.planted && !progress.watered) next = { ...progress, watered: true }
      break
    case 'completeStep': {
      const step = currentStep(plant, progress)
      const matches =
        step && step.kind === action.step.kind &&
        (step.kind === 'challenge' || (action.step.kind === 'care' && step.action === action.step.action))
      if (matches) next = { ...progress, stepsDone: progress.stepsDone + 1 }
      break
    }
    case 'harvest':
      if (isReady(plant, progress) && !progress.harvested) next = { ...progress, harvested: true }
      break
  }
  return next === progress ? state : { ...state, plants: { ...state.plants, [action.id]: next } }
}
