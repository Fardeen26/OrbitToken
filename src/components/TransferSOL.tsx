import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { LucideLoader2 } from 'lucide-react';


export default function TransferSOL() {
    const [recipient, setRecipient] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amount, setAmount] = useState<string>();
    const { connection } = useConnection();
    const wallet = useWallet();
    const { toast } = useToast()

    const transferSol = async () => {
        if (!wallet.publicKey) {
            return toast({
                variant: "destructive",
                title: "Uh oh! Wallet not Connected",
            })
        }

        if (!recipient || !amount || Number(amount) < 0) {
            return toast({
                variant: "destructive",
                title: "Provide the correct credentials",
            })
        }
        setIsSubmitting(true);
        try {
            const lamports = BigInt(Number(amount) * Math.pow(10, 9));
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports
                })
            );

            await wallet.sendTransaction(transaction, connection)

            toast({
                variant: 'default',
                title: "Transaction is successful!",
            })

            setRecipient('');
            setAmount('');
        } catch (error) {
            return toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred"
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>Transfer SOL</CardTitle>
                <CardDescription>Send SOL to another wallet address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="space-y-2">
                    <Label htmlFor="address">Recipient Address</Label>
                    <Input id="address" placeholder="Enter recipient's wallet address" onChange={(e) => setRecipient(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="0.00" onChange={(e) => setAmount(e.target.value)} />
                </div>
                <Button className="w-full" onClick={transferSol}>
                    {
                        isSubmitting ? <span className="flex items-center"><LucideLoader2 className="animate-spin mr-2" /> Transferring</span> : 'Send Transaction'
                    }
                </Button>
            </CardContent>
        </Card>
    )
}