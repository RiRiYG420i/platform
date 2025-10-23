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
import { LANG_B_GRADIENT } from '../styles'
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
  /* Match footer background color */
  background: rgba(37, 44, 55, 0.6);
  transition: background 200ms ease;
  backdrop-filter: blur(20px);
  color: #252C37;
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
    background: ${LANG_B_GRADIENT} !important;
    color: #252C37 !important;
  }
`

// Force the main Token and Connect buttons in the header to darker yellow
const RedButtonWrapper = styled.div`
  /* Target the immediate GambaUi.Button rendered as a button, not dropdown items */
  & > button,
  & > div > button {
    background: ${LANG_B_GRADIENT} !important;
    color: #252C37 !important;
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
  // Swipe-to-dismiss state (mobile sheet)
  const [dragX, setDragX] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const startXRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Gesture handlers for the side sheet (mobile)
  const onSheetPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startXRef.current = e.clientX
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onSheetPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || startXRef.current == null) return
    const dx = e.clientX - startXRef.current
    // Only allow dragging towards the right (to dismiss)
    setDragX(Math.max(0, dx))
  }
  const onSheetPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startXRef.current == null) return
    const dx = e.clientX - startXRef.current
    startXRef.current = null
    setDragging(false)
    const threshold = 80
    if (dx > threshold) {
      // Dismiss the sheet
      setMenuOpen(false)
      setDragX(0)
    } else {
      // Snap back
      setDragX(0)
    }
  }

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
          <MobileSheet
            onPointerDown={onSheetPointerDown}
            onPointerMove={onSheetPointerMove}
            onPointerUp={onSheetPointerUp}
            style={{
              transform: `translateX(${dragX}px)`,
              transition: dragging ? 'none' : 'transform 220ms ease',
              touchAction: 'none',
            }}
          >
            <SheetHandle />
            <SheetContent>
              {ENABLE_LEADERBOARD && (
                <GambaUi.Button
                  style={{
                    background: LANG_B_GRADIENT,
                    minHeight: 48,
                  }}
                  onClick={() => {
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
const littleB = new URL('../../buttons/little-b.svg', import.meta.url).href

const HamburgerButton = styled.button`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: rgba(37, 44, 55, 0.55);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  background-image: url(${littleB});
  background-size: 70% auto;
  background-position: center;
  background-repeat: no-repeat;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06);
  &:hover { opacity: 0.9; }
  &:active { transform: scale(0.98); }
  span {
    display: none; /* we now use the SVG background instead of bars */
  }
  span:nth-child(1), span:nth-child(2), span:nth-child(3) { display: none; }

  /* bars disabled as we use image background */

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
  top: 0; bottom: 0; right: 0; left: auto;
  width: min(420px, 86vw);
  background: rgba(26, 26, 33, 0.7);
  -webkit-backdrop-filter: blur(18px) saturate(120%);
  backdrop-filter: blur(18px) saturate(120%);
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  box-shadow: -10px 0 30px rgba(0,0,0,0.35);
  padding-bottom: env(safe-area-inset-bottom);
  animation: slideIn 240ms ease;
  will-change: transform;

  @keyframes slideIn {
    from { transform: translateX(12%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const SheetHandle = styled.div`
  width: 26px;
  height: 4px;
  background: #ffffff55;
  border-radius: 2px;
  margin: 10px auto 6px 12px;
`

const SheetContent = styled.div`
  display: grid;
  gap: 12px;
  padding: 16px;
  & > * { width: 100%; }
`
