// src/sections/Dashboard/FeaturedGameViewport.tsx
import React from 'react'
import { GambaUi } from 'gamba-react-ui-v2'

import { GAMES } from '../../games'
import { FEATURED_GAME_ID, FEATURED_GAME_INLINE } from '../../constants'
import { GameViewport } from '../Game/GameViewport'
import { Container as GameContainer, Screen as GameScreen, Controls as GameControls, InlineControlsArea } from '../Game/Game.styles'

export default function FeaturedGameViewport() {
  if (!FEATURED_GAME_INLINE || !FEATURED_GAME_ID) return null
  const game = GAMES.find((g) => (g as any).id === FEATURED_GAME_ID)
  if (!game) return null

  const hasInlineControls = FEATURED_GAME_ID === 'slots'

  return (
    <GameViewport>
      <GambaUi.Game
        game={game}
        errorFallback={<p style={{ color: 'white', textAlign: 'center' }}>Unable to load game.</p>}
      >
        <GameContainer style={{ gap: 10, width: '100%' }}>
          <GameScreen $fill>
            <GambaUi.PortalTarget target="screen" />
          </GameScreen>

          {!hasInlineControls && (
            <InlineControlsArea>
              <GambaUi.PortalTarget target="inline" />
            </InlineControlsArea>
          )}

          {!hasInlineControls && (
            <GameControls
              style={{
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <GambaUi.PortalTarget target="controls" />
              <GambaUi.PortalTarget target="play" />
            </GameControls>
          )}
        </GameContainer>
      </GambaUi.Game>
    </GameViewport>
  )
}
