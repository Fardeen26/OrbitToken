import { getTokenMetadata } from "@solana/spl-token";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

const TokenBalance = () => {
    const [token, setToken] = useState([]);
    const [token22, setToken22] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const { connection } = useConnection();
    const wallet = useWallet();

    useEffect(() => {
        const getBalances = async () => {
            if (wallet.publicKey) {
                setIsFetching(true)
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
                            const name = 'Unknown Token';
                            const symbol = 'UNK';
                            return { mintAddress, balance, name, symbol };
                        } catch (error) {
                            console.error("Error decoding account data:", error);
                            return null;
                        }
                    }).filter(token => token !== null);

                    setToken(tokens)
                    setIsFetching(false)

                } catch (error) {
                    console.error("Error fetching balances:", error);
                    setIsFetching(false)
                }
            }
        };

        const getToken22Blanaces = async () => {
            if (!wallet.publicKey) return;
            setIsFetching(true)
            const tokenMint22 = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_2022_PROGRAM_ID });
            const userTokens22 = await Promise.all(tokenMint22.value.map(async (account) => {
                const mintAddress = account.account.data.parsed.info.mint;
                const balance = account.account.data.parsed.info.tokenAmount.uiAmount;

                // Fetch metadata for Token-22
                const metadata = await getTokenMetadata(connection, new PublicKey(mintAddress), 'confirmed', TOKEN_2022_PROGRAM_ID);
                console.log("User Metadata :- ", metadata);
                return {
                    mintAddress,
                    balance,
                    name: metadata.name || "Unknown Token-22",
                    symbol: metadata.symbol || "UNK"
                };
            }));

            console.log("User token :- ", userTokens22);
            setToken22(userTokens22);
            setIsFetching(false)
        }

        getBalances();
        getToken22Blanaces();
    }, [connection, wallet])




    return (
        <div className="">
            {
                !wallet.publicKey && <p className="mt-12 text-center">No Wallet Selected</p>
            }
            {
                isFetching ? <p className="mt-12">Fetching...</p> : (
                    <div className="w-[50vw] mt-12 flex flex-col gap-5">
                        {token.map((token, idx) => (
                            <div key={token.mintAddress} className="w-full rounded-xl flex justify-between p-4 shadow-lg items-center border">
                                <div className="flex gap-4 items-center">
                                    <div className="rounded-full px-4 h-14 w-14 bg-gray-200 flex justify-center items-center font-semibold text-sm">{token.mintAddress.substring(0, 5)}</div>
                                    <div className="w-full flex-grow">
                                        <p className="text-lg">{token.name}</p>
                                        <p className="w-4/6 md:hidden text-sm font-thin overflow-clip text-ellipsis">{token.mintAddress.substring(0, 40)}</p>
                                        <p className="hidden md:block w-full text-sm font-thin">{token.mintAddress}</p>
                                        <p className="md:hidden">
                                            {Number.isInteger(token.balance) ? token.balance : token.balance.toFixed(2)} {token.symbol.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden md:flex gap-4 items-center">
                                    <p>
                                        {Number.isInteger(token.balance) ? token.balance : token.balance.toFixed(2)} {token.symbol.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {token22.map((token, idx) => (
                            <div key={token.mintAddress} className="w-full rounded-xl flex justify-between px-4 py-4 shadow-xl items-center border">
                                <div className="flex gap-4 items-center">
                                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg600Xa4ws6jp54kMDNGYF232lIhY51QJqEA&s' alt="token-image" className="w-14 h-14 rounded-full" />
                                    <div className="w-full flex-grow">
                                        <p className="text-lg">{token.name}</p>
                                        <p className="w-4/6 md:hidden text-sm font-thin overflow-clip text-ellipsis">{token.mintAddress.substring(0, 40)}</p>
                                        <p className="hidden md:block w-full text-sm font-thin">{token.mintAddress}</p>
                                        <p className="md:hidden">
                                            {Number.isInteger(token.balance) ? token.balance : token.balance.toFixed(2)} {token.symbol.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden md:flex gap-4 items-center">
                                    <p>
                                        {Number.isInteger(token.balance) ? token.balance : token.balance.toFixed(2)} {token.symbol.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

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
