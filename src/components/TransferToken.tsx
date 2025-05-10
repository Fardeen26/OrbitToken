/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, getTokenMetadata, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, TokenAccountNotFoundError, TokenInvalidAccountOwnerError } from "@solana/spl-token"
import { PublicKey, PublicKeyInitData, Signer, Transaction } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"
import { LucideLoader2 } from "lucide-react"

type NormalTokenType = {
    mint: string,
    balance: number,
    name: string
}

type SplTokenType = {
    mint: string;
    balance: number;
    name: string;
    symbol: string;
}

export function TransferForm() {
    const [normatTokens, setNormalTokens] = useState<NormalTokenType[]>([]);
    const [splTokens, setSplTokens] = useState<SplTokenType[]>([]);
    const [selectedTokenType, setSelectedTokenType] = useState<string>();
    const [selectedToken, setSelectedToken] = useState<PublicKeyInitData | null>('');
    const [recipient, setRecipient] = useState<PublicKeyInitData>('');
    const [amount, setAmount] = useState<string>()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { connection } = useConnection();
    const wallet = useWallet();
    const { toast } = useToast();

    const fetchNormalTokens = async () => {
        const tokenMint = await connection.getParsedTokenAccountsByOwner(wallet.publicKey as PublicKey, { programId: TOKEN_PROGRAM_ID });
        const tokens = tokenMint.value.map((account, index) => ({
            mint: account.account.data.parsed.info.mint,
            balance: account.account.data.parsed.info.tokenAmount.uiAmount,
            name: `Unknown Token ${index + 1}`,
        }));

        setNormalTokens(tokens);
    };

    const fetchSplTokens = async () => {
        const tokenMint22 = await connection.getParsedTokenAccountsByOwner(wallet.publicKey as PublicKey, { programId: TOKEN_2022_PROGRAM_ID });
        const tokens = await Promise.all(tokenMint22.value.map(async (account) => {
            const mint = account.account.data.parsed.info.mint;
            const balance = account.account.data.parsed.info.tokenAmount.uiAmount;

            const metadata = await getTokenMetadata(connection, new PublicKey(mint), 'confirmed', TOKEN_2022_PROGRAM_ID);
            return {
                mint,
                balance,
                name: metadata?.name || "Unknown Token-22",
                symbol: metadata?.symbol || "Coin"
            };
        }));

        setSplTokens(tokens);
    };

    const transferNormalToken = async () => {
        if (!wallet.publicKey) {
            return toast({
                variant: "destructive",
                title: "Uh oh! Wallet not Connected",
            })
        }

        if (!recipient || !amount || Number(amount) < 0 || !selectedToken) {
            return toast({
                variant: "destructive",
                title: "Provide the correct credentials",
            })
        }

        setIsSubmitting(true);
        try {
            const sourceAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                wallet.publicKey as unknown as Signer,
                new PublicKey(selectedToken),
                wallet.publicKey
            );

            const recipientPublicKey = new PublicKey(recipient);
            const recipientTokenAccounts = await connection.getTokenAccountsByOwner(
                recipientPublicKey,
                { programId: TOKEN_PROGRAM_ID }
            );

            let destinationAccountPubkey;
            if (recipientTokenAccounts.value.length === 0) {
                const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
                const associatedTokenAddress = PublicKey.findProgramAddressSync(
                    [recipientPublicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), new PublicKey(selectedToken).toBuffer()],
                    ASSOCIATED_TOKEN_PROGRAM_ID
                )[0];

                destinationAccountPubkey = associatedTokenAddress;

                if (!wallet.publicKey) {
                    return null;
                }

                const createAssociatedAccountInstruction = createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedTokenAddress,
                    recipientPublicKey,
                    new PublicKey(selectedToken),
                    TOKEN_PROGRAM_ID
                );

                const createTransaction = new Transaction().add(createAssociatedAccountInstruction);
                await wallet.sendTransaction(createTransaction, connection);
            } else {
                destinationAccountPubkey = recipientTokenAccounts.value[0].pubkey;
            }

            if (!wallet.publicKey || !amount) {
                return null;
            }
            const transferInstruction = createTransferInstruction(
                sourceAccount.address,
                destinationAccountPubkey,
                wallet.publicKey,
                Number(amount) * Math.pow(10, 9)
            );

            const transferTransaction = new Transaction().add(transferInstruction);
            const latestBlockHash = await connection.getLatestBlockhash('confirmed');
            transferTransaction.recentBlockhash = latestBlockHash.blockhash;
            transferTransaction.feePayer = wallet.publicKey;

            await wallet.sendTransaction(transferTransaction, connection);
            toast({
                variant: 'default',
                title: "Transaction is successful!",
            })
            setAmount('')
            setRecipient('');
            setSelectedToken(null);
        } catch (error) {
            return toast({
                variant: "destructive",
                title: "Transaction failed!",
                description: error instanceof Error ? error.message : "An unknown error occurred"
            })
        } finally {
            setIsSubmitting(false);
        }
    };

    const transferSPLToken = async () => {
        if (!wallet.publicKey) {
            return toast({
                variant: "destructive",
                title: "Uh oh! Wallet not Connected",
            })
        }

        if (!recipient || !amount || Number(amount) < 0 || !selectedToken) {
            return toast({
                variant: "destructive",
                title: "Provide the correct credentials",
            })
        }

        setIsSubmitting(true);
        const recipientAddress = new PublicKey(recipient);
        const mint = new PublicKey(selectedToken);

        const sendersATA = getAssociatedTokenAddressSync( // getting sender ATA
            mint,
            wallet.publicKey,
            false,
            TOKEN_2022_PROGRAM_ID
        );

        try {
            const associatedToken = getAssociatedTokenAddressSync( // getting receiver ATA
                mint,
                recipientAddress,
                false,
                TOKEN_2022_PROGRAM_ID
            );

            try {
                await getAccount( // Attempt to get the existing associated token account
                    connection,
                    associatedToken,
                    "confirmed",
                    TOKEN_2022_PROGRAM_ID
                );
            } catch (error) {
                if (
                    error instanceof TokenAccountNotFoundError ||
                    error instanceof TokenInvalidAccountOwnerError
                ) {
                    try {
                        const transaction = new Transaction().add( // creating receiver ATA
                            createAssociatedTokenAccountInstruction(
                                wallet.publicKey,
                                associatedToken,
                                recipientAddress,
                                mint,
                                TOKEN_2022_PROGRAM_ID
                            )
                        );

                        const signature = await wallet.sendTransaction(transaction, connection);

                        toast({
                            variant: "default",
                            title: "Associated token account created",
                        })

                        const latestBlockhash = await connection.getLatestBlockhash();
                        await connection.confirmTransaction({
                            blockhash: latestBlockhash.blockhash,
                            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                            signature,
                        });

                    } catch (error) {
                        return toast({
                            variant: "destructive",
                            title: "Error while transferring token",
                            description: error instanceof Error ? error.message : "An unknown error occurred"
                        })
                    }
                }
            }

            const amountInLamports = Number(amount) * Math.pow(10, 9);

            const tx = new Transaction().add(
                createTransferInstruction(
                    sendersATA,
                    associatedToken,
                    wallet.publicKey,
                    amountInLamports,
                    [],
                    TOKEN_2022_PROGRAM_ID
                )
            );

            await wallet.sendTransaction(tx, connection);
            toast({
                variant: "default",
                title: "Transaction Sent Successfully!",
            })
            setAmount('')
            setRecipient('');
            setSelectedToken(null);
        } catch (error) {
            console.log(error);
            return toast({
                variant: "destructive",
                title: "Transaction failed!",
                description: error instanceof Error ? error.message : "An unknown error occurred"
            })
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTransfer = async () => {
        if (selectedTokenType === 'spl') {
            await transferSPLToken();
        } else if (selectedTokenType === 'normal') {
            await transferNormalToken();
        }
    }

    useEffect(() => {
        fetchNormalTokens();
        fetchSplTokens();
    }, [connection, wallet, selectedTokenType]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transfer Tokens</CardTitle>
                <CardDescription>Send tokens to another wallet address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Token Type</Label>
                    <Select onValueChange={(value) => setSelectedTokenType(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select token type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal Token</SelectItem>
                            <SelectItem value="spl">SPL Token</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="token">Choose Token</Label>
                    <Select onValueChange={(value) => setSelectedToken(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a token" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                selectedTokenType === "normal" &&
                                (normatTokens.length ? (
                                    normatTokens.map((token, index) => (
                                        <SelectItem value={token.mint} key={index}>{token.name} ({token.balance})</SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="">Tokens Not Found</SelectItem>
                                ))
                            }

                            {
                                selectedTokenType === "spl" &&
                                (splTokens.length ? (
                                    splTokens.map((token, index) => (
                                        <SelectItem value={token.mint} key={index}>{token.name} ({token.balance})</SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="">Tokens Not Found</SelectItem>
                                ))
                            }

                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Recipient Address</Label>
                    <Input id="address" value={recipient as string} placeholder="Enter recipient's wallet address" onChange={(e) => setRecipient(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" value={amount} type="number" placeholder="0.00" onChange={(e) => setAmount(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleTransfer}>
                    {
                        isSubmitting ? <span className="flex items-center"><LucideLoader2 className="animate-spin mr-2" /> Sending</span> : 'Send Transaction'
                    }
                </Button>
            </CardContent>
        </Card>
    )
}