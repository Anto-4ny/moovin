import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [isAuthValid, setIsAuthValid] = useState(null); // null = loading
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    if (!token || !storedRole) {
      console.warn('⛔ No token or role — redirecting');
      setIsAuthValid(false);
      return;
    }

    // Validate token with backend
    fetch('http://localhost:8000/api/users/me/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          console.warn('⛔ Invalid or expired token');
          localStorage.clear();
          setIsAuthValid(false);
        } else {
          setIsAuthValid(true);
        }
      })
      .catch(err => {
        console.error('🔌 Auth validation failed:', err);
        localStorage.clear();
        setIsAuthValid(false);
      });
  }, []);

  if (isAuthValid === null) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>🔐 Validating access...</div>; // loading UI
  }

  if (!isAuthValid) {
    return <Navigate to="/" replace />;
  }

  // 👇 Allow admin to access any page
  if (role === 'admin' || allowedRoles.includes(role)) {
    return children;
  }

  console.warn(`⛔ Role "${role}" not allowed here — redirecting`);
  return <Navigate to={`/dashboard/${role}`} replace />;
};

export default ProtectedRoute;


