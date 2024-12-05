import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ReactElement } from "react";
import * as web3 from "@solana/web3.js";
import { useSolanaChain } from "@/hooks/useSolanaChain";

const WalletContextProvider = ({ children }: { children: ReactElement }) => {
    const { isDevnet } = useSolanaChain()
    const endpoint = isDevnet ? web3.clusterApiUrl("devnet") : import.meta.env.VITE_MAINNET_RPC_URL;
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletContextProvider;