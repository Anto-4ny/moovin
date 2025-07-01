import React from 'react';
import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const EditProperty = () => {
  const { id } = useParams();

  return (
    <Box p={3}>
      <Typography variant="h4">Edit Property #{id}</Typography>
      <Typography variant="body1" color="textSecondary">
        Modify property details and update listings here.
      </Typography>
    </Box>
  );
};

export default EditProperty;
