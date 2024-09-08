import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useState } from 'react';
import { Toaster, toast } from 'sonner'

function TransferSOL() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState(0);
    const [isSending, setIsSending] = useState(false)
    const { connection } = useConnection();
    const wallet = useWallet();

    const sendSol = async (e) => {
        e.preventDefault();
        if (!wallet.publicKey) return toast.error('Wallet is not connected');
        if (!recipient || !amount || amount < 0) return toast.error("Provide the correct credentials");

        try {
            setIsSending(true)
            const lamports = BigInt(amount * Math.pow(10, 9));
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports
                })
            );
            const tnx = await wallet.sendTransaction(transaction, connection)
            toast.success(`Transaction is successful! ${tnx}`)
            setIsSending(false)
        } catch (error) {
            toast.error(error.message)
            setIsSending(false)
        }
    }

    return (
        <div className="mt-20 flex justify-center  p-5 w-[30vw] items-center rounded-lg bg-white">
            <Toaster position='bottom-right' />
            <form action="" className='flex flex-col items-center gap-3' onSubmit={sendSol}>
                <input type="text" placeholder='recipient' onChange={(e) => setRecipient(e.target.value)} className='bg-black placeholder:text-sm focus:placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg border' />
                <input type='number' step='any' placeholder='amount' onChange={(e) => setAmount(e.target.value)} className='bg-black placeholder:text-sm focus:placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg border' />
                <button className='text-lg mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black'>  {isSending ? 'Sending...' : 'Send Transaction'} </button>
            </form>
        </div>
    );
};

export default TransferSOL;