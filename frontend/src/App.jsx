import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// context
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";

// components
import PageLayout from "./layouts/PageLayout";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";

// pages
import SetupProfile from "./pages/Profile/SetupProfile.jsx";
import WelcomePage from "./pages/WelcomePage/WelcomePage.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ExploreProjects from "./pages/Projects/ExploreProjects.jsx";
import CreateProject from "./pages/Projects/CreateProject.jsx";
import ProjectDetails from "./pages/Projects/ProjectDetails.jsx";
import Requests from "./pages/Collaboration/Requests.jsx";
import RequestDetails from "./pages/Collaboration/RequestDetails.jsx";
import Notifications from "./pages/Notification/Notifications.jsx";
import UserProfile from "./pages/Profile/UserProfile.jsx";

import "./App.css";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading loading-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" replace /> : <WelcomePage />
          }
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <WelcomePage />}
        />

        <Route
          path="/setup-profile"
          element={
            user ? (
              <SetupProfile user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/explore"
          element={
            user ? <ExploreProjects /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/projects/create"
          element={user ? <CreateProject /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/projects/:id"
          element={user ? <ProjectDetails /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/requests"
          element={user ? <Requests /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/requests/:id"
          element={user ? <RequestDetails /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/notifications"
          element={user ? <Notifications /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/profile/:username"
          element={user ? <UserProfile /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        <Route
          path="/signup"
          element={user ? <Navigate to="/setup-profile" replace /> : <Signup />}
        />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
