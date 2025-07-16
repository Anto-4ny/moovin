import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useTheme } from '@mui/material/styles';
import {
  Box, Button, Divider, FormHelperText, Grid, TextField, Typography,
  FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton,
  RadioGroup, FormControlLabel, Radio
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'assets/images/social-google.svg';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const BACKEND_URL = 'https://moovin-jf0f.onrender.com/api/token/login/';

const AuthLogin = ({ ...rest }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('tenant');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');

    if (token && savedRole) {
      fetch('https://moovin-jf0f.onrender.com/api/users/me/', {
        headers: {
          Authorization: `Token ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            localStorage.clear();
            navigate('/application/login');
          } else {
            navigate(`/dashboard/${savedRole}`);
          }
        })
        .catch(() => {
          localStorage.clear();
          navigate('/');
        });
    }
  }, [navigate]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <>

      <Formik
        initialValues={{ email: '', password: '', submit: null }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').required('Email is required'),
          password: Yup.string().required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            if (role === 'admin') {
              if (values.email !== ADMIN_EMAIL || values.password !== ADMIN_PASSWORD) {
                setErrors({ submit: 'Access denied. Invalid admin credentials.' });
                setSubmitting(false);
                return;
              }
            }

            const response = await axios.post(BACKEND_URL, {
              email: values.email,
              password: values.password
            });

            const { auth_token } = response.data;

            if (!auth_token) {
              setErrors({ submit: 'No token returned from server.' });
              setSubmitting(false);
              return;
            }

            // Fetch actual user role from backend
            const userRes = await axios.get('https://moovin-jf0f.onrender.com/api/users/me/', {
              headers: { Authorization: `Token ${auth_token}` }
            });

            const userRole = userRes.data.role;

            if (userRole !== role) {
              setErrors({ submit: `You registered as a '${userRole}'. Please select that role.` });
              setSubmitting(false);
              return;
            }

            // Save and redirect
            localStorage.setItem('token', auth_token);
            localStorage.setItem('role', userRole);
            navigate(`/dashboard/${userRole}`);
          } catch (err) {
            console.error('❌ Login error:', err);
            setErrors({ submit: 'Invalid credentials or server error.' });
          } finally {
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
              type="email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              variant="outlined"
            />

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ mt: 3, mb: 1 }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={values.password}
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
              <Button
                color="primary"
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
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