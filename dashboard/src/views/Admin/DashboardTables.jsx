import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TextField, InputAdornment, Box
} from '@mui/material';
import {
  Search, Person, Home, AttachMoney, CalendarToday, CreditCard, Category, Assignment
} from '@mui/icons-material';
import { useState } from 'react';

export default function DashboardTables({ bookings = [], payments = [] }) {
  const [bookingPage, setBookingPage] = useState(0);
  const [paymentPage, setPaymentPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [bookingSearch, setBookingSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Filter bookings
  const filteredBookings = bookings.filter(b =>
    b?.buyer_details?.email?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b?.buyer_details?.username?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b?.property_details?.name?.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  // Filter payments
  const filteredPayments = payments.filter(p =>
    p?.user_details?.email?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
    p?.property_name?.toLowerCase().includes(paymentSearch.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Bookings Section */}
      <Typography variant="h6" gutterBottom mt={5} fontWeight="bold">
         All Bookings
      </Typography>

      <TextField
        placeholder="Search bookings..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={bookingSearch}
        onChange={(e) => setBookingSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><Person /> Tenant</TableCell>
                <TableCell><Person /> Landlord</TableCell>
                <TableCell><Home /> Property</TableCell>
                <TableCell><Category /> Type</TableCell>
                <TableCell><Assignment /> Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.slice(bookingPage * rowsPerPage, bookingPage * rowsPerPage + rowsPerPage)
                .map(b => (
                  <TableRow key={b.id} hover>
                    <TableCell>{b?.buyer_details?.email || 'N/A'}</TableCell>
                    <TableCell>{b?.owner_details?.email || 'N/A'}</TableCell>
                    <TableCell>{b?.property_details?.name || 'N/A'}</TableCell>
                    <TableCell>{b?.booking_type || 'N/A'}</TableCell>
                    <TableCell sx={{
                      color: b.status === 'pending' ? 'orange' : 'green',
                      fontWeight: 600
                    }}>
                      {b.status || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredBookings.length}
            page={bookingPage}
            onPageChange={(e, newPage) => setBookingPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </TableContainer>
      </Box>

      {/* Payments Section */}
      <Typography variant="h6" gutterBottom mt={7} fontWeight="bold">
        💳 All Payments
      </Typography>

      <TextField
        placeholder="Search payments..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={paymentSearch}
        onChange={(e) => setPaymentSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><Person /> User</TableCell>
                <TableCell><Home /> Property</TableCell>
                <TableCell><AttachMoney /> Amount</TableCell>
                <TableCell><CalendarToday /> Date</TableCell>
                <TableCell><CreditCard /> Card</TableCell>
                <TableCell>Months</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.slice(paymentPage * rowsPerPage, paymentPage * rowsPerPage + rowsPerPage)
                .map(p => (
                  <TableRow key={p.id} hover>
                    <TableCell>{p?.user_details?.email || 'N/A'}</TableCell>
                    <TableCell>{p?.property_name || 'N/A'}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1e88e5' }}>
                      KES {p.amount}
                    </TableCell>
                    <TableCell>{p?.date || 'N/A'}</TableCell>
                    <TableCell>{p?.cardNumber || 'N/A'}</TableCell>
                    <TableCell>{p?.months?.filter(Boolean).join(', ') || 'N/A'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredPayments.length}
            page={paymentPage}
            onPageChange={(e, newPage) => setPaymentPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </TableContainer>
      </Box>
    </Box>
  );
}
