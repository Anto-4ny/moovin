import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid } from '@mui/material';

// project import
import AuthLogin from './AuthLogin';

// assets
import Logo from 'assets/images/logo-dark.svg';

// ==============================|| LOGIN PAGE ||============================== //

const Login = () => {
  const theme = useTheme();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: theme.palette.common.black,
        height: '100%',
        minHeight: '100vh',
        px: 2
      }}
    >
      <Grid item xs={12} sm={10} md={6} lg={4}>
        <Card
          sx={{
            overflow: 'visible',
            display: 'flex',
            position: 'relative',
            maxWidth: 475,
            mx: 'auto',
            my: 4
          }}
        >
          <CardContent sx={{ p: theme.spacing(5, 4, 3, 4) }}>
            <Grid container direction="column" spacing={4}>
              <Grid item xs={12}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography color="textPrimary" gutterBottom variant="h2">
                      Sign In
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Welcome back! Login to continue.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <RouterLink to="/">
                      <img alt="Moovin Logo" src={Logo} height="32" />
                    </RouterLink>
                  </Grid>
                </Grid>
              </Grid>

              {/* Login Form Component */}
              <Grid item xs={12}>
                <AuthLogin />
              </Grid>

              {/* Register Link */}
              <Grid container justifyContent="flex-start" sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}>
                <Grid item>
                  <Typography
                    variant="subtitle2"
                    color="secondary"
                    component={RouterLink}
                    to="/application/register"
                    sx={{ textDecoration: 'none', pl: 2 }}
                  >
                    Don&apos;t have an account? Create one
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;

