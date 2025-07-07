import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Snackbar, Alert, InputAdornment, MenuItem, Divider
} from '@mui/material';
import {
  Person, Work, Description, Phone, Email
} from '@mui/icons-material';
import axios from 'axios';

const PROFESSIONS = [
  'Electrician',
  'Plumber',
  'Technician',
  'House Cleaner',
  'Carpenter',
  'Painter',
  'Interior Designer',
  'Security Expert',
  'Landscaper',
  'Handyman',
  'AC/Fridge Repair',
  'Roofer',
  'Mason',
  'Other'
];

export default function ProfessionalApplication() {
  const [formData, setFormData] = useState({
    full_name: '',
    profession: '',
    description: '',
    phone: '',
    email: ''
  });

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/professionals/', formData, {
        headers: { Authorization: `Token ${token}` }
      });
      setSnack({ open: true, message: 'Application submitted successfully!', severity: 'success' });
      setFormData({ full_name: '', profession: '', description: '', phone: '', email: '' });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: 'Submission failed.', severity: 'error' });
    }
  };

  return (
    <Box p={3} maxWidth={700} mx="auto">
      <Paper elevation={4} sx={{
        p: 4,
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        background: '#fdfdfd',
      }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main">
          🧰 Apply as a Professional
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Submit your details and join our directory of verified service providers.
        </Typography>
        <Divider sx={{ my: 3 }} />

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            select
            label="Profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Work />
                </InputAdornment>
              )
            }}
          >
            {PROFESSIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Detailed Description"
            name="description"
            multiline
            rows={5}
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3, py: 1.5, fontWeight: 'bold', borderRadius: 3 }}
          >
            Submit Application
          </Button>
        </form>
      </Paper>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
