import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box, Button, Divider, FormHelperText, Grid, TextField, Typography, FormControl, InputLabel,
  OutlinedInput, InputAdornment, IconButton, FormControlLabel, Checkbox, RadioGroup, Radio
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          re_password: '',
          full_name: '',
          phone_number: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(150).required('Username is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').max(255).required('Password is required'),
          re_password: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Please confirm your password'),
          full_name: Yup.string().max(255).required('Full name is required'),
          phone_number: Yup.string().matches(/^\+?\d{9,15}$/, 'Enter a valid phone number').required('Phone number is required'),
          terms: Yup.boolean().oneOf([true], 'You must accept the Terms and Conditions')
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            // Step 1: Register user
            const response = await axios.post('https://moovin-jf0f.onrender.com/api/users/', {
              username: values.username,
              email: values.email,
              password: values.password,
              re_password: values.re_password,
              role: role,
              full_name: values.full_name,
              phone_number: values.phone_number
            });

            console.log('✅ Registered:', response.data);

            // Step 2: Log in immediately
            const loginRes = await axios.post('https://moovin-jf0f.onrender.com/api/token/login/', {
              username: values.username,
              password: values.password
            });

            const token = loginRes.data?.key;
            if (token) {
              localStorage.setItem('token', token);
              localStorage.setItem('role', role);
              navigate(`/dashboard/${role}`);
            } else {
              throw new Error('Login failed after registration');
            }
          } catch (error) {
            const responseData = error?.response?.data || {};
            const errorObject = {
              username: responseData?.username?.[0],
              email: responseData?.email?.[0],
              password: responseData?.password?.[0],
              re_password: responseData?.re_password?.[0],
              full_name: responseData?.full_name?.[0],
              phone_number: responseData?.phone_number?.[0],
              submit: responseData?.non_field_errors?.[0] || error.message
            };

            setErrors(errorObject);
            console.error('📛 Registration error:', responseData);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              name="full_name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.full_name}
              error={Boolean(touched.full_name && errors.full_name)}
              helperText={touched.full_name && errors.full_name}
            />

            <TextField
              fullWidth
              label="Phone Number"
              margin="normal"
              name="phone_number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.phone_number}
              error={Boolean(touched.phone_number && errors.phone_number)}
              helperText={touched.phone_number && errors.phone_number}
            />

            <TextField
              fullWidth
              label="Username"
              margin="normal"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username}
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username}
            />

            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              name="email"
              type="email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}>
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
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                error={Boolean(touched.password && errors.password)}
              />
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: theme.spacing(2) }}>
  <InputLabel htmlFor="re_password">Confirm Password</InputLabel>
  <OutlinedInput
    id="re_password"
    type={showPassword ? 'text' : 'password'}
    name="re_password"
    value={values.re_password}
    onBlur={handleBlur}
    onChange={handleChange}
    label="Confirm Password"
    error={Boolean(touched.re_password && errors.re_password)}
    endAdornment={
      <InputAdornment position="end">
        <IconButton
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          edge="end"
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    }
  />
  {touched.re_password && errors.re_password && (
    <FormHelperText error>{errors.re_password}</FormHelperText>
  )}
</FormControl>

            {/* Role Selection */}
            <Box mt={2}>
              <Typography variant="subtitle1">Register as:</Typography>
              <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)} name="role">
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
                    onChange={(event) => {
                      setChecked(event.target.checked);
                      setFieldValue('terms', event.target.checked);
                    }}
                    name="terms"
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
              {touched.terms && errors.terms && (
                <FormHelperText error>{errors.terms}</FormHelperText>
              )}
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
