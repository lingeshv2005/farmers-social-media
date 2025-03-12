import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Base.css';
import axiosInstance from '../utils/axios';
import { ENDPOINTS } from '../config/api';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    userType: 'farmer',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Create user account with all required fields
      const signupResponse = await axiosInstance.post(ENDPOINTS.SIGNUP, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        userType: formData.userType,
        location: formData.location || '' // Use empty string as default if not provided
      });

      if (signupResponse.data.success) {
        toast.success('Sign up successful! Please login.');
        navigate('/login');
      } else {
        throw new Error(signupResponse.data.message || 'Sign up failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Sign up failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="box">
        <h1 className="title">Create Account</h1>
        <p className="subtitle">Join our farming community today</p>
        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="User Type"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="farmer">Farmer</MenuItem>
            <MenuItem value="Doctor">Doctor</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#0ea965' } }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
          </Button>
        </form>
        <p className="footer">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </motion.div>
  );
}

export default SignUp;
