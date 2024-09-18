import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { DarkModeContext } from '../provider/DarkModeContext';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

const Navbar = () => {
    const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

    return (
        <div className="px-3 pt-3 pb-0 transition-all bg-white text-black dark:bg-black dark:text-white">
            <nav className="mx-auto">
                <div className="flex justify-between items-baseline">
                    <div className="">
                        <Link to={'/'} className="text-3xl font-bold tracking-tighter">OrbitToken</Link>
                    </div>
                    <div className="flex gap-20 align-bottom text-end">
                        <div className="align-bottom">
                            <Link to={'/token'} className="text-xl font-semibold tracking-tight hover:text-purple-300">Tokens</Link>
                        </div>
                        <div className="">
                            <Link to={'/transaction'} className="text-xl font-semibold tracking-tight hover:text-purple-300">Transaction</Link>
                        </div>
                        <div className="">
                            <Link to={'/account'} className="text-xl font-semibold tracking-tight hover:text-purple-300">Account</Link>
                        </div>
                    </div>

                    <div className="">
                        <button
                            onClick={toggleDarkMode}
                            className='mr-5'
                        >
                            {isDarkMode ? <MoonIcon className='h-5 w-5' /> : <SunIcon className='h-5 w-5' />}
                        </button>

                        <WalletMultiButton style={{
                            backgroundColor: '#000',
                            color: 'white',
                            padding: '2px 18px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }} />
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar