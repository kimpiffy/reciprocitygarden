import { useEffect, useReducer } from 'react'
import { ArtPreview } from './components/ArtPreview'
import { Garden } from './components/Garden'
import { IntroductionScreen } from './components/IntroductionScreen'
import { gardenReducer } from './logic/garden'
import { loadState, saveState } from './logic/storage'

export default function App() {
  const [state, dispatch] = useReducer(gardenReducer, undefined, loadState)

  useEffect(() => saveState(state), [state])

  if (new URLSearchParams(window.location.search).has('preview')) return <ArtPreview />
  return state.started ? (
    <Garden state={state} dispatch={dispatch} />
  ) : (
    <IntroductionScreen onStart={() => dispatch({ type: 'start' })} />
  )
}
