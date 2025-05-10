import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from 'lucide-react'
import { TokenBalance } from "./components/TokenBalance"
import { CreateTokenForm } from "./components/CreateTokenForm"
import { TransferForm } from "./components/TransferToken"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useSetRecoilState } from "recoil"
import { walletBalanceAtom } from "./atoms"
import { useEffect } from "react"
import Account from "./components/Account"


export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const setWalletBalance = useSetRecoilState(walletBalanceAtom)

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet.publicKey) {
        try {
          const walletBalance = await connection.getBalance(wallet.publicKey) / 1000000000;
          setWalletBalance(walletBalance)
        } catch (err) {
          console.error(err)
        }
      } else {
        setWalletBalance(0)
      }
    };

    fetchBalance()
  }, [connection, setWalletBalance, wallet])


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <main className="container relative mx-auto p-6 max-sm:py-6 max-sm:px-2">
        <div className="flex flex-col gap-8">
          <section className="text-center space-y-4 pt-12 pb-8">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              OrbitToken
            </h1>
            <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              The next-generation Solana wallet that empowers you to manage your SOL and tokens with ease
            </p>
            <div className="flex justify-center gap-4">
              <a href="/token">
                <Button size="lg" className="gap-2 rounded-lg">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </section>

          <Account />

          <Tabs defaultValue="balance" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="balance">Token Balance</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
              <TabsTrigger value="create">Create Token</TabsTrigger>
            </TabsList>
            <TabsContent value="balance" className="space-y-4">
              <TokenBalance />
            </TabsContent>
            <TabsContent value="transfer">
              <TransferForm />
            </TabsContent>
            <TabsContent value="create">
              <CreateTokenForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

