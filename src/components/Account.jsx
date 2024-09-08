import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

const Account = () => {
    const [balance, setBalance] = useState(-1);
    const [currentPublicKey, setCurrentPublicKey] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isAirdropping, setIsAirdropping] = useState(false)
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();

    const fetchBalance = async (pubKey) => {
        if (pubKey) {
            setIsFetching(true)
            try {
                const walletBalance = await connection.getBalance(pubKey) / 1000000000;
                setBalance(walletBalance);
                setIsFetching(false)
            } catch (error) {
                toast.error(error.message);
                setBalance(0);
                setIsFetching(false)
            }
        } else {
            setBalance(0);
        }
    };

    const getAirdrop = async () => {
        if (!publicKey) return toast.error('Wallet is not connected');
        try {
            setIsAirdropping(true)
            await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
            setBalance(await connection.getBalance(publicKey) / 1000000000)
            toast.success('1 SOL is successfully airdropped');
            setIsAirdropping(false)
        } catch (error) {
            toast.error(error.message)
            setIsAirdropping(false)
        }

    }

    useEffect(() => {
        if (connected && publicKey) {
            if (currentPublicKey !== publicKey) {
                setCurrentPublicKey(publicKey);
                fetchBalance(publicKey);

                const balanceChangeListener = connection.onAccountChange(publicKey, () => {
                    console.log("changed")
                    fetchBalance(publicKey)
                });

                return () => {
                    connection.removeAccountChangeListener(balanceChangeListener);
                };
            }
        }
    }, [publicKey, connection]);

    return (
        <div className="flex flex-col items-center justify-center p-5 mt-12">
            <Toaster position='bottom-right' />
            {
                isFetching ? 'Fetching...' : (<h1 className="text-4xl font-bold tracking-tighter">{balance > -1 ? `${balance} SOL` : !publicKey ? <span className="text-2xl font-bold tracking-tighter">Wallet not connected</span> : ''}</h1>)
            }
            <button className='text-xl mt-5 px-3 py-2 w-72 bg-[#512DA8] text-white rounded hover:bg-black' onClick={getAirdrop}> {isAirdropping ? 'Requesting...' : 'Get Airdrop'}</button>
        </div>
    );
};

export default Account;
