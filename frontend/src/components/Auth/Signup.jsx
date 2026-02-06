import React, { useState } from "react";
import "./Auth.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(formData.username, formData.email, formData.password);
      navigate("/setup-profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="signup-card">
        <h2 className="auth-header">Sign-up to Teamify</h2>
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="form-column">
          <input
            type="text"
            placeholder="Name (Username)"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
