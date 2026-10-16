import intro from '../content/intro.json'

export function IntroductionScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="intro">
      <div className="intro-card">
        <h1>{intro.title}</h1>
        {intro.paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
        <button type="button" className="big-button" onClick={onStart}>
          {intro.buttonLabel}
        </button>
      </div>
    </main>
  )
}
