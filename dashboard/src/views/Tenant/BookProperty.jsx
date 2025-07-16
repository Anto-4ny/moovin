import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardMedia, Button, Snackbar,
  Alert, Chip, Divider, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemText
} from '@mui/material';
import { FavoriteBorder, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookProperty = () => {
  const [properties, setProperties] = useState([]); // Always initialize as array
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [favorites, setFavorites] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://moovin-jf0f.onrender.com/api/properties/')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setProperties(data);
        } else if (Array.isArray(data?.results)) {
          setProperties(data.results);
        } else {
          setProperties([]); // fallback
          console.warn('⚠️ Unexpected response shape:', data);
        }
      })
      .catch((error) => {
        console.error('Property fetch failed:', error);
        setSnack({ open: true, message: 'Failed to load properties.', severity: 'error' });
      });
  }, []);

  const toggleFavorite = (propertyId) => {
    setFavorites(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const openPropertyDetails = (property) => {
    setSelectedProperty(property);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedProperty(null);
  };

  const goToPayment = (propertyId) => {
    navigate(`/payment/${propertyId}`);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={2} color="primary">
        Browse Available Properties
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Click on any property to view full details.
      </Typography>

      <Grid container spacing={4}>
        {Array.isArray(properties) && properties.length > 0 ? (
          properties.map((prop) => (
            <Grid item xs={12} md={6} lg={4} key={prop.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="180"
                  image={prop.images?.[0]?.image || '/img/default.jpg'}
                  alt={prop.name}
                  onClick={() => openPropertyDetails(prop)}
                  sx={{ cursor: 'pointer' }}
                />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      onClick={() => openPropertyDetails(prop)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {prop.name}
                    </Typography>
                    <Tooltip title="Add to favorites">
                      <IconButton
                        onClick={() => toggleFavorite(prop.id)}
                        color={favorites.includes(prop.id) ? 'error' : 'default'}
                      >
                        <FavoriteBorder />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="body2" color="textSecondary">
                    📍 {prop.location}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    💰 {prop.status === 'sale' ? 'Price' : 'Rent'}: <strong>USD {prop.rent}</strong>
                  </Typography>
                  <Divider sx={{ my: 1 }} />

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={prop.status === 'sale' ? 'For Sale' : 'For Rent'}
                      color={prop.status === 'sale' ? 'info' : 'success'}
                      size="small"
                    />
                    {prop.is_booked && (
                      <Chip
                        label={prop.status === 'sale' ? 'Sold' : 'Rented'}
                        color={prop.status === 'sale' ? 'error' : 'warning'}
                        size="small"
                      />
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => goToPayment(prop.id)}
                  >
                    {prop.status === 'sale' ? 'Buy Now' : 'Rent Now'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" mt={2}>
            No properties available at the moment.
          </Typography>
        )}
      </Grid>

      {/* Property Detail Modal */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProperty?.name}
          <IconButton onClick={closeDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <img
            src={selectedProperty?.images?.[0]?.image || '/img/default.jpg'}
            alt="Full"
            style={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 6, marginBottom: 16 }}
          />
          <Box mb={2}>
            <Chip
              label={selectedProperty?.status === 'sale' ? 'For Sale' : 'For Rent'}
              color={selectedProperty?.status === 'sale' ? 'info' : 'success'}
              size="small"
              sx={{ mr: 1 }}
            />
            {selectedProperty?.is_booked && (
              <Chip
                label={selectedProperty.status === 'sale' ? 'Sold' : 'Rented'}
                color={selectedProperty.status === 'sale' ? 'error' : 'warning'}
                size="small"
              />
            )}
          </Box>
          <List dense>
            <ListItem><ListItemText primary="Location" secondary={selectedProperty?.location} /></ListItem>
            <ListItem><ListItemText primary="Category" secondary={selectedProperty?.category} /></ListItem>
            <ListItem><ListItemText primary="Size" secondary={`${selectedProperty?.size} Sqm`} /></ListItem>
            <ListItem><ListItemText primary="Beds" secondary={selectedProperty?.beds} /></ListItem>
            <ListItem><ListItemText primary="Baths" secondary={selectedProperty?.baths} /></ListItem>
            <ListItem>
              <ListItemText
                primary={selectedProperty?.status === 'sale' ? 'Price' : 'Rent (USD)'}
                secondary={selectedProperty?.rent}
              />
            </ListItem>
            <ListItem><ListItemText primary="Description" secondary={selectedProperty?.description} /></ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => goToPayment(selectedProperty.id)}
            variant="contained"
            color="primary"
          >
            {selectedProperty?.status === 'sale' ? 'Buy Now' : 'Rent Now'}
          </Button>
        </DialogActions>
      </Dialog>

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

