import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

const Account = () => {
    const [balance, setBalance] = useState(0);
    const [currentPublicKey, setCurrentPublicKey] = useState(null);
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();

    const fetchBalance = async (pubKey) => {
        if (pubKey) {
            try {
                const walletBalance = await connection.getBalance(pubKey) / 1000000000;
                setBalance(walletBalance);
            } catch (error) {
                console.error("Failed to fetch balance:", error);
                setBalance(0);
            }
        } else {
            setBalance(0);
        }
    };

    const getAirdrop = async () => {
        await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
        const walletBalance = await connection.getBalance(publicKey) / 1000000000;
        setBalance(walletBalance)
    }

    useEffect(() => {
        if (connected && publicKey) {
            if (currentPublicKey !== publicKey) {
                setCurrentPublicKey(publicKey);
                fetchBalance(publicKey);

                const balanceChangeListener = connection.onAccountChange(publicKey, () => fetchBalance(publicKey));

                return () => {
                    connection.removeAccountChangeListener(balanceChangeListener);
                };
            }
        }
    }, [connected, publicKey, currentPublicKey, connection]);

    return (
        <div className="flex flex-col items-center justify-center p-5 mt-12">
            <h1 className="text-4xl font-mono font-extrabold">{balance > 0 ? `${balance} SOL` : ''}</h1>
            <button className='text-xl mt-5 px-3 py-2 w-72 bg-[#512DA8] text-white rounded hover:bg-black font-mono' onClick={getAirdrop}>Get Airdrop</button>
        </div>
    );
};

export default Account;
