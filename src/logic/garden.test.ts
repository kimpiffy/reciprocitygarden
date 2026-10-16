import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import manifesto from '../content/manifesto.json'
import { PLANTS } from '../config/plants'
import { CARE_TOOLS } from '../config/tools'
import { gardenReducer, initialState, phaseOf, stageFor, currentStep, type Action } from './garden'
import { loadState, saveState } from './storage'

const run = (actions: Action[]) => actions.reduce(gardenReducer, initialState())

describe('configuration', () => {
  it('has eight plants, each with a unique id and its own manifesto line', () => {
    expect(PLANTS).toHaveLength(8)
    expect(new Set(PLANTS.map((p) => p.id)).size).toBe(8)
    expect(manifesto.lines).toHaveLength(8)
    PLANTS.forEach((p, i) => expect(p.manifestoLine).toBe(manifesto.lines[i]))
  })

  it('only uses known care tools and has six growth stages', () => {
    for (const p of PLANTS) {
      expect(p.stages).toHaveLength(6)
      p.care.forEach((c) => expect(CARE_TOOLS[c]).toBeDefined())
    }
  })

  it('ships a placeholder file for every stage and harvest item', () => {
    for (const p of PLANTS) {
      for (const name of [...p.stages, p.harvest.image]) {
        const found = ['png', 'webp', 'svg'].some((ext) => fs.existsSync(`public/${p.assetFolder}/${name}.${ext}`))
        expect(found, `${p.assetFolder}/${name}`).toBe(true)
      }
    }
  })
})

describe('growth journey', () => {
  const journey: Action[] = [{ type: 'start' }]
  PLANTS.forEach((p) => journey.push({ type: 'plant', id: p.id }))
  PLANTS.forEach((p) => journey.push({ type: 'water', id: p.id }))

  it('moves through planting and watering phases in order', () => {
    expect(phaseOf(initialState())).toBe('planting')
    expect(phaseOf(run([{ type: 'plant', id: PLANTS[0].id }]))).toBe('planting')
    expect(phaseOf(run(journey.slice(0, 1 + PLANTS.length)))).toBe('watering')
    expect(phaseOf(run(journey))).toBe('growing')
  })

  it('lets every plant complete the journey and fills the basket', () => {
    const actions = [...journey]
    for (const p of PLANTS) {
      for (const action of p.care) actions.push({ type: 'completeStep', id: p.id, step: { kind: 'care', action } })
      actions.push({ type: 'completeStep', id: p.id, step: { kind: 'challenge' } })
    }
    const grown = run(actions)
    expect(phaseOf(grown)).toBe('harvesting')
    PLANTS.forEach((p) => expect(stageFor(p, grown.plants[p.id])).toBe(5))
    const done = PLANTS.reduce((s, p) => gardenReducer(s, { type: 'harvest', id: p.id }), grown)
    expect(phaseOf(done)).toBe('complete')
  })

  it('ignores out-of-order actions', () => {
    const p = PLANTS[0]
    const watered = run(journey)
    expect(gardenReducer(watered, { type: 'completeStep', id: p.id, step: { kind: 'challenge' } })).toBe(watered)
    expect(gardenReducer(watered, { type: 'harvest', id: p.id })).toBe(watered)
    expect(gardenReducer(initialState(), { type: 'water', id: p.id })).toEqual(initialState())
    expect(currentStep(p, watered.plants[p.id])).toEqual({ kind: 'care', action: p.care[0] })
  })

  it('resets to a fresh garden', () => {
    expect(gardenReducer(run(journey), { type: 'reset' })).toEqual(initialState())
  })
})

describe('saved progress', () => {
  it('round-trips and survives corrupt data', () => {
    const store = new Map<string, string>()
    globalThis.localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    } as Storage
    const state = run([{ type: 'start' }, { type: 'plant', id: PLANTS[0].id }])
    saveState(state)
    expect(loadState()).toEqual(state)
    store.set([...store.keys()][0], '{not json')
    expect(loadState()).toEqual(initialState())
  })
})
