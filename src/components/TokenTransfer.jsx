// import { useState } from "react";
// import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getOrCreateAssociatedTokenAccount, createTransferInstruction, getTokenMetadata } from "@solana/spl-token";
// import { PublicKey, Transaction } from "@solana/web3.js";
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';


// const TokenTransfer = () => {
//     const [mintAddress, setMintAddress] = useState([]);
//     const { connection } = useConnection();
//     const { publicKey, sendTransaction } = useWallet();

//     const fetchTokens = async () => {
//         const tokenMint = await connection.getParsedTokenAccountsByOwner(
//             publicKey,
//             { programId: TOKEN_PROGRAM_ID }
//         );

//         // console.log(tokenMint.value[0].account.data.program);
//         console.log("token mints ", tokenMint);

//         const userTokens = tokenMint.value.map((account) => ({
//             mint: account.account.data.parsed.info.mint,
//             amount: account.account.data.parsed.info.tokenAmount.uiAmount,
//             symbol: account.account.data.parsed.info.tokenAmount.decimals, // If you have token metadata
//         }));

//         console.log("user tokens ", userTokens)

//         setMintAddress([...mintAddress, userTokens[0].mint]);
//     };


//     const fetchTokens22 = async () => {
//         const tokenMint22 = await connection.getParsedTokenAccountsByOwner(publicKey, {
//             programId: TOKEN_2022_PROGRAM_ID
//         })

//         console.log(tokenMint22.value[0].account.data.program);
//         // fetch mint address
//         const userTokens22 = tokenMint22.value.map((account) => ({
//             mint: account.account.data.parsed.info.mint,
//             amount: account.account.data.parsed.info.tokenAmount.uiAmount,
//             symbol: account.account.data.parsed.info.tokenAmount.decimals,
//         }));

//         setMintAddress([...mintAddress, userTokens22[0].mint]);

//         // fetch the metadata
//         const getMetaData = async () => {
//             const metadata = await getTokenMetadata(
//                 connection,
//                 new PublicKey(userTokens22[0].mint),
//                 'confirmed',
//                 TOKEN_2022_PROGRAM_ID,
//             )
//             console.log(metadata)
//         }

//         getMetaData();
//     };

//     const DESTINATION_WALLET = 'HyjQfrWfPLWrWEMaamn1cNMGecMz8NHSXcZWJ3eXLRRq';
//     const MINT_ADDRESS = '5f7onzn6Psctq3ASebUzNmyXcuNEZx9A6A1xjbKxxBRn';
//     const TRANSFER_AMOUNT = 1;

//     const sendToken = async (e) => {
//         e.preventDefault();

//         console.log(`1 - Getting Source Token Account`);
//         try {
//             let sourceAccount = await getOrCreateAssociatedTokenAccount(
//                 connection,
//                 publicKey,
//                 new PublicKey(MINT_ADDRESS),
//                 publicKey
//             );
//             console.log(`Source Account: ${sourceAccount.address.toString()}`);

//             console.log(`2 - Getting Destination Token Account`);
//             let destinationAccount = await getOrCreateAssociatedTokenAccount(
//                 connection,
//                 publicKey,
//                 new PublicKey(MINT_ADDRESS),
//                 new PublicKey(DESTINATION_WALLET)
//             );
//             console.log(`Destination Account: ${destinationAccount.address.toString()}`);

//             console.log(`3 - Creating and Sending Transaction`);
//             const tx = new Transaction();
//             tx.add(createTransferInstruction(
//                 sourceAccount.address,
//                 destinationAccount.address,
//                 publicKey,
//                 TRANSFER_AMOUNT * Math.pow(10, 9)
//             ))

//             const latestBlockHash = await connection.getLatestBlockhash('confirmed');
//             tx.recentBlockhash = await latestBlockHash.blockhash;
//             const signature = await sendTransaction(tx, connection);
//             console.log(`Transaction Success!🎉`, `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`);
//         } catch (error) {
//             console.log("an error occurred :- ", error)
//         }
//     }

//     return (
//         <div className="mt-20 flex justify-center  p-5 w-[30vw] items-center rounded-lg bg-white">
//             <form action="" className='flex flex-col items-center gap-3' onSubmit={sendToken}>
//                 <select name="" id="">
//                     <option value="1">Token 1</option>
//                 </select>
//                 <input type="text" placeholder='recipient' className='bg-black placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg border' />
//                 <input type="text" placeholder='amount' className='bg-black placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg border' />
//                 <button className='text-xl mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black font-mono'>Send Token</button>
//             </form>
//             <button onClick={fetchTokens} className='text-xl mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black font-mono'>Get Token</button>
//             <button onClick={fetchTokens22} className='text-xl mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black font-mono'>Get Token 22</button>
//         </div>
//     )
// }

// export default TokenTransfer


import { useState, useEffect } from "react";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getOrCreateAssociatedTokenAccount, createTransferInstruction, getTokenMetadata, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const TokenTransfer = () => {
    const [normalTokens, setNormalTokens] = useState([]);
    const [token22s, setToken22s] = useState([]);
    const [selectedTokenType, setSelectedTokenType] = useState('normal');
    const [selectedToken, setSelectedToken] = useState(null);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState(0);

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    useEffect(() => {
        if (selectedTokenType === 'normal') {
            fetchNormalTokens();
        } else if (selectedTokenType === 'token22') {
            fetchTokens22();
        }
    }, [selectedTokenType]);

    useEffect(() => {
        setSelectedToken(null);
    }, [selectedTokenType]);

    const fetchNormalTokens = async () => {
        if (!publicKey) return;
        const tokenMint = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });
        const userTokens = tokenMint.value.map((account, index) => ({
            mint: account.account.data.parsed.info.mint,
            balance: account.account.data.parsed.info.tokenAmount.uiAmount,
            name: `Unknown Token ${index + 1}`,
        }));

        setNormalTokens(userTokens);
    };

    const fetchTokens22 = async () => {
        if (!publicKey) return;
        const tokenMint22 = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_2022_PROGRAM_ID });
        const userTokens22 = await Promise.all(tokenMint22.value.map(async (account) => {
            const mint = account.account.data.parsed.info.mint;
            const balance = account.account.data.parsed.info.tokenAmount.uiAmount;

            // Fetch metadata for Token-22
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

            // Step 7: Build and send the transfer transaction
            const transferTransaction = new Transaction().add(transferInstruction);
            const latestBlockHash = await connection.getLatestBlockhash('confirmed');
            transferTransaction.recentBlockhash = latestBlockHash.blockhash;
            const signature = await sendTransaction(transferTransaction, connection);

            console.log(`Transaction Success! 🎉 https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        } catch (error) {
            console.log("An error occurred: ", error);
        }
    };


    const sendToken22 = async () => {
        if (!publicKey) {
            console.log('Wallet not connected');
            return;
        }
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
            console.log(`Transaction Success! 🎉 https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        } catch (error) {
            console.error('Error transferring Token-22:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedToken) {
            alert("Please select a token.");
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
            <form onSubmit={handleSubmit} className='flex flex-col items-center gap-3'>
                {/* Token Type Selector */}
                <select value={selectedTokenType} onChange={(e) => setSelectedTokenType(e.target.value)} className="bg-black text-white px-3 py-2 rounded-lg w-full">
                    <option value="normal">Normal Token</option>
                    <option value="token22">Token-22</option>
                </select>

                {/* Token Selector Dropdown */}
                <select value={selectedToken || ''} onChange={(e) => setSelectedToken(e.target.value)} className="bg-black text-white px-3 py-2 rounded-lg w-full">
                    {selectedTokenType === 'normal' && normalTokens.map((token, index) => (
                        <option key={index} value={token.mint}>
                            {token.name} -  {token.balance.toFixed(2)} Coin
                        </option>
                    ))}
                    {selectedTokenType === 'token22' && token22s.map((token, index) => (
                        <option key={index} value={token.mint} className="flex text-blue-500 bg-red-700 gap-5">
                            {token.name} -  {token.balance.toFixed(2)} {token.symbol}
                        </option>
                    ))}
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
                <button type="submit" className='text-xl mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black font-mono'>Send Token</button>
            </form>
        </div>
    );
}

export default TokenTransfer;
