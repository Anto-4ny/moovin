import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Card, CardContent,
  Snackbar, Alert, InputLabel, MenuItem, Select, FormControl,
  Switch, FormControlLabel
} from '@mui/material';
import axios from 'axios';

const categories = [
  'Apartment', 'Bedsitter', 'Single Room', 'Hostel',
  'Bungalow', 'Maisonette', 'Studio', 'Office', 'Villa', 'Shop', 'House'
];

const AddProperty = () => {
  const [form, setForm] = useState({
    name: '',
    full_name: '',
    phone_number: '',
    location: '',
    rent: '',
    category: '',
    description: '',
    images: [],
    size: '',
    beds: '',
    baths: '',
    status: 'rent',
    featured: false
  });

  const [previews, setPreviews] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e) => {
    setForm(prev => ({ ...prev, featured: e.target.checked }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm(prev => ({ ...prev, images: files }));
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async () => {
    const {
      name, full_name, phone_number, location, rent,
      category, description, images, size, beds,
      baths, status, featured
    } = form;

    if (!name || !full_name || !phone_number || !location || !rent || !category || !description || !size || !beds || !baths || images.length === 0) {
      setSnack({ open: true, message: 'Please fill all fields and upload at least one image.', severity: 'warning' });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setSnack({ open: true, message: 'Login required to post property.', severity: 'error' });
      return;
    }

    try {
      // ✅ 1. Update landlord profile with name and phone
      await axios.patch('http://localhost:8000/api/users/me/', {
        full_name,
        phone_number
      }, {
        headers: { Authorization: `Token ${token}` }
      });

      // ✅ 2. Submit property
      const formData = new FormData();
      formData.append('name', name);
      formData.append('location', location);
      formData.append('rent', rent);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('size', size);
      formData.append('beds', beds);
      formData.append('baths', baths);
      formData.append('status', status);
      formData.append('featured', featured);
      images.forEach((img) => formData.append('uploaded_images', img));

      await axios.post('http://localhost:8000/api/properties/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        }
      });

      setSnack({ open: true, message: 'Property posted successfully.', severity: 'success' });

      // ✅ Reset form
      setForm({
        name: '', full_name: '', phone_number: '', location: '', rent: '', category: '',
        description: '', images: [], size: '', beds: '', baths: '', status: 'rent', featured: false
      });
      setPreviews([]);
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      const message = error.response?.data?.detail ||
        (typeof error.response?.data === 'object'
          ? Object.values(error.response.data).flat().join(', ')
          : 'Failed to add property.');
      setSnack({ open: true, message, severity: 'error' });
    }
  };

  return (
    <Box p={4}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Add New Property
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            List a property with all relevant details and images.
          </Typography>

          <Grid container spacing={3}>
            {/* Landlord Info */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Your Full Name"
                name="full_name"
                fullWidth
                value={form.full_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phone_number"
                fullWidth
                value={form.phone_number}
                onChange={handleChange}
              />
            </Grid>

            {/* Property Info */}
            {[{ label: 'Property Name', name: 'name' },
              { label: 'Location', name: 'location' },
              { label: 'Rent (KES)', name: 'rent', type: 'number' },
              { label: 'Size (Sqm)', name: 'size', type: 'number' },
              { label: 'Bedrooms', name: 'beds', type: 'number' },
              { label: 'Bathrooms', name: 'baths', type: 'number' }
            ].map(({ label, name, type = 'text' }) => (
              <Grid key={name} item xs={12} sm={6}>
                <TextField
                  label={label}
                  name={name}
                  type={type}
                  fullWidth
                  value={form[name]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            {/* Category & Status */}
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

            {/* Description */}
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

            {/* Image Upload */}
            <Grid item xs={12}>
              <InputLabel>Upload Property Image</InputLabel><br />
              <Button variant="contained" component="label">
                Select Image(s)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
              <Box display="flex" gap={2} mt={2} flexWrap="wrap">
                {previews.map((src, index) => (
                  <img key={index} src={src} alt={`preview-${index}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                ))}
              </Box>
            </Grid>

            {/* Featured */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={form.featured} onChange={handleToggle} color="primary" />}
                label="Mark as Featured"
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                Submit Property
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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

export default AddProperty;
