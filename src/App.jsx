import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import WalletContextProvider from './provider/ConnectionProvider'

function App() {
  return (
    <div>
      <WalletContextProvider>
        <Navbar />
        <hr />
        <Hero />
        <hr />
        <Footer />
      </WalletContextProvider>
    </div>
  )
}

export default App
