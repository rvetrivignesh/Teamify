import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PageLayout from "./layouts/PageLayout";
import WelcomePage from "./components/WelcomePage/WelcomePage.jsx";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";

import "./App.css";

const HomePage = ({ user }) => {
  return (
    <div className="page">
      <div className="card">
        <h2>Welcome back, {user.username}!</h2>
        <p>You are now logged in.</p>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<PageLayout />}>

        <Route
          path="/"
          element={user ? <HomePage user={user} /> : <WelcomePage />}
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <Signup />}
        />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
