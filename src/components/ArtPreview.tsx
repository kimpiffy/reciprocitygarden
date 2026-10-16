import { PLANTS } from '../config/plants'
import { Art } from './Art'
import { Plant } from './Plant'

/**
 * Illustrator preview page (open the site with ?preview on the end of the address).
 * Shows every growth stage, overlay and harvest item for each plant side by side.
 */
export function ArtPreview() {
  return (
    <main className="preview">
      <h1>Artwork preview</h1>
      <p>
        Each box is the real plant artwork area. Replace files in <code>public/assets</code> and refresh this page.
        Missing files simply show nothing.
      </p>
      {PLANTS.map((plant) => (
        <section key={plant.id}>
          <h2>{plant.name} <small>({plant.assetFolder}/)</small></h2>
          <div className="preview-row">
            {plant.stages.map((name, stage) => (
              <figure key={name}>
                <div className="plot-stage preview-stage">
                  <Plant config={plant} stage={stage} />
                </div>
                <figcaption>{name}</figcaption>
              </figure>
            ))}
            <figure>
              <div className="plot-stage preview-stage">
                <Art base={`${plant.assetFolder}/${plant.harvest.image}`} />
              </div>
              <figcaption>{plant.harvest.image}</figcaption>
            </figure>
          </div>
        </section>
      ))}
      <section>
        <h2>Garden artwork <small>(assets/ui/)</small></h2>
        <div className="preview-row">
          {['seed-packet', 'basket', 'letter-closed', 'letter-open', 'soil', 'background'].map((name) => (
            <figure key={name}>
              <div className="preview-ui"><Art base={`assets/ui/${name}`} /></div>
              <figcaption>{name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}
