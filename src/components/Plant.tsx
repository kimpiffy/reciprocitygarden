import seed1 from '../../seed1.png'
import seed2 from '../../seed2.png'
import seed3 from '../../seed3.png'
import type { PlantConfig } from '../types'
import { Art } from './Art'
import { Icon } from './Icon'

const SEED_IMAGES = [seed1, seed2, seed3]

interface PlantProps {
  config: PlantConfig
  seedIndex: number
  /** -1 = not planted, 0–5 = growth stage. */
  stage: number
  berryReady: boolean
  trellisPlaced: boolean
}

/**
 * The plant illustration layer plus the optional transparent overlay layer.
 * Every image fills the same box, anchored to the bottom, so all stages and
 * the overlay line up exactly.
 */
export function Plant({ config, seedIndex, stage, berryReady, trellisPlaced }: PlantProps) {
  if (stage < 0) return null
  const folder = `${config.assetFolder}/`
  return (
    <>
      {config.id === 'lavender' && trellisPlaced && (
        <div className="layer layer-trellis" aria-hidden="true">
          <Icon name="trellis" size={120} />
        </div>
      )}
      <div className="layer layer-plant" data-plant={config.id} data-stage={stage}>
        {/* key on stage so the grow animation replays on every change */}
        <div className="grow" key={stage}>
          {stage === 0 ? (
            <img
              className="planted-seed"
              src={SEED_IMAGES[seedIndex % SEED_IMAGES.length]}
              alt=""
              style={{ visibility: 'hidden' }}
              onLoad={(e) => { e.currentTarget.style.visibility = 'visible' }}
              onError={(e) => {
                console.error('Failed to load planted seed image:', e.currentTarget.src)
                e.currentTarget.style.visibility = 'hidden'
              }}
            />
          ) : (
            <Art base={folder + config.stages[stage]} />
          )}
        </div>
      </div>
      <div className="layer layer-overlay">
        <Art base={folder + config.overlay} />
        {config.id === 'hawthorn' && berryReady && (
          <Art base={folder + 'berry-overlay'} className="hawthorn-berry-overlay" />
        )}
      </div>
    </>
  )
}
