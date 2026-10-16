import { CARE_TOOLS } from '../config/tools'
import type { CareAction } from '../types'
import { Art } from './Art'
import { Icon } from './Icon'

export type ToolId = 'seed' | CareAction

interface Props {
  tool: ToolId | null
  /** Care tools to show (only those some plant uses). */
  careTools: CareAction[]
  available: Record<ToolId, boolean>
  /** The tool to draw attention to with a gentle pulse. */
  pulse: ToolId | null
  onSelect: (tool: ToolId) => void
}

export function GardeningToolbar({ tool, careTools, available, pulse, onSelect }: Props) {
  const cls = (id: ToolId) =>
    `tool${tool === id ? ' tool-selected' : ''}${pulse === id ? ' pulse' : ''}${available[id] ? '' : ' tool-locked'}`
  return (
    <div className="toolbar" role="toolbar" aria-label="Gardening tools">
      <button
        type="button"
        className={`${cls('seed')} seed-packet`}
        aria-pressed={tool === 'seed'}
        aria-disabled={!available.seed}
        onClick={() => onSelect('seed')}
      >
        <Art base="assets/ui/seed-packet" className="seed-packet-art" />
        <span>Seed packet</span>
      </button>
      {careTools.map((id) => (
        <button
          key={id}
          type="button"
          className={cls(id)}
          aria-pressed={tool === id}
          aria-disabled={!available[id]}
          onClick={() => onSelect(id)}
        >
          <Icon name={CARE_TOOLS[id].icon} size={34} />
          <span>{CARE_TOOLS[id].label}</span>
        </button>
      ))}
    </div>
  )
}
