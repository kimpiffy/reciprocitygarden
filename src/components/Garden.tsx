import { useReducer, useRef, useState, type Dispatch } from 'react'
import { PLANTS } from '../config/plants'
import { CARE_TOOLS } from '../config/tools'
import { currentStep, phaseOf, type Action } from '../logic/garden'
import type { CareAction, GardenState } from '../types'
import { Art } from './Art'
import { FlyingItem } from './FlyingItem'
import { GardeningToolbar, type ToolId } from './GardeningToolbar'
import { HarvestBasket } from './HarvestBasket'
import { ManifestoLetter } from './ManifestoLetter'
import { PlantPlot, type PlotEffect } from './PlantPlot'

interface Props {
  state: GardenState
  dispatch: Dispatch<Action>
}

interface Flight {
  id: string
  from: DOMRect
}

const CARE_TOOL_IDS = [...new Set(PLANTS.flatMap((p) => p.care))] as CareAction[]
const TOTAL = PLANTS.length

export function Garden({ state, dispatch }: Props) {
  const [tool, setTool] = useState<ToolId | null>(null)
  const [feedback, setFeedback] = useState('')
  const [effects, bumpEffect] = useReducer(
    (all: Record<string, PlotEffect>, e: { id: string; kind: PlotEffect['kind'] }) => ({
      ...all,
      [e.id]: { kind: e.kind, n: (all[e.id]?.n ?? 0) + 1 },
    }),
    {},
  )
  const [flights, setFlights] = useState<Flight[]>([])
  const [letterOpen, setLetterOpen] = useState(false)
  const basketRef = useRef<HTMLDivElement>(null)

  const phase = phaseOf(state)
  const list = PLANTS.map((p) => state.plants[p.id])
  const plantedCount = list.filter((g) => g.planted).length
  const wateredCount = list.filter((g) => g.watered).length
  const allPlanted = plantedCount === TOTAL

  const available = { seed: !allPlanted, water: allPlanted, compost: allPlanted, prune: allPlanted, weed: allPlanted }
  const pulse: ToolId | null =
    phase === 'planting' && tool !== 'seed' ? 'seed' : phase === 'watering' && tool !== 'water' ? 'water' : null

  const guidance = {
    planting:
      tool === 'seed'
        ? `Tap an empty planting space to plant a seed (${plantedCount} of ${TOTAL} planted).`
        : 'Tap the pulsing seed packet to pick up a seed.',
    watering:
      tool === 'water'
        ? `Tap each seed to water it (${wateredCount} of ${TOTAL} watered).`
        : 'All the seeds are planted! Choose the watering can, then tap each seed.',
    growing:
      'Each plant shows what it needs above it. Choose the matching tool and tap the plant, or follow the instructions on the plant.',
    harvesting: 'Something is ready! Tap each ripe item to put it in your basket. Other plants may still need care.',
    complete: 'Your basket is full. Open the letter to read what we made together.',
  }[phase]

  const selectTool = (id: ToolId) => {
    if (!available[id]) {
      setFeedback(
        id === 'seed' ? 'All the seeds are already planted.' : 'Plant a seed in every space first, then this tool is ready.',
      )
      return
    }
    setTool(tool === id ? null : id)
    setFeedback('')
  }

  const effect = (id: string, kind: PlotEffect['kind']) => bumpEffect({ id, kind })

  const activate = (id: string) => {
    const plant = PLANTS.find((p) => p.id === id)!
    const progress = state.plants[id]
    if (!tool) return setFeedback('Choose a tool first: the seed packet, or one of the gardening tools.')

    if (tool === 'seed') {
      if (progress.planted) return setFeedback('There is already a seed here. Try an empty space.')
      dispatch({ type: 'plant', id })
      effect(id, 'plant')
      if (plantedCount + 1 === TOTAL) {
        setTool('water')
        setFeedback('That’s the last seed! The watering can is ready.')
      } else setFeedback(`Seed planted in the ${plant.name.toLowerCase()} space.`)
      return
    }

    if (!progress.planted) return setFeedback('There’s no seed here yet. Plant one first.')

    if (!progress.watered) {
      if (tool !== 'water') return setFeedback('This seed would like a drink first. Choose the watering can.')
      dispatch({ type: 'water', id })
      effect(id, 'water')
      if (wateredCount + 1 === TOTAL) setTool(null)
      setFeedback(`The ${plant.name.toLowerCase()} drinks happily and starts to grow.`)
      return
    }

    const step = currentStep(plant, progress)
    if (step?.kind === 'care' && step.action === tool) {
      dispatch({ type: 'completeStep', id, step })
      effect(id, tool as CareAction)
      setFeedback(CARE_TOOLS[tool as CareAction].doneMessage)
    } else if (step?.kind === 'challenge') {
      setFeedback(`The ${plant.name.toLowerCase()} has a challenge. Follow the instructions above it.`)
    } else if (step?.kind === 'care') {
      setFeedback(`The ${plant.name.toLowerCase()} needs something else right now. Look for the hint above it.`)
    } else setFeedback(`The ${plant.name.toLowerCase()} has everything it needs.`)
  }

  const challengeComplete = (id: string) => {
    dispatch({ type: 'completeStep', id, step: { kind: 'challenge' } })
    effect(id, 'done')
    const plant = PLANTS.find((p) => p.id === id)!
    setFeedback(`Well done! The ${plant.name.toLowerCase()} is ready, and a line of our manifesto has been unlocked.`)
  }

  const restart = () => {
    setLetterOpen(false)
    setTool(null)
    setFeedback('')
    dispatch({ type: 'reset' })
  }

  const confirmRestart = () => {
    if (window.confirm('Start the garden again from the beginning?')) restart()
  }

  return (
    <>
      <div className="garden-screen" inert={letterOpen}>
        <header className="garden-header">
          <h1>Our Garden</h1>
          <div className="status" role="status" aria-live="polite">
            {feedback && <p className="feedback">{feedback}</p>}
            <p className="guidance">{guidance}</p>
          </div>
          <button type="button" className="link-button" onClick={confirmRestart}>
            Start again
          </button>
        </header>

        <div
          className="garden-scroll"
          tabIndex={0}
          role="region"
          aria-label="The garden. Scroll sideways to see all eight planting spaces."
        >
          <div className="garden-track">
            <Art base="assets/ui/background" className="garden-background" />
            <div className="plots">
              {PLANTS.map((config, index) => (
                <PlantPlot
                  key={config.id}
                  config={config}
                  index={index}
                  total={TOTAL}
                  progress={state.plants[config.id]}
                  seedSelected={tool === 'seed'}
                  waterAvailable={allPlanted}
                  effect={effects[config.id]}
                  flying={flights.some((f) => f.id === config.id)}
                  onActivate={() => activate(config.id)}
                  onChallengeComplete={() => challengeComplete(config.id)}
                  onHarvest={(from) => {
                    setFlights((f) => [...f, { id: config.id, from }])
                    setFeedback(`The ${config.harvest.name.toLowerCase()} goes into the basket.`)
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <footer className="garden-panel">
          <GardeningToolbar tool={tool} careTools={CARE_TOOL_IDS} available={available} pulse={pulse} onSelect={selectTool} />
          <HarvestBasket plants={PLANTS} state={state} basketRef={basketRef} />
        </footer>
      </div>

      {flights.map((f) => {
        const plant = PLANTS.find((p) => p.id === f.id)!
        return (
          <FlyingItem
            key={f.id}
            base={`${plant.assetFolder}/${plant.harvest.image}`}
            from={f.from}
            target={basketRef}
            onDone={() => {
              dispatch({ type: 'harvest', id: f.id })
              setFlights((all) => all.filter((x) => x.id !== f.id))
            }}
          />
        )
      })}

      <ManifestoLetter
        available={phase === 'complete'}
        open={letterOpen}
        onOpen={() => setLetterOpen(true)}
        onClose={() => setLetterOpen(false)}
        onRestart={restart}
        lines={PLANTS.map((p) => p.manifestoLine)}
      />
    </>
  )
}
