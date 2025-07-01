import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import { CheckCircle, Home, Payments, SupportAgent, Construction, EmojiEvents } from '@mui/icons-material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TenantDashboard = () => {
  const theme = useTheme();
  const property = {
    name: 'Skyline Residences',
    location: 'Utawala, Nairobi',
    status: 'Rented',
    monthlyRent: 'KES 35,000',
    dueDate: '5th of every month'
  };

  const paymentData = [
    { month: 'Mar', amount: 35000 },
    { month: 'Apr', amount: 35000 },
    { month: 'May', amount: 35000 },
    { month: 'Jun', amount: 35000 },
    { month: 'Jul', amount: 0 }
  ];

  return (
    <Box p={4} sx={{ background: theme.palette.grey[100], minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome Back, Tenant! 🎉
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Here's a quick look at your rental and activity.
      </Typography>

      <Grid container spacing={4} mt={2}>
        {/* Property Info */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}><Home /></Avatar>}
              title="Rented Property"
              titleTypographyProps={{ fontWeight: 'bold' }}
            />
            <Divider />
            <CardContent>
              <Typography variant="h6">{property.name}</Typography>
              <Typography variant="body2" color="textSecondary">Location: {property.location}</Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Typography variant="body2">Status:</Typography>
                <Chip label={property.status} color="success" size="small" />
              </Box>
              <Typography variant="body2">Monthly Rent: {property.monthlyRent}</Typography>
              <Typography variant="body2">Due: {property.dueDate}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Rent Chart & Bills */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: theme.palette.secondary.main }}><Payments /></Avatar>}
              title="Rent Overview"
              titleTypographyProps={{ fontWeight: 'bold' }}
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="textSecondary">Last Payment: KES 35,000 (June)</Typography>
              <Typography variant="body2">Next Due: KES 35,000 (July)</Typography>
              <Typography variant="body2">Water: KES 1,200 | Electricity: KES 3,000</Typography>
              <Box mt={2}>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={paymentData}>
                    <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} strokeWidth={2} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis hide />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Pay Now</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: theme.palette.warning.main }}><SupportAgent /></Avatar>}
              title="Support Contacts"
              titleTypographyProps={{ fontWeight: 'bold' }}
            />
            <Divider />
            <CardContent>
              <Typography variant="body2">Admin: support@moovin.co.ke</Typography>
              <Typography variant="body2">Landlord: Mr. Kamau</Typography>
              <Typography variant="body2">Phone: +254 712 345 678</Typography>
              <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>Message Landlord</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Repairs */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: theme.palette.error.main }}><Construction /></Avatar>}
              title="Repair Requests"
              titleTypographyProps={{ fontWeight: 'bold' }}
            />
            <Divider />
            <CardContent>
              <Typography variant="body2">• Bathroom leaking - <Chip label="Pending" color="warning" size="small" /></Typography>
              <Typography variant="body2" mt={1}>• Kitchen lights - <Chip label="Completed" color="success" size="small" /></Typography>
              <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }}>Book a Repair</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Reward / Early Payment */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: theme.palette.success.dark }}><EmojiEvents /></Avatar>}
              title="Early Bird Reward"
              titleTypographyProps={{ fontWeight: 'bold' }}
            />
            <Divider />
            <CardContent>
              <Typography variant="body2">🎉 Congratulations! You paid rent early 3 months in a row.</Typography>
              <Typography variant="body2" mt={1}>You qualify for a 5% discount next month.</Typography>
              <Chip icon={<CheckCircle />} label="Reward Active" color="success" size="small" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TenantDashboard;
