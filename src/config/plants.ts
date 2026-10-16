import manifesto from '../content/manifesto.json'
import type { PlantConfig } from '../types'

/**
 * Central configuration for the eight plants.
 * Writers: edit `name`, `description`, `harvest.name` and `challenge.instructions`.
 * Illustrators: put files in public/<assetFolder>/ (see docs/ILLUSTRATOR_GUIDE.md).
 * Order here = order in the garden, left to right = manifesto line order.
 */
const STAGES = ['seed', 'sprout', 'young', 'growing', 'mature', 'harvest-ready']
const OVERLAY = 'decorative-overlay'

type PlantInput = Omit<PlantConfig, 'assetFolder' | 'stages' | 'overlay' | 'manifestoLine'>

function plant(input: PlantInput, index: number): PlantConfig {
  return {
    ...input,
    assetFolder: `assets/plants/${input.id}`,
    stages: STAGES,
    overlay: OVERLAY,
    manifestoLine: manifesto.lines[index],
  }
}

const inputs: PlantInput[] = [
  {
    id: 'hawthorn',
    name: 'Hawthorn',
    description: 'A tough little tree that shelters birds, but young ones dislike a strong wind.',
    harvest: { name: 'Hawthorn berries', image: 'harvest-item', x: 50, y: 32 },
    care: ['prune'],
    challenge: {
      type: 'place',
      instructions: 'A strong wind is coming! Tap the button to put up a windbreak.',
      buttonLabel: 'Put up the windbreak',
      icon: 'shelter',
    },
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    description: 'Tall and cheerful, the sunflower always turns its face to the light.',
    harvest: { name: 'Sunflower', image: 'harvest-item', x: 50, y: 20 },
    care: ['compost'],
    challenge: {
      type: 'slider',
      instructions: 'Slide the sun across the sky until it shines on the flower.',
      sliderLabel: 'Move the sun',
      target: 50,
      tolerance: 10,
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'A fragrant climber that needs plenty of room and a little patience.',
    harvest: { name: 'Rose', image: 'harvest-item', x: 50, y: 25 },
    care: ['compost', 'prune'],
    challenge: {
      type: 'tap-clear',
      instructions: 'Weeds are stealing the rose’s food. Tap each weed to pull it out.',
      items: 3,
      itemLabel: 'Weed',
      icon: 'weed',
    },
  },
  {
    id: 'pea',
    name: 'Pea plant',
    description: 'A curly climber that loves to hold on to something.',
    harvest: { name: 'Pea pods', image: 'harvest-item', x: 50, y: 36 },
    care: ['water'],
    challenge: {
      type: 'place',
      instructions: 'The peas want to climb. Tap the button to give them a supporting cane.',
      buttonLabel: 'Add a cane',
      icon: 'cane',
    },
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    description: 'Sweet, low and sprawling. Everyone wants a taste, including the pests.',
    harvest: { name: 'Strawberries', image: 'harvest-item', x: 50, y: 50 },
    care: ['compost', 'water'],
    challenge: {
      type: 'tap-clear',
      instructions: 'Tiny pests are nibbling the berries. Tap each one to send it away.',
      items: 3,
      itemLabel: 'Pest',
      icon: 'bug',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    description: 'A sleepy, scented plant that hates having wet feet.',
    harvest: { name: 'Lavender', image: 'harvest-item', x: 50, y: 30 },
    care: ['prune'],
    challenge: {
      type: 'tap-clear',
      instructions: 'The soil is too soggy. Tap each puddle to help the water drain away.',
      items: 2,
      itemLabel: 'Puddle',
      icon: 'puddle',
    },
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    description: 'A hungry plant that dreams of becoming very, very round.',
    harvest: { name: 'Pumpkin', image: 'harvest-item', x: 68, y: 92 },
    care: ['water'],
    challenge: {
      type: 'place',
      instructions: 'Pumpkins are hungry! Tap the button to add a big scoop of compost.',
      buttonLabel: 'Add compost',
      icon: 'compost',
    },
  },
  {
    id: 'wildflower',
    name: 'Wildflower',
    description: 'A bright, untidy flower that needs visitors with wings.',
    harvest: { name: 'Wildflower', image: 'harvest-item', x: 50, y: 25 },
    care: ['weed'],
    challenge: {
      type: 'follow-path',
      instructions: 'A bee is looking for flowers. Tap the glowing spots to guide it along.',
      steps: 3,
      guideLabel: 'Bee',
    },
  },
]

export const PLANTS: PlantConfig[] = inputs.map(plant)
