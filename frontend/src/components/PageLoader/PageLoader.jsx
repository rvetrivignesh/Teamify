import "./PageLoader.css";

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="page-loader-container">
      <div className="page-loader-content">
        <div className="spinner"></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
