/** Care actions a visitor can perform with a toolbar tool. */
export type CareAction = 'water' | 'compost' | 'prune' | 'weed'

/** Names of every icon the app can draw (see components/Icon.tsx). */
export type IconName =
  | 'seed' | 'water' | 'compost' | 'prune' | 'weed'
  | 'cane' | 'shelter' | 'bug' | 'puddle' | 'bee' | 'sun'

export interface ChallengeBase {
  /** Shown to the visitor when this challenge becomes active. */
  instructions: string
}

/** Tap N small things (weeds, pests, puddles…) to clear them away. */
export interface TapClearChallenge extends ChallengeBase {
  type: 'tap-clear'
  items: number
  itemLabel: string
  icon: IconName
}

/** Tap one button to place something (a barrier, a cane, compost…). */
export interface PlaceChallenge extends ChallengeBase {
  type: 'place'
  buttonLabel: string
  icon: IconName
}

/** Tap a short trail of spots to guide something (e.g. a bee) to the plant. */
export interface FollowPathChallenge extends ChallengeBase {
  type: 'follow-path'
  steps: number
  guideLabel: string
}

/** Move a slider until it lines up with a target (e.g. the sun). */
export interface SliderChallenge extends ChallengeBase {
  type: 'slider'
  sliderLabel: string
  /** 0–100. The challenge is complete when the slider is within `tolerance`. */
  target: number
  tolerance: number
}

export type ChallengeConfig =
  | TapClearChallenge
  | PlaceChallenge
  | FollowPathChallenge
  | SliderChallenge

export interface PlantConfig {
  id: string
  name: string
  description: string
  /** Folder under /public (no leading or trailing slash). */
  assetFolder: string
  /** Six file names (no extension), in growth order. */
  stages: string[]
  /** File name (no extension) of the optional transparent overlay. */
  overlay: string
  harvest: {
    name: string
    /** File name (no extension). */
    image: string
    /** Position of the harvestable item on the plant, in % of the artwork box. */
    x: number
    y: number
  }
  /** Care steps, done in order, before the challenge. */
  care: CareAction[]
  challenge: ChallengeConfig
  /** One line of the manifesto (from content/manifesto.json). */
  manifestoLine: string
}

export interface PlantProgress {
  planted: boolean
  watered: boolean
  /** Number of care steps + challenge completed so far. */
  stepsDone: number
  harvested: boolean
}

export interface GardenState {
  version: 1
  started: boolean
  plants: Record<string, PlantProgress>
}
