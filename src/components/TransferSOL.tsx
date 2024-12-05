import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';


export default function TransferSOL() {
    const [recipient, setRecipient] = useState<string>('');
    const [amount, setAmount] = useState<string>();
    const { connection } = useConnection();
    const wallet = useWallet();

    const transferSol = async () => {
        if (!wallet.publicKey) return console.error('Wallet is not connected');
        if (!recipient || !amount || Number(amount) < 0) return console.error("Provide the correct credentials");

        try {
            const lamports = BigInt(Number(amount) * Math.pow(10, 9));
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports
                })
            );
            const tnx = await wallet.sendTransaction(transaction, connection)
            console.log(`Transaction is successful! ${tnx}`)
            setRecipient('');
            setAmount('');
        } catch (error) {
            console.error(error)
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
                <Button className="w-full" onClick={transferSol}>Send Transaction</Button>
            </CardContent>
        </Card>
    )
}