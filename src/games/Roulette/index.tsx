import { computed } from '@preact/signals-react'
import { GambaUi, TokenValue, useCurrentPool, useCurrentToken, useSound, useUserBalance } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import styled from 'styled-components'
import { Chip } from './Chip'
import { StyledResults } from './Roulette.styles'
export default function Roulette() {
  const game = GambaUi.useGame()
  const token = useCurrentToken()
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const gamba = useGamba()

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
  })

  const wager = totalChipValue.value * token.baseWager / 10_000

  const multiplier = Math.max(...bet.value)
  const maxPayout = multiplier * wager
  const maxPayoutExceeded = maxPayout > pool.maxPayout
  const balanceExceeded = wager > (balance.balance + balance.bonusBalance)

  const play = async () => {
    await game.play({
      bet: bet.value,
      wager,
    })
    sounds.play('play')
    const result = await game.result()
    addResult(result.resultIndex)
    if (result.payout > 0) {
      sounds.play('win')
    } else {
      sounds.play('lose')
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <ScreenGrid>
          <GambaUi.Responsive>
            <Wrapper onContextMenu={(e) => e.preventDefault()}>
              <Stats />
              <Results />
              <Table />
            </Wrapper>
          </GambaUi.Responsive>
          <ControlsInline>
            <GambaUi.Select
              options={CHIPS}
              value={selectedChip.value}
              onChange={(value: number) => selectedChip.value = value}
              label={(value: number) => (
                <>
                  <Chip value={value} /> = <TokenValue amount={token.baseWager * value} />
                </>
              )}
            />
            <GambaUi.Button
              disabled={!wager || gamba.isPlaying}
              onClick={clearChips}
            >
              Clear
            </GambaUi.Button>
            <GambaUi.Button main disabled={!wager || balanceExceeded || maxPayoutExceeded} onClick={play}>
              Spin
            </GambaUi.Button>
          </ControlsInline>
        </ScreenGrid>
      </GambaUi.Portal>
    </>
  )
}

const ScreenGrid = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  align-items: stretch;
  min-height: 0;
`
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const gamba = useGamba()

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
  })

  const wager = totalChipValue.value * token.baseWager / 10_000

  const multiplier = Math.max(...bet.value)
  const maxPayout = multiplier * wager
  const maxPayoutExceeded = maxPayout > pool.maxPayout
  const balanceExceeded = wager > (balance.balance + balance.bonusBalance)

  const play = async () => {
    await game.play({
      bet: bet.value,
      wager,
          <GambaUi.Portal target="screen">
            <ScreenGrid>
              <GambaUi.Responsive>
                <Wrapper onContextMenu={(e) => e.preventDefault()}>
                  <Stats />
                  <Results />
                  <Table />
                </Wrapper>
              </GambaUi.Responsive>
              <ControlsInline>
                <GambaUi.Select
                  options={CHIPS}
                  value={selectedChip.value}
                  onChange={(value: number) => selectedChip.value = value}
                  label={(value: number) => (
                    <>
                      <Chip value={value} /> = <TokenValue amount={token.baseWager * value} />
                    </>
                  )}
                />
                <GambaUi.Button
                  disabled={!wager || gamba.isPlaying}
                  onClick={clearChips}
                >
                  Clear
                </GambaUi.Button>
                <GambaUi.Button main disabled={!wager || balanceExceeded || maxPayoutExceeded} onClick={play}>
                  Spin
                </GambaUi.Button>
              </ControlsInline>
            </ScreenGrid>
          </GambaUi.Portal>
            )}
          />
          <GambaUi.Button
            disabled={!wager || gamba.isPlaying}
            onClick={clearChips}

    const ScreenGrid = styled.div`
      height: 100%;
      display: grid;
      grid-template-rows: minmax(0, 1fr) auto;
      align-items: stretch;
      min-height: 0;
    `
          >
            Clear
          </GambaUi.Button>
          <GambaUi.Button main disabled={!wager || balanceExceeded || maxPayoutExceeded} onClick={play}>
            Spin
          </GambaUi.Button>
        </ControlsInline>
      </GambaUi.Portal>
    </>
  )
}
