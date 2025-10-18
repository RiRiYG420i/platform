import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
  return (
    <WelcomeWrapper>
      <WelcomeContent>
        <h1>Welcome to SOL-WIN👋</h1>
        <p>A fair, simple and decentralized casino on Solana. Play </p>
      </WelcomeContent>
      <BottomArea>
        <JackpotBar title="Jackpot (SOL)" onClick={() => setJackpotModal(true)} style={{ cursor: 'pointer' }}>
          💰 <TokenValue mint={solPool?.token} amount={solPool?.jackpotBalance ?? 0} />
        </JackpotBar>
      </BottomArea>
      <ButtonGroup style={{ marginTop: 'auto' }}>
        <ActionButton onClick={handleCopyInvite}>
          💸 Copy Invite
        </ActionButton>
        <ActionButton onClick={openLink('https://v2.gamba.so/')}> 
          � How to
        </ActionButton>
      </ButtonGroup>
      {jackpotModal && (
        <Modal onClose={() => setJackpotModal(false)}>
          <h1>Jackpot 💰</h1>
          <p style={{ fontWeight: 'bold' }}>
            Es gibt <TokenValue mint={solPool?.token} amount={solPool?.jackpotBalance ?? 0} /> im Jackpot.
          </p>
          <p>
            Der Jackpot ist ein Preispool, der mit jedem Einsatz wächst. Je größer der Pool, desto höher die Gewinnchance. Nach einem Gewinn wird der Pool zurückgesetzt und wächst erneut.
          </p>
          <p>
            Du zahlst maximal <b>0.1%</b> jedes Einsatzes für die Chance auf den Jackpot.
          </p>
        </Modal>
      )}
    </WelcomeWrapper>
  );
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
  gap: 6px; /* Reduced gap */
  margin-top: 0; /* Remove auto push to bottom */
  width: 100%;

  @media (min-width: 800px) {
    align-items: flex-end;
    gap: 8px;
  }
`;

const JackpotBar = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #ECD11E; /* match button yellow */
  color: #121212;
  font-weight: 700;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(236, 209, 30, 0.66); /* #ECD11E at 66% opacity */
  color: #121212;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  min-width: 120px;
  max-width: 180px;
  width: 100%;
  text-align: center;

  &:hover {
    background: rgba(230, 192, 0, 0.66); /* #e6c000 at 66% opacity */
    transform: translateY(-2px);
  }

  @media (min-width: 800px) {
    width: 100%;
    max-width: 180px;
    flex-grow: 0;
  }
`;

export function WelcomeBanner() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { set: setUserModal } = useUserStore();
  const context = useGambaPlatformContext();
  // Find the SOL pool with the highest jackpot
  const solPools = context.pools?.filter(p => p.token.toBase58() === 'So11111111111111111111111111111111111111112') || [];
  const solPool = solPools.reduce((max, p) => (p.jackpotBalance > (max?.jackpotBalance ?? 0) ? p : max), solPools[0]);
  const [jackpotModal, setJackpotModal] = React.useState(false);

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
        <JackpotBar title="Jackpot (SOL)" onClick={() => setJackpotModal(true)} style={{ cursor: 'pointer' }}>
          💰 <TokenValue mint={SOL_POOL.token} amount={solPool?.jackpotBalance ?? 0} />
        </JackpotBar>
        return (
          <WelcomeWrapper>
            <WelcomeContent>
              <h1>Welcome to SOL-WIN👋</h1>
              <p>A fair, simple and decentralized casino on Solana. Play </p>
            </WelcomeContent>
            <BottomArea>
              <JackpotBar title="Jackpot (SOL)" onClick={() => setJackpotModal(true)} style={{ cursor: 'pointer' }}>
                💰 <TokenValue mint={solPool?.token} amount={solPool?.jackpotBalance ?? 0} />
              </JackpotBar>
            </BottomArea>
            <ButtonGroup style={{ marginTop: 'auto' }}>
              <ActionButton onClick={handleCopyInvite}>
                💸 Copy Invite
              </ActionButton>
              <ActionButton onClick={openLink('https://v2.gamba.so/')}> 
                � How to
              </ActionButton>
            </ButtonGroup>
            {jackpotModal && (
              <Modal onClose={() => setJackpotModal(false)}>
                <h1>Jackpot 💰</h1>
                <p style={{ fontWeight: 'bold' }}>
                  Es gibt <TokenValue mint={solPool?.token} amount={solPool?.jackpotBalance ?? 0} /> im Jackpot.
                </p>
                <p>
                  Der Jackpot ist ein Preispool, der mit jedem Einsatz wächst. Je größer der Pool, desto höher die Gewinnchance. Nach einem Gewinn wird der Pool zurückgesetzt und wächst erneut.
                </p>
                <p>
                  Du zahlst maximal <b>0.1%</b> jedes Einsatzes für die Chance auf den Jackpot.
                </p>
              </Modal>
            )}
          </WelcomeWrapper>
        );