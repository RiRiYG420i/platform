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
  color: #252C37;
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
    color: #252C37 !important;
    &:hover { background: #C9A019 !important; }
  }
`

// Force the main Token and Connect buttons in the header to darker yellow
const RedButtonWrapper = styled.div`
  /* Target the immediate GambaUi.Button rendered as a button, not dropdown items */
  & > button,
  & > div > button {
  background: #E0B41B !important;
    color: #252C37 !important;
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
  const [menuOpen, setMenuOpen] = React.useState(false)

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
            <img alt="Gamba logo" src="/logo.png" />
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

          {/* Leaderboard shows only on desktop (also available inside mobile menu) */}
          {isDesktop && (
            <StyledButton>
              <GambaUi.Button onClick={() => setShowLeaderboard(true)}>
                Leaderboard
              </GambaUi.Button>
            </StyledButton>
          )}

          {/* Desktop actions */}
          {isDesktop && (
            <>
              <RedButtonWrapper>
                <TokenSelect />
              </RedButtonWrapper>
              <RedButtonWrapper>
                <UserButton />
              </RedButtonWrapper>
            </>
          )}

          {/* Mobile hamburger */}
          {!isDesktop && (
            <HamburgerButton
              aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span aria-hidden />
              <span aria-hidden />
              <span aria-hidden />
            </HamburgerButton>
          )}
        </div>
      </StyledHeader>

      {/* Mobile overlay menu */}
      {!isDesktop && menuOpen && (
        <MobileMenuOverlay
          role="dialog"
          aria-modal="true"
          id="mobile-menu"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setMenuOpen(false)
          }}
        >
          <MobileScrim onClick={() => setMenuOpen(false)} />
          <MobileSheet>
            <SheetHandle />
            <SheetContent>
              {ENABLE_LEADERBOARD && (
                <GambaUi.Button onClick={() => {
                  setMenuOpen(false)
                  setShowLeaderboard(true)
                }}>
                  Leaderboard
                </GambaUi.Button>
              )}
              <RedButtonWrapper>
                <TokenSelect />
              </RedButtonWrapper>
              <RedButtonWrapper>
                <UserButton />
              </RedButtonWrapper>
            </SheetContent>
          </MobileSheet>
        </MobileMenuOverlay>
      )}
    </>
  )
}

/* ----------------------------- Mobile styles ----------------------------- */
const HamburgerButton = styled.button`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: #E0B41B; /* darker yellow */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  &:hover { background: #C9A019; }
  &:active { transform: scale(0.98); }
  span {
    position: absolute;
    display: block;
    width: 20px;
    height: 2px;
    background: #252C37;
    border-radius: 1px;
    transition: transform 200ms ease, opacity 200ms ease;
  }
  span:nth-child(1) { transform: translateY(-6px); }
  span:nth-child(2) { transform: translateY(0); }
  span:nth-child(3) { transform: translateY(6px); }

  /* When [aria-expanded=true], morph into an X */
  &[aria-expanded='true'] span:nth-child(1) { transform: rotate(45deg); }
  &[aria-expanded='true'] span:nth-child(2) { opacity: 0; }
  &[aria-expanded='true'] span:nth-child(3) { transform: rotate(-45deg); }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    span { transition: none; }
  }
`

const MobileMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
`

const MobileScrim = styled.button`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  border: 0;
  padding: 0;
`

const MobileSheet = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  background: rgba(26, 26, 33, 0.7);
  -webkit-backdrop-filter: blur(18px) saturate(120%);
  backdrop-filter: blur(18px) saturate(120%);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.35);
  padding-bottom: env(safe-area-inset-bottom);
  animation: slideUp 220ms ease;

  @keyframes slideUp {
    from { transform: translateY(12%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const SheetHandle = styled.div`
  width: 40px;
  height: 4px;
  background: #ffffff55;
  border-radius: 2px;
  margin: 10px auto;
`

const SheetContent = styled.div`
  display: grid;
  gap: 12px;
  padding: 16px;
  & > * { width: 100%; }
`
