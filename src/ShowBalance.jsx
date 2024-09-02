import { useConnection, useWallet } from "@solana/wallet-adapter-react";


const ShowBalance = () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const fetchBalance = async () => {
        console.log(await connection.getBalance(wallet.publicKey) / 1000000000)
    }

    return (
        <div>
            <button onClick={fetchBalance}>Show Balance</button>
        </div>
    )
}

export default ShowBalance 