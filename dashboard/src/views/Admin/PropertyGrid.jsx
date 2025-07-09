import React, { useState } from 'react';
import {
  Grid, Card, CardMedia, CardContent, CardActions, Box, Typography,
  Divider, IconButton, Chip, Tooltip, Pagination
} from '@mui/material';
import {
  LocationOn, KingBed, Bathtub, AttachMoney, Phone, Person, Info,
  Delete, Edit
} from '@mui/icons-material';

export default function PropertyGrid({ properties = [], handleDeleteProperty, handleEditProperty }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ Ensure `properties` is an array before slicing
  const validProperties = Array.isArray(properties) ? properties : [];
  const pageCount = Math.ceil(validProperties.length / itemsPerPage);
  const paginatedProperties = validProperties.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <Typography variant="h5" fontWeight={600} gutterBottom mt={5}>
        All Listed Properties
      </Typography>

      <Grid container spacing={3}>
        {paginatedProperties.map(property => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: '#fff',
                boxShadow: '0 6px 12px rgba(0,0,0,0.07)',
                transition: 'transform 0.25s ease',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
            >
              {/* Image */}
              <Box sx={{ height: 160, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={property.images?.[0]?.image || '/placeholder.jpg'}
                  alt={property.name}
                  sx={{ width: '100%', objectFit: 'cover' }}
                />
              </Box>

              {/* Content */}
              <CardContent sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                  {property.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {property.description}
                </Typography>

                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn fontSize="small" color="primary" />
                  <Typography variant="body2">Location: {property.location}</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <AttachMoney fontSize="small" color="success" />
                  <Typography variant="body2">Rent: USD {property.rent}</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <KingBed fontSize="small" color="action" />
                  <Typography variant="body2">{property.beds} Beds</Typography>
                  <Bathtub fontSize="small" color="action" />
                  <Typography variant="body2">{property.baths} Baths</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2"><strong>Size:</strong> {property.size} sqft</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Info fontSize="small" />
                  <Chip
                    label={property.status}
                    color={property.status === 'available' || property.status === 'rent' ? 'success' : 'warning'}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Owner Info */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="caption">{property.owner_name || 'N/A'}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="caption">{property.owner_phone || 'N/A'}</Typography>
                </Box>
              </CardContent>

              {/* Actions */}
              <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                <Tooltip title="Edit Property">
                  <IconButton color="primary" onClick={() => handleEditProperty(property)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Property">
                  <IconButton color="error" onClick={() => handleDeleteProperty(property.id)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(e, val) => setPage(val)}
          color="primary"
        />
      </Box>
    </>
  );
}
