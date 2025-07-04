import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button,
  Grid, Stack, Paper, useTheme, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Divider
} from '@mui/material';
import {
  Payments as PaymentsIcon,
  SupportAgent as SupportAgentIcon,
  Update as UpdateIcon
} from '@mui/icons-material';

import axios from 'axios';

import TrackRepair from '../Tenant/TrackRepair';
import BookProperty from '../Tenant/BookProperty';
import BookRepair from '../Tenant/BookRepair';

const TenantDashboard = () => {
  const theme = useTheme();
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // Track selected booking for payment
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    months: [],
    cardNumber: '',
    cvv: '',
    expiry: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8000/api/users/me/', {
        headers: { Authorization: `Token ${token}` }
      }).then((res) => setUser(res.data));

      axios.get('http://localhost:8000/api/bookings/', {
        headers: { Authorization: `Token ${token}` }
      }).then((res) => setBookings(res.data));
    }
  }, []);

  const handleOpenPayment = (booking) => {
    setSelectedBooking(booking);
    setPaymentOpen(true);
  };

  const handlePaymentSubmit = () => {
    const token = localStorage.getItem('token');
    if (!selectedBooking || !selectedBooking.property?.id) {
      alert("No valid booking selected for payment.");
      return;
    }

    const payload = {
      ...formData,
      months: formData.months, // array like ['July', 'August']
      property: selectedBooking.property.id
    };

    axios.post('http://localhost:8000/api/payments/', payload, {
      headers: { Authorization: `Token ${token}` }
    }).then(() => {
      setPaymentOpen(false);
      alert('Payment submitted!');
      setFormData({
        amount: '',
        months: [],
        cardNumber: '',
        cvv: '',
        expiry: ''
      });
    }).catch((err) => {
      console.error("Payment error:", err.response?.data || err.message);
      alert('Payment failed. Please check the details and try again.');
    });
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
        {bookings.map((booking, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar
                      variant="rounded"
                      src={booking.property.image || ''}
                      sx={{ width: 64, height: 64 }}
                    />
                    <Box>
                      <Typography variant="h6">{booking.property.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {booking.property.location}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography mt={2} variant="body1">
                    Rent: <b>USD {parseFloat(booking.property.rent).toLocaleString()}</b> / Month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6">Payment History</Typography>
                  <Box mt={2}>
                    {(booking.payment_history || []).map((p, i) => (
                      <Typography key={i} variant="body2">
                        ✅ {p.month}: USD {p.amount} (on {new Date(p.date).toLocaleDateString()})
                      </Typography>
                    ))}
                  </Box>
                  <Box mt={2}>
                    <Typography variant="body2" color="error">
                      Due Months: {(booking.due_months || []).join(', ') || 'None'}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleOpenPayment(booking)} // pass the booking object
                  >
                    Pay Rent
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </React.Fragment>
        ))}

        <Grid item xs={12}>
          <BookProperty />
        </Grid>

        <Grid item xs={12}>
          <BookRepair />
        </Grid>

        <Grid item xs={12}>
          <TrackRepair />
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderLeft: `5px solid ${theme.palette.secondary.main}`,
              borderRadius: 3,
              backgroundColor: '#fff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
                <SupportAgentIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>Need Help?</Typography>
                <Typography variant="body2" color="text.secondary">
                  Reach out to our support team or landlord
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1.5} mt={2}>
              <Box display="flex" alignItems="center">
                <SupportAgentIcon fontSize="small" color="secondary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Admin Email: <b>support@moovin.co.ke</b>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 500, mr: 1 }}>Landlord:</Typography>
                <Typography variant="body2"><b>Mr. Kamau</b></Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 500, mr: 1 }}>Phone:</Typography>
                <Typography variant="body2"><b>+254 712 345 678</b></Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="secondary"
                sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
                startIcon={<SupportAgentIcon />}
              >
                Contact Support
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle fontWeight="bold" color="primary.main">Pay Rent</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Amount (KES)"
                name="amount"
                type="number"
                fullWidth
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Month(s)"
                name="months"
                placeholder="e.g. August, September"
                fullWidth
                value={formData.months.join(', ')}
                onChange={(e) => setFormData({ ...formData, months: e.target.value.split(',').map(m => m.trim()) })}
              />
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
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPaymentOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handlePaymentSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantDashboard;
