import React from 'react';

// material-ui
import { Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import getMenuItemsByRole from 'menu-items'; // adjust path if needed

// ==============================|| MENULIST ||============================== //

const MenuList = () => {
  // 1. Get role from localStorage (or use context/auth if you prefer)
  const userRole = localStorage.getItem('user_role'); // 'admin', 'tenant', 'landlord'
  const menuItem = getMenuItemsByRole(userRole);

  // 2. Render groups (usually one for navigation, one for shared pages)
  const navItems = menuItem.items.map((item) => {
    if (item.type === 'group') {
      return <NavGroup key={item.id} item={item} />;
    }

    return (
      <Typography key={item.id} variant="h6" color="error" align="center">
        Menu Items Error
      </Typography>
    );
  });

  return <>{navItems}</>;
};

export default MenuList;

