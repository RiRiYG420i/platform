// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useUserBalance,
} from 'gamba-react-ui-v2'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Modal } from '../components/Modal'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal'
import { PLATFORM_CREATOR_ADDRESS } from '../constants'
import { useMediaQuery } from '../hooks/useMediaQuery'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'
import { ENABLE_LEADERBOARD } from '../constants'

const Bonus = styled.button`
  all: unset;
  cursor: pointer;
  color: #121212;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  background: #E0B41B; /* slightly darker than header background */
  transition: background-color 0.2s, transform 0.2s ease;
  &:hover {
  background: #C9A019;
    transform: translateY(-1px);
  }
`

const StyledHeader = styled.div<{ $scrolled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background: ${(props: { $scrolled: boolean }) => (props.$scrolled ? 'rgba(236, 209, 30, 0.5)' : '#ECD11E')};
  transition: background 200ms ease;
  backdrop-filter: blur(20px);
  color: #121212;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`

const Logo = styled(NavLink)`
  height: 35px;
  margin: 0 15px;
  & > img {
    height: 120%;
  }
`

const StyledButton = styled.div`
  button {
    background: #E0B41B !important; /* darker yellow */
    color: #121212 !important;
    border: none !important;
    &:hover { background: #C9A019 !important; }
  }
`

// Force the main Token and Connect buttons in the header to darker yellow
const RedButtonWrapper = styled.div`
  /* Target the immediate GambaUi.Button rendered as a button, not dropdown items */
  & > button,
  & > div > button {
    background: #E0B41B !important;
    color: #121212 !important;
    border: none !important;
  }
  & > button:hover,
  & > div > button:hover {
    background: #C9A019 !important;
  }
`

export default function Header() {
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const isDesktop = useMediaQuery('lg') 
  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have <b>
              <TokenValue amount={balance.bonusBalance} />
            </b>{' '}
            worth of free plays. This bonus will be applied automatically when you
            play.
          </p>
          <p>Note that a fee is still needed from your wallet for each play.</p>
        </Modal>
      )}

      

      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

  <StyledHeader $scrolled={scrolled}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Logo to="/">
            <img alt="Gamba logo" src="/logo.svg" />
          </Logo>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Jackpot indicator moved to WelcomeBanner */}

          {balance.bonusBalance > 0 && (
            <Bonus onClick={() => setBonusHelp(true)}>
              ✨ <TokenValue amount={balance.bonusBalance} />
            </Bonus>
          )}

          {/* Leaderboard shows only on desktop */}
          {isDesktop && (
            <StyledButton>
              <GambaUi.Button onClick={() => setShowLeaderboard(true)}>
                Leaderboard
              </GambaUi.Button>
            </StyledButton>
          )}

          <RedButtonWrapper>
            <TokenSelect />
          </RedButtonWrapper>
          <RedButtonWrapper>
            <UserButton />
          </RedButtonWrapper>
        </div>
      </StyledHeader>
    </>
  )
}
