// Login.js
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google'; // Import Google icon
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import { Link } from 'react-router-dom';
import { database, auth, googleProvider, signInWithRedirect, getRedirectResult,signInWithPopup } from "../../firebaseconfig";
import { getDatabase, ref, push, onValue, off, get } from "firebase/database";
import bcrypt from 'bcryptjs';
import { useHistory } from "react-router-dom";

// ... (imports)

const Login = () => {
  const [email, setEmail] = useState(localStorage.getItem('userEmail'));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userdata, setuserdata] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading

  const history = useHistory();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    if (email == "admin" && password == "admin") {
      localStorage.setItem('USERSTATUS', 'ADMIN');
      history.push("/admin");
    }

    // Check if userdata is available
    if (loading) {
      // Show a loading state or message to the user
      console.log('Loading user data...');
      return;
    }

    // Check if there's a user with the entered credentials
    const user = userdata.find((user) => user.userEmail === email);

    if (user) {
      // Compare the hashed password
      bcrypt.compare(password, user.userPassword, (err, result) => {
        if (result) {
          // Authentication success
          console.log('Authentication successful');
          toast.success(`Logged in successfully`, { position: 'top-center', className: 'toast-success' });
          localStorage.setItem('USERSTATUS', "LOGGED_IN");
          setTimeout(() => {
            history.push("/orderSummary");
          }, 2000);
        } else {
          // Authentication failed
          console.log('Authentication failed');
          toast.error(`Wrong credentials`, { position: 'top-center', className: 'toast-error' });
        }
      });
    } else {
      // User not found
      console.log('User not found');
      toast.error(`User not found`, { position: 'top-center', className: 'toast-error' });
    }
  };

  const handleGoogleLogin = async () => {
    signInWithRedirect(auth, googleProvider);

    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = googleProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        alert(user.displayName);
        console.log('hello',user.displayName)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = googleProvider.credentialFromError(error);
        console.log(errorMessage);
      });
  };

  useEffect(() => {
    console.log("loading users data..")
    const userRef = ref(database, 'Users/Registered');
    const handleuserData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setuserdata(userList);
      } else {
        setuserdata([]);
      }
      setLoading(false); // Set loading to false once data is loaded
    };

    onValue(userRef, handleuserData);

    return () => {
      off(userRef, 'value', handleuserData);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', marginTop: '20px' }}>
      <div style={{boxShadow: '0 4px 8px grey'}}>
      <div style={{  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <Typography style={{ color: 'hsl(26, 100%, 55%)', fontWeight: 'bold', marginBottom: '16px' }} variant="h5">
          Login
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', width: '100%', maxWidth: '300px' }}>
            <MailOutlineIcon  style={{ marginRight: '8px',color:"hsl(26, 100%, 55%)" }} />
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
            <LockOutlinedIcon color="hsl(26, 100%, 55%)" style={{ marginRight: '8px',color:"hsl(26, 100%, 55%)" }} />
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
          backgroundColor="hsl(26, 100%, 55%)"
          onClick={handleLogin}
          style={{ marginTop: '20px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s', backgroundColor: 'hsl(26, 100%, 55%)' }}
          onMouseOver={(e) => (e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
          onMouseOut={(e) => (e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)')}
        >
          Login
        </Button>
        {/* <Button
          variant="contained"
          color="secondary"
          onClick={handleGoogleLogin}
          style={{
            marginTop: '20px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s',
            color: 'black',
            backgroundColor: '#fff', // Set background color to white
            display: 'flex',
            alignItems: 'center', // Align items to center
            justifyContent: 'center', // Justify content to center
          }}
          onMouseOver={(e) => (e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
          onMouseOut={(e) => (e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)')}
        >
          <GoogleIcon style={{ marginRight: '8px' }} />
          Login with Google
        </Button> */}
        <Typography variant="body2" style={{ marginTop: '10px', color: '#3f51b5' }}>
          Don't have an account? <Link to="/Signup">Sign up</Link>
        </Typography>
      </div>
        <ToastContainer position="top-center" autoClose={2000} />
        </div>
    </div>
  );
};

export default Login;
