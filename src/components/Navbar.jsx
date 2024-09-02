import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import WalletContextProvider from './ConnectionProvider'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="p-5">
            <nav className="mx-auto">
                <div className="flex justify-between items-center">
                    <div className="">
                        <Link href="/" className="text-4xl font-mono font-bold">
                            OrbitToken
                        </Link>
                    </div>
                    <div className="flex gap-10">
                        <div className="">
                            <Link href="/token" className="text-xl">Token</Link>
                        </div>
                        <div className="">
                            <Link href="/transaction" className="text-xl">Transaction</Link>
                        </div>
                        <div className="">
                            <Link href="/account" className="text-xl">Account</Link>
                        </div>
                    </div>
                    <div className="">

                        <WalletContextProvider>
                            <WalletMultiButton />
                        </WalletContextProvider>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar