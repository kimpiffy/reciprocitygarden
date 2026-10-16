import { useEffect, useRef, type RefObject } from 'react'
import { Art } from './Art'

interface Props {
  base: string
  from: DOMRect
  /** Element to fly towards. */
  target: RefObject<HTMLElement | null>
  onDone: () => void
}

/** A harvested item travelling from the plant into the basket. */
export function FlyingItem({ base, from, target, onDone }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  })

  useEffect(() => {
    const node = el.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dest = target.current
    if (!node || !dest || reduce) {
      done.current()
      return
    }
    const to = dest.getBoundingClientRect()
    const dx = to.left + to.width / 2 - (from.left + from.width / 2)
    const dy = to.top + to.height / 2 - (from.top + from.height / 2)
    void node.offsetWidth // commit the start position before animating
    node.style.transform = `translate(${dx}px, ${dy}px) scale(0.45)`
    const timer = setTimeout(() => done.current(), 900)
    return () => clearTimeout(timer)
  }, [from, target])

  return (
    <div
      className="flying-item"
      ref={el}
      aria-hidden="true"
      style={{ left: from.left, top: from.top, width: from.width, height: from.height }}
    >
      <Art base={base} />
    </div>
  )
}
