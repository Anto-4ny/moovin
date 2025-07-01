import React from 'react';
import { Typography, Box } from '@mui/material';

const LandlordDashboard = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">Landlord Dashboard</Typography>
      <Typography variant="body1" color="textSecondary">
        Track earnings, manage properties, and interact with tenants.
      </Typography>
    </Box>
  );
};

export default LandlordDashboard;
