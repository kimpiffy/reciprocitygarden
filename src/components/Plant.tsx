import seed1 from '../../seed1.png'
import seed2 from '../../seed2.png'
import seed3 from '../../seed3.png'
import type { PlantConfig } from '../types'
import { Art } from './Art'

const SEED_IMAGES = [seed1, seed2, seed3]

interface PlantProps {
  config: PlantConfig
  seedIndex: number
  /** -1 = not planted, 0–5 = growth stage. */
  stage: number
}

/**
 * The plant illustration layer plus the optional transparent overlay layer.
 * Every image fills the same box, anchored to the bottom, so all stages and
 * the overlay line up exactly.
 */
export function Plant({ config, seedIndex, stage }: PlantProps) {
  if (stage < 0) return null
  const folder = `${config.assetFolder}/`
  return (
    <>
      <div className="layer layer-plant" data-stage={stage}>
        {/* key on stage so the grow animation replays on every change */}
        <div className="grow" key={stage}>
          {stage === 0 ? (
            <img className="planted-seed" src={SEED_IMAGES[seedIndex % SEED_IMAGES.length]} alt="" />
          ) : (
            <Art base={folder + config.stages[stage]} />
          )}
        </div>
      </div>
      <div className="layer layer-overlay">
        <Art base={folder + config.overlay} />
      </div>
    </>
  )
}
