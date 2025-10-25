// src/sections/Game/GameViewport.tsx
import React from 'react'
import styled from 'styled-components'

/**
 * GameViewport
 *
 * A fixed viewport that sits directly under the Header and spans the full
 * width and (safe) viewport height. It also manages scroll locking while
 * mounted so the background content doesn't scroll behind the game.
 */
const Viewport = styled.div`
  position: fixed;
  top: var(--header-height, 60px);
  left: 0;
  width: 100vw;
  /* Prefer small viewport units for stability on mobile address bar changes */
  height: calc(100svh - var(--header-height, 60px));
  max-height: calc(100svh - var(--header-height, 60px));
  /* Fallbacks for environments without svh support */
  @supports not (height: 100svh) {
    height: calc(100dvh - var(--header-height, 60px));
    max-height: calc(100dvh - var(--header-height, 60px));
  }
  @supports not (height: 100dvh) {
    height: calc(100vh - var(--header-height, 60px));
    max-height: calc(100vh - var(--header-height, 60px));
  }

  z-index: 5; /* Below header, above background content */
  display: grid;
  grid-template-rows: 1fr; /* children can stretch */
  width: 100vw;
  /* Respect safe areas on devices with sensor housings */
  padding-bottom: env(safe-area-inset-bottom, 0);
  background: transparent;
`

type GameViewportProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function GameViewport({ children, className, style }: GameViewportProps) {
  React.useEffect(() => {
    // Lock background scroll while the game viewport is active
    document.body.classList.add('game-fullscreen')
    return () => {
      document.body.classList.remove('game-fullscreen')
    }
  }, [])

  return (
    <Viewport className={`game-viewport${className ? ' ' + className : ''}`} style={style}>
      {children}
    </Viewport>
  )
}

export default GameViewport
