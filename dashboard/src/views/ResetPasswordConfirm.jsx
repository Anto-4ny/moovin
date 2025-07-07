import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post('http://localhost:8000/api/password/reset/confirm/', {
      uid,
      token,
      new_password: newPassword,
      re_new_password: reNewPassword
    });

    setSuccess(true);
    setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Set New Password</Typography>
      {success ? (
        <Typography color="success.main">Password reset successful! Redirecting to login...</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={reNewPassword}
            onChange={(e) => setReNewPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Reset Password
          </Button>
        </form>
      )}
    </Box>
  );
};

export default ResetPasswordConfirm;
