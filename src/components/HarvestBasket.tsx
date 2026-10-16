import type { Ref } from 'react'
import type { GardenState, PlantConfig } from '../types'
import { isReady } from '../logic/garden'
import { Art } from './Art'

interface Props {
  plants: PlantConfig[]
  state: GardenState
  basketRef: Ref<HTMLDivElement>
}

/** The basket, its contents, and a gentle (non-competitive) progress summary. */
export function HarvestBasket({ plants, state, basketRef }: Props) {
  const harvested = plants.filter((p) => state.plants[p.id].harvested)
  const unlocked = plants.filter((p) => isReady(p, state.plants[p.id])).length
  const full = harvested.length === plants.length
  return (
    <div className={`basket${full ? ' basket-full' : ''}`}>
      <div className="basket-picture" ref={basketRef}>
        <Art base="assets/ui/basket" className="basket-art" />
        <ul className="basket-items" aria-label="Items in the basket">
          {harvested.map((p) => (
            <li key={p.id}>
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
        <p>
          <strong>Manifesto:</strong> {unlocked} of {plants.length} lines unlocked
        </p>
      </div>
    </div>
  )
}
