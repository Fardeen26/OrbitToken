import { getTokenMetadata } from "@solana/spl-token";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

const TokenBalance = () => {
    const [token, setToken] = useState([]);
    const [token22, setToken22] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const { connection } = useConnection();
    const wallet = useWallet();

    useEffect(() => {
        const getBalances = async () => {
            if (!wallet.publicKey) return;
            try {
                setIsFetching(true)
                const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
                    programId: TOKEN_PROGRAM_ID,
                });
                const tokens = tokenAccounts.value.map((accountInfo) => {
                    try {
                        const accountData = AccountLayout.decode(accountInfo.account.data);
                        const balanceBigInt = accountData.amount;
                        const balance = Number(balanceBigInt) / 1e9;
                        const mintAddress = new PublicKey(accountData.mint).toString();
                        const name = 'Unknown Token';
                        const symbol = 'UNK';
                        return { mintAddress, balance, name, symbol };
                    } catch (error) {
                        console.error("Error decoding account data:", error);
                        return null;
                    }
                }).filter(token => token !== null);

                setToken(tokens)
                setIsFetching(false)

            } catch (error) {
                toast.error(error.message)
                setIsFetching(false)
            }
        };

        const getToken22Balances = async () => {
            if (!wallet.publicKey) return;
            try {
                setIsFetching(true)
                const tokenMint22 = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_2022_PROGRAM_ID });
                const userTokens22 = await Promise.all(tokenMint22.value.map(async (account) => {
                    const mintAddress = account.account.data.parsed.info.mint;
                    const balance = account.account.data.parsed.info.tokenAmount.uiAmount;

                    const metadata = await getTokenMetadata(connection, new PublicKey(mintAddress), 'confirmed', TOKEN_2022_PROGRAM_ID);
                    let imageUrl = '';
                    if (metadata.uri != 'https://cdn.100xdevs.com/metadata.json') {
                        const responce = await fetch(metadata.uri, {
                            method: 'GET'
                        });
                        const data = await responce.json()
                        imageUrl = data.image;
                    }

                    return {
                        mintAddress,
                        balance,
                        name: metadata.name || "Unknown Token-22",
                        symbol: metadata.symbol || "UNK",
                        image: imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg600Xa4ws6jp54kMDNGYF232lIhY51QJqEA&s',
                    };
                }));

                setToken22(userTokens22);
                setIsFetching(false)
            } catch (error) {
                toast.error(error.message)
            }
        }

        getBalances();
        getToken22Balances();
    }, [connection, wallet])

    return (
        <div>
            <Toaster position='bottom-right' />
            {
                !wallet.publicKey && <p className="mt-12 text-center">wallet not connected</p>
            }
            {
                !token.length && !token22.length && <p className="mt-12 text-center">there are no custom tokens present in your wallet</p>
            }
            {
                token.length && token22.length && isFetching ? <p className="mt-12">Fetching...</p> : (
                    <div className="w-[50vw] mt-12 flex flex-col gap-5">
                        {token.map((token) => (
                            <div key={token.mintAddress} className="w-full rounded-xl flex justify-between p-4 shadow-lg items-center border">
                                <div className="flex gap-4 items-center">
                                    <div className="rounded-full px-4 h-14 w-14 bg-gray-200 flex justify-center items-center font-semibold text-sm">{token.mintAddress.substring(0, 5)}</div>
                                    <div className="w-full flex-grow">
                                        <p className="text-lg">{token.name}</p>
                                        <p className="w-4/6 md:hidden text-sm font-thin overflow-clip text-ellipsis">{token.mintAddress.substring(0, 40)}</p>
                                        <p className="hidden md:block w-full text-sm font-thin">{token.mintAddress}</p>
                                        <p className="md:hidden">
                                            {Number.isInteger(token.balance) ? token.balance : token.balance.toFixed(2)} {token.symbol.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden md:flex gap-4 items-center">
                                    <p>
                                        {Number.isInteger(token.balance) ? token.balance : token.balance.toFixed(2)} {token.symbol.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {token22.map((token) => (
                            <div key={token.mintAddress} className="w-full rounded-xl flex justify-between px-4 py-4 shadow-xl items-center border">
                                <div className="flex gap-4 items-center">
                                    <img src={token.image} alt="token-image" className="w-14 h-14 rounded-full" />
                                    <div className="w-full flex-grow">
                                        <p className="text-lg">{token.name}</p>
                                        <p className="w-4/6 md:hidden text-sm font-thin overflow-clip text-ellipsis">{token.mintAddress.substring(0, 40)}</p>
                                        <p className="hidden md:block w-full text-sm font-thin">{token.mintAddress}</p>
                                        <p className="md:hidden">
                                            {Number.isInteger(token.balance) ? token.balance : token.balance.toFixed(2)} {token.symbol.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden md:flex gap-4 items-center">
                                    <p>
                                        {Number.isInteger(token.balance) ? token.balance : token.balance.toFixed(2)} {token.symbol.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

        </div>
    )
}

export default TokenBalance;