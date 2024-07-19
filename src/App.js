import './App.css';
import { createBrowserRouter, RouterProvider, Navigate, useRouteLoaderData } from "react-router-dom";
import RootLayout from "./pages/Root";
import Login from './pages/Login';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/home",
    element: <RootLayout />,
    children: [
      {

      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App;
