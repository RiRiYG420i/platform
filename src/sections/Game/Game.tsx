// src/sections/Game/Game.tsx
import React from 'react'
import { useParams } from 'react-router-dom'
import { GambaUi, useSoundStore } from 'gamba-react-ui-v2'
import { useTransactionError } from 'gamba-react-v2'

import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import { GAMES } from '../../games'
import { useUserStore } from '../../hooks/useUserStore'
import { GameSlider } from '../Dashboard/Dashboard'
import slotsBg from '../../games/Slots/assets/bg.jpg'
import slotsHeader from '../../games/Slots/assets/header.png'
import { Container, Controls, IconButton, InlineControlsArea, MetaControls, Screen, Spinner, Splash } from './Game.styles'
import { GameViewport } from './GameViewport'
import { LoadingBar, useLoadingState } from './LoadingBar'
import { ProvablyFairModal } from './ProvablyFairModal'
import { TransactionModal } from './TransactionModal'

function CustomError() {
  return (
    <GambaUi.Portal target="error">
      <GambaUi.Responsive>
  <h1>Oh no!</h1>
        <p>Something went wrong</p>
      </GambaUi.Responsive>
    </GambaUi.Portal>
  )
}

function CustomRenderer() {
  const { game } = GambaUi.useGame()
  const [info, setInfo] = React.useState(false)
  const [provablyFair, setProvablyFair] = React.useState(false)
  const soundStore = useSoundStore()
  const firstTimePlaying = useUserStore(s => !s.gamesPlayed.includes(game.id))
  const markGameAsPlayed = useUserStore(s => () => s.markGameAsPlayed(game.id, true))
  const [ready, setReady] = React.useState(false)
  const [txModal, setTxModal] = React.useState(false)
  const loading = useLoadingState()

  // hasInlineControls: games like Slots render their own controls inside the screen
  const hasInlineControls = game.id === 'slots'
  const isSlots = hasInlineControls

  React.useEffect(() => {
    const t = setTimeout(() => setReady(true), 750)
    return () => clearTimeout(t)
  }, [])

  React.useEffect(() => {
    const t = setTimeout(() => setInfo(firstTimePlaying), 1000)
    return () => clearTimeout(t)
  }, [firstTimePlaying])

  const closeInfo = () => {
    markGameAsPlayed()
    setInfo(false)
  }

  // global transaction errors
  useTransactionError(err => {
    if (err.message === 'NOT_CONNECTED') return
    // you might want to show a toast here
  })

  return (
    <>
      {info && (
        <Modal onClose={closeInfo}>
          <h1>
            <img height="100" title={game.meta.name} src={game.meta.image} />
          </h1>
          <p>{game.meta.description}</p>
          <GambaUi.Button main onClick={closeInfo}>Play</GambaUi.Button>
        </Modal>
      )}
      {provablyFair && <ProvablyFairModal onClose={() => setProvablyFair(false)} />}
      {txModal     && <TransactionModal onClose={() => setTxModal(false)} />}

      <GameViewport
        className={isSlots ? 'slots-global-hero' : undefined}
        style={isSlots ? {
          backgroundImage: `url(${slotsBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0C0C11',
        } : undefined}
      >
        <div style={{ display: 'grid', gridTemplateRows: isSlots ? 'auto 1fr' : '1fr', width: '100%', height: '100%' }}>
          {isSlots && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 6 }}>
              <img src={slotsHeader} alt="Slots header" style={{ height: 60, width: 'auto' }} />
            </div>
          )}
        <Container>
        <Screen $fill>
          <Splash><img height="150" src={game.meta.image} /></Splash>
          <GambaUi.PortalTarget target="error" />
          {ready && <GambaUi.PortalTarget target="screen" />}

          <MetaControls>
            <IconButton onClick={() => setInfo(true)}><Icon.Info /></IconButton>
            <IconButton onClick={() => setProvablyFair(true)}><Icon.Fairness /></IconButton>
            <IconButton onClick={() => soundStore.set(soundStore.volume ? 0 : .5)}>
              {soundStore.volume ? <Icon.Volume /> : <Icon.VolumeMuted />}
            </IconButton>
          </MetaControls>
        </Screen>

        {/* Inline controls host directly under the screen (only when game doesn't have inline controls) */}
        {!hasInlineControls && (
          <InlineControlsArea>
            <GambaUi.PortalTarget target="inline" />
          </InlineControlsArea>
        )}

        {!hasInlineControls && <LoadingBar />}

        {/* Global controls/play area (suppressed for games with their own inline controls) */}
        {!hasInlineControls && (
          <Controls>
            <GambaUi.PortalTarget target="controls" />
            <GambaUi.PortalTarget target="play" />
          </Controls>
        )}
        </Container>
        </div>
      </GameViewport>
    </>
  )
}

export default function Game() {
  const { gameId } = useParams()
  const game = GAMES.find(g => g.id === gameId)

  return (
    <>
      {game ? (
          <GambaUi.Game game={game} errorFallback={<CustomError />} children={<CustomRenderer />} />
      ) : (
        <h1>Game not found!</h1>
      )}
      <GameSlider />
    </>
  )
}
