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
import Token from './components/Token.jsx';
import { Transaction } from './components/Transaction.jsx';
import Account from './components/Account.jsx';
import Navbar from "./components/Navbar"
import WalletContextProvider from './components/ConnectionProvider.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/token",
    element: <>
      <Navbar />
      <hr />
      <Token /></>,
  },
  {
    path: "/transaction",
    element: <>
      <Navbar />
      <hr />
      <Transaction /></>,
  },
  {
    path: "/account",
    element: <>
      <Navbar />
      <hr />
      <Account />
    </>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletContextProvider>
      <RouterProvider router={router} />
    </WalletContextProvider>
  </React.StrictMode>
);