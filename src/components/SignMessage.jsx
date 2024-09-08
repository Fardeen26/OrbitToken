import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { useState } from 'react';
import { Toaster, toast } from 'sonner'

function SignMessage() {
    const [isSigning, setIsSigning] = useState(false)
    const [message, setMessage] = useState('')
    const { publicKey, signMessage } = useWallet();

    const messageSign = async (e) => {
        e.preventDefault();
        if (!publicKey) return toast.error('Wallet is not connected!');
        if (!signMessage) return toast.error('Wallet does not support message signing!');
        if (!message) return toast.error("Please provide a message");

        try {
            setIsSigning(true)
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);

            if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) throw new Error('Message signature invalid!');
            toast.success(`Message signed successfully! ${bs58.encode(signature)}`);
            setIsSigning(false)
        } catch (error) {
            setIsSigning(false)
            toast.error(error.message)
        }

    };

    return (
        <div className="mt-20 flex justify-center p-5 w-[30vw] items-center rounded-lg">
            <Toaster position='bottom-right' />
            <form action="" className='flex flex-col items-center gap-3' onSubmit={messageSign}>
                <input type="text" placeholder='message' onChange={(e) => setMessage(e.target.value)} className='bg-black placeholder:text-sm focus:placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg' />
                <button className='text-lg mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black'>{isSigning ? 'Signing...' : 'Sign Message '}</button>
            </form>
        </div>
    );
};

export default SignMessage;