import React, { useState } from 'react';
import {
  Typography, IconButton, Dialog, DialogActions, DialogTitle,
  Button, List, ListItem, ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const mockUsers = [
  { id: 1, name: 'John Doe (Tenant)' },
  { id: 2, name: 'Alice Smith (Landlord)' }
];

export default function DeleteUser() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = () => {
    console.log('Deleting user:', selectedUser);
    // Call API here
    handleClose();
  };

  return (
    <>
      <List dense>
        {mockUsers.map(user => (
          <ListItem
            key={user.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleOpen(user)} color="error">
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete {selectedUser?.name}?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
