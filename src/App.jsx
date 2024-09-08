import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import WalletContextProvider from './components/ConnectionProvider'

function App() {
  return (
    <div className="overflow-hidden">
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
