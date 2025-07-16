import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post('https://moovin-jf0f.onrender.com/api/password/reset/', { email });
    setSubmitted(true);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Reset Password</Typography>
      {submitted ? (
        <Typography color="success.main">Check your email for the reset link.</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Send Reset Link
          </Button>
        </form>
      )}
    </Box>
  );
};

export default ForgotPassword;
