// src/routes/ThemeRoutes.jsx
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import MainRoutes from './MainRoutes';

export default function ThemeRoutes() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('🧾 Logged in as:', role || 'None', '| token:', token || 'None');
  }, []);

  return useRoutes(MainRoutes);
}
