import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Typography, Avatar, Divider
} from '@mui/material';
import {
  deepPurple, teal, orange, indigo, amber,
  deepOrange, purple, cyan
} from '@mui/material/colors';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DomainIcon from '@mui/icons-material/Domain';
import axios from 'axios';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const StatCard = ({ title, icon, value, bg }) => (
  <Paper elevation={3} sx={{
    p: 2, borderRadius: 2, display: 'flex', alignItems: 'center',
    bgcolor: bg, color: '#fff'
  }}>
    <Avatar sx={{ bgcolor: '#fff', color: bg, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5" fontWeight={700}>{Number(value).toLocaleString()}</Typography>
    </Box>
  </Paper>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    tenants: 0,
    landlords: 0,
    properties: 0,
    apartmentsRented: 0,
    vacantUnits: 0,
    issuesRaised: 0,
    earnings: []
  });

  useEffect(() => {
    axios.get('/api/admin/dashboard-stats/')
      .then(res => setStats(res.data))
      .catch(err => console.error('Dashboard fetch error:', err));
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3} fontWeight={700} color={indigo[900]}>
        Welcome, Admin 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={stats.totalUsers} icon={<PeopleAltOutlinedIcon />} bg={purple[500]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tenants" value={stats.tenants} icon={<DomainIcon />} bg={teal[500]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Landlords" value={stats.landlords} icon={<DomainIcon />} bg={amber[600]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Issues Raised" value={stats.issuesRaised} icon={<ReportProblemOutlinedIcon />} bg={deepOrange[500]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Properties" value={stats.properties} icon={<HomeWorkOutlinedIcon />} bg={cyan[700]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Rented Apartments" value={stats.apartmentsRented} icon={<ApartmentIcon />} bg={purple[700]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Vacant Units" value={stats.vacantUnits} icon={<DomainIcon />} bg={teal[300]} />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom color={indigo[800]}>
            Monthly Earnings Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.earnings} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
              <Line type="monotone" dataKey="earnings" stroke={indigo[500]} strokeWidth={3} />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      <Box mt={4}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom color={indigo[800]}>
            Admin Controls
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">➤ Manage Tenants</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">➤ Manage Landlords</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">➤ Approve / Remove Properties</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">➤ Resolve Reported Issues</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">➤ Track Payments</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">➤ Generate Reports</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
