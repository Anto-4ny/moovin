import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Snackbar,
  Alert,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { HomeWork, Info, FavoriteBorder } from '@mui/icons-material';
import axios from 'axios';

const BookProperty = () => {
  const [properties, setProperties] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios.get('/api/properties/available')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProperties(data);
      })
      .catch(() => setSnack({ open: true, message: 'Failed to load properties.', severity: 'error' }));
  }, []);

  const handleBooking = async (propertyId) => {
    try {
      await axios.post(`/api/properties/book/${propertyId}`);
      setSnack({ open: true, message: 'Booking request sent successfully.', severity: 'success' });
    } catch {
      setSnack({ open: true, message: 'Booking failed. Try again.', severity: 'error' });
    }
  };

  const toggleFavorite = (propertyId) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={2} color="primary">
        Book a Property
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Explore the latest available properties and send a booking request.
      </Typography>

      <Grid container spacing={4}>
        {properties.map((prop) => (
          <Grid item xs={12} md={6} lg={4} key={prop.id}>
            <Card>
              {prop.image && (
                <CardMedia
                  component="img"
                  height="180"
                  image={prop.image}
                  alt={prop.name}
                />
              )}
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {prop.name}
                  </Typography>
                  <Tooltip title="Add to favorites">
                    <IconButton onClick={() => toggleFavorite(prop.id)} color={favorites.includes(prop.id) ? 'error' : 'default'}>
                      <FavoriteBorder />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Typography variant="body2" color="textSecondary">
                  📍 {prop.location}
                </Typography>
                <Typography variant="body2" mt={1}>
                  💰 Rent: <strong>KES {prop.rent}</strong>
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Chip
                  label={prop.status === 'Available' ? 'Available' : 'Not Available'}
                  color={prop.status === 'Available' ? 'success' : 'default'}
                  size="small"
                />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={prop.status !== 'Available'}
                  onClick={() => handleBooking(prop.id)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookProperty;

