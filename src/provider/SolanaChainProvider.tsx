import { ReactElement, useState } from "react"
import { SolanaChainContext } from "@/context/SolanaChainContext";

const SolanaChainProvider = ({ children }: { children: ReactElement }) => {
    const [isDevnet, setIsDevnet] = useState<boolean>(false);

    const toggleChain = () => {
        setIsDevnet(!isDevnet);
    }

    return (
        <SolanaChainContext.Provider value={{ isDevnet, toggleChain }}>
            {children}
        </SolanaChainContext.Provider>
    )
}

export default SolanaChainProvider