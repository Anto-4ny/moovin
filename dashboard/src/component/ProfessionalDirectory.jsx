import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, TextField, InputAdornment, Card, CardContent, Chip, Divider
} from '@mui/material';
import {
  Search, Phone, Email, WorkOutline, InfoOutlined
} from '@mui/icons-material';
import axios from 'axios';

export default function ProfessionalDirectory() {
  const [professionals, setProfessionals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/professionals/');
      setProfessionals(res.data);
    } catch (err) {
      console.error('Error fetching professionals:', err);
    }
  };

  const filtered = professionals.filter(p =>
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary.main">
        🧑‍🔧 Browse Verified Professionals
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Find skilled technicians, electricians, cleaners, and more.
      </Typography>

      <TextField
        placeholder="Search by name, profession, or skill..."
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="primary" />
            </InputAdornment>
          )
        }}
      />

      <Grid container spacing={3} mt={1}>
        {filtered.length === 0 ? (
          <Typography variant="body1" mt={3} color="text.secondary" mx={2}>
            No professionals found.
          </Typography>
        ) : (
          filtered.map(pro => (
            <Grid item xs={12} sm={6} md={4} key={pro.id}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 4,
                  transition: 'transform 0.3s ease',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                  '&:hover': { transform: 'translateY(-5px)' },
                  height: '100%',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <WorkOutline fontSize="small" color="primary" />
                    <Typography variant="h6" fontWeight={700} noWrap>
                      {pro.full_name}
                    </Typography>
                  </Box>

                  <Chip
                    label={pro.profession}
                    color="success"
                    size="small"
                    sx={{ mb: 1, textTransform: 'capitalize' }}
                  />

                  <Divider sx={{ my: 1.5 }} />

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <InfoOutlined fontSize="small" color="action" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {pro.description}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
                      <Phone fontSize="small" color="primary" /> {pro.phone || 'N/A'}
                    </Typography>
                    <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
                      <Email fontSize="small" color="primary" /> {pro.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
