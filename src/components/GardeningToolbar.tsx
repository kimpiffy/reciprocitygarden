import seedPacket from '../../seedpacket.png'
import openSeedPacket from '../../seedpacktopen.png'
import wateringCan from '../../wateringcan.png'
import wateringCanPour from '../../wateringcanpour.png'
import compost from '../../compost.png'
import { CARE_TOOLS } from '../config/tools'
import type { CareAction } from '../types'
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
        aria-label="Seed packet"
        aria-pressed={tool === 'seed'}
        aria-disabled={!available.seed}
        onClick={() => onSelect('seed')}
      >
        <img
          key={tool === 'seed' ? openSeedPacket : seedPacket}
          src={tool === 'seed' ? openSeedPacket : seedPacket}
          className="seed-packet-art"
          alt=""
          draggable={false}
          style={{ visibility: 'hidden' }}
          onLoad={(e) => { e.currentTarget.style.visibility = 'visible' }}
          onError={(e) => {
            console.error('Failed to load gardening tool image:', e.currentTarget.src)
            e.currentTarget.style.visibility = 'hidden'
          }}
        />
      </button>
      <div className="tool-grid">
        {careTools.map((id) => (
          <button
            key={id}
            type="button"
            className={cls(id)}
            aria-label={id === 'water' || id === 'compost' ? CARE_TOOLS[id].label : undefined}
            aria-pressed={tool === id}
            aria-disabled={!available[id]}
            onClick={() => onSelect(id)}
          >
            {id === 'water' || id === 'compost' ? (
              <img
                key={id === 'water' ? (tool === 'water' ? wateringCanPour : wateringCan) : compost}
                src={id === 'water' ? (tool === 'water' ? wateringCanPour : wateringCan) : compost}
                className={id === 'water' ? 'watering-can-art' : 'compost-art'}
                alt=""
                draggable={false}
                style={{ visibility: 'hidden' }}
                onLoad={(e) => { e.currentTarget.style.visibility = 'visible' }}
                onError={(e) => {
                  console.error('Failed to load gardening tool image:', e.currentTarget.src)
                  e.currentTarget.style.visibility = 'hidden'
                }}
              />
            ) : (
              <>
                <Icon name={CARE_TOOLS[id].icon} size={34} />
                <span>{CARE_TOOLS[id].label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
