import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  InputLabel,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const categories = [
  'Apartment',
  'Bedsitter',
  'Single Room',
  'Hostel',
  'Bungalow',
  'Maisonette',
  'Studio'
];

const AddProperty = () => {
  const [form, setForm] = useState({
    name: '',
    location: '',
    rent: '',
    category: '',
    description: '',
    images: []
  });

  const [previews, setPreviews] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm(prev => ({ ...prev, images: files }));
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async () => {
    const { name, location, rent, category, description, images } = form;
    if (!name || !location || !rent || !category || !description || images.length === 0) {
      setSnack({ open: true, message: 'Please fill all fields and upload images.', severity: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('rent', rent);
    formData.append('category', category);
    formData.append('description', description);
    images.forEach((img, i) => formData.append('images', img));

    try {
      await axios.post('/api/properties/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSnack({ open: true, message: 'Property posted successfully.', severity: 'success' });
      setForm({ name: '', location: '', rent: '', category: '', description: '', images: [] });
      setPreviews([]);
    } catch {
      setSnack({ open: true, message: 'Failed to add property.', severity: 'error' });
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
            List a property with basic details and images.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Property Name"
                name="name"
                fullWidth
                value={form.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                fullWidth
                value={form.location}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Rent (KES)"
                name="rent"
                type="number"
                fullWidth
                value={form.rent}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="category"
                select
                fullWidth
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((option, index) => (
                  <MenuItem key={index} value={option}>{option}</MenuItem>
                ))}
              </TextField>
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
              <InputLabel>Upload Property Images</InputLabel>
              <Button variant="contained" component="label">
                Select Images
                <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
              </Button>
              <Box display="flex" gap={2} mt={2} flexWrap="wrap">
                {previews.map((src, index) => (
                  <img key={index} src={src} alt={`preview-${index}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                Submit Property
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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