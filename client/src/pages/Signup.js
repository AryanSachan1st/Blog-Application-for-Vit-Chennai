import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import userService from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await userService.registerUser({ username, email, password });
      if (response.success && response.emailSent) {
        setOtpSent(true);
        setMessage('OTP sent to your email. Please check your inbox.');
      } else if (response.success) {
        // OTP already verified, login directly
        login(response.data.token);
        setMessage('Registration successful!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setMessage('Error: ' + response.error);
      }
    } catch (error) {
      setMessage('Error registering: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await userService.registerUser({ username, email, password, otp });
      if (response.success) {
        setOtpVerified(true);
        login(response.data.token);
        setMessage('Registration successful!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setMessage('Error: ' + response.error);
      }
    } catch (error) {
      setMessage('Error verifying OTP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await userService.registerUser({ username, email, password });
      if (response.success && response.emailSent) {
        setOtp(''); // Clear previous OTP
        setMessage('OTP resent to your email. Please check your inbox.');
      } else {
        setMessage('Error: ' + response.error);
      }
    } catch (error) {
      setMessage('Error resending OTP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Create Your Account</h2>
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Choose a username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : !otpVerified ? (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp" className="form-label">Enter OTP</label>
              <input
                type="text"
                id="otp"
                className="form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit OTP"
                maxLength="6"
              />
              <p className="form-help-text">Please check your email for the OTP. It will expire in 10 minutes.</p>
            </div>
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" onClick={handleResendOTP} disabled={loading} className="auth-button secondary">
              {loading ? 'Resending...' : 'Resend OTP'}
            </button>
          </form>
        ) : null}
        
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Login here</Link>
          </p>
        </div>
        
        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
