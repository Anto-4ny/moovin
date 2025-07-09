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

  // Ensure arrays
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safePayments = Array.isArray(payments) ? payments : [];

  // Filter bookings
  const filteredBookings = safeBookings.filter(b => {
    const email = b?.buyer_details?.email || '';
    const username = b?.buyer_details?.username || '';
    const property = b?.property_details?.name || '';
    return (
      email.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      username.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      property.toLowerCase().includes(bookingSearch.toLowerCase())
    );
  });

  // Filter payments
  const filteredPayments = safePayments.filter(p => {
    const email = p?.user_details?.email || '';
    const property = p?.property_name || '';
    return (
      email.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      property.toLowerCase().includes(paymentSearch.toLowerCase())
    );
  });

  return (
    <Box sx={{ p: 2 }}>
      {/* ================= Bookings Section ================= */}
      <Typography variant="h6" gutterBottom mt={5} fontWeight="bold">
         All Properties Bought
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
                <TableCell><Person fontSize="small" /> Tenant</TableCell>
                <TableCell><Person fontSize="small" /> Landlord</TableCell>
                <TableCell><Home fontSize="small" /> Property</TableCell>
                <TableCell><Category fontSize="small" /> Type</TableCell>
                <TableCell><Assignment fontSize="small" /> Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.slice(bookingPage * rowsPerPage, bookingPage * rowsPerPage + rowsPerPage)
                .map((b) => (
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

      {/* ================= Payments Section ================= */}
      <Typography variant="h6" gutterBottom mt={7} fontWeight="bold">
         All Rent Payments
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
                <TableCell><Person fontSize="small" /> User</TableCell>
                <TableCell><Home fontSize="small" /> Property</TableCell>
                <TableCell><AttachMoney fontSize="small" /> Amount</TableCell>
                <TableCell><CalendarToday fontSize="small" /> Date</TableCell>
                <TableCell><CreditCard fontSize="small" /> Card</TableCell>
                <TableCell>Months</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.slice(paymentPage * rowsPerPage, paymentPage * rowsPerPage + rowsPerPage)
                .map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>{p?.user_details?.email || 'N/A'}</TableCell>
                    <TableCell>{p?.property_name || 'N/A'}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1e88e5' }}>
                      KES {p?.amount?.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell>{p?.date || 'N/A'}</TableCell>
                    <TableCell>{p?.cardNumber || 'N/A'}</TableCell>
                    <TableCell>{Array.isArray(p?.months) ? p.months.filter(Boolean).join(', ') : 'N/A'}</TableCell>
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