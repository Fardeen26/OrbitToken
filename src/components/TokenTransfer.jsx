import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getOrCreateAssociatedTokenAccount, createTransferInstruction, transfer } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction, clusterApiUrl } from "@solana/web3.js";
// import bs58 from 'bs58';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from "react";
import { getTokenMetadata } from "@solana/spl-token";
// tkn 22-- ->  TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
const TokenTransfer = () => {

    // const SOLANA_CONNECTION = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const [mintAddress, setMintAddress] = useState([]);
    const { connection } = useConnection();
    const { sendTransaction } = useWallet();
    const publicKey = new PublicKey('578xpu1oZP9HfL1uMP98bVDpbcwbJwCn2T2xYz3uhML1');

    const fetchTokens = async () => {
        const tokenMint = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            { programId: TOKEN_PROGRAM_ID }
        );


        const userTokens = tokenMint.value.map((account) => ({
            mint: account.account.data.parsed.info.mint,
            amount: account.account.data.parsed.info.tokenAmount.uiAmount,
            symbol: account.account.data.parsed.info.tokenAmount.decimals, // If you have token metadata
        }));
        // setTokens(userTokens);
        // console.log("token mint", userTokens[0].mint);
        setMintAddress([...mintAddress, userTokens[0].mint]);
    };



    const fetchTokens22 = async () => {
        const tokenMint22 = await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: TOKEN_2022_PROGRAM_ID
        })

        const userTokens22 = tokenMint22.value.map((account) => ({
            mint: account.account.data.parsed.info.mint,
            amount: account.account.data.parsed.info.tokenAmount.uiAmount,
            symbol: account.account.data.parsed.info.tokenAmount.decimals, // If you have token metadata
        }));

        setMintAddress([...mintAddress, userTokens22[0].mint]);

        const getMetaData = async () => {
            const metadata = await getTokenMetadata(
                connection, // Connection instance
                new PublicKey(userTokens22[0].mint), // PubKey of the Mint Account
                'confirmed', // Commitment, can use undefined to use default
                TOKEN_2022_PROGRAM_ID,
            )
            console.log(metadata)
        }

        getMetaData();
    };





    // const PRIVATE_KEY_STRING = '5AHLjsKDiC3SVW98k1cw3Hr8LKbKLAQYGvwZV45U6no7yfTQwqQcQLcJNCyaCCtg89Q9DVLmWRtBHJt3rE2epFf3';

    // Convert the base58 encoded private key string to a Uint8Array
    // const secretKey = bs58.decode(PRIVATE_KEY_STRING);
    // const FROM_KEYPAIR = Keypair.fromSecretKey(secretKey);

    // =================================================================================================================================

    const DESTINATION_WALLET = 'HyjQfrWfPLWrWEMaamn1cNMGecMz8NHSXcZWJ3eXLRRq';
    const MINT_ADDRESS = '5f7onzn6Psctq3ASebUzNmyXcuNEZx9A6A1xjbKxxBRn'; //You must change this value!
    const TRANSFER_AMOUNT = 1;

    const sendToken = async (e) => {
        e.preventDefault();

        // console.log(`Sending ${TRANSFER_AMOUNT} ${(MINT_ADDRESS)} from ${(FROM_KEYPAIR.publicKey.toString())} to ${(DESTINATION_WALLET)}.`)
        //Step 1
        console.log(`1 - Getting Source Token Account`);

        try {
            let sourceAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                publicKey,
                new PublicKey(MINT_ADDRESS),
                publicKey
            );
            console.log(`Source Account: ${sourceAccount.address.toString()}`);

            //Step 2
            console.log(`2 - Getting Destination Token Account`);
            let destinationAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                publicKey,
                new PublicKey(MINT_ADDRESS),
                new PublicKey(DESTINATION_WALLET)
            );
            console.log(`Destination Account: ${destinationAccount.address.toString()}`);

            //Step 3
            console.log(`4 - Creating and Sending Transaction`);
            const tx = new Transaction();
            tx.add(createTransferInstruction(
                sourceAccount.address,
                destinationAccount.address,
                publicKey,
                TRANSFER_AMOUNT * Math.pow(10, 9)
            ))

            const latestBlockHash = await connection.getLatestBlockhash('confirmed');
            tx.recentBlockhash = await latestBlockHash.blockhash;
            const signature = await sendTransaction(tx, connection);
            console.log(
                '\x1b[32m', //Green Text
                `   Transaction Success!🎉`,
                `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
            );
        } catch (error) {
            console.log("error aa gya :- ", error)
        }

    }
    // ===========================================================================================================================



    // const handleTransfer = async () => {
    //     if (!publicKey) {
    //         alert('Wallet not connected!');
    //         return;
    //     }

    //     // Replace these with your actual addresses and amount
    //     const tokenMintAddress = new PublicKey('5f7onzn6Psctq3ASebUzNmyXcuNEZx9A6A1xjbKxxBRn');
    //     const receiverPublicKey = new PublicKey('HyjQfrWfPLWrWEMaamn1cNMGecMz8NHSXcZWJ3eXLRRq');
    //     const amountToTransfer = 1000000000; // Amount in smallest units of the token

    //     // Create an instance of the Token class with the custom program ID
    //     const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
    //         connection,
    //         publicKey,
    //         tokenMintAddress,
    //         publicKey
    //     );
    //     const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
    //         connection,
    //         publicKey,
    //         tokenMintAddress,
    //         receiverPublicKey
    //     );

    //     // Create a transaction to transfer tokens
    //     const transaction = new Transaction().add(
    //         transfer(
    //             connection,
    //             senderTokenAccount.address,
    //             receiverTokenAccount.address,
    //             publicKey,
    //             [],
    //             amountToTransfer
    //         )
    //     );

    //     try {
    //         const signature = await sendTransaction(transaction, connection);
    //         await connection.confirmTransaction(signature, 'confirmed');
    //         console.log('Transaction confirmed with signature:', signature);
    //     } catch (error) {
    //         console.error('Transaction failed:', error);
    //     }
    // }


    return (
        <div className="mt-20 flex justify-center  p-5 w-[30vw] items-center rounded-lg bg-white">
            <form action="" className='flex flex-col items-center gap-3' >
                <select name="" id="">
                    <option value="1">Token 1</option>
                </select>
                <input type="text" placeholder='recipient' className='bg-black placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg border' />
                <input type="text" placeholder='amount' className='bg-black placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg border' />
                <button className='text-xl mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black font-mono'>Send Token</button>
            </form>
            <button onClick={fetchTokens} className='text-xl mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black font-mono'>Get Token</button>
            <button onClick={fetchTokens22} className='text-xl mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black font-mono'>Get Token 22</button>
        </div>
    )
}

export default TokenTransfer




// import { useState } from "react";
// import { useWallet, useConnection } from "@solana/wallet-adapter-react";
// import { PublicKey, Transaction } from "@solana/web3.js";
// import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// const TokenTransfer = () => {
//     const { connection } = useConnection();
//     const { publicKey, sendTransaction } = useWallet();
//     const [mintAddress, setMintAddress] = useState(""); // User selects the token mint address
//     const [destinationWallet, setDestinationWallet] = useState(""); // User enters the destination wallet address
//     const [amount, setAmount] = useState(0); // Amount to transfer

//     const handleTransfer = async () => {
//         if (!publicKey) {
//             alert("Please connect your wallet first!");
//             return;
//         }

//         try {
//             const sourceAccount = await getOrCreateAssociatedTokenAccount(
//                 connection,
//                 publicKey, // The current user's wallet public key
//                 new PublicKey(mintAddress),
//                 publicKey // Source is the user's wallet
//             );

//             const destinationAccount = await getOrCreateAssociatedTokenAccount(
//                 connection,
//                 publicKey,
//                 new PublicKey(mintAddress),
//                 new PublicKey(destinationWallet) // Destination wallet public key
//             );

//             const transaction = new Transaction().add(
//                 transfer(
//                     connection,
//                     publicKey, // The current user's wallet public key
//                     sourceAccount.address,
//                     destinationAccount.address,
//                     publicKey, // The current user's wallet public key (signer)
//                     amount
//                 )
//             );

//             const signature = await sendTransaction(transaction, connection);
//             console.log(`Transaction signature: ${signature}`);
//         } catch (error) {
//             console.error("Transfer failed", error);
//         }
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 placeholder="Enter Token Mint Address"
//                 value={mintAddress}
//                 onChange={(e) => setMintAddress(e.target.value)}
//             />
//             <input
//                 type="text"
//                 placeholder="Enter Destination Wallet Address"
//                 value={destinationWallet}
//                 onChange={(e) => setDestinationWallet(e.target.value)}
//             />
//             <input
//                 type="number"
//                 placeholder="Enter Amount to Transfer"
//                 value={amount}
//                 onChange={(e) => setAmount(parseInt(e.target.value, 10))}
//             />
//             <button onClick={handleTransfer}>Transfer Token</button>
//         </div>
//     );
// };

// export default TokenTransfer;









// import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
// import { useEffect, useState } from "react";
// import { useWallet, useConnection } from "@solana/wallet-adapter-react";
// import { PublicKey } from "@solana/web3.js";
// // import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token-2022";
// import { Metadata } from "@metaplex-foundation/mpl-token-metadata"; // Import Metaplex Metadata
// import { getTokenMetadata } from "@solana/spl-token";

// const TransferToken = () => {
//     // const TOKEN_2022_PROGRAM_ID = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
//     const { connection } = useConnection();
//     const { publicKey } = useWallet();
//     const [tokens, setTokens] = useState([]);
//     const [setSelectedToken] = useState(null);
//     const [destinationWallet, setDestinationWallet] = useState("");
//     const [amount, setAmount] = useState(0);

//     const getMetaData = async () => {
//         const metadata = await getTokenMetadata(
//             connection, // Connection instance
//             new PublicKey('2au8Tdm5fEQajaAN39jGWYPvfH7MDr1bS9qnRxS3oBDJ'), // PubKey of the Mint Account
//             'confirmed', // Commitment, can use undefined to use default
//             TOKEN_2022_PROGRAM_ID,
//         )
//         console.log(metadata)
//     }

//     // useEffect(() => {
//     //     const fetchTokens = async () => {
//     //         if (publicKey) {
//     //             // Fetch tokens from both the standard SPL Token Program and the Token-2022 Program
//     //             console.log("token prigram id", TOKEN_PROGRAM_ID)
//     //             console.log("token 22 prigram id", TOKEN_2022_PROGRAM_ID)
//     //             const tokenAccounts = await fetchTokenAccounts(publicKey);
//     //             setTokens(tokenAccounts);
//     //         }
//     //     };

//     //     fetchTokens();
//     // }, [publicKey, connection]);

//     // const fetchTokenAccounts = async (owner) => {
//     //     const accounts = [];

//     //     // Fetch standard SPL tokens
//     //     const splTokenAccounts = await connection.getParsedTokenAccountsByOwner(
//     //         owner,
//     //         { programId: TOKEN_PROGRAM_ID }
//     //     );

//     //     console.log("splTokenAccounts is here", splTokenAccounts)
//     //     let tokenInfo = 0;
//     //     splTokenAccounts.value.forEach(account => {
//     //         tokenInfo = account.account.data.parsed.info;
//     //         accounts.push({
//     //             mint: tokenInfo.mint,
//     //             amount: tokenInfo.tokenAmount.uiAmount,
//     //             decimals: tokenInfo.tokenAmount.decimals,
//     //             symbol: tokenInfo.mint, // Placeholder, replace with metadata fetch
//     //         });
//     //     });

//     //     console.log("tokenInfo is here", tokenInfo)


//     //     // Fetch Token-2022 accounts
//     //     const token2022Accounts = await connection.getTokenAccountsByOwner(
//     //         owner,
//     //         { programId: TOKEN_2022_PROGRAM_ID }
//     //     );

//     //     console.log("token2022Accounts is here", token2022Accounts)

//     //     for (const { account } of token2022Accounts.value) {
//     //         try {
//     //             console.log("account is here :- ", account)
//     //             const accountData = AccountLayout.decode(account.data);
//     //             const mintPublicKey = new PublicKey(accountData.mint);

//     //             // Fetch Metadata for Token-2022 if available
//     //             let metadata = null;
//     //             try {
//     //                 const metadataPDA = await Metadata.(mintPublicKey);
//     //                 const metadataAccount = await Metadata.load(connection, metadataPDA);
//     //                 metadata = metadataAccount.data;
//     //             } catch (error) {
//     //                 console.error("Failed to fetch metadata", error);
//     //             }

//     //             accounts.push({
//     //                 mint: mintPublicKey.toString(),
//     //                 amount: Number(accountData.amount) / 10 ** accountData.decimals, // Convert to user-friendly format
//     //                 decimals: accountData.decimals,
//     //                 symbol: metadata?.data?.symbol || mintPublicKey.toString(), // Use fetched metadata or fallback to mint address
//     //                 name: metadata?.data?.name, // Display name from metadata
//     //             });
//     //         } catch (error) {
//     //             console.error("Failed to parse Token-2022 account data", error);
//     //         }
//     //     }

//     //     return accounts;
//     // };

//     // const handleTransfer = async () => {
//     //     if (!publicKey || !selectedToken) {
//     //         alert("Please connect your wallet and select a token first!");
//     //         return;
//     //     }

//     //     try {
//     //         const sourceAccount = await getOrCreateAssociatedTokenAccount(
//     //             connection,
//     //             publicKey,
//     //             new PublicKey(selectedToken.mint),
//     //             publicKey
//     //         );

//     //         const destinationAccount = await getOrCreateAssociatedTokenAccount(
//     //             connection,
//     //             publicKey,
//     //             new PublicKey(selectedToken.mint),
//     //             new PublicKey(destinationWallet)
//     //         );

//     //         const transaction = new Transaction().add(
//     //             transfer(
//     //                 connection,
//     //                 publicKey,
//     //                 sourceAccount.address,
//     //                 destinationAccount.address,
//     //                 publicKey,
//     //                 amount * 10 ** selectedToken.decimals // Convert amount to the correct decimals
//     //             )
//     //         );

//     //         const signature = await sendTransaction(transaction, connection);
//     //         console.log(`Transaction signature: ${signature}`);
//     //     } catch (error) {
//     //         console.error("Transfer failed", error);
//     //     }
//     // };

//     return (
//         <div>
//             <button onClick={getMetaData}>ewncwekcv</button>
//             {/* <select onChange={(e) => setSelectedToken(tokens[e.target.value])}>
//                 <option value="">Select Token</option>
//                 {tokens.map((token, index) => (
//                     <option key={index} value={index}>
//                         {token.name || token.symbol || token.mint} - {token.amount}
//                     </option>
//                 ))}
//             </select> */}

//             <input
//                 type="text"
//                 placeholder="Enter Destination Wallet Address"
//                 value={destinationWallet}
//                 onChange={(e) => setDestinationWallet(e.target.value)}
//             />
//             <input
//                 type="number"
//                 placeholder="Enter Amount to Transfer"
//                 value={amount}
//                 onChange={(e) => setAmount(parseFloat(e.target.value))}
//             />
//             <button>Transfer Token</button>
//         </div>
//     );
// };

// export default TransferToken;
