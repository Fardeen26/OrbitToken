import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SolanaChainProvider from './provider/SolanaChainProvider.tsx'
import WalletContextProvider from './provider/ConnectionProvider.tsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from './components/Header.tsx'
import { RecoilRoot } from 'recoil'
import TransferSOL from './components/TransferSOL.tsx'
import Account from './components/Account.tsx'
import TokenRoute from './components/TokenRoute.tsx'
import { Toaster } from "@/components/ui/toaster"
import DarkModeProvider from './provider/DarkModeProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DarkModeProvider>
      <RecoilRoot>
        <SolanaChainProvider>
          <WalletContextProvider>
            <Router>
              <Header />
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/token" element={<TokenRoute />} />
                <Route path="/transaction" element={<div className='px-8 max-sm:px-2'><TransferSOL /></div>} />
                <Route path="/account" element={<div className='px-8 max-sm:px-2 mt-10'><Account /></div>} />
              </Routes>
            </Router>
          </WalletContextProvider>
        </SolanaChainProvider>
      </RecoilRoot>
      <Toaster />
    </DarkModeProvider>
  </StrictMode>,
)
