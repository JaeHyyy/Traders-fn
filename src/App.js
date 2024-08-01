import './App.css';
import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useRouteLoaderData } from "react-router-dom";
import RootLayout from "./pages/Root";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
import Testt from './pages/Testt';
import Receipt from './pages/Receipt';
import MobileLogin from './pages/ModileLogin';
import MobileMain from './pages/MobileMain';
import MobileProductDetail from './pages/MobileProductDetail';
import Stock from './pages/StockList';
import OrderCart from './pages/OrderCart';
import QrCode from './pages/QrCode';
import ReceiptModify from './pages/ReceiptModify';

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
        path: "/receiptmodify",
        element: <ReceiptModify />
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
    path: "/mobile/login",
    element: <MobileLogin />
  },
  {
    path: "/mobile/main",
    element: <MobileMain />
  },
  {
    path: "/mobile/productDetail",
    element: <MobileProductDetail />
  }
])

function App() {
  return <RouterProvider router={router} />

}

export default App;
