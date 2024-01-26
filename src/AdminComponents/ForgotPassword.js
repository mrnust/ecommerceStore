// ForgotPassword.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  const checkPasswordStrength = (value) => {
    // Check password strength conditions here
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    return {
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    };
  };

  const handlePasswordChange = (value) => {
    const strength = checkPasswordStrength(value);
    // Update UI based on password strength conditions
    console.log('Password Strength:', strength);
  };

  const renderPasswordStrength = (condition, label) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', color: condition ? 'green' : 'red' }}>
        {condition ? <CheckCircleOutlineIcon style={{ marginRight: '4px' }} /> : '-'}
        <Typography variant="body2" style={{ fontSize: '12px' }}>
          {label}
        </Typography>
      </div>
    );
  };

  const handleSignup = () => {
    // Your signup logic here
    // console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    // Example: You can add user registration logic or navigate to another page after successful signup
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#ffffff' }}>
      <Typography style={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: '16px' }} variant="h5">
        Forgot Password
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', width: '100%', maxWidth: '300px' }}>
          <MailOutlineIcon color="primary" style={{ marginRight: '8px' }} />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px', width: '100%', maxWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <LockOutlinedIcon color="primary" style={{ marginRight: '8px' }} />
            <TextField
              label="New Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handlePasswordChange(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {renderPasswordStrength(checkPasswordStrength(password).hasUpperCase, 'Uppercase')}
          {renderPasswordStrength(checkPasswordStrength(password).hasLowerCase, 'Lowercase')}
          {renderPasswordStrength(checkPasswordStrength(password).hasNumber, 'Number')}
          {renderPasswordStrength(checkPasswordStrength(password).hasSpecialChar, 'Special Character')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', width: '100%', maxWidth: '300px' }}>
          <LockOutlinedIcon color="primary" style={{ marginRight: '8px' }} />
          <TextField
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSignup}
        style={{ marginTop: '20px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s', backgroundColor: '#3f51b5' }}
        onMouseOver={(e) => (e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
        onMouseOut={(e) => (e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)')}
      >
        Update
      </Button>
      <Typography variant="body2" style={{ marginTop: '10px', color: '#3f51b5' }}>
        Remember you password? <Link to="/login">Login</Link>
      </Typography>
    </div>
  );
};

export default ForgotPassword;
