import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Grid,
  Avatar,
  Tooltip,
  CardActions
} from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ScheduleIcon from '@mui/icons-material/Schedule';
import axios from 'axios';

const TrackRepair = () => {
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    axios.get('/api/repairs/track')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setRepairs(data);
        } else if (data?.repairs && Array.isArray(data.repairs)) {
          setRepairs(data.repairs);
        } else {
          setRepairs([]);
        }
      })
      .catch(() => setRepairs([]));
  }, []);

  return (
    <Box
      p={{ xs: 2, md: 3 }}
      sx={{
        background: '#f9f9f9',
        borderRadius: 2,
        boxShadow: 0,
        mb: 2
      }}
    >
      <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
        🛠️ Repair Tracker
      </Typography>

      {repairs.length > 0 ? (
        <Grid container spacing={2}>
          {repairs.map((repair, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: `4px solid ${
                    repair.status === 'Completed' ? '#2e7d32' :
                    repair.status === 'In Progress' ? '#ed6c02' :
                    '#ccc'
                  }`
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{
                      bgcolor:
                        repair.status === 'Completed' ? 'success.main' :
                        repair.status === 'In Progress' ? 'warning.main' :
                        'default'
                    }}>
                      <BuildCircleIcon />
                    </Avatar>
                  }
                  title={repair.type}
                  subheader={`Reported: ${new Date(repair.reportedOn).toLocaleDateString()}`}
                  titleTypographyProps={{ fontSize: 16, fontWeight: 600 }}
                  subheaderTypographyProps={{ fontSize: 12 }}
                />
                <Divider />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                    <strong>Description:</strong> {repair.details}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Preferred:</strong> {new Date(repair.date).toLocaleDateString()} at {repair.time}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                  <Tooltip title={`Status: ${repair.status}`} arrow>
                    <Chip
                      label={repair.status}
                      size="small"
                      color={
                        repair.status === 'Completed' ? 'success' :
                        repair.status === 'In Progress' ? 'warning' :
                        'default'
                      }
                      icon={
                        repair.status === 'Completed' ? <DoneAllIcon fontSize="small" /> :
                        repair.status === 'In Progress' ? <ScheduleIcon fontSize="small" /> :
                        <BuildCircleIcon fontSize="small" />
                      }
                      sx={{ fontWeight: 500 }}
                    />
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          p={4}
          textAlign="center"
          border="1px dashed #ccc"
          borderRadius={2}
          bgcolor="#fff"
          mt={2}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No repair requests found.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Once you book a repair, it will appear here for tracking.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TrackRepair;

