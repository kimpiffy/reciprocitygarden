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
    id: 'rose',
    name: 'Cherry Blossom',
    unlockedValue: 'Opportunity',
    description: 'A spring-blooming tree whose blossoms return with care and patience.',
    harvest: { name: 'Cherry blossoms', image: 'harvest-item', x: 50, y: 25 },
    care: ['compost', 'prune'],
    challenge: {
      type: 'tap-clear',
      instructions: 'Weeds are crowding the cherry tree. Tap each one to clear the space.',
      items: 3,
      itemLabel: 'Weed',
      icon: 'weed',
    },
  },
  {
    id: 'pea',
    name: 'Bamboo',
    unlockedValue: 'Flexibility',
    description: 'A fast-growing grove of tall stems that can shelter a garden.',
    harvest: { name: 'Bamboo shoots', image: 'harvest-item', x: 50, y: 36 },
    care: ['water'],
    challenge: {
      type: 'place',
      instructions: 'The young bamboo needs support. Tap the button to place a sturdy cane.',
      buttonLabel: 'Add a cane',
      icon: 'cane',
    },
  },
  {
    id: 'strawberry',
    name: 'Peony',
    unlockedValue: 'Mutual Care',
    description: 'A full, fragrant flower that rewards steady care with a bright bloom.',
    harvest: { name: 'Peonies', image: 'harvest-item', x: 50, y: 50 },
    care: ['compost', 'water'],
    challenge: {
      type: 'tap-clear',
      instructions: 'Tiny pests are nibbling the peony buds. Tap each one to send it away.',
      items: 3,
      itemLabel: 'Pest',
      icon: 'bug',
    },
  },
  {
    id: 'hawthorn',
    name: 'Hawthorn',
    unlockedValue: 'Boundaries',
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
    id: 'wildflower',
    name: 'Dahlia',
    unlockedValue: 'Individuality',
    description: 'A many-petalled bloom that brings color and visitors to the garden.',
    harvest: { name: 'Dahlia blooms', image: 'harvest-item', x: 50, y: 25 },
    care: ['weed'],
    challenge: {
      type: 'follow-path',
      instructions: 'A bee is looking for flowers. Tap the glowing spots to guide it to the dahlia.',
      steps: 3,
      guideLabel: 'Bee',
    },
  },
  {
    id: 'pumpkin',
    name: 'Mangrove',
    unlockedValue: 'Resilience',
    description: 'A coastal tree with tangled roots that creates shelter along the water.',
    harvest: { name: 'Mangrove propagules', image: 'harvest-item', x: 68, y: 92 },
    care: ['water'],
    challenge: {
      type: 'place',
      instructions: 'Help the young mangrove settle in. Tap the button to add rich compost.',
      buttonLabel: 'Add compost',
      icon: 'compost',
    },
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    unlockedValue: 'Solidarity',
    description: 'Tall and cheerful, the sunflower always turns its face to the light.',
    harvest: { name: 'Sunflower seeds', image: 'harvest-item', x: 50, y: 20 },
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
    id: 'lavender',
    name: 'Wisteria',
    unlockedValue: 'Trust',
    description: 'A graceful, fragrant vine that grows in cascades of blossoms.',
    harvest: { name: 'Wisteria blossoms', image: 'harvest-item', x: 50, y: 30 },
    care: ['prune'],
    challenge: {
      type: 'tap-clear',
      instructions: 'The soil is too soggy. Tap each puddle to help the wisteria roots drain.',
      items: 2,
      itemLabel: 'Puddle',
      icon: 'puddle',
    },
  },
]

export const PLANTS: PlantConfig[] = inputs.map(plant)
