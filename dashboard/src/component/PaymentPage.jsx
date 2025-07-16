import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, Snackbar, Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const { id } = useParams(); // property ID
  const [property, setProperty] = useState(null);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://moovin-jf0f.onrender.com/api/properties/${id}/`)
      .then(res => setProperty(res.data))
      .catch(err => {
        console.error('Error loading property:', err);
        setSnack({ open: true, message: 'Failed to load property.', severity: 'error' });
      });
  }, [id]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCard(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!card.number || !card.expiry || !card.cvv) {
      return setSnack({ open: true, message: 'Enter all card details.', severity: 'warning' });
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        property: id,
        payment_method: 'Card',
        booking_type: property?.status === 'sale' ? 'buy' : 'rent'
      };

      const response = await axios.post(`https://moovin-jf0f.onrender.com/api/bookings/`, payload, {
        headers: {
          Authorization: `Token ${token}`
        }
      });

      setSnack({ open: true, message: 'Payment successful. Booking confirmed!', severity: 'success' });
      setTimeout(() => navigate('/dashboard/tenant'), 3000);

    } catch (err) {
      console.error('Axios Error:', err);
      console.error('Server Response:', err.response?.data);
      setSnack({ open: true, message: 'Payment failed. See console for details.', severity: 'error' });
    }
  };

  return (
    <Box p={4}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2}>Complete Payment</Typography>

          {property && (
            <>
              <Typography variant="h6">{property.name}</Typography>
              <Typography variant="body1" color="textSecondary">{property.location}</Typography>
              <Typography variant="body1" my={2}>Amount: <strong>AUD {property.rent}</strong></Typography>

              <TextField
                fullWidth label="Card Number" name="number" onChange={handleInput}
                margin="normal" placeholder="1234 5678 9012 3456"
              />
              <TextField
                fullWidth label="Expiry Date" name="expiry" onChange={handleInput}
                margin="normal" placeholder="MM/YY"
              />
              <TextField
                fullWidth label="CVV" name="cvv" onChange={handleInput}
                margin="normal" placeholder="123"
              />

              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handlePayment}>
                Pay & Book
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentPage;
