import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import "./LoadingPage.css";

const LoadingPage = () => {
  return (
    <div className="loading-page-layout">
      <Navbar />
      <div className="loading-page-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
