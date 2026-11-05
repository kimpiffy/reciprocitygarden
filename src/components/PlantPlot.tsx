import seeds from '../../seeds.png'
import water from '../../water.png'
import { useRef, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { CARE_TOOLS } from '../config/tools'
import { currentStep, isReady, stageFor } from '../logic/garden'
import type { PlantConfig, PlantProgress } from '../types'
import { Art } from './Art'
import { Icon } from './Icon'
import { Plant } from './Plant'
import { PlantChallenge } from './PlantChallenge'

export interface PlotEffect {
  kind: 'plant' | 'water' | 'compost' | 'prune' | 'weed' | 'done'
  /** Changes on every effect so the animation replays. */
  n: number
}

interface Props {
  config: PlantConfig
  index: number
  total: number
  progress: PlantProgress
  seedSelected: boolean
  waterAvailable: boolean
  /** True once every plant has grown: ripe items can then be dragged to the basket. */
  harvestMode: boolean
  effect?: PlotEffect
  /** True while the harvested item is flying to the basket. */
  flying: boolean
  onActivate: () => void
  onChallengeComplete: () => void
  /** Keyboard fallback: harvest without dragging. */
  onHarvest: (rect: DOMRect) => void
  /** Called with the drop point; returns true if it landed in the basket. */
  onHarvestDrop: (x: number, y: number) => boolean
}

/** One planting space: the layers (soil → plant → overlay → effects → controls) stacked in a single box. */
export function PlantPlot(props: Props) {
  const { config, index, total, progress, effect, flying } = props
  const stage = stageFor(config, progress)
  const step = currentStep(config, progress)
  const ready = isReady(config, progress)
  const harvestable = ready && !progress.harvested && !flying
  const [drag, setDrag] = useState<{ dx: number; dy: number; rect: DOMRect } | null>(null)
  const start = useRef({ x: 0, y: 0 })

  const onDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (!props.harvestMode) return
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { x: e.clientX, y: e.clientY }
    setDrag({ dx: 0, dy: 0, rect: e.currentTarget.getBoundingClientRect() })
  }
  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (drag) setDrag((current) => current && ({ ...current, dx: e.clientX - start.current.x, dy: e.clientY - start.current.y }))
  }
  const onUp = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag) return
    props.onHarvestDrop(e.clientX, e.clientY)
    setDrag(null)
  }

  let hint = ''
  let hintIcon: 'seed' | 'water' | null = null
  if (!progress.planted) hint = props.seedSelected ? 'Tap to plant a seed here.' : 'An empty planting space.'
  else if (!progress.watered) {
    hint = props.waterAvailable ? 'Needs a drink of water.' : 'Seed planted.'
    if (props.waterAvailable) hintIcon = 'water'
  } else if (step?.kind === 'care') {
    hint = `Needs: ${CARE_TOOLS[step.action].label}.`
  } else if (step?.kind === 'challenge') hint = config.challenge.instructions
  else if (!progress.harvested)
    hint = props.harvestMode
      ? `Drag the ${config.harvest.name.toLowerCase()} into the basket.`
      : 'Ready! Waiting for the other plants to grow.'
  else hint = 'Harvested. Thank you!'

  return (
    <>
    <div className={`plot${ready && !progress.harvested ? ' plot-ready' : ''}${drag ? ' plot-dragging' : ''}`}>
      <div className="plot-stage">
        {/* Interactive layer (bottom): tap/click the space to use the selected tool */}
        <button
          type="button"
          className={`plot-hit${progress.planted ? '' : ' plot-empty'}`}
          aria-label={`${config.name}, planting space ${index + 1} of ${total}. ${hint}`}
          onClick={props.onActivate}
        />
        <Plant
          config={config}
          seedIndex={index}
          stage={stage}
          berryReady={ready && !progress.harvested && !drag}
          trellisPlaced={ready}
        />

        <div className="layer layer-effects" aria-hidden={effect ? undefined : true}>
          {effect && (
            <span key={effect.n} className={`fx fx-${effect.kind}`} aria-hidden="true">
              {effect.kind === 'plant'
                ? <img src={seeds} alt="" />
                : effect.kind === 'water'
                  ? <img src={water} alt="" />
                  : <><i /><i /><i /></>}
            </span>
          )}
        </div>

        {/* Challenge + harvest controls (top layer) */}
        <div className="layer layer-controls">
          {step?.kind === 'challenge' && (
            <PlantChallenge key={config.id} challenge={config.challenge} onComplete={props.onChallengeComplete} />
          )}
          {harvestable && (
            <button
              type="button"
              className={`harvest-item${config.id === 'hawthorn' ? ' harvest-item-hawthorn' : ''}${props.harvestMode ? ' harvest-draggable' : ''}${drag ? ' harvest-held' : ''}`}
              style={{
                left: `${config.harvest.x}%`,
                top: `${config.harvest.y}%`,
              }}
              disabled={!props.harvestMode}
              aria-label={`Harvest: ${config.harvest.name}. Drag it into the basket, or press Enter to place it.`}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={() => setDrag(null)}
              onClick={(e) => {
                if (e.detail === 0) props.onHarvest(e.currentTarget.getBoundingClientRect())
              }}
            >
              <Art base={`${config.assetFolder}/${config.harvest.image}`} />
            </button>
          )}
        </div>
      </div>

      <div className="plot-soil">
        <Art base="assets/ui/soil" className="soil-art" />
        <span className="plot-name">{config.name}</span>
        {ready && <span className="plot-unlocked">✦ {config.unlockedValue} unlocked!</span>}
      </div>

      <p className="plot-hint">
        {step?.kind === 'care' && <Icon name={CARE_TOOLS[step.action].icon} size={22} />}
        {hintIcon && <Icon name={hintIcon} size={22} />}
        <span>{hint}</span>
      </p>
    </div>
    {drag && createPortal(
      <div
        className="harvest-drag-preview"
        aria-hidden="true"
        style={{
          left: drag.rect.left + drag.dx,
          top: drag.rect.top + drag.dy,
          width: drag.rect.width,
          height: drag.rect.height,
        }}
      >
        <Art base={`${config.assetFolder}/${config.harvest.image}`} />
      </div>,
      document.body,
    )}
    </>
  )
}
