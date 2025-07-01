import React from 'react';
import { Typography, Box } from '@mui/material';

const AddProperty = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">Add Property</Typography>
      <Typography variant="body1" color="textSecondary">
        Use this form to list a new property with name, price, images, and description.
      </Typography>
    </Box>
  );
};

export default AddProperty;
