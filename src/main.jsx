import { Buffer } from 'buffer';
window.Buffer = Buffer;
import React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from './App.jsx'
import Token from './components/token/Token.jsx';
import Transaction from './components/transaction/Transaction.jsx';
import Account from './components/account/Account.jsx';
import Navbar from "./components/Navbar"
import WalletContextProvider from './provider/ConnectionProvider.jsx'
import DarkModeProvider from './provider/DarkModeContext.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/token",
    element: <div className='bg-white transition-all dark:bg-black dark:text-white h-screen'>
      <Navbar />
      <hr className='hidden' />
      <Token />
    </div>,
  },
  {
    path: "/transaction",
    element: <div className='bg-black text-white h-screen transition-all'>
      <Navbar />
      <hr className='hidden' />
      <Transaction />
    </div>,
  },
  {
    path: "/account",
    element: <div className='bg-black text-white h-screen transition-all'>
      <Navbar />
      <hr className='hidden' />
      <Account />
    </div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletContextProvider>
      <DarkModeProvider>
        <RouterProvider router={router} />
      </DarkModeProvider>
    </WalletContextProvider>
  </React.StrictMode>
);