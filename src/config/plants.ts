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
      type: 'tap-clear',
      instructions: 'Remove the old, damaged bamboo canes to make room for healthy new growth.',
      items: 3,
      itemLabel: 'Dead bamboo cane',
      icon: 'dead-cane',
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
      type: 'place',
      instructions: 'Place a sturdy support to help hold up the peony’s heavy flowers.',
      buttonLabel: 'Add plant support',
      icon: 'support',
    },
  },
  {
    id: 'hawthorn',
    name: 'Hawthorn',
    unlockedValue: 'Boundaries',
    description: 'A tough little tree that shelters birds, but young ones dislike a strong wind.',
    harvest: { name: 'Hawthorn berries', image: 'harvest-item', x: 78, y: 13 },
    care: ['prune'],
    challenge: {
      type: 'tap-clear',
      instructions: 'Collect the three fallen leaves around the hawthorn.',
      items: 3,
      itemLabel: 'Fallen leaf',
      itemAction: 'collect',
      icon: 'fallen-leaf',
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
      type: 'tap-clear',
      instructions: 'Clean the mangrove roots by removing the rubbish caught among them.',
      items: 3,
      itemLabel: 'Piece of rubbish',
      icon: 'litter',
    },
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    unlockedValue: 'Optimism',
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
      type: 'place',
      instructions: 'Place a trellis beside the wisteria so its vines can climb and grow.',
      buttonLabel: 'Add a trellis',
      icon: 'trellis',
    },
  },
]

export const PLANTS: PlantConfig[] = inputs.map(plant)
