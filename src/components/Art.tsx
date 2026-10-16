import { useState } from 'react'

/** Formats an illustrator may supply, tried in this order (first one found wins). */
const EXTENSIONS = ['png', 'webp', 'svg']

/** Remembers which extension worked for each file so we only probe once. */
const resolved = new Map<string, number>()

interface ArtProps {
  /** Path under /public without extension, e.g. "assets/plants/rose/young". */
  base: string
  className?: string
  alt?: string
}

function ArtInner({ base, className, alt = '' }: ArtProps) {
  const [index, setIndex] = useState(() => resolved.get(base) ?? 0)
  if (index >= EXTENSIONS.length) return null
  const src = `${import.meta.env.BASE_URL}${base}.${EXTENSIONS[index]}`
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      draggable={false}
      onLoad={() => resolved.set(base, index)}
      onError={() => {
        resolved.set(base, index + 1)
        setIndex(index + 1)
      }}
    />
  )
}

/**
 * Draws a replaceable illustration. Tries base.png, base.webp, then base.svg;
 * draws nothing if none exist (so optional layers like overlays can be absent).
 */
export function Art(props: ArtProps) {
  return <ArtInner key={props.base} {...props} />
}
