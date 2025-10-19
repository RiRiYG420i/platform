import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled from 'styled-components';
const bannerImg = new URL('../../../banner.png', import.meta.url).href;
import { useUserStore } from '../../hooks/useUserStore';
import { Modal } from '../../components/Modal';

const WelcomeWrapper = styled.div`
  margin-top: 0;
  /* Animations */
  @keyframes welcome-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes backgroundGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Styling */
  background-color: #252C37;
  background-image:
    linear-gradient(to bottom, rgba(37,44,55,0) 98%, #252C37 100%),
    url(${bannerImg});
  background-size: contain;
  background-position: top center;
  background-repeat: no-repeat;
  border: 4px solid #F8C61E; /* Match GameCard solid background color */
  animation: welcome-fade-in 0.5s ease;
  border-radius: 12px; /* Slightly larger radius for a modern look */
  /* Compact bottom padding; height increase handled via min-height */
  padding: 20px 20px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px; /* Tighter spacing on mobile */
  text-align: center;
  filter: drop-shadow(0 4px 3px rgba(0,0,0,.07)) drop-shadow(0 2px 2px rgba(0,0,0,.06));
  position: relative;
  /* Increase banner height downward by ~one button height on mobile */
  min-height: 376px;

  /* Desktop styles using a min-width media query */
  @media (min-width: 800px) {
    margin-top: 72px;
    /* Restore compact padding; increase height via min-height */
    padding: 40px;
    /* Increase banner height downward by ~one button height on desktop */
    min-height: 656px;
    background-image:
      linear-gradient(to bottom, rgba(37,44,55,0) 85%, #252C37 100%),
      url(${bannerImg});
  }
`;

const WelcomeContent = styled.div`
  h1, p {
    color: transparent !important;
    text-shadow: none !important;
  }

  h1 {
    font-size: 1.75rem;
    margin: 0 0 8px 0;
  }
  p {
    font-size: 1rem;
    margin: 0;
  }
  @media (min-width: 800px) {
    h1 {
      font-size: 2.25rem;
    }
    p {
      font-size: 1.125rem;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: center;
  align-items: flex-end;
  width: 100%;

  @media (min-width: 800px) {
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
  }
`;

const BottomArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: auto; /* stick the whole area to bottom */
  width: 100%;

  @media (min-width: 800px) {
    align-items: flex-end;
  }
`;

const JackpotBadge = styled.button`
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ECD11E;
  color: #252C37;
  font-weight: 600;
  font-size: 0.9rem; /* match button font-size */
  border-radius: 10px;
  padding: 12px 16px; /* match ActionButton padding */
  min-width: 120px;
  max-width: 180px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  &:hover { background: #e6c000; transform: translateY(-2px); }
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  background: #ECD11E;
  color: #252C37;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  min-width: 120px;
  max-width: 180px;
  width: 100%;
  text-align: center;

  &:hover {
    background: #e6c000;
    transform: translateY(-2px);
  }

  @media (min-width: 800px) {
    width: 100%;
    max-width: 180px;
    flex-grow: 0;
  }
`;

import { GambaUi, TokenValue, useCurrentPool, useGambaPlatformContext } from 'gamba-react-ui-v2';
import { PLATFORM_JACKPOT_FEE } from '../../constants';
export function WelcomeBanner() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const pool = useCurrentPool();
  const context = useGambaPlatformContext();
  const { set: setUserModal } = useUserStore(); // Destructure for cleaner access
  const [jackpotHelp, setJackpotHelp] = React.useState(false);

  const handleCopyInvite = () => {
    setUserModal({ userModal: true });
    if (!wallet.connected) {
      walletModal.setVisible(true);
    }
  };

  const openLink = (url: string) => () => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <WelcomeWrapper>
      <WelcomeContent>
        <h1>Welcome to SOL-WIN👋</h1>
        <p>A fair, simple and decentralized casino on Solana. Play </p>
      </WelcomeContent>
      <BottomArea>
        {(
          // Always show: if current jackpot is 0, still render using amount 0
          true
        ) && (
          <JackpotBadge
            onClick={() => setJackpotHelp(true)}
            aria-label="Show jackpot details"
          >
            💰 Jackpot: <TokenValue amount={pool?.jackpotBalance ?? 0} />
          </JackpotBadge>
        )}
        <ButtonGroup>
          <ActionButton onClick={handleCopyInvite}>
            💸 Copy Invite
          </ActionButton>
          <ActionButton onClick={openLink('https://drive.google.com/file/d/1ytQLxvTwmaXRSnJwcfv3R-Nh4ostI53u/view')}>
            ❓ How to
          </ActionButton>
        </ButtonGroup>
      </BottomArea>
      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot 💰</h1>
          <p style={{ fontWeight: 'bold' }}>
            There&apos;s <TokenValue amount={pool.jackpotBalance} /> in the
            Jackpot.
          </p>
          <p>
            The Jackpot is a prize pool that grows with every bet made. As it
            grows, so does your chance of winning. Once a winner is selected,
            the pool resets and grows again from there.
          </p>
          <p>
            You pay a maximum of{' '}
            {(PLATFORM_JACKPOT_FEE * 100).toLocaleString(undefined, { maximumFractionDigits: 4 })}
            % of each wager for a chance to win.
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
    </WelcomeWrapper>
  );
}