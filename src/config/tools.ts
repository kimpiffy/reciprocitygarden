import type { CareAction, IconName } from '../types'

/** Labels and icons for the care tools in the toolbar. */
export const CARE_TOOLS: Record<CareAction, { label: string; icon: IconName; doneMessage: string }> = {
  water: { label: 'Watering can', icon: 'water', doneMessage: 'Lovely, that was a good drink.' },
  compost: { label: 'Compost', icon: 'compost', doneMessage: 'Rich and crumbly. Just what it wanted.' },
  prune: { label: 'Pruning shears', icon: 'prune', doneMessage: 'A tidy trim. It looks happier.' },
  weed: { label: 'Weeding fork', icon: 'weed', doneMessage: 'The weeds are gone. More room to grow.' },
}
