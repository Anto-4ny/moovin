// src/routes/ThemeRoutes.jsx
import { useEffect, useState } from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import MainRoutes from './MainRoutes';

export default function ThemeRoutes() {
  const navigate = useNavigate(); // ✅ Always top-level
  const routing = useRoutes(MainRoutes); // ✅ Always top-level
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('🧾 Logged in as:', role || 'None', '| token:', token || 'None');

    if (!token || !role) {
      setAuthChecked(true); 
      return;
    }

    fetch('http://localhost:8000/api/users/me/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          console.warn('⛔ Invalid or expired token — clearing localStorage and redirecting');
          localStorage.clear();
          navigate('/', { replace: true });
        }
        setAuthChecked(true);
      })
      .catch((err) => {
        console.error('❌ Auth check failed:', err);
        localStorage.clear();
        navigate('/', { replace: true });
        setAuthChecked(true);
      });
  }, [navigate]);

  if (!authChecked) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>🔐 Validating session...</div>;
  }

  return routing;
}

