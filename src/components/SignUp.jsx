import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate(); 

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
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('https://farmers-social-media-backend.onrender.com/api/v1/auth/signup', {
        username: formData.username,
        password: formData.password
      });
      setIsAuth(true);
      localStorage.setItem('isAuth',true);
      
      navigate('/home'); 

    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">Join Our Community</h1>
        <p className="signup-subtitle">Connect with farmers and share your experiences</p>
        
        <form className="signup-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
        
          <div className="signup-input-group full-width">
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

          <div className="signup-input-group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="signup-input-group">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <button type="submit" className="signup-btn">
            Create Account
            <span className="btn-shine"></span>
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
