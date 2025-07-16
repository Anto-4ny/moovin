import AddProperty from '../Landlord/AddProperty';
import EditProperty from '../Landlord/EditProperty';
import ManageProperty from '../Landlord/ManageProperty';

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, Avatar, Divider, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  MonetizationOn, Home, Build, ReportProblem, ListAlt, AddHomeWork
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { green, teal, orange, red, indigo } from '@mui/material/colors';

const StatCard = ({ title, value, icon, bg, onClick }) => (
  <Paper
    onClick={onClick}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 4,
      bgcolor: '#fff',
      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
      border: `1px solid ${bg}`,
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': {
        transform: onClick ? 'translateY(-6px)' : 'none',
        boxShadow: onClick ? `0 10px 25px ${bg}44` : undefined,
      },
    }}
  >
    <Box display="flex" alignItems="center">
      <Avatar sx={{ bgcolor: bg, mr: 2 }}>{icon}</Avatar>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Token ${token}` };

        const userRes = await axios.get('https://moovin-jf0f.onrender.com/api/users/me/', { headers });
        const user = userRes.data;
        setUserId(user.id);

        const [propRes, bookRes, payRes] = await Promise.all([
          axios.get('https://moovin-jf0f.onrender.com/api/properties/', { headers }),
          axios.get('https://moovin-jf0f.onrender.com/api/bookings/', { headers }),
          axios.get('https://moovin-jf0f.onrender.com/api/payments/', { headers })
        ]);

        const propList = Array.isArray(propRes.data?.results) ? propRes.data.results : [];
        const myProps = propList.filter(p => p.owner === user.id);

        const bookingList = Array.isArray(bookRes.data?.results) ? bookRes.data.results : [];
        const myBookings = bookingList.filter(b => myProps.some(p => p.id === b.property));

        const paymentList = Array.isArray(payRes.data?.results) ? payRes.data.results : [];
        const myPayments = paymentList.filter(p => myProps.some(prop => prop.id === p.property));

        setProperties(myProps);
        setBookings(myBookings);
        setPayments(myPayments);
      } catch (err) {
        console.error("Landlord dashboard error:", err);
      }
    };

    fetchData();
  }, []);

  const totalEarnings = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={700} color={indigo[900]} gutterBottom>
        Welcome, Landlord
      </Typography>
      <Typography variant="body1" mb={3}>
        Monitor your properties, tenant activity and payment history.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Earnings" value={`USD ${totalEarnings.toFixed(2)}`} icon={<MonetizationOn />} bg={green[600]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Properties Listed" value={properties.length} icon={<Home />} bg={teal[500]} onClick={() => navigate('/manage-property')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Bookings" value={bookings.length} icon={<ListAlt />} bg={orange[600]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Payments" value={payments.length} icon={<ReportProblem />} bg={red[500]} />
        </Grid>
      </Grid>

      <Box mt={5}>
        <Typography variant="h6" gutterBottom color={indigo[800]}>Bookings on Your Properties</Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Tenant</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell>{booking.property_details?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {booking.buyer_details?.full_name || booking.buyer_details?.username || 'N/A'} <br />
                    ({booking.buyer_details?.phone_number || 'N/A'})
                  </TableCell>
                  <TableCell>{booking.booking_type}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>{new Date(booking.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom color={indigo[800]}>Tenant Payments</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Tenant</TableCell>
                <TableCell>Months</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date Paid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((p, index) => (
                <TableRow key={index}>
                  <TableCell>{p.property_name || 'N/A'}</TableCell>
                  <TableCell>
                    {p.user_details?.full_name || p.user_details?.username || 'N/A'} <br />
                    ({p.user_details?.phone_number || 'N/A'})
                  </TableCell>
                  <TableCell>{Array.isArray(p.months) ? p.months.join(', ') : 'N/A'}</TableCell>
                  <TableCell>{p.amount}</TableCell>
                  <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box mt={5}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom color={indigo[800]}>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid item xs={12}>
            <Button href="/dashboard/manage-property" fullWidth variant="outlined" color="success" startIcon={<ListAlt />}>
              Manage Properties
            </Button>
            <Box mt={2}><ManageProperty /></Box>
          </Grid>

          <Grid container spacing={3} mt={2}>
            <Grid item xs={12}>
              <Button href="/dashboard/add-property" fullWidth variant="contained" color="primary" startIcon={<AddHomeWork />}>
                Add Property
              </Button>
              <Box mt={2}><AddProperty /></Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
