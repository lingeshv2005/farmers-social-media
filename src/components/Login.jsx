import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Base.css';
import axiosInstance from '../utils/axios';
import { ENDPOINTS } from '../config/api';
import GLogin from './GoogleLogin';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to posts
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (isAuth) {
      navigate('/posts', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove any existing tokens
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('isAuth');

      const response = await axiosInstance.post(ENDPOINTS.LOGIN, {
        username: formData.username,
        password: formData.password
      });

      const { token, userId, name, email, userType } = response.data;
      
      // Set authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', name || formData.username);
      localStorage.setItem('isAuth', 'true');

      // Show success message
      toast.success('Login successful!');

      // Navigate to posts page
      navigate('/posts', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="box">
        <h1 className="title">Welcome Back!</h1>
        <p className="subtitle">Connect with farmers and share experiences</p>
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
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
            sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#0ea965' } }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
          </Button>
        </form>
        <br />
        <GLogin />
        <p className="footer">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </motion.div>
  );
}

export default Login;
