import { Button } from "@/components/ui/button"
import { Coins } from 'lucide-react'
import { motion } from 'framer-motion'
import { ModeToggle } from "./ModeToggle"
import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSolanaChain } from "@/hooks/useSolanaChain";
import { useDarkMode } from "@/hooks/useDarkMode";

export function Header() {
    const { isDevnet, toggleChain } = useSolanaChain();
    const { isDarkMode } = useDarkMode();

    return (
        <motion.header
            className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-none backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <a href="/" className="flex items-center space-x-2">
                        <Coins className="h-8 w-8 text-gray-900 dark:text-white" />
                        <span className="font-bold text-xl text-gray-900 dark:text-white">OrbitToken</span>
                    </a>
                    <nav className="hidden md:flex gap-6">
                        <Link to="/token" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">Tokens</Link>

                        <Link to="/transaction" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">Transaction</Link>

                        <Link to="/account" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">Account</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white" onClick={toggleChain}>
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDevnet ? 'bg-green-400' : 'bg-red-400'}  opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isDevnet ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                        Devnet
                    </Button>
                    <WalletMultiButton style={{
                        backgroundColor: 'transparent',
                        color: `${isDarkMode ? '#ffffff' : '#000000'}`,
                        padding: '2px 16px',
                        borderColor: '#d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }} />
                    <ModeToggle />
                </div>
            </div>
        </motion.header>
    )
}

