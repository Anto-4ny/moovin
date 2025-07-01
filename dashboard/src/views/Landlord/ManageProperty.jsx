import React from 'react';
import { Typography, Box } from '@mui/material';

const ManageProperty = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">Manage Property</Typography>
      <Typography variant="body1" color="textSecondary">
        View, edit or remove your listed properties here.
      </Typography>
    </Box>
  );
};

export default ManageProperty;
