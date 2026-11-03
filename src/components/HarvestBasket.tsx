import type { Ref } from 'react'
import type { GardenState, PlantConfig } from '../types'
import { Art } from './Art'

interface Props {
  plants: PlantConfig[]
  state: GardenState
  basketRef: Ref<HTMLDivElement>
}

/** The basket, its contents, and a gentle (non-competitive) progress summary. */
export function HarvestBasket({ plants, state, basketRef }: Props) {
  const harvested = plants.filter((p) => state.plants[p.id].harvested)
  const full = harvested.length === plants.length
  const itemPositions = [
    { left: 18, top: 24, rotate: -12 },
    { left: 50, top: 14, rotate: 8 },
    { left: 82, top: 27, rotate: -6 },
    { left: 34, top: 49, rotate: 13 },
    { left: 68, top: 47, rotate: -10 },
    { left: 15, top: 76, rotate: 7 },
    { left: 52, top: 82, rotate: -4 },
    { left: 84, top: 73, rotate: 11 },
  ]
  return (
    <div className={`basket${full ? ' basket-full' : ''}`}>
      <div className="basket-picture" ref={basketRef}>
        <Art base="assets/ui/basket" className="basket-art" />
        <ul className="basket-items" aria-label="Items in the basket">
          {harvested.map((p, index) => (
            <li
              key={p.id}
              style={{
                left: `${itemPositions[index].left}%`,
                top: `${itemPositions[index].top}%`,
                rotate: `${itemPositions[index].rotate}deg`,
              }}
            >
              <Art base={`${p.assetFolder}/${p.harvest.image}`} alt={p.harvest.name} />
            </li>
          ))}
        </ul>
      </div>
      <div className="basket-text">
        <p>
          <strong>Basket:</strong> {harvested.length} of {plants.length} gathered
        </p>
        <p className="basket-dots" aria-hidden="true">
          {plants.map((p) => (
            <span key={p.id} className={state.plants[p.id].harvested ? 'dot dot-full' : 'dot'} />
          ))}
        </p>
      </div>
    </div>
  )
}
