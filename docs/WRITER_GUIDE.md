# Writer guide

All the words are in plain text files. You only change what is **between the quote marks**. Don't remove the quotes,
commas, or brackets around them. Save the file and refresh the browser to see your words.

## The introduction

File: `src/content/intro.json`

- `title`: the first big line.
- `paragraphs`: each line in quotes is one paragraph. Add or remove lines, keeping a comma after every line except the last.
- `buttonLabel`: the words on the big start button.

## The manifesto (eight lines)

File: `src/content/manifesto.json`

- `lines`: **exactly eight** lines, in order. Line 1 belongs to the first plant (left), line 8 to the last (right).
  Each line is unlocked when its plant's challenge is finished, and all eight are revealed together in the final letter.
- `title`, `intro`, `signoff`: the heading, a short opening sentence and the closing words on the letter.

Because the order matters, the plant order is: Hawthorn, Sunflower, Rose, Pea plant, Strawberry, Lavender, Pumpkin, Wildflower.

## Plant names, descriptions and challenge instructions

File: `src/config/plants.ts`

Each plant is a block like this. Change only the text in quotes:

```ts
{
  id: 'rose',                       // do not change (it's the folder name)
  name: 'Rose',                     // the plant's name
  description: 'A fragrant climber…', // a short description
  harvest: { name: 'Rose', … },     // what the visitor collects (only change name)
  challenge: {
    type: 'tap-clear',              // do not change
    instructions: 'Weeds are stealing the rose’s food. Tap each weed to pull it out.',  // <-- your words
    itemLabel: 'Weed',              // what the little thing is called for screen readers
    …
  },
},
```

Tips for the instruction text:

- Say **what is happening** and **what to do** in one or two short sentences ("Slide the sun… ").
- It appears in a small box above the plant, so keep it under about 120 characters.
- Be kind: there is no failing. Never use words like "wrong", "fail", "hurry".

## Other words

Tool names (Watering can, Compost…) and the encouraging messages are in `src/config/tools.ts`.
Other short messages are in `src/components/Garden.tsx`: ask a developer if you want them changed.
