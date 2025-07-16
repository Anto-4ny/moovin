import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

// project import
import AuthLogin from './AuthLogin';

// assets
import Logo from 'assets/images/moovin-logo.png';
import GoogleIcon from 'assets/images/social-google.svg'; // your Google SVG

const Login = () => {
  const theme = useTheme();

  // Update this to match your backend Google login URL
  const GOOGLE_LOGIN_URL = 'https://moovin-jf0f.onrender.com/accounts/google/login/';

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

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
                      <img alt="Moovin Logo" src={Logo} height="54" width="54" />
                    </RouterLink>
                  </Grid>
                </Grid>
              </Grid>

              {/* Google Login Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleGoogleLogin}
                  sx={{
                    backgroundColor: theme.palette.grey[50],
                    color: theme.palette.grey[800],
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: theme.palette.grey[100] }
                  }}
                >
                  <img src={GoogleIcon} alt="Google" style={{ width: 20, marginRight: 12 }} />
                  Sign in with Google
                </Button>
              </Grid>

              {/* Divider */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" textAlign="center" color="textSecondary">
                  OR
                </Typography>
              </Grid>

              {/* Login Form */}
              <Grid item xs={12}>
                <AuthLogin />
              </Grid>

              {/* Forgot Password */}
              <Grid item xs={12} sx={{ mt: -2 }}>
                <Typography
                  variant="body2"
                  color="primary"
                  component={RouterLink}
                  to="/forgot-password"
                  sx={{
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot your password?
                </Typography>
              </Grid>

              {/* Register Link */}
              <Grid container justifyContent="flex-start" sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}>
                <Grid item>
                  <Typography variant="subtitle2" color="textSecondary">
                    Don’t have an account?{' '}
                    <Typography
                      component={RouterLink}
                      to="/application/register"
                      sx={{
                        display: 'inline',
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Create one
                    </Typography>
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