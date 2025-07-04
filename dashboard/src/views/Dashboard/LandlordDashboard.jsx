import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, Avatar, Divider, Button
} from '@mui/material';
import {
  MonetizationOn, Home, Build, ReportProblem, ListAlt, AddHomeWork, Edit
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { green, teal, orange, red, indigo } from '@mui/material/colors';

import AddProperty from '../Landlord/AddProperty';
import EditProperty from '../Landlord/EditProperty';
import ManageProperty from '../Landlord/ManageProperty';

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
  const [stats, setStats] = useState({
    earnings: 0,
    totalProperties: 0,
    maintenanceRequests: 0,
    unresolvedComplaints: 0,
  });

useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      // Step 1: Get the current user
      const userRes = await axios.get('http://localhost:8000/api/users/me/', {
        headers: { Authorization: `Token ${token}` }
      });

      const userId = userRes.data.id; // now you have the user ID

      // Step 2: Get all properties
      const res = await axios.get('http://localhost:8000/api/properties/', {
        headers: { Authorization: `Token ${token}` }
      });

      // Step 3: Filter only properties by this user
      const userProperties = res.data.filter(p => p.owner === userId);

      setStats(prev => ({
        ...prev,
        totalProperties: userProperties.length
      }));
    } catch (err) {
      console.error('Error fetching property stats:', err);
    }
  };

  fetchData();
}, []);


  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={700} color={indigo[900]} gutterBottom>
        Welcome, Landlord
      </Typography>
      <Typography variant="body1" mb={3}>
        Manage your properties, respond to tenant needs, and track your earnings.
      </Typography>

      {/* STATISTICS */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Earnings"
            value={`USD ${stats.earnings}`}
            icon={<MonetizationOn />}
            bg={green[600]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Properties Listed"
            value={stats.totalProperties}
            icon={<Home />}
            bg={teal[500]}
            onClick={() => navigate('/manage-property')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Repairs Requested"
            value={stats.maintenanceRequests}
            icon={<Build />}
            bg={orange[600]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unresolved Complaints"
            value={stats.unresolvedComplaints}
            icon={<ReportProblem />}
            bg={red[500]}
          />
        </Grid>
      </Grid>

      {/* Add more sections here if needed */}
            {/* ACTION SECTIONS */}
      <Box mt={5}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom color={indigo[800]}>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid item xs={12}>
              <Button href="/manage-property" fullWidth variant="outlined" color="success" startIcon={<ListAlt />}>
                Manage Properties
              </Button>
              <Box mt={2}><ManageProperty /></Box>
            </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button href="/add-property" fullWidth variant="contained" color="primary" startIcon={<AddHomeWork />}>
                Add Property
              </Button>
              <Box mt={2}><AddProperty /></Box>
            </Grid>


          </Grid>
        </Paper>
      </Box>
            {/* COMPLAINT & PAYMENT SECTIONS */}
      <Box mt={5}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" color={indigo[800]} gutterBottom>
            Tenant Complaints & Payments
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Complaints from Tenants
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and resolve pending tenant complaints quickly to ensure satisfaction.
              </Typography>
              {/* Placeholder for complaint resolution UI */}
              <Box mt={2}>
                <Button variant="outlined" color="error">View Complaints</Button>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Payment Transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor rent received from tenants, monthly breakdowns and pending dues.
              </Typography>
              {/* Placeholder for payments list/chart */}
              <Box mt={2}>
                <Button variant="outlined" color="primary">View Payment History</Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
