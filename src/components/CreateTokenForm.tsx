/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenCreationAtom } from "@/atoms"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRecoilState } from "recoil"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import PinataService from "@/utils/uploadMetadata"
import { createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, createMintToInstruction, ExtensionType, getAssociatedTokenAddressSync, getMintLen, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token"
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata"

export function CreateTokenForm() {
    const [tokenData, setTokenData] = useRecoilState(tokenCreationAtom);
    const { connection } = useConnection();
    const wallet = useWallet();

    const handleInputChange = (event: { target: { id: any; value: any } }) => {
        const { id, value } = event.target;
        setTokenData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const uploadMetadata = async () => {
        const metadata = {
            tokenName: tokenData.tokenName,
            tokenSymbol: tokenData.tokenSymbol,
            description: "Created using the OrbitToken",
            tokenImage: tokenData.tokenImage
        }
        const metadataUrl = await PinataService.uploadMetadata(metadata);
        return metadataUrl;
    }

    const createToken = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!wallet.publicKey) return console.error("Please connect to a wallet first")
        if (!tokenData) return console.error("Provide the correct credentials")

        try {
            const mintKeypair = Keypair.generate();

            let metadataUri = await uploadMetadata();

            console.log("in cttoken fnx", metadataUri);

            if (!metadataUri) {
                console.error("Failed to generate metadata URI, using custom URI")
                metadataUri = import.meta.env.VITE_DEFAULT_URI
            };

            const metadata = {
                mint: mintKeypair.publicKey,
                name: tokenData.tokenName,
                symbol: tokenData.tokenSymbol,
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
                createInitializeMintInstruction(mintKeypair.publicKey, tokenData.tokenDecimals, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
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

            console.info(`Token mint created at ${mintKeypair.publicKey.toBase58()}`)
            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
            );

            console.info(associatedToken.toBase58())

            const transaction2 = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID,
                ),
                createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, tokenData.tokenSupply * Math.pow(10, tokenData.tokenDecimals), [], TOKEN_2022_PROGRAM_ID)
            );

            await wallet.sendTransaction(transaction2, connection);

        } catch (error) {
            console.error('Error while creating token', error)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Token</CardTitle>
                <CardDescription>Deploy a new token on Solana blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="tokenName">Token Name</Label>
                    <Input id="tokenName" placeholder="Enter token name" onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tokenSymbol">Token Symbol</Label>
                    <Input id="tokenSymbol" placeholder="Enter token symbol" onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tokenImage">Image URL</Label>
                    <Input id="tokenImage" type="text" placeholder="https://cat.png" onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tokenDecimals">Decimals</Label>
                    <Input id="tokenDecimals" type="number" placeholder="9" onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tokenSupply">Initial Supply</Label>
                    <Input id="tokenSupply" type="number" placeholder="1000000" onChange={handleInputChange} />
                </div>
                <Button className="w-full" onClick={createToken}>Create Token</Button>
            </CardContent>
        </Card>
    )
}

