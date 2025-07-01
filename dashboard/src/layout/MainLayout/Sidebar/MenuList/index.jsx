import React from 'react';

// MUI
import { Typography } from '@mui/material';

// Project imports
import NavGroup from './NavGroup';
import getMenuItemsByRole from 'menu-items'; 

// ==============================|| MENU LIST ||============================== //

const MenuList = () => {
  // ✅ Ensure the correct key is used (must match what you set in localStorage)
  const userRole = localStorage.getItem('role'); 

  // ✅ Log for debugging
  console.log('📋 MenuList role:', userRole);

  const menuData = getMenuItemsByRole(userRole);

  // Render grouped menu items
  const navItems = menuData.items.map((item) => {
    if (item.type === 'group') {
      return <NavGroup key={item.id} item={item} />;
    }

    // Handle fallback if type isn't 'group'
    return (
      <Typography key={item.id} variant="h6" color="error" align="center">
        ⚠️ Unknown menu item type: {item.title}
      </Typography>
    );
  });

  return <>{navItems}</>;
};

export default MenuList;


