import React from 'react';
import { Typography, Box } from '@mui/material';

const BookProperty = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">Book Property</Typography>
      <Typography variant="body1" color="textSecondary">
        Tenants can browse and book available properties here.
      </Typography>
    </Box>
  );
};

export default BookProperty;
