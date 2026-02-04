import React from "react";
import "./WelcomePage.css";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="hero">
        <h1 className="brand">Teamify</h1>

        <p className="description">
          Teamify helps you discover ideas, collaborate with skilled peers,
          and build meaningful projects together.
        </p>

        <div className="cta">
          <p className="cta-text">
            Continue with your account or create a new one
          </p>

          <div className="actions">
            <button
              className="btn primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="btn secondary"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
