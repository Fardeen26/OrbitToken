import { getTokenMetadata } from "@solana/spl-token";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
// TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA -> token program id
// HdxKHA1ErFUs7k4BrYuE59nHNmjLubhuF3jCsZ7dAbQw -> token mint
// 5Sxnh7cKqVLXRnz3FmVypgRMvzT6JxioXMy3WUqWMUUe -> token mint


const TokenBalance = () => {
    const [token, setToken] = useState([]);
    const [token22, setToken22] = useState([])
    const { connection } = useConnection();
    const wallet = useWallet();

    useEffect(() => {
        const getBalances = async () => {
            if (wallet.publicKey) {
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
                            return { mintAddress, balance };
                        } catch (error) {
                            console.error("Error decoding account data:", error);
                            return null;
                        }
                    }).filter(token => token !== null);

                    // console.log("tokens", tokens)
                    setToken(tokens)

                } catch (error) {
                    console.error("Error fetching balances:", error);
                }
            }
        };

        const getToken22Blanaces = async () => {
            if (!wallet.publicKey) return;
            const tokenMint22 = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_2022_PROGRAM_ID });
            const userTokens22 = await Promise.all(tokenMint22.value.map(async (account) => {
                const mint = account.account.data.parsed.info.mint;
                const balance = account.account.data.parsed.info.tokenAmount.uiAmount;

                // Fetch metadata for Token-22
                const metadata = await getTokenMetadata(connection, new PublicKey(mint), 'confirmed', TOKEN_2022_PROGRAM_ID);
                // console.log(metadata)
                return {
                    mint,
                    balance,
                    name: metadata.name || "Unknown Token-22",
                    symbol: metadata.symbol || "Coin"
                };
            }));


            setToken22(userTokens22);
        }

        getBalances();
        getToken22Blanaces();
    }, [connection, wallet])




    return (
        <div>
            {token.map((item, idx) => (
                <div key={idx} className={`border py-10 px-10 w-[50vw] mt-8 rounded-lg shadow-md ${wallet.publicKey ? 'visible' : 'hidden'}`}>
                    <div className="flex justify-between">
                        <div>{item.mintAddress}</div>
                        <div>{item.balance}</div>
                    </div>
                </div>
            ))}

            {token22.map((item, idx) => (
                <div key={idx} className={`border py-10 px-10 w-[50vw] mt-8 rounded-lg shadow-md ${wallet.publicKey ? 'visible' : 'hidden'}`}>
                    <div className="flex justify-between">
                        <div>{item.mint}</div>
                        <div>{item.balance.toFixed(2)}</div>
                    </div>
                </div>
            ))}

            {/* <button onClick={getToken22Blanaces}>fetch 22</button> */}
        </div>
    )
}

export default TokenBalance;


// BHAI YE SOLAN PE JITNE BHI TOKENS HE SABKA METADATA LAJKE DETA HE

// import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// // import { PublicKey } from "@solana/web3.js";
// import { useEffect, useState } from "react";
// import { programs } from '@metaplex/js';

// import { Metaplex } from "@metaplex-foundation/js";
// import { Connection, PublicKey } from "@solana/web3.js";
// import { ENV, TokenListProvider } from "@solana/spl-token-registry";

// // const { metadata: { Metadata } } = programs;

// const TokenBalance = () => {
//     async function getTokenMetadata() {
//         const connection = new Connection("https://api.devnet.solana.com");
//         const metaplex = Metaplex.make(connection);

//         const mintAddress = new PublicKey("HdxKHA1ErFUs7k4BrYuE59nHNmjLubhuF3jCsZ7dAbQw");

//         let tokenName;
//         let tokenSymbol;
//         let tokenLogo;

//         try {
//             const metadataAccount = metaplex
//                 .nfts()
//                 .pdas()
//                 .metadata({ mint: mintAddress });

//             const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

//             if (metadataAccountInfo) {
//                 const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress });
//                 tokenName = token.name;
//                 tokenSymbol = token.symbol;
//                 tokenLogo = token.json?.image;
//                 console.log("yha nhi aaya!")
//             }
//             else {
//                 const provider = await new TokenListProvider().resolve();
//                 const tokenList = provider.filterByChainId(ENV.Devnet).getList();
//                 console.log("token list :- ", tokenList)
//                 const tokenMap = tokenList.reduce((map, item) => {
//                     map.set(item.address, item);
//                     return map;
//                 }, new Map());

//                 console.log("token Map :- ", tokenMap)

//                 const token = tokenMap.get(mintAddress.toBase58());
//                 console.log("token data :- ", token)

//                 // tokenName = token.name;
//                 // tokenSymbol = token.symbol;
//                 // tokenLogo = token.logoURI;
//                 // console.log("token data", tokenName, tokenSymbol, tokenLogo);
//             }
//         } catch (error) {
//             console.log('error', error)
//         }


//     }

//     return (
//         <div>
//             {/* {tokenData.map((item, idx) => (
//                 <div key={idx} className={`border py-10 px-10 w-[50vw] mt-8 rounded-lg shadow-md ${wallet.publicKey ? 'visible' : 'hidden'}`}>
//                     <div className="flex justify-between">
//                         <div>
//                             {item.image ? <img src={item.image} alt={item.tokenName} width={50} /> : <div>No Image</div>}
//                             <div>{item.tokenName} ({item.symbol})</div>
//                         </div>
//                         <div>
//                             <div>Mint: {item.mintAddress}</div>
//                             <div>Balance: {item.balance}</div>
//                         </div>
//                     </div>
//                 </div>
//             ))} */}
//             <button onClick={getTokenMetadata}>GET</button>
//         </div>
//     )
// }

// export default TokenBalance;



// import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { PublicKey } from "@solana/web3.js";
// import { useEffect, useState } from "react";
// import { Metadata, PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';

// const TokenBalance = () => {
//     const [tokenData, setTokenData] = useState([]);
//     const { connection } = useConnection();
//     const wallet = useWallet();

//     useEffect(() => {
//         const getBalances = async () => {
//             if (wallet.publicKey) {
//                 try {
//                     const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
//                         programId: TOKEN_PROGRAM_ID,
//                     });

//                     const tokens = await Promise.all(tokenAccounts.value.map(async (accountInfo) => {
//                         try {
//                             const accountData = AccountLayout.decode(accountInfo.account.data);
//                             const balanceBigInt = accountData.amount;
//                             const balance = Number(balanceBigInt) / 1e9;
//                             const mintAddress = new PublicKey(accountData.mint).toString();

//                             // Calculate the PDA (Program Derived Address) for the token metadata
//                             const [metadataPDA] = await PublicKey.findProgramAddress(
//                                 [
//                                     Buffer.from('metadata'),
//                                     TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//                                     new PublicKey(accountData.mint).toBuffer(),
//                                 ],
//                                 TOKEN_METADATA_PROGRAM_ID
//                             );

//                             // Fetch metadata account info
//                             const metadataAccountInfo = await connection.getAccountInfo(metadataPDA);

//                             if (metadataAccountInfo) {
//                                 const metadata = Metadata.deserialize(metadataAccountInfo.data);
//                                 const { data } = metadata;
//                                 const tokenName = data.name;
//                                 const symbol = data.symbol;
//                                 const uri = data.uri;

//                                 // Fetch image and other metadata from the URI
//                                 const response = await fetch(uri);
//                                 const metadataJson = await response.json();
//                                 const image = metadataJson.image;

//                                 return { mintAddress, balance, tokenName, symbol, image };
//                             } else {
//                                 console.warn(`Metadata not found for mint: ${mintAddress}`);
//                                 return { mintAddress, balance, tokenName: "Unknown", symbol: "N/A", image: null };
//                             }

//                         } catch (error) {
//                             console.error("Error decoding account data:", error);
//                             return null;
//                         }
//                     }));

//                     setTokenData(tokens.filter(token => token !== null));
//                 } catch (error) {
//                     console.error("Error fetching balances:", error);
//                 }
//             }
//         };

//         getBalances();
//     }, [connection, wallet]);

//     return (
//         <div>
//             {tokenData.map((item, idx) => (
//                 <div key={idx} className={`border py-10 px-10 w-[50vw] mt-8 rounded-lg shadow-md ${wallet.publicKey ? 'visible' : 'hidden'}`}>
//                     <div className="flex justify-between">
//                         <div>
//                             {item.image ? <img src={item.image} alt={item.tokenName} width={50} /> : <div>No Image</div>}
//                             <div>{item.tokenName} ({item.symbol})</div>
//                         </div>
//                         <div>
//                             <div>Mint: {item.mintAddress}</div>
//                             <div>Balance: {item.balance}</div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )
// }

// export default TokenBalance;
