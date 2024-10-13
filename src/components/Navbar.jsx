import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import { DarkModeContext } from '../provider/DarkModeContext';
import { MoonIcon, SunIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [isMenuVisible, setIsMenuVisible] = useState(false)
    const location = useLocation();

    return (
        <div className="px-3 pt-3 pb-0 transition-all bg-white text-black dark:bg-black dark:text-white">
            <nav className="mx-auto">
                <div className="flex justify-between items-baseline max-sm:items-center">
                    <div className="max-sm:hidden block">
                        <Link to={'/'} className="text-3xl max-sm:text-lg font-bold tracking-tighter">OrbitToken</Link>
                    </div>
                    <div className="flex gap-20 max-sm:gap-7 align-baseline max-sm:align-middle text-end max-sm:hidden">
                        <div className="align-bottom">
                            <Link to={'/token'} className={`text-xl max-sm:text-base font-semibold tracking-tight dark:opacity-80 dark:hover:opacity-100 dark:hover:text-white hover:text-[#6a2aff] ${location.pathname == '/token' ? 'dark:!opacity-100' : ''}`}>Tokens</Link>
                        </div>
                        <div className="">
                            <Link to={'/transaction'} className={`text-xl max-sm:text-base font-semibold tracking-tight dark:opacity-80 dark:hover:opacity-100 dark:hover:text-white hover:text-[#6a2aff] ${location.pathname == '/transaction' ? 'dark:!opacity-100' : ''}`}>Transaction</Link>
                        </div>
                        <div className="">
                            <Link to={'/account'} className={`text-xl max-sm:text-base font-semibold tracking-tight dark:opacity-80 dark:hover:opacity-100 dark:hover:text-white hover:text-[#6a2aff] ${location.pathname == '/account' ? 'dark:!opacity-100' : ''}`}>Account</Link>
                        </div>
                    </div>

                    <div className="hidden max-sm:block">
                        <button onClick={() => setIsMenuVisible(!isMenuVisible)}>
                            <HamburgerMenuIcon className='h-5 w-5' />
                        </button>
                    </div>

                    <div className={`${isMenuVisible ? 'top-0' : 'top-[-250px]'} z-10 w-full transition-all duration-300 absolute top-20 left-0`}>
                        <div className={`flex flex-col gap-4 px-4 py-8 bg-black dark:bg-white text-white dark:text-black`}>
                            <div onClick={() => setIsMenuVisible(false)}>
                                <Link to={'/'} className={`text-xl font-semibold tracking-tight hover:opacity-75`}>Home</Link>
                            </div>
                            <div onClick={() => setIsMenuVisible(false)}>
                                <Link to={'/token'} className={`text-xl font-semibold tracking-tight hover:opacity-75`}>Tokens</Link>
                            </div>
                            <div onClick={() => setIsMenuVisible(false)}>
                                <Link to={'/transaction'} className={`text-xl font-semibold tracking-tight hover:opacity-75`}>Transaction</Link>
                            </div>
                            <div onClick={() => setIsMenuVisible(false)}>
                                <Link to={'/account'} className={`text-xl font-semibold tracking-tight hover:opacity-75`}>Account</Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={toggleDarkMode}
                            className='mr-5'
                        >
                            {isDarkMode ? <MoonIcon className='h-5 w-5 max-sm:h-4 max-sm:w-4' /> : <SunIcon className='h-5 w-5 max-sm:h-4 max-sm:w-4' />}
                        </button>

                        <WalletMultiButton style={{
                            backgroundColor: '#000',
                            color: 'white',
                            padding: '2px 16px',
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