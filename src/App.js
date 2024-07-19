import './App.css';
import { createBrowserRouter, RouterProvider, Navigate, useRouteLoaderData } from "react-router-dom";
import RootLayout from "./pages/Root";

const router = createBrowserRouter([
  {
    path: "/homee",
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
