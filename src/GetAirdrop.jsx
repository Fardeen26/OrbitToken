import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const GetAirdrop = () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const getAirdrop = async () => {
        const res = await connection.requestAirdrop(wallet.publicKey, 1 * LAMPORTS_PER_SOL);
        console.log(res);
    }

    return (
        <div>
            <input type="text" placeholder="amount" />
            <button onClick={getAirdrop}>Request Airdrop</button>
        </div>
    )
}

export default GetAirdrop