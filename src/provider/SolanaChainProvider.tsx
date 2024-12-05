import { ReactElement, useState, useEffect } from "react";
import { SolanaChainContext } from "@/context/SolanaChainContext";

const SolanaChainProvider = ({ children }: { children: ReactElement }) => {
    const [isDevnet, setIsDevnet] = useState<boolean>(() => {
        const savedValue = localStorage.getItem("isDevnet");
        return savedValue ? JSON.parse(savedValue) : true;
    });

    const toggleChain = () => {
        setIsDevnet((prev) => {
            const newValue = !prev;
            localStorage.setItem("isDevnet", JSON.stringify(newValue));
            return newValue;
        });
    };

    useEffect(() => {
        localStorage.setItem("isDevnet", JSON.stringify(isDevnet));
    }, [isDevnet]);

    return (
        <SolanaChainContext.Provider value={{ isDevnet, toggleChain }}>
            {children}
        </SolanaChainContext.Provider>
    );
};

export default SolanaChainProvider;
