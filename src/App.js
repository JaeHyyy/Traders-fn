import './App.css';
import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useRouteLoaderData } from "react-router-dom";
import RootLayout from "./pages/Root";
import Login from './pages/Login';
import Main from './pages/Main';
import Testt from './pages/Testt';

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
        path: "/test",
        element: <Testt />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  }
])

function App() {
  return <RouterProvider router={router} />

}

export default App;
