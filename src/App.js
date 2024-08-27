import './App.css';
import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useRouteLoaderData } from "react-router-dom";
import RootLayout from "./pages/Root";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
import MyPage from './pages/MyPage';
import DisUse from './pages/DisUse';
import Receipt from './pages/Receipt';
import MobileLogin from './pages/MobileLogin';
import MobileReceive from './pages/MobileReceive';
import MobileProductDetail from './pages/MobileProductDetail';
import Stock from './pages/StockList';
import OrderCart from './pages/OrderCart';
import QrCode from './pages/QrCode';
import ReceiptModify from './pages/ReceiptModify';
import ProtectedRoute from './ProtectedRoute';
import PaymentSuccess from './pages/PaymentSuccess';

//관리자 페이지 
import AdminMain from './pages/AdminMain';
import AdminGoods from './pages/AdminGoods';
import AdminMovement from './pages/AdminMovement';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css';  // 테마
import 'primereact/resources/primereact.min.css';           // 기본 스타일
import 'primeicons/primeicons.css';                         // 아이콘
import MobileMain from './pages/MobileMain';
import MobileInventory from './pages/MobileInventory';
import MobileReject from './pages/MobileReject';


const router = createBrowserRouter([

  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute element={Main} />
      },
      {
        path: "/receipt",
        element: <ProtectedRoute element={Receipt} />

      },
      {
        path: "/receiptmodify",
        element: <ReceiptModify />
      },
      {
        path: "/qrcode",
        element: <ProtectedRoute element={QrCode} />
      },
      {
        path: "/stock",
        element: <ProtectedRoute element={Stock} />
      },
      {
        path: "/ordercart",
        element: <OrderCart />
      },
      {
        path: "/disuse",
        element: <DisUse />
      },
      {
        path: "/mypage",
        element: <ProtectedRoute element={MyPage} />
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
    path: "/mobile/inventory",
    element: <ProtectedRoute element={MobileInventory} />
  },
  {
    path: "/mobile/receive",
    element: <ProtectedRoute element={MobileReceive} />
  },
  {
    path: "/mobile/reject",
    element: <ProtectedRoute element={MobileReject} />
  },
  {
    path: "/mobile/productDetail/:gcode",
    element: <ProtectedRoute element={MobileProductDetail} />
  },
  {
    path: "/traders/payment/PaymentSuccess",
    element: <PaymentSuccess />
  },
  {
    path: "/adminMain",
    element: <ProtectedRoute element={AdminMain} />
  },
  {
    path: "/adminGoods",
    element: <ProtectedRoute element={AdminGoods} />
  },
  {
    path: "/adminMovement",
    element: <ProtectedRoute element={AdminMovement} />
  }
])

function App() {
  return (
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  );


}

export default App;
