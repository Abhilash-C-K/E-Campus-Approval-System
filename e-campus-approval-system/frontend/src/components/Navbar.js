import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import api from '../utils/api';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>E-Campus Approval</h2>
          <span className="user-badge">{user.role === 'admin' ? 'Admin' : 'Student'}</span>
        </div>
        
        <div className="navbar-menu">
          {user.role === 'student' ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
              <Link to="/status" className={`nav-link ${isActive('/status')}`}>
                Status
              </Link>
              <Link to="/history" className={`nav-link ${isActive('/history')}`}>
                History
              </Link>
              <Link to="/notifications" className={`nav-link ${isActive('/notifications')}`}>
                <FaBell />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </Link>
            </>
          ) : (
            <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard')}`}>
              Dashboard
            </Link>
          )}
          
          <div className="user-menu">
            <FaUser className="user-icon" />
            <span className="user-name">{user.name}</span>
          </div>
          
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
