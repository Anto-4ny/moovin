import React, { useState } from 'react';
import {
  Typography, IconButton, Dialog, DialogActions, DialogTitle,
  Button, List, ListItem, ListItemText
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const mockProperties = [
  { id: 101, name: 'Sunset Villa - 3BHK, Sydney' },
  { id: 102, name: 'Downtown Loft - 2BHK, Melbourne' }
];

export default function DeleteProperty() {
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleOpen = (property) => {
    setSelectedProperty(property);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProperty(null);
  };

  const handleDelete = () => {
    console.log('Deleting property:', selectedProperty);
    // Call delete property API here
    handleClose();
  };

  return (
    <>
      <List dense>
        {mockProperties.map(property => (
          <ListItem
            key={property.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleOpen(property)} color="error">
                <DeleteForeverIcon />
              </IconButton>
            }
          >
            <ListItemText primary={property.name} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete property: {selectedProperty?.name}?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
