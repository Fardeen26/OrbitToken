import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { SetterOrUpdater } from "recoil";


export const getAirdrop = async (publicKey: PublicKey | null, connection: Connection, setWalletBalance: SetterOrUpdater<number>) => {
    try {
        if (!publicKey) {
            return null;
        }
        const airDropResult = await connection.requestAirdrop(publicKey, 5 * LAMPORTS_PER_SOL);
        let status;
        do {
            status = (await connection.getSignatureStatus(airDropResult)).value;
        } while (!status || status.confirmationStatus !== "confirmed");

        const totalBalance = await connection.getBalance(publicKey) / 1000000000;
        setWalletBalance(totalBalance)
    } catch (error) {
        console.error("error while airdrop", error)
    }
}