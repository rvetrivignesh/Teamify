import "./Auth.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/"); // Redirect to home/dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="login-card">
        <h2 className="auth-header">Login to Teamify</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="form-column">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
