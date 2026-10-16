import type { PlantConfig } from '../types'
import { Art } from './Art'

interface PlantProps {
  config: PlantConfig
  /** -1 = not planted, 0–5 = growth stage. */
  stage: number
}

/**
 * The plant illustration layer plus the optional transparent overlay layer.
 * Every image fills the same box, anchored to the bottom, so all stages and
 * the overlay line up exactly.
 */
export function Plant({ config, stage }: PlantProps) {
  if (stage < 0) return null
  const folder = `${config.assetFolder}/`
  return (
    <>
      <div className="layer layer-plant" data-stage={stage}>
        {/* key on stage so the grow animation replays on every change */}
        <div className="grow" key={stage}>
          <Art base={folder + config.stages[stage]} />
        </div>
      </div>
      <div className="layer layer-overlay">
        <Art base={folder + config.overlay} />
      </div>
    </>
  )
}
