import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button,
  Grid, Stack, Paper, useTheme, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, InputLabel, Select, FormControl, Divider
} from '@mui/material';
import {
  Payments as PaymentsIcon,
  SupportAgent as SupportAgentIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';

import TrackRepair from '../Tenant/TrackRepair';
import BookProperty from '../Tenant/BookProperty';
import BookRepair from '../Tenant/BookRepair';

const TenantDashboard = () => {
  const theme = useTheme();
  const [user, setUser] = useState({ email: 'Tenant', username: 'Tenant' });
  const [recentProperties, setRecentProperties] = useState([]);

  useEffect(() => {
    axios.get('/api/tenant/profile').then(res => setUser(res.data))
      .catch(err => console.error(err));
    axios.get('/api/properties/recent')
      .then(res => setRecentProperties(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRecentProperties([]));
  }, []);

  const paymentData = [
    { month: 'Mar', rent: 35000 },
    { month: 'Apr', rent: 35000 },
    { month: 'May', rent: 35000 },
    { month: 'Jun', rent: 35000 },
    { month: 'Jul', rent: 0 }
  ];

  const cardStyle = {
    borderRadius: 4,
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    background: theme.palette.background.paper
  };

  const [paymentOpen, setPaymentOpen] = useState(false);
const [formData, setFormData] = useState({
  date: new Date(),
  time: new Date(),
  amount: '',
  months: [],
  cardNumber: '',
  cvv: '',
  expiry: ''
});

const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handlePaymentSubmit = () => {
  console.log('Payment Info:', formData);
  setPaymentOpen(false); // Close dialog after submit
};

  const billData = [
    { name: 'Water', amount: 1200 },
    { name: 'Electricity', amount: 3000 },
    { name: 'Garbage', amount: 500 },
    { name: 'Internet', amount: 2000 }
  ];const [billOpen, setBillOpen] = useState(false);

const allBills = [
  { name: 'Water', amountDue: 1200, paid: 800 },
  { name: 'Electricity', amountDue: 3000, paid: 2000 },
  { name: 'Garbage', amountDue: 500, paid: 500 },
  { name: 'Internet', amountDue: 2000, paid: 0 }
];

const [selectedActivity, setSelectedActivity] = useState(null);

const activityLogs = [
  { action: 'Paid rent on time', time: '2 days ago', type: 'success', details: 'Full rent for July paid successfully via card ending 1234.' },
  { action: 'Contacted landlord', time: '4 days ago', type: 'success', details: 'Asked landlord about electricity outage. Response received.' },
  { action: 'Requested maintenance', time: '1 week ago', type: 'warning', details: 'Requested plumbing fix for leaking tap in kitchen.' },
  { action: 'Viewed property documents', time: '2 weeks ago', type: 'success', details: 'Downloaded rental agreement and invoice.' },
];



  return (
    <Box p={4} sx={{ bgcolor: theme.palette.grey[50], minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Welcome back, <span style={{ color: theme.palette.secondary.main }}>{user.username}</span>!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Your home at a glance — stay on top of everything effortlessly.
      </Typography>

      <Grid container spacing={4}>
{/* Payment History */}
<Grid item xs={12} md={8}>
  <Card sx={cardStyle}>
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
          <PaymentsIcon />
        </Avatar>
        <Typography variant="h6" fontWeight={600}>Payment History</Typography>
      </Box>
      <Box height={220}>
        <ResponsiveContainer>
          <LineChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="rent"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, py: 1.5 }}
        onClick={() => setPaymentOpen(true)}
      >
        Make a Payment
      </Button>
    </CardContent>
  </Card>
</Grid>

{/* Payment Dialog */}
<Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle fontWeight="bold" color="primary.main">Make a Payment</DialogTitle>
  <DialogContent dividers>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DatePicker
            label="Payment Date"
            value={formData.date}
            onChange={(newValue) => setFormData({ ...formData, date: newValue })}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TimePicker
            label="Payment Time"
            value={formData.time}
            onChange={(newValue) => setFormData({ ...formData, time: newValue })}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Amount (USD)"
            name="amount"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Month(s)</InputLabel>
            <Select
              multiple
              value={formData.months}
              name="months"
              onChange={(e) => setFormData({ ...formData, months: e.target.value })}
              renderValue={(selected) => selected.join(', ')}
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'].map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Card Number"
            name="cardNumber"
            fullWidth
            value={formData.cardNumber}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="CVV"
            name="cvv"
            type="password"
            fullWidth
            value={formData.cvv}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Expiry (MM/YY)"
            name="expiry"
            fullWidth
            value={formData.expiry}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={() => setPaymentOpen(false)} color="inherit">Cancel</Button>
    <Button variant="contained" onClick={handlePaymentSubmit}>
      Submit Payment
    </Button>
  </DialogActions>
</Dialog>


 {/* Utility Bills */}
<Grid item xs={12} md={4}>
  <Card sx={cardStyle}>
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
          <PaymentsIcon />
        </Avatar>
        <Typography variant="h6" fontWeight={600}>Current Bills</Typography>
      </Box>
      <Box height={170}>
        <ResponsiveContainer>
          <BarChart data={billData}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="amount" fill={theme.palette.info.main} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Button
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => setBillOpen(true)}
      >
        View Details
      </Button>
    </CardContent>
  </Card>
</Grid>

{/* Utility Bill Modal */}
<Dialog open={billOpen} onClose={() => setBillOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle fontWeight="bold" color="info.main">
    Utility Bill Details
  </DialogTitle>
  <DialogContent dividers>
    <Grid container spacing={2}>
      {allBills.map((bill, index) => {
        const remaining = bill.amountDue - bill.paid;
        return (
          <Grid item xs={12} key={index}>
            <Box p={2} borderRadius={2} border="1px solid #e0e0e0">
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {bill.name}
              </Typography>
              <Typography variant="body2">
                Amount Due: <b>USD {bill.amountDue.toLocaleString()}</b>
              </Typography>
              <Typography variant="body2">
                Paid: <b style={{ color: 'green' }}>USD {bill.paid.toLocaleString()}</b>
              </Typography>
              <Typography variant="body2">
                Remaining: <b style={{ color: remaining > 0 ? 'red' : 'green' }}>
                  USD {remaining.toLocaleString()}
                </b>
              </Typography>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={() => setBillOpen(false)} color="inherit">Close</Button>
  </DialogActions>
</Dialog>


{/* Activity Log */}
<Grid item xs={12}>
  <Card sx={{ ...cardStyle, p: 3 }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 2 }}>
          <UpdateIcon />
        </Avatar>
        <Typography variant="h6" fontWeight={600}>Recent Activity Log</Typography>
      </Box>

      <Stack spacing={2} mt={1}>
        {activityLogs.map((item, index) => (
          <Box
            key={index}
            onClick={() => setSelectedActivity(item)}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: index % 2 === 0 ? '#fdfaf5' : '#f9f9f9',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: '0.2s',
              '&:hover': {
                backgroundColor: '#fff8e1',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Avatar
              sx={{
                width: 30,
                height: 30,
                bgcolor: item.type === 'success' ? 'success.main' : 'error.main'
              }}
            >
              <UpdateIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="500">{item.action}</Typography>
              <Typography variant="caption" color="text.secondary">
                {item.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </CardContent>
  </Card>
</Grid>


        {/* Recent Properties */}
        <Grid item xs={12}>
          <BookProperty properties={recentProperties} />
        </Grid>

        {/* Book Repair */}
        <Grid item xs={12}>
          <BookRepair />
        </Grid>

        {/* Track Repair Requests */}
          <TrackRepair />
          {/* Help & Support Panel */}
<Grid item xs={12}>
  <Paper
    elevation={4}
    sx={{
      ...cardStyle,
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
        <Typography variant="h6" fontWeight={700}>
          Need Help?
        </Typography>
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
    </Box>
  );
};

export default TenantDashboard;

