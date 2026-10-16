# Illustrator guide

You can replace any placeholder drawing **without touching any code**. Just save your file with the right name in the
right folder.

## 1. Where files go

Each plant has its own folder:

```
public/assets/plants/hawthorn/
public/assets/plants/sunflower/
public/assets/plants/rose/
public/assets/plants/pea/
public/assets/plants/strawberry/
public/assets/plants/lavender/
public/assets/plants/pumpkin/
public/assets/plants/wildflower/
```

(The plant names and folder names are set in `src/config/plants.ts`. To add or rename a plant, ask a developer.)

## 2. Which files to make

Use **exactly** these names (lower-case, with hyphens). Use `.png`, `.webp` or `.svg`.

| File | What it is | Needed? |
| --- | --- | --- |
| `seed` | The planted seed, just after planting | yes |
| `sprout` | Stage 2: small shoot (appears after watering) | yes |
| `young` | Stage 3: young plant | yes |
| `growing` | Stage 4: developing plant | yes |
| `mature` | Stage 5: mature plant | yes |
| `harvest-ready` | Stage 6: ready to harvest (after its challenge is done) | yes |
| `harvest-item` | The flower / fruit / vegetable the visitor clicks, which then flies into the basket | yes |
| `decorative-overlay` | Optional transparent layer drawn **over every stage** | optional |

Example: `public/assets/plants/rose/young.png`.

If you supply more than one format for the same name, the site uses **png first, then webp, then svg**. That means a
`young.png` automatically beats the placeholder `young.svg`. You can leave the placeholder in place or delete it.
Anything you don't supply keeps its placeholder, so you can replace artwork a little at a time.

## 3. Size and transparency

- **Canvas size: 800 × 1000 px** (portrait, 4:5). Any size with the same 4:5 shape also works, but use this one if unsure.
  Keep file sizes small (ideally under 300 KB each).
- **Harvest item: 400 × 400 px** (square).
- **Save with a transparent background.** Do not paint a sky or soil into plant images. Transparent areas let the garden
  background, soil and other layers show through.
- **Soil line = the bottom edge of the canvas.** Draw the plant so its base touches the bottom, horizontally centred. The
  site anchors every image to the bottom centre of the same box, so **all stages line up as the plant grows** as long as
  you use the same canvas size and the same stem position for every stage.
- Draw each stage as the **whole plant** at that stage (not just the new bit).

## 4. How layers work

Every planting space is a stack of layers, back to front:

1. **Background**: shared garden scenery (`public/assets/ui/background`).
2. **Soil**: the soil strip (`public/assets/ui/soil`).
3. **Plant**: your current growth stage image.
4. **Overlay**: your optional `decorative-overlay` image, drawn on top of the plant at **every** stage and the same size.
5. **Effects**: sparkles, water drops etc. from the site.
6. **Controls**: clickable things (challenge items, harvest item).

Use the overlay for details you want to sit over the top of the shared plant shapes and animation: ladybirds, dew, a
frame of leaves, painted texture, and so on. Because it covers the same canvas, draw it on an 800 × 1000 transparent
canvas and place elements where you want them on the plant.

Other replaceable artwork lives in `public/assets/ui/`: `seed-packet`, `basket`, `letter-closed` (the envelope),
`letter-open` (the paper behind the manifesto; it is stretched to fit), `soil` and `background`.

## 5. Preview your artwork

1. Run `npm run dev` and open the address it shows (usually http://localhost:5173).
2. Add `?preview` to the end of the address: `http://localhost:5173/?preview`.
3. You will see every stage of every plant, its harvest item, and the garden artwork on a checkerboard (so you can check
   transparency). Refresh the page after saving a new file. If a new file doesn't show up, do a hard refresh
   (Ctrl/Cmd + Shift + R).
4. To see it in the real garden, add `?preview` off again and play through.

## 6. Worked example: replacing the Hawthorn

1. Draw six hawthorn stages on an 800 × 1000 transparent canvas, with the trunk base at the bottom centre each time.
2. Export them as PNG and name them:
   `seed.png`, `sprout.png`, `young.png`, `growing.png`, `mature.png`, `harvest-ready.png`.
3. Draw one hawthorn berry on a 400 × 400 transparent canvas and export `harvest-item.png`.
4. *(Optional)* Draw some birds and blossom on an 800 × 1000 transparent canvas, export `decorative-overlay.png`.
5. Copy all the files into `public/assets/plants/hawthorn/`. You'll now have e.g. both `seed.svg` (placeholder) and
   `seed.png` (yours); the PNG wins.
6. Open `http://localhost:5173/?preview` and check the Hawthorn row.

That's it. No code changes are needed. The same steps work for the other seven plants.
