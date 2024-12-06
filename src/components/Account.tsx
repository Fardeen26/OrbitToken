import { Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { getAirdrop } from "@/utils/getAirdrop";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { walletBalanceAtom } from "@/atoms";
import { useRecoilState } from "recoil";


export default function Account() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [walletBalance, setWalletBalance] = useRecoilState(walletBalanceAtom);

    return (
        <Card className="border-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle>Wallet Overview</CardTitle>
                        <CardDescription>Manage your tokens and transactions</CardDescription>
                    </div>
                    <Wallet className="w-8 h-8 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Total Balance</p>
                        <p className="text-2xl font-bold"> {`${publicKey ? walletBalance : '0'}`} SOL</p>
                    </div>
                    <Button onClick={() => getAirdrop(publicKey, connection, setWalletBalance)}>Get Airdrop</Button>
                </div>
            </CardContent>
        </Card>
    )
}