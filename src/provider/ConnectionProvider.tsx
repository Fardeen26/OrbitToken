import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ReactElement } from "react";
import * as web3 from "@solana/web3.js";
// import { SolanaChainContext } from "@/context/SolanaChainContext";

const WalletContextProvider = ({ children }: { children: ReactElement }) => {
    // const value = useContext(SolanaChainContext)
    // const endpoint = value?.isDevnet ? import.meta.env.VITE_DEVNET_RPC_URL : import.meta.env.VITE_MAINNET_RPC_URL;
    // const endpoint = import.meta.env.VITE_DEVNET_RPC_URL
    const endpoint = web3.clusterApiUrl("devnet");
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletContextProvider;