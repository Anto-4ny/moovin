import React from 'react';
import { Typography, Box } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">Admin Dashboard</Typography>
      <Typography variant="body1" color="textSecondary">
        Monitor users, remove properties, handle issues, and track earnings.
      </Typography>
    </Box>
  );
};

export default AdminDashboard;
