import { useState, useEffect } from "react";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getOrCreateAssociatedTokenAccount, createTransferInstruction, getTokenMetadata } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Toaster, toast } from 'sonner'

const TokenTransfer = () => {
    const [normalTokens, setNormalTokens] = useState([]);
    const [token22s, setToken22s] = useState([]);
    const [selectedTokenType, setSelectedTokenType] = useState('normal');
    const [selectedToken, setSelectedToken] = useState(null);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState(0);
    const [isSending, setIsSending] = useState(false)

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    useEffect(() => {
        if (publicKey) {
            if (selectedTokenType === 'normal') {
                fetchNormalTokens();
            } else if (selectedTokenType === 'token22') {
                fetchTokens22();
            }
        }
    }, [selectedTokenType]);

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
            console.log(metadata)
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
        if (!recipient || !amount) return toast.error('Provide the correct credentials')

        setIsSending(true)
        try {
            let sourceAccount = await getOrCreateAssociatedTokenAccount(
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
                console.log(`Recipient does not have an associated token account, creating one...`);

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
                console.log(`Associated token account created: ${associatedTokenAddress.toString()}`);
            } else {
                destinationAccountPubkey = recipientTokenAccounts.value[0].pubkey;
                console.log(`Recipient already has associated token account: ${destinationAccountPubkey.toString()}`);
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
            const signature = await sendTransaction(transferTransaction, connection);

            toast.success(`Transaction is Successful! ${signature}`)
            setIsSending(false)
        } catch (error) {
            toast.error(error.message)
            setIsSending(false)
        }
    };

    const sendToken22 = async () => {
        if (!publicKey) return toast.error('Wallet is not connected');
        if (!recipient || !amount || amo) return toast.error('Provide the correct credentials')
        setIsSending(true)
        try {
            const sourceTokenAccounts = await connection.getTokenAccountsByOwner(
                publicKey, { programId: TOKEN_2022_PROGRAM_ID }
            );
            if (sourceTokenAccounts.value.length === 0) {
                throw new Error('No Token-22 account found for the wallet');
            }
            const sourceTokenAccount = sourceTokenAccounts.value[0].pubkey;

            const destinationWallet = new PublicKey(recipient);

            const mint = new PublicKey(selectedToken);

            const destinationTokenAccount = await connection.getTokenAccountsByOwner(destinationWallet, {
                programId: TOKEN_2022_PROGRAM_ID,
            });

            let destinationTokenAccountPubkey;

            if (destinationTokenAccount.value.length === 0) {
                const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
                const associatedTokenAddress = PublicKey.findProgramAddressSync(
                    [destinationWallet.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
                    ASSOCIATED_TOKEN_PROGRAM_ID
                )[0];

                destinationTokenAccountPubkey = associatedTokenAddress;

                const createAssociatedAccountInstruction = createAssociatedTokenAccountInstruction(
                    publicKey,
                    associatedTokenAddress,
                    destinationWallet,
                    mint,
                    TOKEN_2022_PROGRAM_ID
                );

                const transaction = new Transaction().add(createAssociatedAccountInstruction);

                await sendTransaction(transaction, connection);
            } else {
                destinationTokenAccountPubkey = destinationTokenAccount.value[0].pubkey;
            }

            const transferInstruction = createTransferInstruction(
                sourceTokenAccount,
                destinationTokenAccountPubkey,
                publicKey,
                amount * Math.pow(10, 9),
                [],
                TOKEN_2022_PROGRAM_ID
            );

            const transaction = new Transaction().add(transferInstruction);
            const signature = await sendTransaction(transaction, connection);
            toast.success(`Transaction is Successful! ${signature}`)
            setIsSending(false)
        } catch (error) {
            toast.error(error.message)
            setIsSending(false)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!publicKey) {
            return toast.error("Please connect to a wallet first")
        }
        if (publicKey && !selectedToken) {
            toast.error('Please select a token')
            return;
        }
        if (selectedTokenType === 'normal') {
            await sendNormalToken();
        } else {
            await sendToken22();
        }
    };

    return (
        <div className="mt-20 flex justify-center p-5 w-[30vw] items-center rounded-lg bg-white">
            <Toaster position="bottom-right" />
            <form onSubmit={handleSubmit} className='flex flex-col items-center gap-3'>
                <select value={selectedTokenType} onChange={(e) => setSelectedTokenType(e.target.value)} className="bg-black text-white px-3 py-2 rounded-lg w-full">
                    <option value="normal">Normal Token</option>
                    <option value="token22">Token-22</option>
                </select>

                <select value={selectedToken || ''} onChange={(e) => setSelectedToken(e.target.value)} className="bg-black text-white px-3 py-2 rounded-lg w-full">
                    <option value="" disabled>Select a token</option>
                    {
                        selectedTokenType === 'normal' && (
                            normalTokens.length ? (
                                normalTokens.map((token, index) => (
                                    <option key={index} value={token.mint}>
                                        {token.name} - Balance: {token.balance}
                                    </option>
                                ))
                            ) : <option value="" disabled>No tokens present</option>
                        )
                    }

                    {
                        selectedTokenType === 'token22' && (
                            token22s.length ? (
                                token22s.map((token, index) => (
                                    <option key={index} value={token.mint}>
                                        {token.name} - Balance: {token.balance}
                                    </option>
                                ))
                            ) : <option value="" disabled>No token-22 present</option>
                        )
                    }
                </select>

                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder='Recipient Address'
                    className='bg-black placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg border'
                />
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder='Amount'
                    className='bg-black placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg border'
                />
                <button type="submit" className='text-lg mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black'>{isSending ? 'Sending...' : 'Transfer Token'} </button>
            </form>
        </div>
    );
}

export default TokenTransfer;
