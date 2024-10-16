import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import Button from '../ui/Button';
import Input from '../ui/Input';
import Label from '../ui/Label';

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
            setMessage('')
        } catch (error) {
            setIsSigning(false)
            toast.error(error.message)
        }

    };

    return (
        <div className="mt-10 flex justify-center p-5 w-[30vw] max-sm:w-full items-center rounded-lg">
            <Toaster position='bottom-right' />
            <form className='flex flex-col items-center gap-3 w-full' onSubmit={messageSign}>
                <div className="space-y-2 w-full">
                    <Label labelText={"Message"} />
                    <Input placeholder={"Greetings!"} value={message} setter={setMessage} type={'text'} />
                </div>

                <Button btnText={"Sign Message"} btnState={isSigning} onStateText={"Signing..."} />
            </form>
        </div>
    );
};

export default SignMessage;