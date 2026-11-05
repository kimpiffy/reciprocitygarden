import { useState } from 'react'

/** Formats an illustrator may supply, tried in this order (first one found wins). */
const EXTENSIONS = ['png', 'webp', 'svg']

interface ArtProps {
  /** Path under /public without extension, e.g. "assets/plants/rose/young". */
  base: string
  className?: string
  alt?: string
}

function ArtInner({ base, className, alt = '' }: ArtProps) {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  if (index >= EXTENSIONS.length) return null
  const src = `${import.meta.env.BASE_URL}${base}.${EXTENSIONS[index]}`
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      draggable={false}
      style={{ visibility: loaded ? 'visible' : 'hidden' }}
      onLoad={() => setLoaded(true)}
      onError={() => setIndex(index + 1)}
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
