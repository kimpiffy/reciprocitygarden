import { useEffect, useRef } from 'react'
import manifesto from '../content/manifesto.json'
import { Art } from './Art'

interface Props {
  /** True once every harvest item is in the basket. */
  available: boolean
  open: boolean
  onOpen: () => void
  onClose: () => void
  onRestart: () => void
  lines: string[]
}

/** The envelope that appears once the basket is full, and the unfolded manifesto. */
export function ManifestoLetter({ available, open, onOpen, onClose, onRestart, lines }: Props) {
  const envelope = useRef<HTMLButtonElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (open) heading.current?.focus()
    else if (wasOpen.current) envelope.current?.focus()
    wasOpen.current = open
  }, [open])

  if (!available) return null
  return (
    <>
      {!open && (
        <button
          type="button"
          className="envelope pulse"
          onClick={onOpen}
          aria-label="A letter has arrived. Open it to read our manifesto."
          ref={envelope}
        >
          <Art base="assets/ui/letter-closed" className="envelope-art" />
          <span>Open the letter</span>
        </button>
      )}
      {open && (
        <div className="letter-backdrop">
          <div
            className="letter"
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-title"
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          >
            <Art base="assets/ui/letter-open" className="letter-art" />
            <div className="letter-content">
              <h2 id="letter-title" tabIndex={-1} ref={heading}>{manifesto.title}</h2>
              <p className="letter-intro">{manifesto.intro}</p>
              <ol>
                {lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
              <p className="letter-signoff">{manifesto.signoff}</p>
              <div className="letter-actions">
                <button type="button" onClick={onClose}>Back to the garden</button>
                <button type="button" onClick={onRestart}>Grow the garden again</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
