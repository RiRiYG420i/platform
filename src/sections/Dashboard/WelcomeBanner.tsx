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
    linear-gradient(to bottom, rgba(37,44,55,0) 70%, #252C37 100%),
    url(${bannerImg});
  background-size: contain;
  background-position: top center;
  background-repeat: no-repeat;
  border: 4px solid #F8C61E; /* Match GameCard solid background color */
  animation: welcome-fade-in 0.5s ease;
  border-radius: 12px; /* Slightly larger radius for a modern look */
  padding: 24px; /* Consistent padding */
  display: flex;
  flex-direction: column;
  gap: 24px; /* Consistent gap */
  text-align: center;
  filter: drop-shadow(0 4px 3px rgba(0,0,0,.07)) drop-shadow(0 2px 2px rgba(0,0,0,.06));
  position: relative;
  min-height: 420px;

  /* Desktop styles using a min-width media query */
  @media (min-width: 800px) {
    margin-top: 48px;
    padding: 40px;
    min-height: 600px;
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
  gap: 10px;
  margin-top: auto; /* stick the whole area to bottom */
  width: 100%;

  @media (min-width: 800px) {
    align-items: flex-end;
  }
`;

const JackpotBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ECD11E;
  color: #121212;
  font-weight: 700;
  font-size: 0.9rem; /* match button font-size */
  border-radius: 10px;
  padding: 8px 12px;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  background: #ECD11E;
  color: #121212;
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

import { TokenValue, useCurrentPool } from 'gamba-react-ui-v2';
export function WelcomeBanner() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const pool = useCurrentPool();
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
        {pool?.jackpotBalance > 0 && (
          <JackpotBadge
            onClick={() => setJackpotHelp(true)}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            aria-label="Show jackpot details"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setJackpotHelp(true) }}
          >
            Jackpot: <TokenValue amount={pool.jackpotBalance} />
          </JackpotBadge>
        )}
        <ButtonGroup>
          <ActionButton onClick={handleCopyInvite}>
            💸 Copy Invite
          </ActionButton>
          <ActionButton onClick={openLink('https://v2.gamba.so/')}>
            � How to
          </ActionButton>
        </ButtonGroup>
      </BottomArea>
      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot 💰</h1>
          <p style={{ fontWeight: 700 }}>
            Aktueller Jackpot: <TokenValue amount={pool.jackpotBalance} />
          </p>
          <p>
            Der Jackpot wächst bei jedem Einsatz und kann jederzeit gewonnen werden.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setJackpotHelp(false)}
              style={{
                background: '#ECD11E',
                color: '#121212',
                border: 'none',
                borderRadius: 10,
                padding: '10px 14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Schließen
            </button>
          </div>
        </Modal>
      )}
    </WelcomeWrapper>
  );
}