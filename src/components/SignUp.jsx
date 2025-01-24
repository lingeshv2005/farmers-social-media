import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignUp.css';

function SignUp({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    avatar: null,
  });
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      // TODO: Implement actual signup logic here
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">Join Our Community</h1>
        <p className="signup-subtitle">Connect with farmers and share your experiences</p>
        
        <form className="signup-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="signup-input-group">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="firstName">First Name</label>
          </div>

          <div className="signup-input-group">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="lastName">Last Name</label>
          </div>

          <div className="signup-input-group full-width">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="email">Email</label>
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

          <div className="signup-input-group">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="phone">Phone Number</label>
          </div>

          <div className="signup-input-group">
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="location">Location</label>
          </div>

          <div className="avatar-upload">
            <div className="avatar-preview">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" />
              ) : (
                <div className="avatar-placeholder"></div>
              )}
            </div>
            <label className="avatar-upload-btn" htmlFor="avatar">
              {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <button type="submit" className="signup-btn">
            Create Account
            <span className="btn-shine"></span>
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
