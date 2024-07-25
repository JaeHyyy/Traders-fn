import './App.css';
import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useRouteLoaderData } from "react-router-dom";
import RootLayout from "./pages/Root";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
import Testt from './pages/Testt';
import Receipt from './pages/Receipt';
import Stock from './pages/StockList';
import OrderCart from './pages/OrderCart';
import QrCode from './pages/QrCode'; 

const router = createBrowserRouter([

  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Main />
      },
      {
        path: "/receipt",
        element: <Receipt />
      },
      {
        path: "/qrcode",
        element: <QrCode />
      },
      {
        path: "/stock",
        element: <Stock />
      },
      {
        path: "/ordercart",
        element: <OrderCart />
      },
      {
        path: "/test",
        element: <Testt />
      }

    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: ""
  }
])

function App() {
  return <RouterProvider router={router} />

}

export default App;
