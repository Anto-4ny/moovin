import React, { useState, useEffect } from 'react';
import {
  Typography, Box, TextField, Button, Grid, Card, CardContent,
  Snackbar, Alert, InputLabel, MenuItem, Select, FormControl,
  Switch, FormControlLabel
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const categories = [
  'Apartment', 'Bedsitter', 'Single Room', 'Hostel',
  'Bungalow', 'Maisonette', 'Studio', 'Office', 'Villa', 'Shop', 'House'
];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', location: '', rent: '', category: '', description: '',
    size: '', beds: '', baths: '', status: 'rent', featured: false
  });

  const [userProperties, setUserProperties] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/properties/${id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setForm(res.data);
      } catch (error) {
        console.error(error);
        setSnack({ open: true, message: 'Failed to load property details.', severity: 'error' });
      }
    };

    const fetchUserProperties = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/properties/', {
          headers: { Authorization: `Token ${token}` }
        });
        setUserProperties(res.data);
      } catch (err) {
        console.error(err);
        setSnack({ open: true, message: 'Failed to fetch your properties.', severity: 'error' });
      }
    };

    fetchProperty();
    fetchUserProperties();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e) => {
    setForm(prev => ({ ...prev, featured: e.target.checked }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/properties/${id}/`, form, {
        headers: { Authorization: `Token ${token}` }
      });

      setSnack({ open: true, message: 'Property updated successfully.', severity: 'success' });
      navigate('/manage-property'); // or your main listing route
    } catch (error) {
      console.error(error);
      setSnack({ open: true, message: 'Update failed.', severity: 'error' });
    }
  };

  return (
    <Box p={4}>
      {/* Edit Form */}
      <Card sx={{ mb: 5 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Edit Property #{id}</Typography>

          <Grid container spacing={3}>
            {[{ label: 'Property Name', name: 'name' },
              { label: 'Location', name: 'location' },
              { label: 'Rent (USD)', name: 'rent', type: 'number' },
              { label: 'Size (Sqm)', name: 'size', type: 'number' },
              { label: 'Bedrooms', name: 'beds', type: 'number' },
              { label: 'Bathrooms', name: 'baths', type: 'number' }]
              .map(({ label, name, type = 'text' }) => (
              <Grid key={name} item xs={12} sm={6}>
                <TextField label={label} name={name} type={type} fullWidth value={form[name]} onChange={handleChange} />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={form.category} onChange={handleChange}>
                  {categories.map((option, index) => (
                    <MenuItem key={index} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={form.status} onChange={handleChange}>
                  <MenuItem value="rent">For Rent</MenuItem>
                  <MenuItem value="sale">For Sale</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                multiline
                rows={3}
                fullWidth
                value={form.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={form.featured} onChange={handleToggle} color="primary" />}
                label="Mark as Featured"
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                Update Property
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Other Properties Section */}
      <Typography variant="h6" mb={2}>Your Other Properties</Typography>
      <Grid container spacing={2}>
        {userProperties.map(prop => (
          <Grid item xs={12} sm={6} md={4} key={prop.id}>
            <Card>
              <img
                src={prop.images?.[0]?.image || '/img/default.jpg'}
                alt={prop.name}
                style={{ width: '100%', height: 160, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6">{prop.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {prop.location} • USD {prop.rent}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => navigate(`/edit-property/${prop.id}`)}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProperty;
