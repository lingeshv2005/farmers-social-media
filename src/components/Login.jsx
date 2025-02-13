import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Base.css';

import GLogin from './GoogleLogin';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get('https://farmers-social-media-backend.onrender.com/api/v1/auth/login', 
        formData, { headers: { 'Content-Type': 'application/json' } }
      );
      const { token, userId } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('isAuth', 'true');

      toast.success('Login successful!');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} required />
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
                    {showPassword ? <Visibility /> : <VisibilityOff />}  {/* Default closed eye */}
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
