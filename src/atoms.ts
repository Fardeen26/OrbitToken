import { atom } from "recoil";

export const walletBalanceAtom = atom({
    key: 'walletBalance',
    default: 0
})

type NormalTokemnType = {
    balance: number,
    name: string
    mintAddress: string
    symbol: string,
}

export type Token22Type = {
    balance: number,
    name: string | undefined,
    mintAddress: string
    symbol: string | undefined,
    imageUrl: string
}

export const normalTokenBalance = atom<NormalTokemnType[]>({
    key: 'normalTokenBalance',
    default: []
})

export const token22TokenBalance = atom<Token22Type[]>({
    key: 'token22TokenBalance',
    default: []
})

export type tokenCreationType = {
    tokenName: string,
    tokenSymbol: string
    tokenImage: string
    tokenSupply: number,
    tokenDecimals: number
}


export const tokenCreationAtom = atom<tokenCreationType>({
    key: 'tokenCreation',
    default: {
        tokenName: '',
        tokenSymbol: '',
        tokenImage: '',
        tokenSupply: 100,
        tokenDecimals: 9,
    }
})