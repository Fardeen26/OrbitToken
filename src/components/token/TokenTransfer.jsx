import { useState, useEffect } from "react";
import {
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Toaster, toast } from "sonner";
import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { getTokenMetadata } from "@solana/spl-token";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { getAccount } from "@solana/spl-token";
import { TokenAccountNotFoundError } from "@solana/spl-token";
import { TokenInvalidAccountOwnerError } from "@solana/spl-token";

const TokenTransfer = () => {
    const [normalTokens, setNormalTokens] = useState([]);
    const [token22s, setToken22s] = useState([]);
    const [selectedTokenType, setSelectedTokenType] = useState("normal");
    const [selectedToken, setSelectedToken] = useState(null);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState('');
    const [isSending, setIsSending] = useState(false);

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    useEffect(() => {
        if (publicKey) {
            if (selectedTokenType === "normal") {
                fetchNormalTokens();
            } else if (selectedTokenType === "token22") {
                fetchTokens22();
            }
        }
    }, [selectedTokenType, publicKey]);

    useEffect(() => {
        setSelectedToken(null);
    }, [selectedTokenType]);

    const fetchNormalTokens = async () => {
        const tokenMint = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });
        const userTokens = tokenMint.value.map((account, index) => ({
            mint: account.account.data.parsed.info.mint,
            balance: account.account.data.parsed.info.tokenAmount.uiAmount,
            name: `Unknown Token ${index + 1}`,
        }));
        setNormalTokens(userTokens);
    };

    const fetchTokens22 = async () => {
        const tokenMint22 = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_2022_PROGRAM_ID });
        const userTokens22 = await Promise.all(tokenMint22.value.map(async (account) => {
            const mint = account.account.data.parsed.info.mint;
            const balance = account.account.data.parsed.info.tokenAmount.uiAmount;

            const metadata = await getTokenMetadata(connection, new PublicKey(mint), 'confirmed', TOKEN_2022_PROGRAM_ID);
            return {
                mint,
                balance,
                name: metadata.name || "Unknown Token-22",
                symbol: metadata.symbol || "Coin"
            };
        }));

        setToken22s(userTokens22);
    };

    const sendNormalToken = async () => {
        if (!publicKey) return toast.error('Wallet is not connected');
        if (!recipient || !amount) return toast.error('Provide the correct credentials');

        setIsSending(true);
        try {
            const sourceAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                publicKey,
                new PublicKey(selectedToken),
                publicKey
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

                const createAssociatedAccountInstruction = createAssociatedTokenAccountInstruction(
                    publicKey,
                    associatedTokenAddress,
                    recipientPublicKey,
                    new PublicKey(selectedToken),
                    TOKEN_PROGRAM_ID
                );

                const createTransaction = new Transaction().add(createAssociatedAccountInstruction);
                await sendTransaction(createTransaction, connection);
            } else {
                destinationAccountPubkey = recipientTokenAccounts.value[0].pubkey;
            }

            const transferInstruction = createTransferInstruction(
                sourceAccount.address,
                destinationAccountPubkey,
                publicKey,
                amount * Math.pow(10, 9)
            );

            const transferTransaction = new Transaction().add(transferInstruction);
            const latestBlockHash = await connection.getLatestBlockhash('confirmed');
            transferTransaction.recentBlockhash = latestBlockHash.blockhash;
            transferTransaction.feePayer = publicKey;

            const signature = await sendTransaction(transferTransaction, connection);
            toast.success(`Transaction is Successful! ${signature}`);
            setAmount('')
            setRecipient('');
        } catch (error) {
            setIsSending(false);
            toast.error(`Transaction failed: ${error.message}`);
        } finally {
            setIsSending(false);
        }
    };

    const sendToken22 = async () => {
        if (!publicKey) return toast.error('Wallet is not connected');
        if (!recipient || !amount) return toast.error('Provide the correct credentials');

        setIsSending(true)
        const recipientAddress = new PublicKey(recipient);
        const mint = new PublicKey(selectedToken);

        const sendersATA = getAssociatedTokenAddressSync( // getting sender ATA
            mint,
            publicKey,
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
                                publicKey,
                                associatedToken,
                                recipientAddress,
                                mint,
                                TOKEN_2022_PROGRAM_ID
                            )
                        );

                        const signature = await sendTransaction(transaction, connection);
                        toast.info('Associated token account created');

                        const latestBlockhash = await connection.getLatestBlockhash();
                        await connection.confirmTransaction({
                            blockhash: latestBlockhash.blockhash,
                            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                            signature,
                        });
                    } catch (error) {
                        toast.info(error.message);
                        setIsSending(false)
                        return;
                    }
                }
            }

            let amountInLamports = amount * Math.pow(10, 9);

            const tx = new Transaction().add(
                createTransferInstruction(
                    sendersATA,
                    associatedToken,
                    publicKey,
                    amountInLamports,
                    [],
                    TOKEN_2022_PROGRAM_ID
                )
            );

            const signature = await sendTransaction(tx, connection);
            toast.success(`Transaction Sent Successfully! ${signature}`);
            setIsSending(false)
        } catch (error) {
            toast.error(`Transaction failed: ${error.message}`);
            setIsSending(false)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!publicKey) {
            return toast.error("Please connect to a wallet first");
        }
        if (publicKey && !selectedToken) {
            return toast.error('Please select a token');
        }
        if (selectedTokenType === 'normal') {
            await sendNormalToken();
        } else {
            await sendToken22();
        }
    };

    return (
        <div className="mt-10 flex justify-center p-5 w-[30vw] max-sm:w-full items-center rounded-lg dark:bg-black dark:text-white ">
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-full">

                <div className="w-full">
                    <div className="text-xs mb-3 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Select token type</div>
                    <select
                        value={selectedTokenType}
                        onChange={(e) => setSelectedTokenType(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-black dark:border-white bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="normal" className="text-black">Normal Token</option>
                        <option value="token22" className="text-black">Token-22</option>
                    </select>
                </div>

                <div className="w-full mt-1">
                    <div className="text-xs mb-3 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Choose a token</div>
                    <select
                        value={selectedToken || ""}
                        onChange={(e) => setSelectedToken(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-black dark:border-white bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="" disabled>
                            Select a token
                        </option>
                        {selectedTokenType === "normal" &&
                            (normalTokens.length ? (
                                normalTokens.map((token, index) => (
                                    <option value={token.mint} key={index} className="text-black">
                                        {token.name} ({token.balance})
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled className="text-black">
                                    No tokens found
                                </option>
                            ))}
                        {selectedTokenType === "token22" &&
                            (token22s.length ? (
                                token22s.map((token, index) => (
                                    <option value={token.mint} key={index} className="text-black">
                                        {token.name} ({token.balance})
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled className="text-black">
                                    No Token-22 tokens found
                                </option>
                            ))}
                    </select>
                </div>

                <div className="space-y-2 w-full">
                    <Label labelText={"Recipient Address"} />
                    <Input placeholder={"578xpu1oZP9HfL1uMP98bVDpbcwbJwCn2T2xYz3uhML1"} value={recipient} setter={setRecipient} type={'text'} />
                </div>

                <div className="space-y-2 w-full">
                    <Label labelText={"Amount"} />
                    <Input placeholder={"0.01"} value={amount} setter={setAmount} type={'number'} />
                </div>

                <Button btnText={"Send Transaction"} btnState={isSending} onStateText={"Sending..."} />
            </form>
        </div>
    );
};

export default TokenTransfer;
