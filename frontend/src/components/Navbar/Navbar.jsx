import './Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2>Teamify</h2>
      </Link>
      <div style={{ display: 'flex', gap: '20px' }}>
        {user ? (
          <>
            <span>Hello, {user.username}</span>
            <span onClick={logout} style={{ cursor: 'pointer', fontWeight: 'bold' }}>Logout</span>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span>Login</span>
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar;
