import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/Login.css';

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // loading state for button
  const [showPassword, setShowPassword] = useState(false); // to toggle password visibility
  const navigate = useNavigate();  // hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // show loading indicator

    try {
      const response = await axios.get('https://farmers-social-media-backend.onrender.com/api/login', {
        params:{
          username: formData.username,
          password: formData.password
        }
      });
      const { token } = response.data;

      // Store the token (you can use localStorage, cookies, or state)
      localStorage.setItem('authToken', token);

      // Update authentication state
      setIsAuthenticated(true);

      // Redirect to home page
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);  // hide loading indicator after the request
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Welcome Back!</h1>
        <p className="login-subtitle">Connect with farmers and share your experiences</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="login-input-group">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="login-input-group">
            <input
              type={showPassword ? 'text' : 'password'}  // Toggle password visibility
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="password-toggle"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="form-footer">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}  {/* Show loading state text */}
            <span className="btn-shine"></span>
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
