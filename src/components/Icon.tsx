import type { IconName } from '../types'

const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Simple placeholder icons. Decorative: always pair with a text label. */
export function Icon({ name, size = 28 }: { name: IconName; size?: number }) {
  let body
  switch (name) {
    case 'seed':
      body = <><ellipse cx="12" cy="13" rx="5" ry="7" transform="rotate(30 12 13)" /><path d="M12 6 q1 -3 4 -3" /></>
      break
    case 'water':
      body = <><path d="M4 10 h11 v8 a2 2 0 0 1 -2 2 h-7 a2 2 0 0 1 -2 -2z" /><path d="M15 12 l6 -5 M3 10 q-1 -4 3 -4 h2" /><path d="M20 12 v2 M22 13 v2" /></>
      break
    case 'compost':
      body = <><path d="M4 20 q2 -9 8 -9 t8 9z" /><path d="M9 16 h.01 M13 15 h.01 M15 18 h.01 M11 18 h.01" /></>
      break
    case 'prune':
      body = <><circle cx="6" cy="18" r="3" /><circle cx="18" cy="18" r="3" /><path d="M8 16 L18 3 M16 16 L6 3" /></>
      break
    case 'weed':
      body = <><path d="M12 21 v-9 M12 14 q-6 0 -7 -8 q7 0 7 8 M12 12 q6 0 7 -7 q-7 0 -7 7" /><path d="M5 21 h14" /></>
      break
    case 'cane':
      body = <><path d="M12 2 v20 M8 8 l8 0 M8 14 l8 0" /></>
      break
    case 'shelter':
      body = <><path d="M12 3 l8 3 v6 q0 6 -8 9 q-8 -3 -8 -9 v-6z" /></>
      break
    case 'bug':
      body = <><ellipse cx="12" cy="14" rx="5" ry="6" /><path d="M12 8 v12 M7 11 l-3 -2 M17 11 l3 -2 M7 15 h-4 M17 15 h4 M8 19 l-3 2 M16 19 l3 2" /></>
      break
    case 'puddle':
      body = <path d="M12 3 q6 8 6 12 a6 6 0 0 1 -12 0 q0 -4 6 -12z" />
      break
    case 'bee':
      body = <><ellipse cx="12" cy="14" rx="6" ry="5" /><path d="M9 9 q-2 -5 0 -6 q3 1 3 6 M15 9 q2 -5 0 -6 q-3 1 -3 6 M9 13 v2 M13 12 v4" /></>
      break
    case 'sun':
      body = <><circle cx="12" cy="12" r="4" /><path d="M12 2 v3 M12 19 v3 M2 12 h3 M19 12 h3 M5 5 l2 2 M17 17 l2 2 M19 5 l-2 2 M7 17 l-2 2" /></>
      break
    case 'dead-cane':
      body = <><path d="M12 21 V4 M8 8 h8 M8 13 h8 M10 3 l2 2 2 -2" /><path d="M9 18 l2 -2 2 2" /></>
      break
    case 'damaged-branch':
      body = <><path d="M12 21 V12 l-5 -5 M12 15 l5 -5 M7 7 5 4 M17 10 l3 -3" /><path d="M3 5 l3 3 M4 3 l3 3" /></>
      break
    case 'fallen-leaf':
      body = <><path d="M5 19 C5 9 11 4 20 4 C20 13 15 19 5 19 Z" /><path d="M5 19 C9 14 13 10 18 7" /></>
      break
    case 'litter':
      body = <><path d="M8 5 h8 l-1 16 H9z M7 5 h10 M10 2 h4 M11 9 v8 M14 9 v8" /></>
      break
    case 'support':
      body = <><path d="M6 22 V5 M18 22 V5 M6 13 h12 M6 19 h12 M12 4 v7" /><path d="M12 3 q-4 0 -4 -3 M12 3 q4 0 4 -3" /></>
      break
    case 'trellis':
      body = <><path d="M5 22 V3 M19 22 V3 M5 8 h14 M5 14 h14 M5 20 h14 M5 8 l14 12 M19 8 5 20" /></>
      break
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...common}>
      {body}
    </svg>
  )
}
