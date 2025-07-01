import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'assets/images/social-google.svg';

const AuthRegister = ({ ...rest }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [role, setRole] = React.useState('tenant');

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

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
              '&:hover': { backgroundColor: theme.palette.grey[100] }
            }}
            size="large"
            variant="contained"
          >
            <img src={Google} alt="google" width="20px" style={{ marginRight: '16px' }} />
            Register with Google
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
          username: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(150).required('Username is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            const response = await axios.post('http://localhost:8000/api/auth/users/', {
              username: values.username,
              email: values.email,
              password: values.password,
              role: role
            });

            console.log('Registered:', response.data);
            navigate(`/dashboard/${role}`); // Redirect based on role
          } catch (error) {
            const errMsg = error?.response?.data?.email?.[0] ||
                           error?.response?.data?.username?.[0] ||
                           'Registration failed';
            setErrors({ submit: errMsg });
            console.error(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            <TextField
              error={Boolean(touched.username && errors.username)}
              fullWidth
              helperText={touched.username && errors.username}
              label="Username"
              margin="normal"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username}
              variant="outlined"
            />

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

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}
              variant="outlined"
            >
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

            {/* Role Selection */}
            <Box mt={2}>
              <Typography variant="subtitle1">Register as:</Typography>
              <RadioGroup
                row
                value={role}
                onChange={(e) => setRole(e.target.value)}
                name="role"
              >
                <FormControlLabel value="tenant" control={<Radio />} label="Tenant" />
                <FormControlLabel value="landlord" control={<Radio />} label="Landlord" />
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
              </RadioGroup>
            </Box>

            {/* Terms and conditions */}
            <Box my={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    name="checked"
                    color="primary"
                  />
                }
                label={
                  <>
                    I have read the &nbsp;
                    <Link to="#">Terms and Conditions</Link>
                  </>
                }
              />
            </Box>

            {errors.submit && (
              <Box mt={2}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box mt={2}>
              <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Register
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;

