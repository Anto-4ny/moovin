import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Divider, Button, Box } from '@mui/material';

// project import
import AuthRegister from './AuthRegister';

// assets
import Logo from 'assets/images/moovin-logo.png';
import GoogleIcon from 'assets/images/social-google.svg'; // Make sure this path is correct

const Register = () => {
  const theme = useTheme();

  // Replace with your backend OAuth URL
  const GOOGLE_AUTH_URL = 'https://moovin-jf0f.onrender.com/auth/o/google-oauth2/?redirect_uri=https://moovin-eight.vercel.app/dashboard/oauth/callback';

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: theme.palette.common.black, height: '100%', minHeight: '100vh' }}
    >
      <Grid item xs={11} sm={8} md={6} lg={4}>
        <Card
          sx={{
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            my: 3,
            mx: 'auto',
            maxWidth: 475
          }}
        >
          <CardContent sx={{ p: theme.spacing(5, 4, 3, 4) }}>
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography color="textPrimary" gutterBottom variant="h2">
                      Register
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      To keep connected with us
                    </Typography>
                  </Grid>
                  <Grid item>
                    <RouterLink to="/">
                      <img alt="Moovin Logo" src={Logo} style={{ maxHeight: 54 }} />
                    </RouterLink>
                  </Grid>
                </Grid>
              </Grid>

              {/* Google Sign Up Button */}
              <Grid item>
                <Button
                  fullWidth
                  href={GOOGLE_AUTH_URL}
                  sx={{
                    fontSize: { md: '1rem', xs: '0.875rem' },
                    fontWeight: 500,
                    backgroundColor: theme.palette.grey[50],
                    color: theme.palette.grey[600],
                    textTransform: 'capitalize',
                    '&:hover': {
                      backgroundColor: theme.palette.grey[100]
                    }
                  }}
                  size="large"
                  variant="contained"
                >
                  <img src={GoogleIcon} alt="Google" width="20px" style={{ marginRight: '16px' }} />
                  Sign Up with Google
                </Button>
              </Grid>

              {/* Divider */}
              <Grid item>
                <Box alignItems="center" display="flex">
                  <Divider sx={{ flexGrow: 1 }} />
                  <Typography color="textSecondary" variant="h5" sx={{ m: theme.spacing(2) }}>
                    OR
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Box>
              </Grid>

              {/* Native Registration Form */}
              <Grid item>
                <AuthRegister />
              </Grid>

              {/* Login Link */}
              <Grid item>
                <Grid container justifyContent="flex-start">
                  <Typography variant="subtitle2" color="secondary">
                    Already have an account?&nbsp;
                    <RouterLink
                      to="/application/login"
                      style={{ textDecoration: 'none', color: theme.palette.primary.main }}
                    >
                      Login
                    </RouterLink>
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

export default Register;

