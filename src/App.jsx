import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import SendTransaction from './SendTransaction'
import ShowBalance from './ShowBalance'
import GetAirdrop from './GetAirdrop';
import SignMessage from './SignMessage'
import ShowTokenBalance from './ShowTokenBalance'
import TransferToken from './TransferToken'

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <WalletMultiButton />
            &nbsp;&nbsp;&nbsp;
            <WalletDisconnectButton />
            <SendTransaction />
            <ShowBalance />
            <GetAirdrop />
            <SignMessage />
            <ShowTokenBalance />
            <TransferToken />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
