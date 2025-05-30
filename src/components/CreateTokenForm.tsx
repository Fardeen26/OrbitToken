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
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { LucideLoader2 } from "lucide-react"

export function CreateTokenForm() {
    const [tokenData, setTokenData] = useRecoilState(tokenCreationAtom);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { connection } = useConnection();
    const wallet = useWallet();
    const { toast } = useToast()

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
        if (!wallet.publicKey) {
            return toast({
                variant: "destructive",
                title: "Uh oh! Wallet not Connected",
            })
        }
        if (!tokenData) {
            return toast({
                variant: "destructive",
                title: "Provide the correct credentials",
            })
        }

        setIsSubmitting(true);
        try {
            const mintKeypair = Keypair.generate();
            let metadataUri = await uploadMetadata();

            if (!metadataUri) {
                metadataUri = import.meta.env.VITE_DEFAULT_URI
                return toast({
                    variant: "destructive",
                    title: "Failed to upload metadata",
                })
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

            toast({
                variant: 'default',
                title: "Token mint created",
            })

            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
            );

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

            toast({
                variant: 'default',
                title: "Token is created Successfully!",
            })

            setTokenData({
                tokenName: '',
                tokenSymbol: '',
                tokenImage: '',
                tokenSupply: 0,
                tokenDecimals: 0,
            })

        } catch (error) {
            toast({
                variant: 'destructive',
                title: "rror while creating token",
                description: error instanceof Error ? error.message : "An unknown error occurred"
            })
        } finally {
            setIsSubmitting(false);
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
                    <Input
                        id="tokenName"
                        placeholder="Enter token name"
                        onChange={handleInputChange}
                        value={tokenData.tokenName}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tokenSymbol">Token Symbol</Label>
                    <Input
                        id="tokenSymbol"
                        placeholder="Enter token symbol"
                        onChange={handleInputChange}
                        value={tokenData.tokenSymbol}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tokenImage">Image URL</Label>
                    <Input
                        id="tokenImage"
                        type="text"
                        placeholder="https://cat.png"
                        onChange={handleInputChange}
                        value={tokenData.tokenImage}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tokenDecimals">Decimals</Label>
                    <Input
                        id="tokenDecimals"
                        type="number"
                        placeholder="9"
                        onChange={handleInputChange}
                        value={tokenData.tokenDecimals}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tokenSupply">Initial Supply</Label>
                    <Input
                        id="tokenSupply"
                        type="number"
                        placeholder="1000000"
                        onChange={handleInputChange}
                        value={tokenData.tokenSupply}
                    />
                </div>
                <Button className="w-full" onClick={createToken}>
                    {
                        isSubmitting ? <span className="flex items-center"><LucideLoader2 className="animate-spin mr-2" /> Creating</span> : 'Create Token'
                    }
                </Button>
            </CardContent>
        </Card>
    )
}

