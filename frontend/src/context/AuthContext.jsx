import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      throw new Error(msg);
    }
  };

  const signup = async (username, email, password) => {
    try {
      setError(null);
      const { data } = await api.post("/api/auth/register", { username, email, password });
      localStorage.setItem("token", data.token);
      setUser(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
