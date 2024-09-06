import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { useState } from 'react';

function SignMessage() {
    const [message, setMessage] = useState('')
    const { publicKey, signMessage } = useWallet();


    const sendMessage = async (e) => {
        e.preventDefault();
        if (!publicKey) throw new Error('Wallet not connected!');
        if (!signMessage) throw new Error('Wallet does not support message signing!');
        if (!message) return alert("Invalid Crediantles");

        try {
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);

            if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) throw new Error('Message signature invalid!');
            alert('success', `Message signature: ${bs58.encode(signature)}`);
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <div className="mt-20 flex justify-center p-5 w-[30vw] items-center rounded-lg">
            <form action="" className='flex flex-col items-center gap-3' onSubmit={sendMessage}>
                <input type="text" placeholder='message' onChange={(e) => setMessage(e.target.value)} className='bg-black placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg' />
                <button className='text-lg mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black'>Sign Message</button>
            </form>
        </div>
    );
};

export default SignMessage;