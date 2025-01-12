import { toast } from "@/hooks/use-toast";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { SetterOrUpdater } from "recoil";

export const getAirdrop = async (publicKey: PublicKey | null, connection: Connection, setWalletBalance: SetterOrUpdater<number>, airdropValue: number) => {
    try {
        if (!publicKey) {
            return null;
        }
        const airDropResult = await connection.requestAirdrop(publicKey, airdropValue * LAMPORTS_PER_SOL);
        let status;
        do {
            status = (await connection.getSignatureStatus(airDropResult)).value;
        } while (!status || status.confirmationStatus !== "confirmed");

        const totalBalance = await connection.getBalance(publicKey) / 1000000000;
        toast({
            variant: 'default',
            title: `Airdrop of ${airdropValue} SOL is successful!`,
        })
        setWalletBalance(totalBalance)
    } catch (error) {
        console.error("error while airdrop", error)
        toast({
            variant: "destructive",
            title: "Uh oh! Airdrop Failed",
        })
    }
}