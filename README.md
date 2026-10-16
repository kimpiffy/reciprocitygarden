# Reciprocity Garden

An interactive, illustrated growing garden. Visitors plant eight seeds, water them, care for each plant, solve one small
challenge per plant, harvest eight items into a basket, and finally open a letter containing our collective manifesto.
It is gentle by design: no timers, no failure states, no scores.

This is a **working prototype**: the whole journey works end to end with placeholder art and placeholder text, ready for
students to replace.

```
Introduction → plant 8 seeds → water → grow → care + challenge → harvest → fill basket → open the manifesto letter
```

## Run it

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install        # once
npm run dev        # starts the site at http://localhost:5173
npm test           # checks the configuration and the whole journey logic
npm run build      # makes the finished site in dist/
```

Progress is saved in the browser. Use **Start again** in the garden (or clear site data) to reset it.

## Who edits what?

| You are… | You edit… | Read… |
| --- | --- | --- |
| An **illustrator** | files in `public/assets/` | [docs/ILLUSTRATOR_GUIDE.md](docs/ILLUSTRATOR_GUIDE.md) |
| A **writer** | `src/content/*.json` and the text in `src/config/plants.ts` | [docs/WRITER_GUIDE.md](docs/WRITER_GUIDE.md) |
| A **developer** | `src/` | [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) |

New to the project? Start with [CONTRIBUTING.md](CONTRIBUTING.md).

## Project structure

```
public/assets/
  plants/<plant>/        artwork for each of the eight plants (seed, sprout, … harvest-item, decorative-overlay)
  ui/                    seed packet, basket, letters, soil, background
src/
  content/               WRITERS: intro.json, manifesto.json
  config/plants.ts       the eight plants: names, descriptions, care, challenge, harvest, manifesto line
  config/tools.ts        labels and icons of the care tools
  logic/                 growth rules (garden.ts) and saving progress (storage.ts) – no visuals
  components/            IntroductionScreen, Garden, PlantPlot, Plant, PlantChallenge,
                         GardeningToolbar, HarvestBasket, ManifestoLetter, ArtPreview …
  index.css              all styling and animations
docs/                    guides for illustrators, writers and developers
```

Content (words), artwork (files) and interaction logic (code) are kept apart so each group can work without touching the others.

## Accessibility

Everything works with keyboard, mouse or touch. Instructions are always visible and read out politely by screen readers.
There are no time limits or failure states. Animations are gentle and switch off entirely when the visitor's device is set
to "reduce motion".
