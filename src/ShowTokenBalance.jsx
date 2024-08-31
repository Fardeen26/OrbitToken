import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
// TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA -> token program id


const ShowTokenBalance = () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const getBalances = async () => {
        if (wallet.publicKey) {
            try {
                const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
                    programId: TOKEN_PROGRAM_ID,
                });
                const tokens = tokenAccounts.value.map((accountInfo) => {
                    try {
                        const accountData = AccountLayout.decode(accountInfo.account.data);
                        const balanceBigInt = accountData.amount;
                        const balance = Number(balanceBigInt) / 1e9;
                        const mintAddress = new PublicKey(accountData.mint).toString();
                        return { mintAddress, balance };
                    } catch (error) {
                        console.error("Error decoding account data:", error);
                        return null;
                    }
                }).filter(token => token !== null);

                console.log("tokens", tokens)

            } catch (error) {
                console.error("Error fetching balances:", error);
            }
        }
    };

    return (
        <div>
            <button onClick={getBalances}>Show Token Balance&apos;s</button>
        </div>
    )
}

export default ShowTokenBalance