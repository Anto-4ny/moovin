import React, { useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import axios from 'axios';

const repairTypes = [
  'Plumbing',
  'Electrical',
  'Painting',
  'Carpentry',
  'Pest Control',
  'Internet/Wi-Fi',
  'Broken Windows',
  'Air Conditioning/Heating',
  'Roof Leak',
  'Appliance Issue',
  'Other'
];

const BookRepair = () => {
  const [form, setForm] = useState({
    type: '',
    startedOn: '',
    date: '',
    time: '',
    details: ''
  });

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/repairs/book', form);
      setSnack({ open: true, message: 'Repair request sent successfully.', severity: 'success' });
      setForm({ type: '', startedOn: '', date: '', time: '', details: '' });
    } catch (err) {
      setSnack({ open: true, message: 'Failed to send repair request.', severity: 'error' });
    }
  };

  return (
    <Box p={{ xs: 2, md: 4 }} sx={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <Card elevation={3}>
        <CardHeader
          avatar={<BuildIcon color="primary" />}
          title="Book a Repair"
          subheader="Let your landlord know about an issue"
          titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
        />
        <Divider />
        <CardContent>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Fill in the details below. A repair agent will contact you after confirmation.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Repair Type"
                name="type"
                select
                fullWidth
                value={form.type}
                onChange={handleChange}
                variant="outlined"
              >
                {repairTypes.map((type, i) => (
                  <MenuItem key={i} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Issue Started On"
                name="startedOn"
                type="date"
                fullWidth
                value={form.startedOn}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Preferred Repair Date"
                name="date"
                type="date"
                fullWidth
                value={form.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Preferred Time"
                name="time"
                type="time"
                fullWidth
                value={form.time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Detailed Description"
                name="details"
                multiline
                rows={4}
                fullWidth
                value={form.details}
                onChange={handleChange}
                variant="outlined"
                placeholder="Describe the issue clearly..."
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                fullWidth
                size="large"
                sx={{ background: '#1976d2', color: '#fff', fontWeight: 'bold', py: 1.5 }}
              >
                Submit Repair Request
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookRepair;
