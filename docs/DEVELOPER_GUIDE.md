# Developer guide

Stack: React 19, Vite, TypeScript, plain CSS. Tests with Vitest.

```bash
npm run dev      # dev server
npm test         # config + journey logic tests
npm run build    # type-check + production build
npm run lint     # oxlint
```

## Architecture in one minute

- **Content**: `src/content/*.json`: intro and manifesto text.
- **Configuration**: `src/config/plants.ts`: one entry per plant; `src/config/tools.ts`: care tool labels/icons.
- **Logic** (`src/logic/garden.ts`): a pure reducer holding progress (`planted`, `watered`, `stepsDone`, `harvested` per plant).
  No React, no DOM, easy to test. `storage.ts` saves it to `localStorage` and validates it on load.
- **UI** (`src/components/`): reads config + state; contains **no per-plant details**.
- **Artwork**: files under `public/assets`, found by name through `components/Art.tsx` (tries png → webp → svg).

## The growth system

Every plant has a list of steps: its `care` actions (in order) followed by its `challenge`.

1. Planting (seed packet + tap a space) → stage 0 `seed`.
2. Watering (watering can + tap) → stage 1 `sprout`. Watering opens only once all eight seeds are planted.
3. Each completed step advances the plant (`stageFor` in `logic/garden.ts`), spreading stages 2–4
   (`young`, `growing`, `mature`) across the steps. Finishing the challenge gives stage 5 (`harvest-ready`)
   and unlocks the plant's manifesto line internally.
4. Harvest: the harvest item is clickable once `isReady`. It flies to the basket (`FlyingItem`), then `harvest` is dispatched.
5. When all eight are harvested, `phaseOf` returns `complete`, the basket glows and the envelope appears
   (`ManifestoLetter`). The manifesto text is only shown inside the opened letter.

The reducer rejects out-of-order actions, so UI mistakes can't break progress. There are no failure states.

## Visual layers

`PlantPlot` stacks these absolutely-positioned layers in one 4:5 box (see `index.css`): hit button (z 1) → plant
(`.layer-plant`, z 2) → overlay (z 3) → effects (z 4) → controls (z 5). Every image uses `object-fit: contain` anchored at the
bottom centre, so stages and overlays align automatically.

## Configuring plants and care

```ts
{
  id: 'rose',                          // also the folder name: public/assets/plants/rose
  name: 'Rose', description: '…',
  harvest: { name: 'Rose', image: 'harvest-item', x: 50, y: 25 },   // x/y: where the item sits on the artwork (%)
  care: ['compost', 'prune'],          // 1–3 steps from CareAction, in order
  challenge: { type: 'tap-clear', instructions: '…', items: 3, itemLabel: 'Weed', icon: 'weed' },
}
```

- New care action: add it to `CareAction` in `types.ts`, an entry in `config/tools.ts`, and (if it needs a new icon) a case in
  `components/Icon.tsx`. The toolbar shows whichever tools plants use.
- `STAGES` and `OVERLAY` at the top of `plants.ts` set the six file names and overlay name used by every plant.
- Manifesto lines are taken from `content/manifesto.json` by plant order.

## Challenge types

Defined in `types.ts`, rendered by `components/PlantChallenge.tsx`.

| `type` | Mechanic | Parameters | Used by |
| --- | --- | --- | --- |
| `tap-clear` | tap N items to clear them | `items`, `itemLabel`, `icon` | Rose, Strawberry, Lavender |
| `place` | tap one button to place something | `buttonLabel`, `icon` | Hawthorn, Pea, Pumpkin |
| `follow-path` | tap glowing spots to guide a bee | `steps`, `guideLabel` | Wildflower |
| `slider` | move a slider (keyboard friendly) until it lines up | `sliderLabel`, `target`, `tolerance` | Sunflower |

To change a plant's challenge, edit only its `challenge` object. To add a new mechanic:

1. Add an interface to the `ChallengeConfig` union in `types.ts`.
2. Add a component and a `case` in `PlantChallenge.tsx`. Call the `onComplete` prop when done (use `useFinish` to let the
   finishing animation play).
3. Use it in `plants.ts`. TypeScript will tell you if anything is missing.

## Testing the full visitor journey

- Automated: `npm test` runs the configuration checks and plays all eight plants through the reducer
  (plant → water → care → challenge → harvest → complete), plus saving/loading.
- Manual (takes ~2 minutes): `npm run dev`, then:
  1. Click **Let's Grow**. Pick the seed packet and tap all 8 spaces.
  2. Choose the watering can (auto-selected), tap all 8 seeds.
  3. For each plant read the hint above it. For care, choose that tool and tap the plant. For the challenge, use the controls on the plant.
  4. Tap each ripe item; watch the basket fill. Open the envelope, read the eight lines, try **Grow the garden again**.
  5. Refresh mid-way to confirm progress is restored. Turn on "reduce motion" in your OS to confirm animations stop.
- Artwork: `/?preview` shows all artwork on a checkerboard.
