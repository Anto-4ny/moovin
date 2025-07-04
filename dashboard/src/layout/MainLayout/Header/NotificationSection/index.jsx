import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// MUI
import { useTheme } from '@mui/material/styles';
import {
  Badge,
  Button,
  Chip,
  ClickAwayListener,
  Fade,
  Grid,
  Paper,
  Popper,
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
  Typography,
  ListItemButton
} from '@mui/material';

import PerfectScrollbar from 'react-perfect-scrollbar';
import QueryBuilderTwoToneIcon from '@mui/icons-material/QueryBuilderTwoTone';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';

import User1 from 'assets/images/users/avatar-1.jpg';

const NotificationSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:8000/api/notifications/', {
        headers: { Authorization: `Token ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // Count of unread notifications
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.patch(
        `http://localhost:8000/api/notifications/${id}/`,
        { is_read: true },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <>
      <Badge badgeContent={unreadCount} color="error">
        <Button
          sx={{ minWidth: { sm: 50, xs: 35 } }}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          aria-label="Notification"
          onClick={handleToggle}
          color="inherit"
        >
          <NotificationsNoneTwoToneIcon sx={{ fontSize: '1.5rem' }} />
        </Button>
      </Badge>

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          { name: 'offset', options: { offset: [0, 10] } },
          { name: 'preventOverflow', options: { altAxis: true } }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '10px'
                  }}
                >
                  <PerfectScrollbar style={{ height: 320, overflowX: 'hidden' }}>
                    <ListSubheader disableSticky>
                      <Chip size="small" color="primary" label="Notifications" />
                    </ListSubheader>

                    {notifications.length === 0 ? (
                      <Typography sx={{ p: 2 }} color="textSecondary" align="center">
                        No notifications yet.
                      </Typography>
                    ) : (
                      notifications.map((note) => (
                        <ListItemButton
                          key={note.id}
                          onClick={() => handleNotificationClick(note.id)}
                          sx={{
                            backgroundColor: note.is_read ? 'inherit' : theme.palette.action.hover
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar alt="System" src={User1} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: note.is_read ? 'normal' : 'bold' }}
                              >
                                {note.message}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption">
                                {new Date(note.created_at).toLocaleString()}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction sx={{ top: 22 }}>
                            <Grid container justifyContent="flex-end" alignItems="center">
                              <Grid item>
                                <QueryBuilderTwoToneIcon
                                  sx={{
                                    fontSize: '0.75rem',
                                    mr: 0.5,
                                    color: theme.palette.grey[400]
                                  }}
                                />
                              </Grid>
                              <Grid item>
                                <Typography
                                  variant="caption"
                                  display="block"
                                  gutterBottom
                                  sx={{ color: theme.palette.grey[400] }}
                                >
                                  {new Date(note.created_at).toLocaleTimeString()}
                                </Typography>
                              </Grid>
                            </Grid>
                          </ListItemSecondaryAction>
                        </ListItemButton>
                      ))
                    )}
                  </PerfectScrollbar>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;


