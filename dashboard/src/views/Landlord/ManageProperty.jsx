import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Snackbar, Alert, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageProperty = () => {
  const [properties, setProperties] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/properties/', {
        headers: { Authorization: `Token ${token}` }
      });
      setProperties(res.data);
    } catch (err) {
      setSnack({ open: true, message: 'Failed to load your properties.', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/properties/${deleteDialog.id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setSnack({ open: true, message: 'Property deleted successfully.', severity: 'success' });
      setDeleteDialog({ open: false, id: null });
      fetchProperties(); // Refresh
    } catch (err) {
      setSnack({ open: true, message: 'Delete failed.', severity: 'error' });
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Manage Property</Typography>
        <Button variant="contained" onClick={() => navigate('/add-property')}>+ Add New</Button>
      </Box>

      <Typography variant="body1" color="textSecondary" mb={3}>
        View, edit or remove your listed properties.
      </Typography>

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <Card>
              <img
                src={property.images?.[0]?.image || '/img/default.jpg'}
                alt={property.name}
                style={{ height: 200, objectFit: 'cover', width: '100%' }}
              />
              <CardContent>
                <Typography variant="h6">{property.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {property.location} • KES {property.rent}{property.status === 'rent' ? '/mo' : ''}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {property.category} • {property.size} Sqm • {property.beds} Bed • {property.baths} Bath
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/edit-property/${property.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, id: property.id })}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this property? This action is permanent.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

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

export default ManageProperty;
