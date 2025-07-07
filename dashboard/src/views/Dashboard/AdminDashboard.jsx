// src/views/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Grid, Paper, Typography, Avatar, Divider, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  Snackbar, Alert, TextField, InputAdornment, IconButton,
  TablePagination
} from '@mui/material';
import {
  PeopleAltOutlined, HomeWork, Payment, Domain, Delete, Search, Edit
} from '@mui/icons-material';
import { indigo, teal, deepPurple, amber } from '@mui/material/colors';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import PropertyGrid from '../Admin/PropertyGrid';
import DashboardTables from '../Admin/DashboardTables';

const StatCard = ({ title, icon, value, bg }) => (
  <Paper elevation={3} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', bgcolor: bg, color: '#fff' }}>
    <Avatar sx={{ bgcolor: '#fff', color: bg, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5" fontWeight={700}>{value}</Typography>
    </Box>
  </Paper>
);

export default function AdminDashboard() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Token ${token}` };

  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, propsRes, bookingsRes, payRes] = await Promise.all([
        axios.get('http://localhost:8000/api/users/', { headers }),
        axios.get('http://localhost:8000/api/properties/', { headers }),
        axios.get('http://localhost:8000/api/bookings/', { headers }),
        axios.get('http://localhost:8000/api/payments/', { headers })
      ]);
      setUsers(usersRes.data);
      setProperties(propsRes.data);
      setBookings(bookingsRes.data);
      setPayments(payRes.data);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: 'Failed to fetch admin data.', severity: 'error' });
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}/`, { headers });
      setUsers(prev => prev.filter(u => u.id !== id));
      setSnack({ open: true, message: 'User deleted.', severity: 'success' });
    } catch {
      setSnack({ open: true, message: 'Failed to delete user.', severity: 'error' });
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/properties/${id}/`, { headers });
      setProperties(prev => prev.filter(p => p.id !== id));
      setSnack({ open: true, message: 'Property deleted.', severity: 'success' });
    } catch {
      setSnack({ open: true, message: 'Failed to delete property.', severity: 'error' });
    }
  };

  const handleExportCSV = (data, name) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
    XLSX.writeFile(workbook, `${name}.xlsx`);
  };

  const handleExportPDF = (columns, data, title) => {
    const doc = new jsPDF();
    autoTable(doc, { head: [columns], body: data });
    doc.save(`${title}.pdf`);
  };

  const filteredUsers = users.filter(user =>
    user?.full_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(0);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" mb={3} fontWeight={600}>Admin Dashboard</Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Users" value={users.length} icon={<PeopleAltOutlined />} bg={indigo[500]} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Properties" value={properties.length} icon={<HomeWork />} bg={deepPurple[500]} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Bookings" value={bookings.length} icon={<Domain />} bg={amber[500]} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Payments" value={payments.length} icon={<Payment />} bg={teal[500]} /></Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* USERS SECTION */}
      <Box mb={3} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Typography variant="h6">Users</Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
          <Button variant="outlined" onClick={() => handleExportCSV(filteredUsers, 'Users')}>Export CSV</Button>
          <Button variant="outlined" onClick={() => handleExportPDF(['Name', 'Email', 'Role'], filteredUsers.map(u => [u.full_name || 'N/A', u.email, u.role]), 'Users')}>Export PDF</Button>
        </Box>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.phone_number || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteUser(user.id)}><Delete /></IconButton>
                  <IconButton color="primary"><Edit /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />

      {/* PROPERTY SECTION */}
      <PropertyGrid
        properties={properties}
        handleDeleteProperty={handleDeleteProperty}
        handleEditProperty={(property) => console.log('Edit', property)}
      />

      {/* BOOKINGS & PAYMENTS */}
      <DashboardTables bookings={bookings} payments={payments} />

      {/* NOTIFICATION */}
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
