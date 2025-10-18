import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
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
                  Du zahlst maximal <b>0.1%</b> jedes Einsatzes für die Chance auf den Jackpot.
                </p>
              </Modal>
            )}
          </WelcomeWrapper>
        );