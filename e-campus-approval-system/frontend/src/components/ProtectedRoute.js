import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on user's actual role
    if (user.role === 'student') {
      return <Navigate to="/dashboard" />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher-dashboard" />;
    } else if (user.role === 'hod') {
      return <Navigate to="/hod-dashboard" />;
    } else if (user.role === 'principal') {
      return <Navigate to="/principal-dashboard" />;
    }
  }

  return children;
};

export default ProtectedRoute;
