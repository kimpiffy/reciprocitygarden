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

  it('has eight manifesto paragraphs of exactly 80 words each', () => {
    expect(manifesto.title).toBe('Manifesto')
    expect(manifesto.paragraphs).toHaveLength(8)
    manifesto.paragraphs.forEach((paragraph) => {
      expect(paragraph.trim().split(/\s+/)).toHaveLength(80)
    })
  })

  it('assigns the requested unlocked value to each plant', () => {
    expect(PLANTS.map(({ name, unlockedValue }) => [name, unlockedValue])).toEqual([
      ['Cherry Blossom', 'Opportunity'],
      ['Bamboo', 'Flexibility'],
      ['Peony', 'Mutual Care'],
      ['Hawthorn', 'Boundaries'],
      ['Dahlia', 'Individuality'],
      ['Mangrove', 'Resilience'],
      ['Sunflower', 'Optimism'],
      ['Wisteria', 'Trust'],
    ])
  })

  it('only uses known care tools and has six growth stages', () => {
    for (const p of PLANTS) {
      expect(p.stages).toHaveLength(6)
      p.care.forEach((c) => expect(CARE_TOOLS[c]).toBeDefined())
    }
  })

  it('assigns the plant-specific gardening challenges', () => {
    const challenge = (id: string) => PLANTS.find((p) => p.id === id)!.challenge
    expect(challenge('rose')).toMatchObject({ type: 'tap-clear', itemLabel: 'Weed', icon: 'weed' })
    expect(challenge('pea')).toMatchObject({ type: 'tap-clear', itemLabel: 'Dead bamboo cane', icon: 'dead-cane' })
    expect(challenge('strawberry')).toMatchObject({ type: 'place', buttonLabel: 'Add plant support', icon: 'support' })
    expect(challenge('hawthorn')).toMatchObject({
      type: 'tap-clear',
      items: 3,
      itemLabel: 'Fallen leaf',
      itemAction: 'collect',
      icon: 'fallen-leaf',
    })
    expect(challenge('wildflower')).toMatchObject({ type: 'follow-path' })
    expect(challenge('pumpkin')).toMatchObject({ type: 'tap-clear', itemLabel: 'Piece of rubbish', icon: 'litter' })
    expect(challenge('sunflower')).toMatchObject({ type: 'slider' })
    expect(challenge('lavender')).toMatchObject({ type: 'place', buttonLabel: 'Add a trellis', icon: 'trellis' })
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

  it('requires pruning before collecting the hawthorn leaves', () => {
    const hawthorn = PLANTS.find((p) => p.id === 'hawthorn')!
    const watered = run([
      { type: 'plant', id: hawthorn.id },
      { type: 'water', id: hawthorn.id },
    ])
    expect(currentStep(hawthorn, watered.plants[hawthorn.id])).toEqual({ kind: 'care', action: 'prune' })

    const pruned = gardenReducer(watered, {
      type: 'completeStep',
      id: hawthorn.id,
      step: { kind: 'care', action: 'prune' },
    })
    expect(currentStep(hawthorn, pruned.plants[hawthorn.id])).toEqual({ kind: 'challenge' })
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
