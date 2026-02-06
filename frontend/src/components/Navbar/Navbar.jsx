import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import api from "../../services/api";
import "./Navbar.css";
import NavSearch from "./NavSearch";
import "./NavSearch.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    unreadNotifications: 0,
    pendingRequests: 0,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch stats for badges
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const [notifRes, reqRes] = await Promise.all([
          api.get("/api/notifications"),
          api.get("/api/collaboration"),
        ]);

        const unreadNotifs = notifRes.data.filter((n) => !n.isRead).length;
        const pendingReqs = reqRes.data.received.filter(
          (r) => r.status === "pending",
        ).length;

        setStats({
          unreadNotifications: unreadNotifs,
          pendingRequests: pendingReqs,
        });
      } catch (error) {
        console.error("Failed to fetch navbar stats", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <Link to={user ? "/dashboard" : "/"}>
        <h2 className="nav-header">Teamify</h2>
      </Link>

      {user && (
        <div className="nav-search-wrapper">
          <NavSearch />
        </div>
      )}

      <div className="nav-links">
        {user ? (
          <>
            {/* Added Dashboard Button */}
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>

            <Link to="/explore" className="nav-link">
              Explore
            </Link>

            <Link to="/requests" className="nav-link">
              Requests
              {stats.pendingRequests > 0 && (
                <span className="badge">{stats.pendingRequests}</span>
              )}
            </Link>

            <Link to="/notifications" className="nav-link">
              Notifications
              {stats.unreadNotifications > 0 && (
                <span className="badge">{stats.unreadNotifications}</span>
              )}
            </Link>

            <ThemeToggle />

            {/* Profile Dropdown */}
            <div
              className="user-menu"
              ref={dropdownRef}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="profile-avatar">
                {user.username[0].toUpperCase()}
              </div>
              <div className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
                <Link to={`/profile/${user.username}`} className="dropdown-item">
                  My Profile
                </Link>
                <Link to="/setup-profile" className="dropdown-item">
                  Edit Profile
                </Link>
                <div className="dropdown-item text-danger" onClick={logout}>
                  Logout
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm no-underline">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
