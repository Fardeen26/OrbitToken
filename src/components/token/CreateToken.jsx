import { useState } from "react";
import { TOKEN_2022_PROGRAM_ID, createMintToInstruction, createAssociatedTokenAccountInstruction, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, getAssociatedTokenAddressSync } from "@solana/spl-token"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { Toaster, toast } from "sonner";
import { UploadClient } from "@uploadcare/upload-client";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";

const client = new UploadClient({ publicKey: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY });

const CreateToken = () => {
    const [tokenName, setTokenName] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [tokenImageUrl, setTokenImageUrl] = useState('')
    const [tokenSupply, setTokenSupply] = useState('')
    const [tokenDecimal, setTokenDecimal] = useState('')
    const [isCreating, setIsCreating] = useState(false);
    const { connection } = useConnection();
    const wallet = useWallet();

    const createAndUploadMetadata = async (name, symbol, description, imageUrl) => {
        const metadata = JSON.stringify({
            name,
            symbol,
            description,
            image: imageUrl,
        });

        const metadataFile = new File([metadata], "metadata.json", { type: "application/json" });

        try {
            const result = await client.uploadFile(metadataFile);
            return result.cdnUrl;
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    };

    async function buildToken(e) {
        e.preventDefault();
        if (!wallet.publicKey) return toast.error("Please connect to a wallet first")
        if (!tokenName || !tokenSymbol || !tokenImageUrl || !tokenDecimal || !tokenSupply) return toast.error("Provide the correct credentials")

        try {
            setIsCreating(true);
            const mintKeypair = Keypair.generate();

            let metadataUri = await createAndUploadMetadata(tokenName, tokenSymbol, "Created using OrbitToken", tokenImageUrl);
            if (!metadataUri) {
                toast.info("Failed to generate metadata URI, using custom URI")
                metadataUri = import.meta.env.VITE_DEFAULT_URI
            };

            const metadata = {
                mint: mintKeypair.publicKey,
                name: tokenName,
                symbol: tokenSymbol,
                uri: metadataUri,
                additionalMetadata: [],
            };

            const mintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

            const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: mintLen,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
                createInitializeMintInstruction(mintKeypair.publicKey, tokenDecimal, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mintKeypair.publicKey,
                    metadata: mintKeypair.publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri,
                    mintAuthority: wallet.publicKey,
                    updateAuthority: wallet.publicKey,
                }),
            );

            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            transaction.partialSign(mintKeypair);

            await wallet.sendTransaction(transaction, connection);

            toast.info(`Token mint created at ${mintKeypair.publicKey.toBase58()}`)
            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
            );

            toast.info(associatedToken.toBase58())

            const transaction2 = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID,
                ),
                createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, tokenSupply * Math.pow(10, tokenDecimal), [], TOKEN_2022_PROGRAM_ID)
            );

            await wallet.sendTransaction(transaction2, connection);

            setIsCreating(false)
            toast.success("Token is created Successfully!")
            setTokenDecimal('');
            setTokenImageUrl('');
            setTokenName('');
            setTokenSupply('');
            setTokenSymbol('');
        } catch (error) {
            setIsCreating(false)
            toast.error(error.message);
        }

    }

    return (
        <div className="mt-8 flex justify-center p-5 w-[30vw] items-center rounded-lg bg-white">
            <Toaster position="bottom-right" />
            <form onSubmit={buildToken} className='flex flex-col items-center gap-3 w-full'>
                <div className="space-y-2 w-full">
                    <Label labelText={"Name"} />
                    <Input placeholder={"Dogecoin"} value={tokenName} setter={setTokenName} />
                </div>

                <div className="space-y-2 w-full">
                    <Label labelText={"Symbol"} />
                    <Input placeholder={"DOGE!"} value={tokenSymbol} setter={setTokenSymbol} />
                </div>

                <div className="space-y-2 w-full">
                    <Label labelText={"Image"} />
                    <Input placeholder={"https://cat-image.com"} value={tokenImageUrl} setter={setTokenImageUrl} />
                </div>

                <div className="space-y-2 w-full">
                    <Label labelText={"Decimal"} />
                    <Input placeholder={"9"} value={tokenDecimal} setter={setTokenDecimal} />
                </div>

                <div className="space-y-2 w-full">
                    <Label labelText={"Supply"} />
                    <Input placeholder={"1000"} value={tokenSupply} setter={setTokenSupply} />
                </div>

                <Button btnText={"Create Token"} btnState={isCreating} onStateText={"Creating..."} />
            </form>
        </div>
    )
}

export default CreateToken