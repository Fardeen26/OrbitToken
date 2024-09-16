import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import Button from '../ui/Button';

function TransferSOL() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
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
            setRecipient('');
            setAmount('');
        } catch (error) {
            toast.error(error.message)
            setIsSending(false)
        }
    }

    return (
        <div className="mt-10 flex justify-center  p-5 w-[30vw] items-center rounded-lg bg-white">
            <Toaster position='bottom-right' />
            <form className='flex flex-col items-center gap-3 w-full' onSubmit={sendSol}>
                <div className="space-y-2 w-full">
                    <label htmlFor="" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Recipient Address</label>
                    <input
                        type='text'
                        className="flex h-9 w-full rounded-md border border-black bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder='578xpu1oZP9HfL1uMP98bVDpbcwbJwCn2T2xYz3uhML1'
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                </div>

                <div className="space-y-2 w-full">
                    <label htmlFor="" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Amount</label>
                    <input
                        type='number'
                        step='any'
                        className="flex h-9 w-full rounded-md border border-black bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder='0.001'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <Button btnText={"Send Transaction"} btnState={isSending} onStateText={"Sending..."} />
            </form>
        </div>
    );
};

export default TransferSOL;