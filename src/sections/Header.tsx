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
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
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

// Inline SVG data for a crisp hamburger icon
const HAMBURGER_ICON_DATA =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round'><line x1='8' y1='14' x2='40' y2='14'/><line x1='8' y1='24' x2='40' y2='24'/><line x1='8' y1='34' x2='40' y2='34'/></svg>"
  )

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
  /* Match corner radius with buttons and game cards */
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
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
              onChange={(checked) =>
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
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className="icon" aria-hidden="true" />
              </HamburgerButton>
            </div>
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

const HamburgerButton = styled.button`
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
  .icon {
    display: block;
    width: 74%;
    height: 74%;
    background-image: url(${HAMBURGER_ICON_DATA});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    pointer-events: none;
  }

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
