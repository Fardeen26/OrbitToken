import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import WalletContextProvider from './provider/ConnectionProvider'

function App() {
  return (
    <div className="h-screen transition-all bg-white dark:bg-black">
      <WalletContextProvider>
        <Navbar />
        <hr className="transition-all dark:border-gray-900 my-4" />
        <Hero />
        <hr className="transition-all dark:border-gray-900 my-4" />
        <Footer />
      </WalletContextProvider>
    </div>
  )
}

export default App
