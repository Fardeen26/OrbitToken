import { Buffer } from 'buffer';
window.Buffer = Buffer;
import React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Navbar from './components/Navbar';
import App from './App.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <>
      <Navbar />
      <App />
    </>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);