import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import WalletContextProvider from './ConnectionProvider'
import { Link } from 'react-router-dom'


const Navbar = () => {
    return (
        <div className="p-3">
            <nav className="mx-auto">
                <div className="flex justify-between items-baseline">
                    <div className="">
                        <Link to={'/'} className="text-3xl font-bold tracking-tighter">OrbitToken</Link>
                    </div>
                    <div className="flex gap-20 align-bottom text-end">
                        <div className="align-bottom">
                            <Link to={'/token'} className="text-xl font-semibold tracking-tight">Tokens</Link>
                        </div>
                        <div className="">
                            <Link to={'/transaction'} className="text-xl font-semibold tracking-tight">Transaction</Link>
                        </div>
                        <div className="">
                            <Link to={'/account'} className="text-xl font-semibold tracking-tight">Account</Link>
                        </div>
                    </div>
                    <div className="">
                        <WalletContextProvider>
                            <WalletMultiButton style={{
                                backgroundColor: '#000',
                                color: 'white',
                                padding: '2px 18px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                            }} />
                        </WalletContextProvider>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar