import { Outlet } from "react-router-dom";
import Menubar from "../components/Menubar";


export default function RootLayout() {

  return (
    <div className="container">
      <Menubar />

    </div>
  )
}