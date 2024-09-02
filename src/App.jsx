// import { useMemo } from 'react';
// import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
// import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// import {
//   WalletModalProvider,
//   WalletDisconnectButton,
//   WalletMultiButton
// } from '@solana/wallet-adapter-react-ui';
// import { clusterApiUrl } from '@solana/web3.js';
// import '@solana/wallet-adapter-react-ui/styles.css';
// import SendTransaction from './SendTransaction'
// import ShowBalance from './ShowBalance'
// import GetAirdrop from './GetAirdrop';
// import SignMessage from './SignMessage'
// import ShowTokenBalance from './ShowTokenBalance'
// import TransferToken from './TransferToken'
// import Navbar from './components/Navbar';

import Hero from "./components/Hero"
import Navbar from "./components/Navbar"


function App() {

  return (
    // <WalletContextProvider>
    <div className="">
      <Navbar />
      <Hero />
    </div>
    // </WalletContextProvider>
  )
}

export default App
