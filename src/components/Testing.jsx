import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";
import { PublicKey, Transaction } from '@solana/web3.js';

const Testing = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const TransferToken22 = async () => {
        if (!publicKey) {
            console.log('Wallet not connected');
            return;
        }

        try {
            // Source token account (owned by the user)
            const sourceTokenAccounts = await connection.getTokenAccountsByOwner(
                publicKey, { programId: TOKEN_2022_PROGRAM_ID }
            );
            if (sourceTokenAccounts.value.length === 0) {
                throw new Error('No Token-22 account found for the wallet');
            }
            const sourceTokenAccount = sourceTokenAccounts.value[0].pubkey;

            // Destination wallet (put the public key of the recipient here)
            const destinationWallet = new PublicKey('HyjQfrWfPLWrWEMaamn1cNMGecMz8NHSXcZWJ3eXLRRq'); // replace with the actual destination

            // Token Mint
            const mint = new PublicKey('2au8Tdm5fEQajaAN39jGWYPvfH7MDr1bS9qnRxS3oBDJ'); // Token-22 Mint

            // Check if the destination wallet has an associated token account
            const destinationTokenAccount = await connection.getTokenAccountsByOwner(destinationWallet, {
                programId: TOKEN_2022_PROGRAM_ID,
            });

            let destinationTokenAccountPubkey;

            // If no associated token account for destination wallet, create one
            if (destinationTokenAccount.value.length === 0) {
                const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
                const associatedTokenAddress = PublicKey.findProgramAddressSync(
                    [destinationWallet.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mint.toBuffer()],
                    ASSOCIATED_TOKEN_PROGRAM_ID
                )[0];

                destinationTokenAccountPubkey = associatedTokenAddress;

                // Create an associated token account for the destination
                const createAssociatedAccountInstruction = createAssociatedTokenAccountInstruction(
                    publicKey,                      // Payer
                    associatedTokenAddress,         // Associated token account
                    destinationWallet,              // Owner of the associated token account
                    mint,                           // Token Mint
                    TOKEN_2022_PROGRAM_ID           // Program ID for Token-22
                );

                // Build the transaction
                const transaction = new Transaction().add(createAssociatedAccountInstruction);

                // Send transaction to create the associated token account
                await sendTransaction(transaction, connection);
            } else {
                destinationTokenAccountPubkey = destinationTokenAccount.value[0].pubkey;
            }

            // Create the transfer instruction
            const transferInstruction = createTransferInstruction(
                sourceTokenAccount,                // Source token account
                destinationTokenAccountPubkey,     // Destination token account
                publicKey,                         // Owner (user's public key)
                1000000000,                                 // Amount to transfer (adjust for decimals if necessary)
                [],                                // Multisigners
                TOKEN_2022_PROGRAM_ID
            );

            // Send the transfer transaction
            const transaction = new Transaction().add(transferInstruction);
            const signature = await sendTransaction(transaction, connection);
            console.log('Transaction signature:', signature);
        } catch (error) {
            console.error('Error transferring Token-22:', error);
        }
    };

    return (
        <div>
            Testing
            <button onClick={TransferToken22} className='bg-black text-white rounded'>
                Transfer Token 22
            </button>
        </div>
    );
};

export default Testing;
