import { Outlet } from "react-router-dom";
import "./PageLayout.css";
import Navbar from "../components/Navbar/Navbar.jsx";

const PageLayout = () => {
  return (
    <div className="page-layout">
      <Navbar />
      <div className="main-block">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;
