import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button,
  Grid, useTheme, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Divider, FormControl, InputLabel, Select, MenuItem,
  Snackbar, Alert
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

import BookProperty from '../Tenant/BookProperty';
import ProfessionalDirectory from '../../component/ProfessionalDirectory';

const TenantDashboard = () => {
  const theme = useTheme();
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    amount: '',
    months: [],
    cardNumber: '',
    cvv: '',
    expiry: '',
    date: new Date()
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://moovin-jf0f.onrender.com/api/users/me/', {
        headers: { Authorization: `Token ${token}` }
      }).then((res) => setUser(res.data));

      axios.get('https://moovin-jf0f.onrender.com/api/bookings/', {
        headers: { Authorization: `Token ${token}` }
      }).then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setBookings(data);
      }).catch((err) => {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      });
    }
  }, []);

  const handleOpenPayment = (booking) => {
    setSelectedBooking(booking);
    setPaymentOpen(true);
  };

  const handlePaymentSubmit = () => {
    const token = localStorage.getItem('token');
    const property = selectedBooking?.property_details || {};
    const rentPerMonth = parseFloat(property.rent || 0);
    const totalDue = formData.months.length * rentPerMonth;
    const paidAmount = parseFloat(formData.amount);

    if (paidAmount < totalDue) {
      setSnackbar({ open: true, message: `You must pay at least AUD ${totalDue.toLocaleString()} for the selected months.`, severity: 'error' });
      return;
    }

    const payload = {
      ...formData,
      months: formData.months,
      date: formData.date.toISOString().split('T')[0],
      property: selectedBooking?.property || property.id || null
    };

    axios.post('https://moovin-jf0f.onrender.com/api/payments/', payload, {
      headers: { Authorization: `Token ${token}` }
    }).then(() => {
      setSnackbar({ open: true, message: 'Payment submitted successfully.', severity: 'success' });
      setPaymentOpen(false);
      setFormData({ amount: '', months: [], cardNumber: '', cvv: '', expiry: '', date: new Date() });

      axios.get('https://moovin-jf0f.onrender.com/api/bookings/', {
        headers: { Authorization: `Token ${token}` }
      }).then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setBookings(data);
      });
    }).catch((err) => {
      console.error("Payment error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: 'Payment failed. Please check the details and try again.', severity: 'error' });
    });
  };

  const handleQuitHouse = async (bookingId) => {
    const confirm = window.confirm("Are you sure you want to quit this house?");
    if (!confirm) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://moovin-jf0f.onrender.com/api/bookings/${bookingId}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setSnackbar({ open: true, message: 'You have successfully quit the house.', severity: 'success' });
      setBookings(prev => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      console.error("Quit house error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: 'Failed to quit the house. Please try again.', severity: 'error' });
    }
  };

  return (
    <Box p={4} sx={{ bgcolor: theme.palette.grey[50], minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Welcome back, <span style={{ color: theme.palette.secondary.main }}>{user.username}</span>!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Here's your current property & payments.
      </Typography>

      <Grid container spacing={4}>
        {Array.isArray(bookings) && bookings.length > 0 ? (
          bookings.map((booking, index) => {
            const unpaidMonths = booking.due_months || [];
            const rentPerMonth = parseFloat(booking.property_details.rent || 0);
            const paid = (booking.payment_history || []).reduce((sum, p) => sum + parseFloat(p.amount), 0);
            const expectedTotal = (booking.total_months || 0) * rentPerMonth;
            const balance = expectedTotal - paid;

            const paidMonths = new Set();
            (booking.payment_history || []).forEach(p => {
              if (Array.isArray(p.months)) {
                p.months.forEach(m => paidMonths.add(m));
              } else if (p.month) {
                paidMonths.add(p.month);
              }
            });

            const allMonths = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];

            return (
              <Grid item xs={12} key={index}>
                <Card sx={{ p: 3 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Avatar
                          variant="rounded"
                          src={booking.property_details?.images?.[0]?.image || ''}
                          sx={{ width: '100%', height: 200, borderRadius: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6">{booking.property_details.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{booking.property_details.description}</Typography>
                        <Typography variant="body2">Location: <b>{booking.property_details.location}</b></Typography>
                        <Typography variant="body1" mt={1}>Rent: <b>AUD {rentPerMonth.toLocaleString()}</b> / Month</Typography>

                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" mt={2}>Monthly Payment Status</Typography>

                        {allMonths.map((month, idx) => (
                          <Typography key={idx} variant="body2" sx={{ color: paidMonths.has(month) ? 'green' : 'error' }}>
                            {paidMonths.has(month) ? `✅ ${month} paid` : `❌ ${month} due`}
                          </Typography>
                        ))}

                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <b>Paid:</b> AUD {paid.toLocaleString()}<br />
                          <b>Remaining:</b> AUD {balance > 0 ? balance.toLocaleString() : '0'}
                        </Typography>

                        <Button
                          variant="contained"
                          sx={{ mt: 2, width: '100%' }}
                          onClick={() => handleOpenPayment(booking)}
                          disabled={unpaidMonths.length === 0}
                        >
                          Pay Rent
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ mt: 1, width: '100%' }}
                          onClick={() => handleQuitHouse(booking.id)}
                        >
                          Quit House
                        </Button>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body2">
                          Landlord: <b>{booking.property_details.owner_name || 'N/A'}</b><br />
                          Contact: <b>{booking.property_details.owner_phone || '+610 000 000 000'}</b>
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">You have no current bookings.</Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Browse available properties and book your next home.
              </Typography>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}><BookProperty /></Grid>
        <Grid item xs={12}><ProfessionalDirectory /></Grid>
      </Grid>

      {/* Rent Payment Dialog */}
      <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Pay Rent</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Amount (USD)"
                name="amount"
                type="number"
                fullWidth
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Month(s)</InputLabel>
                <Select
                  multiple
                  value={formData.months}
                  onChange={(e) => setFormData({ ...formData, months: e.target.value })}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {[ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ].map((month) => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Payment Date"
                  value={formData.date}
                  onChange={(newDate) => setFormData({ ...formData, date: newDate })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Card Number"
                name="cardNumber"
                fullWidth
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CVV"
                name="cvv"
                type="password"
                fullWidth
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Expiry (MM/YY)"
                name="expiry"
                fullWidth
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handlePaymentSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TenantDashboard;

