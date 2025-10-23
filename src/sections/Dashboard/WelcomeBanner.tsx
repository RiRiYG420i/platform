import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled from 'styled-components';
const bannerImg = new URL('../../../banner.png', import.meta.url).href;
import { useUserStore } from '../../hooks/useUserStore';
import { Modal } from '../../components/Modal';

const WelcomeWrapper = styled.div`
  margin-top: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: center;
  filter: drop-shadow(0 4px 3px rgba(0,0,0,.07)) drop-shadow(0 2px 2px rgba(0,0,0,.06));
`;

const BannerTop = styled.div`
  position: relative;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
  animation: welcome-fade-in 0.5s ease;

  @media (min-width: 800px) {
    margin-top: 72px;
  }

  @keyframes welcome-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const BannerImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const BannerBottom = styled.div`
  /* Visible container only BELOW the banner */
  background: #252C37; /* match header tone */
  border-left: 12px solid #252C37;
  border-right: 12px solid #252C37;
  border-bottom: 12px solid #252C37;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  /* Pull the background up slightly to meet the banner image */
  margin-top: -8px;
  padding: 20px 20px 16px; /* compensate for negative margin */
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (min-width: 800px) {
    margin-top: -10px;
    padding: 24px 40px 20px;
  }
`;

const WelcomeContent = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  h1, p {
    color: transparent !important;
    text-shadow: none !important;
    margin: 0;
  }
  h1 { font-size: 1.75rem; }
  p { font-size: 1rem; }
  @media (min-width: 800px) {
    h1 { font-size: 2.25rem; }
    p { font-size: 1.125rem; }
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

import { LANG_B_GRADIENT } from '../../styles';

const JackpotBadge = styled.button`
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${LANG_B_GRADIENT};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  min-height: 48px;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${LANG_B_GRADIENT};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  min-height: 48px;
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
      <BannerTop>
        <BannerImage src={bannerImg} alt="Welcome banner" />
        <WelcomeContent>
          <h1>Welcome to SOL-WIN👋</h1>
          <p>A fair, simple and decentralized casino on Solana. Play </p>
        </WelcomeContent>
      </BannerTop>
      <BannerBottom>
        {/* Buttons moved to Header (desktop) and Drawer (mobile) */}
      </BannerBottom>
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