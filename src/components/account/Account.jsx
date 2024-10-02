import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Cross2Icon } from '@radix-ui/react-icons';

const Account = () => {
    const [balance, setBalance] = useState(-1);
    const [currentPublicKey, setCurrentPublicKey] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isAirdropping, setIsAirdropping] = useState(false)
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)
    const [amount, setAmount] = useState('');

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
            await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
            setBalance(await connection.getBalance(publicKey) / 1000000000)
            toast.success(`${amount} SOL is successfully airdropped`);
            setIsAirdropping(false)
            setAmount('')
            setIsDropdownVisible(false)
        } catch (error) {
            toast.error(error.message)
            setIsAirdropping(false)
            isDropdownVisible(false)
        }
    }

    const hideDropdown = () => {
        setAmount('');
        setIsDropdownVisible(false);
    }

    useEffect(() => {
        if (connected && publicKey) {
            if (currentPublicKey !== publicKey) {
                setCurrentPublicKey(publicKey);
                fetchBalance(publicKey);

                const balanceChangeListener = connection.onAccountChange(publicKey, () => {
                    fetchBalance(publicKey)
                });

                return () => {
                    connection.removeAccountChangeListener(balanceChangeListener);
                };
            }
        }
    }, [publicKey, connection]);

    return (
        <div className="flex flex-col items-center justify-center p-5 mt-12 dark:bg-black dark:text-white">
            <Toaster position='bottom-right' />
            {
                isFetching ? 'Fetching...' : (<h1 className="text-[42px] font-bold tracking-tighter">{balance > -1 ? `${balance} SOL` : !publicKey ? <span className="text-2xl font-bold tracking-tighter">Wallet not connected</span> : ''}</h1>)
            }

            <button
                className='dark:bg-white dark:text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base mt-5 px-3 py-[10px] w-80 bg-black text-white border border-black rounded-lg hover:bg-transparent hover:text-black transition-all dark:hover:bg-transparent dark:border-white dark:hover:text-white'
                onClick={() => setIsDropdownVisible(true)}>
                Get Airdrop
            </button>

            {/* Airdrop Dropdown */}
            <div className={`${isDropdownVisible ? 'block' : 'hidden'} absolute z-10 dark:bg-black bg-white p-10 border top-40 shadow-xl w-[30vw] h-[40vh] flex flex-col items-center justify-center rounded-2xl`}>
                <span
                    className="absolute top-0 right-0 cursor-pointer p-2"
                    onClick={hideDropdown}>
                    <Cross2Icon width={20} height={20} className="hover:text-[#6a2aff] dark:hover:text-white hover:scale-110" />
                </span>

                <input
                    type="number"
                    placeholder="enter amount"
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                    className="transition-all dark:border-white flex h-9 w-full rounded-md border border-black bg-transparent px-3 py-1 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                    onClick={getAirdrop}
                    className="dark:bg-white dark:text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm mt-2 px-3 py-[8px] w-32 bg-black text-white border border-black rounded-lg hover:bg-transparent hover:text-black transition-all dark:hover:bg-transparent dark:border-white dark:hover:text-white">
                    {isAirdropping ? 'Airdropping...' : 'Confirm'}
                </button>
            </div>

        </div>
    );
};

export default Account;
