// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useUserBalance,
  useGambaPlatformContext,
} from 'gamba-react-ui-v2'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { LANG_B_GRADIENT } from '../styles'
import { Modal } from '../components/Modal'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal'
import { PLATFORM_CREATOR_ADDRESS, PLATFORM_JACKPOT_FEE } from '../constants'
import { useUserStore } from '../hooks/useUserStore'
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


const StyledHeader = styled.div<{ $scrolled: boolean; $hidden: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  /* Match footer background color */
  background: rgba(37, 44, 55, 0.6);
  transition: background 200ms ease, transform 250ms ease;
  backdrop-filter: blur(20px);
  color: #252C37;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  /* Match corner radius with buttons and game cards */
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transform: translateY(${(p: { $hidden: boolean }) => (p.$hidden ? '-110%' : '0')});
`

const Logo = styled(NavLink)`
  height: 35px;
  margin: 0 15px;
  & > img { height: 120%; }
`

// Wrapper to apply the gradient style to any direct child button
const StyledButton = styled.div`
  & > button {
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
  const location = useLocation()
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const context = useGambaPlatformContext()
  const isDesktop = useMediaQuery('lg') 
  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const user = useUserStore()
  // Mobile header hide/show on scroll + swipe-to-reveal
  const [headerHidden, setHeaderHidden] = React.useState(false)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)
  const lastYRef = React.useRef<number>(0)
  const pullStartYRef = React.useRef<number | null>(null)
  const pullingRef = React.useRef<boolean>(false)
  // Swipe-to-dismiss state (mobile sheet)
  const [dragX, setDragX] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const startXRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 5)
      // Only apply hide/show on mobile screens and when the menu is closed
      if (!isDesktop && !menuOpen) {
        const prev = lastYRef.current
        const dy = y - prev
        lastYRef.current = y
        // Hide when scrolling down past a small threshold
        if (y > 80 && dy > 3) {
          setHeaderHidden(true)
        }
        // Show when scrolling up
        if (dy < -3 || y < 10) {
          setHeaderHidden(false)
        }
      }
    }
    // Initialize
    lastYRef.current = window.scrollY
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isDesktop, menuOpen])

  // Ensure header is visible while menu is open
  React.useEffect(() => {
    if (menuOpen) setHeaderHidden(false)
  }, [menuOpen])

  // Measure header height to place mobile sheet below it
  React.useEffect(() => {
    const measure = () => {
      const h = headerRef.current?.getBoundingClientRect().height ?? 0
      setHeaderHeight(h)
      // Expose header height to CSS so layout can sit just below header
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--header-height', `${Math.round(h)}px`)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    let ro: ResizeObserver | undefined
    if ('ResizeObserver' in window && headerRef.current) {
      ro = new ResizeObserver(measure)
      ro.observe(headerRef.current)
    }
    return () => {
      window.removeEventListener('resize', measure)
      ro?.disconnect()
    }
  }, [])

  // Gesture handlers for the side sheet (mobile)
  const onSheetPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // start tracking but don't mark as dragging until threshold is exceeded
    startXRef.current = e.clientX
    setDragging(false)
  }
  const onSheetPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startXRef.current == null) return
    const dx = e.clientX - startXRef.current
    // Begin dragging only after a small horizontal threshold to preserve clicks inside
    if (!dragging) {
      if (Math.abs(dx) > 12) {
        setDragging(true)
        // capture now that we are actually dragging
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      } else {
        return
      }
    }
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
      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot 💰</h1>
          <p style={{ fontWeight: 'bold' }}>
            There&apos;s <TokenValue amount={pool?.jackpotBalance ?? 0} /> in the Jackpot.
          </p>
          <p>
            The Jackpot is a prize pool that grows with every bet made. As it grows, so does your chance of winning. Once a winner is selected, the pool resets and grows again from there.
          </p>
          <p>
            You pay a maximum of {(PLATFORM_JACKPOT_FEE * 100).toLocaleString(undefined, { maximumFractionDigits: 4 })}% of each wager for a chance to win.
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {context.defaultJackpotFee === 0 ? 'DISABLED' : 'ENABLED'}
            <GambaUi.Switch
              checked={context.defaultJackpotFee > 0}
              onChange={(checked: boolean) =>
                context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)
              }
            />
          </label>
        </Modal>
      )}
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

  <StyledHeader ref={headerRef} $scrolled={scrolled} $hidden={!isDesktop && headerHidden}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Logo
            to="/"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              if (location.pathname === '/') {
                e.preventDefault()
                try {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                } catch {
                  window.scrollTo(0, 0)
                }
              }
            }}
          >
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
              <StyledButton>
                <GambaUi.Button onClick={() => setJackpotHelp(true)}>💰 Jackpot</GambaUi.Button>
              </StyledButton>
              <StyledButton>
                <GambaUi.Button onClick={() => user.set({ userModal: true })}>💸 Invite</GambaUi.Button>
              </StyledButton>
              <StyledButton>
                <GambaUi.Button onClick={() => window.open('https://drive.google.com/file/d/1ytQLxvTwmaXRSnJwcfv3R-Nh4ostI53u/view', '_blank', 'noopener,noreferrer')}>❓ How to</GambaUi.Button>
              </StyledButton>
              <RedButtonWrapper>
                <TokenSelect />
              </RedButtonWrapper>
              <RedButtonWrapper>
                <UserButton />
              </RedButtonWrapper>
            </>
          )}

          {/* Mobile connect + hamburger */}
          {!isDesktop && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <RedButtonWrapper>
                <UserButton />
              </RedButtonWrapper>
              <HamburgerButton
                aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((v: boolean) => !v)}
                $open={menuOpen}
              >
                <span className="bar bar1" aria-hidden="true" />
                <span className="bar bar2" aria-hidden="true" />
                <span className="bar bar3" aria-hidden="true" />
              </HamburgerButton>
            </div>
          )}
        </div>
      </StyledHeader>

      {/* Top edge swipe zone to reveal header on mobile */}
      {!isDesktop && (
        <TopSwipeZone
          aria-hidden
          onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
            pullStartYRef.current = e.clientY
            pullingRef.current = false
          }}
          onPointerMove={(e: React.PointerEvent<HTMLDivElement>) => {
            if (pullStartYRef.current == null) return
            const dy = e.clientY - pullStartYRef.current
            if (!pullingRef.current && dy > 8) {
              pullingRef.current = true
              ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
            }
          }}
          onPointerUp={(e: React.PointerEvent<HTMLDivElement>) => {
            if (pullStartYRef.current == null) return
            const dy = e.clientY - pullStartYRef.current
            pullStartYRef.current = null
            pullingRef.current = false
            // If user pulled down enough, reveal header
            if (dy > 28) {
              setHeaderHidden(false)
            }
          }}
        />
      )}

      {/* Mobile overlay menu */}
      {!isDesktop && menuOpen && (
        <MobileMenuOverlay
          $top={headerHeight}
          role="dialog"
          aria-modal="true"
          id="mobile-menu"
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Escape') setMenuOpen(false)
          }}
        >
          <MobileScrim onClick={() => setMenuOpen(false)} />
          <MobileSheet
            style={{
              transform: `translateX(${dragX}px)`,
              transition: dragging ? 'none' : 'transform 220ms ease',
              touchAction: 'pan-y',
            }}
            onPointerDown={onSheetPointerDown}
            onPointerMove={onSheetPointerMove}
            onPointerUp={onSheetPointerUp}
          >
            <SheetHandle
              onPointerDown={onSheetPointerDown}
              onPointerMove={onSheetPointerMove}
              onPointerUp={onSheetPointerUp}
            />
            <SheetContent>
              {/* Drawer actions at the top */}
              <GambaUi.Button
                style={{ background: LANG_B_GRADIENT, minHeight: 48 }}
                onClick={() => setJackpotHelp(true)}
              >
                💰 Jackpot
              </GambaUi.Button>
              <GambaUi.Button
                style={{ background: LANG_B_GRADIENT, minHeight: 48 }}
                onClick={() => {
                  setMenuOpen(false)
                  if (wallet.connected) {
                    user.set({ userModal: true })
                  } else {
                    walletModal.setVisible(true)
                  }
                }}
              >
                💸 Invite
              </GambaUi.Button>
              <GambaUi.Button
                style={{ background: LANG_B_GRADIENT, minHeight: 48 }}
                onClick={() => window.open('https://drive.google.com/file/d/1ytQLxvTwmaXRSnJwcfv3R-Nh4ostI53u/view', '_blank', 'noopener,noreferrer')}
              >
                ❓ How to
              </GambaUi.Button>
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

const HamburgerButton = styled.button<{ $open: boolean }>`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: ${LANG_B_GRADIENT};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  &:hover { opacity: 0.9; }
  &:active { transform: scale(0.98); }

  /* Bars */
  .bar {
    position: absolute;
    left: 50%;
    width: 26px;
    height: 2px;
    background: #fff;
    border-radius: 2px;
    transform-origin: center;
    transition: transform 220ms ease, opacity 180ms ease;
  }
  .bar1 { transform: translate(-50%, -7px) rotate(0deg); }
  .bar2 { transform: translate(-50%, 0) scaleX(1); }
  .bar3 { transform: translate(-50%, 7px) rotate(0deg); }

  ${(p: { $open: boolean }) => p.$open && css`
    .bar1 { transform: translate(-50%, 0) rotate(45deg); }
    .bar2 { opacity: 0; transform: translate(-50%, 0) scaleX(0); }
    .bar3 { transform: translate(-50%, 0) rotate(-45deg); }
  `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    .bar { transition: none; }
  }
`

const MobileMenuOverlay = styled.div<{ $top: number }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: ${(p: { $top: number }) => `${p.$top}px`};
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

// A small, invisible swipe zone at the very top to pull down the header on mobile
const TopSwipeZone = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 14px; /* small strip to avoid interfering with normal content */
  z-index: 1002; /* above header so it's reachable while header is hidden */
  touch-action: none; /* we want to detect a short pull-down */
  background: transparent;
`
