import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid } from '@mui/material';

// project import
import AuthRegister from './AuthRegister';

// assets
import Logo from 'assets/images/logo-dark.svg';

const Register = () => {
  const theme = useTheme();

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
                      <img alt="Auth method" src={Logo} style={{ maxHeight: 40 }} />
                    </RouterLink>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <AuthRegister />
              </Grid>

              <Grid item>
                <Grid container justifyContent="flex-start">
                  <Typography variant="subtitle2" color="secondary">
                    Already have an account?&nbsp;
                    <RouterLink to="/application/login" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
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

