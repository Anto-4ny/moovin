import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, Avatar, Divider, Button
} from '@mui/material';
import {
  MonetizationOn, Home, Build, ReportProblem, AddHomeWork, Edit, ListAlt
} from '@mui/icons-material';
import { teal, orange, red, indigo, green } from '@mui/material/colors';

import AddProperty from '../Landlord/AddProperty';
import EditProperty from '../Landlord/EditProperty';
import ManageProperty from '../Landlord/ManageProperty';

const StatCard = ({ title, value, icon, bg }) => (
  <Paper sx={{
    p: 2,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 2,
    bgcolor: bg,
    color: '#fff',
  }}>
    <Avatar sx={{ bgcolor: '#fff', color: bg, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h6" fontWeight={700}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
    </Box>
  </Paper>
);

export default function LandlordDashboard() {
  const [stats, setStats] = useState({
    earnings: 0,
    totalProperties: 0,
    maintenanceRequests: 0,
    unresolvedComplaints: 0,
  });

  useEffect(() => {
    // Replace with real API call
    setStats({
      earnings: 43200,
      totalProperties: 4,
      maintenanceRequests: 2,
      unresolvedComplaints: 1,
    });
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
          <StatCard title="Total Earnings" value={`$${stats.earnings}`} icon={<MonetizationOn />} bg={green[600]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Properties Listed" value={stats.totalProperties} icon={<Home />} bg={teal[500]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Repairs Requested" value={stats.maintenanceRequests} icon={<Build />} bg={orange[600]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Unresolved Complaints" value={stats.unresolvedComplaints} icon={<ReportProblem />} bg={red[500]} />
        </Grid>
      </Grid>

      {/* ACTION SECTIONS */}
      <Box mt={5}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom color={indigo[800]}>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button href="/add-property" fullWidth variant="contained" color="primary" startIcon={<AddHomeWork />}>
                Add Property
              </Button>
              <Box mt={2}><AddProperty /></Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button href="/edit-property" fullWidth variant="outlined" color="warning" startIcon={<Edit />}>
                Edit Property
              </Button>
              <Box mt={2}><EditProperty /></Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button href="/manage-property" fullWidth variant="outlined" color="success" startIcon={<ListAlt />}>
                Manage Properties
              </Button>
              <Box mt={2}><ManageProperty /></Box>
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
