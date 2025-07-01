import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    setToken(storedToken);
    setRole(storedRole);
    console.log('🔐 [ProtectedRoute] token:', storedToken, '→ role:', storedRole);
  }, []);

  if (token === null || role === null) {
    // Still loading from localStorage
    return null;
  }

  if (!token || !role) {
    console.warn('⛔ No token or role — redirecting to login');
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    console.warn(`⛔ Role "${role}" not allowed here — redirecting`);
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;


