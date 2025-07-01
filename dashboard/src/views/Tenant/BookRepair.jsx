import React from 'react';
import { Typography, Box } from '@mui/material';

const BookRepair = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">Book Repair</Typography>
      <Typography variant="body1" color="textSecondary">
        Tenants can request repair services here.
      </Typography>
    </Box>
  );
};

export default BookRepair;
