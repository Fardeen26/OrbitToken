import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import Button from '../ui/Button';
import Input from '../ui/Input';
import Label from '../ui/Label';

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
        <div className="dark:bg-black dark:text-white mt-10 flex justify-center  p-5 w-[30vw] max-sm:w-full items-center rounded-lg">
            <Toaster position='bottom-right' />
            <form className='flex flex-col items-center gap-3 w-full' onSubmit={sendSol}>
                <div className="space-y-2 w-full">
                    <Label labelText={"Recipient Address"} />
                    <Input placeholder={"578xpu1oZP9HfL1uMP98bVDpbcwbJwCn2T2xYz3uhML1"} value={recipient} setter={setRecipient} type={'text'} />
                </div>

                <div className="space-y-2 w-full">
                    <Label labelText={"Amount"} />
                    <Input placeholder={"0.001"} value={amount} setter={setAmount} type={'number'} />
                </div>

                <Button btnText={"Send Transaction"} btnState={isSending} onStateText={"Sending..."} />
            </form>
        </div>
    );
};

export default TransferSOL;