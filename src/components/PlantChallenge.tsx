import { useEffect, useRef, useState } from 'react'
import type { ChallengeConfig } from '../types'
import { Icon } from './Icon'

interface Props {
  challenge: ChallengeConfig
  onComplete: () => void
}

/** Gives the finishing animation a moment to play before the plant moves on. */
function useFinish(finished: boolean, onComplete: () => void) {
  const latest = useRef(onComplete)
  useEffect(() => {
    latest.current = onComplete
  })
  useEffect(() => {
    if (!finished) return
    const timer = setTimeout(() => latest.current(), 700)
    return () => clearTimeout(timer)
  }, [finished])
}

/** Evenly spreads item `i` of `n` across the plant box (positions in %). */
const spot = (i: number, n: number) => ({
  left: `${n === 1 ? 50 : 18 + (i * 64) / (n - 1)}%`,
  top: `${i % 2 === 0 ? 62 : 44}%`,
})

/**
 * Renders the interactive part of a challenge. Add a new mechanic by adding a
 * type in types.ts and a component + case here (see docs/DEVELOPER_GUIDE.md).
 */
export function PlantChallenge({ challenge, onComplete }: Props) {
  switch (challenge.type) {
    case 'tap-clear':
      return <TapClear challenge={challenge} onComplete={onComplete} />
    case 'place':
      return <Place challenge={challenge} onComplete={onComplete} />
    case 'follow-path':
      return <FollowPath challenge={challenge} onComplete={onComplete} />
    case 'slider':
      return <Slider challenge={challenge} onComplete={onComplete} />
  }
}

function TapClear({ challenge, onComplete }: { challenge: Extract<ChallengeConfig, { type: 'tap-clear' }>; onComplete: () => void }) {
  const [cleared, setCleared] = useState<number[]>([])
  const finished = cleared.length >= challenge.items
  useFinish(finished, onComplete)
  return (
    <>
      {Array.from({ length: challenge.items }, (_, i) =>
        cleared.includes(i) ? null : (
          <button
            key={i}
            type="button"
            className="challenge-item pop-in"
            style={spot(i, challenge.items)}
            aria-label={`${challenge.itemLabel} ${i + 1} of ${challenge.items}. Tap to clear it.`}
            onClick={() => setCleared((c) => [...c, i])}
          >
            <Icon name={challenge.icon} size={30} />
          </button>
        ),
      )}
      {finished && <span className="challenge-done" aria-hidden="true">✓</span>}
    </>
  )
}

function Place({ challenge, onComplete }: { challenge: Extract<ChallengeConfig, { type: 'place' }>; onComplete: () => void }) {
  const [placed, setPlaced] = useState(false)
  useFinish(placed, onComplete)
  return placed ? (
    <span className="challenge-placed" aria-hidden="true"><Icon name={challenge.icon} size={56} /></span>
  ) : (
    <button type="button" className="challenge-place" onClick={() => setPlaced(true)}>
      <Icon name={challenge.icon} size={26} />
      <span>{challenge.buttonLabel}</span>
    </button>
  )
}

function FollowPath({ challenge, onComplete }: { challenge: Extract<ChallengeConfig, { type: 'follow-path' }>; onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const finished = progress >= challenge.steps
  useFinish(finished, onComplete)
  const point = (i: number) => ({ left: `${12 + (i * 38) / challenge.steps}%`, top: `${75 - (i * 55) / challenge.steps}%` })
  return (
    <>
      <span className="challenge-guide" style={point(Math.min(progress, challenge.steps))} aria-hidden="true">
        <Icon name="bee" size={34} />
      </span>
      {!finished && (
        <button
          type="button"
          className="challenge-item challenge-target pop-in"
          style={point(progress + 1)}
          aria-label={`${challenge.guideLabel}: move to the next spot, step ${progress + 1} of ${challenge.steps}`}
          onClick={() => setProgress((n) => n + 1)}
        />
      )}
    </>
  )
}

function Slider({ challenge, onComplete }: { challenge: Extract<ChallengeConfig, { type: 'slider' }>; onComplete: () => void }) {
  const [value, setValue] = useState(0)
  const finished = Math.abs(value - challenge.target) <= challenge.tolerance
  useFinish(finished, onComplete)
  return (
    <>
      <span className={`challenge-sun${finished ? ' lit' : ''}`} style={{ left: `${10 + value * 0.8}%` }} aria-hidden="true">
        <Icon name="sun" size={40} />
      </span>
      <label className="challenge-slider">
        <span>{challenge.sliderLabel}</span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </label>
    </>
  )
}
