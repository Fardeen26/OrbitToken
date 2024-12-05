import { createContext } from "react";

type solanaChainType = {
    isDevnet: boolean,
    toggleChain: () => void;
}

export const SolanaChainContext = createContext<solanaChainType | null>(null);