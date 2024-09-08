import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import WalletContextProvider from './components/ConnectionProvider'
import { Divider } from "@nextui-org/react"

function App() {
  return (
    <div>
      <WalletContextProvider>
        <Navbar />
        <Divider orientation='horizontal' className='h-[1px] w-full' />
        <Hero />
        <Divider orientation='horizontal' className='h-[1px] w-full' />
        <Footer />
      </WalletContextProvider>
    </div>
  )
}

export default App
