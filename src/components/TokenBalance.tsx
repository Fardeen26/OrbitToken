/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardContent } from "@/components/ui/card"
import { useRecoilState } from "recoil";
import { normalTokenBalance, token22TokenBalance, Token22Type } from "@/atoms";
import { useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, AccountLayout, getTokenMetadata } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import IPFSMetadataService from "@/utils/fetchMetadata";
import { useToast } from "@/hooks/use-toast"

export function TokenBalance() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const { toast } = useToast()
    const [normalTokens, setNormalTokens] = useRecoilState(normalTokenBalance);
    const [tokens22, setTokens22] = useRecoilState(token22TokenBalance);

    useEffect(() => {
        const getBalances = async () => {
            if (!wallet.publicKey) {
                return;
            }
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
                        const name = 'Unknown Token';
                        const symbol = 'UNK';
                        return { mintAddress, balance, name, symbol };
                    } catch (error) {
                        toast({
                            variant: "destructive",
                            title: "Uh oh! Error fetching token metadata",
                            description: `${error}`
                        })
                        return null;
                    }
                }).filter(token => token !== null);

                setNormalTokens(tokens)

            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Error fetching tokens",
                    description: `${error}`
                })
            }
        };

        const getBalances22 = async () => {
            if (!wallet.publicKey) return;
            try {
                const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
                    programId: TOKEN_2022_PROGRAM_ID,
                });
                const tokens = tokenAccounts.value.map(async (accountInfo) => {
                    try {
                        const accountData = AccountLayout.decode(accountInfo.account.data);
                        const balanceBigInt = accountData.amount;
                        const balance = Number(balanceBigInt) / 1e9;
                        const mintAddress = new PublicKey(accountData.mint).toString();

                        const metadata = await getTokenMetadata(connection, new PublicKey(mintAddress), 'confirmed', TOKEN_2022_PROGRAM_ID);
                        const name = metadata?.name;
                        const symbol = metadata?.symbol;
                        let imageUrl = '';

                        if (metadata?.uri.startsWith('ipfs')) {
                            const data = await IPFSMetadataService.fetchMetadataWithFallback(metadata.uri)
                            imageUrl = data.tokenImage;
                        } else {
                            if (!metadata) {
                                return;
                            }
                            try {
                                const response = await fetch(metadata.uri, {
                                    method: 'GET'
                                });
                                const data = await response.json()
                                imageUrl = data.image;
                            } catch (error) {
                                console.log(error)
                            }
                        }

                        if (!imageUrl) {
                            imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg600Xa4ws6jp54kMDNGYF232lIhY51QJqEA&s'
                        }

                        return { mintAddress, balance, name, symbol, imageUrl };
                    } catch (error) {
                        toast({
                            variant: "destructive",
                            title: "Uh oh! Error fetching token metadata",
                            description: `${error}`
                        })
                        return null;
                    }
                }).filter(token => token !== null);

                Promise.all(tokens)
                    .then((resolvedTokens) => {
                        const validTokens: Token22Type[] = resolvedTokens.filter((token): token is Token22Type => token !== null);
                        setTokens22(validTokens)
                    })
                    .catch((error) => {
                        console.error('Error resolving token promises:', error);
                        toast({
                            variant: "destructive",
                            title: "Uh oh! Error resolving token promises",
                            description: `${error}`
                        })
                    });


            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Error fetching tokens",
                    description: `${error}`
                })
            }
        };

        if (wallet.publicKey) {
            getBalances()
            getBalances22()
        }
    }, [connection, setNormalTokens, setTokens22, wallet])


    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {
                !wallet.publicKey && <p className="ml-2">Wallet not connected :(</p>
            }
            {
                wallet.publicKey && !normalTokens.length && !tokens22.length && <p className="ml-2">No Tokens Present</p>
            }

            {
                wallet.publicKey && tokens22.map((token) => (
                    <Card key={token.mintAddress} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center space-x-4 p-4">
                                <div className="relative h-12 w-12 max-lg:h-fit max-lg:w-fit rounded-lg">
                                    <img
                                        src={token.imageUrl}
                                        alt={token.name}
                                        className="rounded-full object-cover max-lg:w-10 max-lg:h-10"
                                    />
                                </div>
                                <div className="space-y-1 max-sm:w-[70vw] max-lg:w-[30vw]">
                                    <h3 className="font-semibold leading-none tracking-tight">{token.name}</h3>
                                    <p className="text-sm overflow-clip text-ellipsis">{token.mintAddress}</p>
                                    <p className="font-bold">
                                        {token.balance} {token.symbol}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

            {
                wallet.publicKey && normalTokens.map((token) => (
                    <Card key={token.mintAddress} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center space-x-4 p-4">
                                <div className="relative px-2 h-10 w-10 max-sm:h-12 max-sm:w-12 flex items-center justify-center rounded-full bg-gray-200 dark:text-black">
                                    <span className="text-xs font-semibold">{token.mintAddress.substring(0, 4)}</span>
                                </div>
                                <div className="space-y-1 max-sm:w-[70vw]">
                                    <h3 className="font-semibold leading-none tracking-tight">{token.name}</h3>
                                    <p className="text-sm overflow-clip text-ellipsis">{token.mintAddress}</p>
                                    <p className="font-bold">
                                        {token.balance} {token.symbol}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </div>
    )
}

