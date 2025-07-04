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
  const [properties, setProperties] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [favorites, setFavorites] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate(); // ✅ for redirection to payment

  useEffect(() => {
    axios.get('http://localhost:8000/api/properties/')
      .then(res => {
        setProperties(res.data || []);
      })
      .catch(() => setSnack({ open: true, message: 'Failed to load properties.', severity: 'error' }));
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

  // ✅ Redirect to payment page
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
        {properties.map((prop) => (
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
                  💰 {prop.status === 'sale' ? 'Price' : 'Rent'}: <strong>KES {prop.rent}</strong>
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Chip
                  label={prop.status === 'sale' ? 'For Sale' : 'For Rent'}
                  color={prop.status === 'sale' ? 'info' : 'success'}
                  size="small"
                />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => goToPayment(prop.id)} // ✅ Go to payment page
                >
                  {prop.status === 'sale' ? 'Buy Now' : 'Rent Now'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
          <List dense>
            <ListItem>
              <ListItemText primary="Location" secondary={selectedProperty?.location} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Category" secondary={selectedProperty?.category} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Size" secondary={`${selectedProperty?.size} Sqm`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Beds" secondary={selectedProperty?.beds} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Baths" secondary={selectedProperty?.baths} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={selectedProperty?.status === 'sale' ? 'Price' : 'Rent (KES)'}
                secondary={selectedProperty?.rent}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Description" secondary={selectedProperty?.description} />
            </ListItem>
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
