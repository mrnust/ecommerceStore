// Login.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = () => {
    // Your login logic here
    console.log('Email:', email);
    console.log('Password:', password);
    // Example: You can add authentication logic or navigate to another page after successful login
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#ffffff' }}>
      <Typography style={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: '16px' }} variant="h5">
        Login 
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
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '300px' }}>
          <LockOutlinedIcon color="primary" style={{ marginRight: '8px' }} />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        style={{ marginTop: '20px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s', backgroundColor: '#3f51b5' }}
        onMouseOver={(e) => (e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
        onMouseOut={(e) => (e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)')}
      >
        Login
      </Button>
      <Typography variant="body2" style={{ marginTop: '10px', color: '#3f51b5' }}>
        <Link to="/forgot-password">Forgot Password?</Link>
      </Typography>
      <Typography variant="body2" style={{ marginTop: '10px', color: '#3f51b5' }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </Typography>
    </div>
  );
};

export default Login;
