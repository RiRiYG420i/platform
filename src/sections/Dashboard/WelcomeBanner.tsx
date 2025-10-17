import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled from 'styled-components';
import { useUserStore } from '../../hooks/useUserStore';

const WelcomeWrapper = styled.div`
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
  background: linear-gradient(-45deg, #ffb07c, #ff3e88, #2969ff, #ef3cff, #ff3c87);
  background-size: 300% 300%;
  animation: welcome-fade-in 0.5s ease, backgroundGradient 30s ease infinite;
  border-radius: 12px; /* Slightly larger radius for a modern look */
  padding: 24px; /* Consistent padding */
  display: flex;
  flex-direction: column;
  gap: 24px; /* Consistent gap */
  text-align: center;
  filter: drop-shadow(0 4px 3px rgba(0,0,0,.07)) drop-shadow(0 2px 2px rgba(0,0,0,.06));

  /* Desktop styles using a min-width media query */
  @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    text-align: left;
    padding: 40px;
    gap: 40px;
  }
`;

const WelcomeContent = styled.div`
  h1 {
    font-size: 1.75rem; /* Responsive font size */
    margin: 0 0 8px 0;
    color: #ffffff;
  }

  p {
    font-size: 1rem;
    color: #ffffffd1;
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
  flex-wrap: wrap; /* Allows buttons to wrap onto the next line */
  gap: 12px; /* Space between buttons */
  justify-content: center; /* Center buttons on mobile */

  @media (min-width: 800px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: linear-gradient(90deg, #FFEFBA, #FFFFFF, #FFD700);
  color: black;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  flex-grow: 1;
  text-align: center;

  &:hover {
    background: linear-gradient(90deg, #FFD700, #FFEFBA, #FFFFFF);
    transform: translateY(-2px);
  }

  @media (min-width: 800px) {
    width: 100%;
    flex-grow: 0;
  }
`;

export function WelcomeBanner() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { set: setUserModal } = useUserStore(); // Destructure for cleaner access

  const handleCopyInvite = () => {
    setUserModal({ userModal: true });
    if (!wallet.connected) {
      walletModal.setVisible(true);
    }
  };

  const openLink = (url) => () => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <WelcomeWrapper>
      <WelcomeContent>
        <h1>Welcome to SOL-WIN👋</h1>
        <p>A fair, simple and decentralized casino on Solana. Play </p>
      </WelcomeContent>
      <ButtonGroup>
        <ActionButton onClick={handleCopyInvite}>
          💸 Copy Invite
        </ActionButton>
        <ActionButton onClick={openLink('https://v2.gamba.so/')}>
          🚀 Add Liquidity
        </ActionButton>
        <ActionButton onClick={openLink('https://discord.gg/HSTtFFwR')}>
          💬 Discord
        </ActionButton>
      </ButtonGroup>
    </WelcomeWrapper>
  );
}