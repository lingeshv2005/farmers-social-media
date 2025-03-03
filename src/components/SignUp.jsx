import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Base.css';

function SignUp() {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
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
      return;
    }

    setLoading(true);
    try {
      // const user = await axios.get('https://farmers-social-media-backend.onrender.com/api/v1/auth/signup', 
      const user = await axios.post('http://localhost:8000/api/v1/auth/signup', 
        { username: formData.username, password: formData.password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      console.log(user.data.user.userId);
      // await axios.put(`https://farmers-social-media-backend.onrender.com/api/v1/userdetails/update/${user.data.userId}`, 
      await axios.put(`http://localhost:8000/api/v1/userdetails/update/${user.data.user.userId}`, 
        {
          username: formData.username,
          userId: user.data.user.userId,
          email: user.data.user.email,
          profilePicture: user.data.user.profilePic,
          location: "India",
          name: formData.username,
          phone: "1234567890"
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      localStorage.setItem('isAuth', 'true');
      toast.success('Signup successful!');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="box">
        <h1 className="title">Join Our Community</h1>
        <p className="subtitle">Connect with farmers and share your experiences</p>
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
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}  {/* Default closed eye */}
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
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
          </Button>
        </form>
        <p className="footer">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </motion.div>
  );
}

export default SignUp;
