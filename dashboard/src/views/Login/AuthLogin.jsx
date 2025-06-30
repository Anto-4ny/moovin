import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'assets/images/social-google.svg';

const AuthLogin = ({ ...rest }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [role, setRole] = React.useState('tenant');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Adjust this URL to your backend domain/port
  const BACKEND_URL = 'http://localhost:8000/api/token/';

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Button
            fullWidth
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
            <img
              src={Google}
              alt="google"
              width="20px"
              style={{
                marginRight: '16px',
                '@media (maxWidth:899.95px)': {
                  marginRight: '8px'
                }
              }}
            />
            Sign in with Google
          </Button>
        </Grid>
      </Grid>

      <Box alignItems="center" display="flex" mt={2}>
        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
        <Typography color="textSecondary" variant="h5" sx={{ m: theme.spacing(2) }}>
          OR
        </Typography>
        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
      </Box>

      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            const response = await axios.post(BACKEND_URL, {
              email: values.email,
              password: values.password
            });

            const token = response.data.access;

            // Store the token (you can use cookies or context as needed)
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Redirect based on role
            if (role === 'admin') {
              navigate('/admin/dashboard');
            } else if (role === 'landlord') {
              navigate('/landlord/dashboard');
            } else {
              navigate('/tenant/dashboard');
            }
          } catch (err) {
            setErrors({ submit: 'Invalid credentials or role' });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            <TextField
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ mt: 3, mb: 1 }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </FormControl>

            <Box mt={2}>
              <Typography variant="subtitle2">Login As:</Typography>
              <RadioGroup
                row
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                <FormControlLabel value="landlord" control={<Radio />} label="Landlord" />
                <FormControlLabel value="tenant" control={<Radio />} label="Tenant" />
              </RadioGroup>
            </Box>

            {errors.submit && (
              <Box mt={2}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box mt={2}>
              <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Log In
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
