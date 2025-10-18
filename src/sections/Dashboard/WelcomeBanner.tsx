import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled from 'styled-components';
const bannerImg = new URL('../../../banner.png', import.meta.url).href;
import { useUserStore } from '../../hooks/useUserStore';

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
  margin-top: auto;
  width: 100%;

  @media (min-width: 800px) {
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: auto;
  }
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
      {pool?.jackpotBalance > 0 && (
        <div style={{ color: '#ECD11E', fontWeight: 700, alignSelf: 'center' }}>
          Jackpot: <TokenValue amount={pool.jackpotBalance} />
        </div>
      )}
      <ButtonGroup>
        <ActionButton onClick={handleCopyInvite}>
          💸 Copy Invite
        </ActionButton>
        <ActionButton onClick={openLink('https://v2.gamba.so/')}>
          � How to
        </ActionButton>
      </ButtonGroup>
    </WelcomeWrapper>
  );
}