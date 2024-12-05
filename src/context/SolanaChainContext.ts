import { createContext } from "react";

export type solanaChainType = {
    isDevnet: boolean,
    toggleChain: () => void;
}

export const SolanaChainContext = createContext<solanaChainType | undefined>(undefined);