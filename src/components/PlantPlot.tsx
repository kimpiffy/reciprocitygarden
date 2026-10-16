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
  effect?: PlotEffect
  /** True while the harvested item is flying to the basket. */
  flying: boolean
  onActivate: () => void
  onChallengeComplete: () => void
  onHarvest: (rect: DOMRect) => void
}

/** One planting space: the layers (soil → plant → overlay → effects → controls) stacked in a single box. */
export function PlantPlot(props: Props) {
  const { config, index, total, progress, effect, flying } = props
  const stage = stageFor(config, progress)
  const step = currentStep(config, progress)
  const ready = isReady(config, progress)
  const harvestable = ready && !progress.harvested && !flying

  let hint = ''
  let hintIcon: 'seed' | 'water' | null = null
  if (!progress.planted) hint = props.seedSelected ? 'Tap to plant a seed here.' : 'An empty planting space.'
  else if (!progress.watered) {
    hint = props.waterAvailable ? 'Needs a drink of water.' : 'Seed planted.'
    if (props.waterAvailable) hintIcon = 'water'
  } else if (step?.kind === 'care') {
    hint = `Needs: ${CARE_TOOLS[step.action].label}.`
  } else if (step?.kind === 'challenge') hint = config.challenge.instructions
  else if (!progress.harvested) hint = `Ready! Tap the ${config.harvest.name.toLowerCase()}.`
  else hint = 'Harvested. Thank you!'

  return (
    <div className={`plot${ready && !progress.harvested ? ' plot-ready' : ''}`}>
      <p className="plot-hint">
        {step?.kind === 'care' && <Icon name={CARE_TOOLS[step.action].icon} size={22} />}
        {hintIcon && <Icon name={hintIcon} size={22} />}
        <span>{hint}</span>
      </p>

      <div className="plot-stage">
        {/* Interactive layer (bottom): tap/click the space to use the selected tool */}
        <button
          type="button"
          className={`plot-hit${progress.planted ? '' : ' plot-empty'}`}
          aria-label={`${config.name}, planting space ${index + 1} of ${total}. ${hint}`}
          onClick={props.onActivate}
        />
        <Plant config={config} stage={stage} />

        <div className="layer layer-effects" aria-hidden={effect ? undefined : true}>
          {effect && (
            <span key={effect.n} className={`fx fx-${effect.kind}`} aria-hidden="true">
              <i /><i /><i />
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
              className="harvest-item"
              style={{ left: `${config.harvest.x}%`, top: `${config.harvest.y}%` }}
              aria-label={`Harvest: ${config.harvest.name}. Tap to put it in the basket.`}
              onClick={(e) => props.onHarvest(e.currentTarget.getBoundingClientRect())}
            >
              <Art base={`${config.assetFolder}/${config.harvest.image}`} />
            </button>
          )}
        </div>
      </div>

      <div className="plot-soil">
        <Art base="assets/ui/soil" className="soil-art" />
        <span className="plot-name">{config.name}</span>
        {ready && <span className="plot-unlocked">✦ Manifesto line unlocked</span>}
      </div>
    </div>
  )
}
