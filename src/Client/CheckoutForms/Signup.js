import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { getDatabase, ref, push, set } from "firebase/database";
import bcrypt from 'bcryptjs';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useHistory } from "react-router-dom";

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  const checkPasswordStrength = (value) => {
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
    setPasswordStrength(strength);
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

  const handleSignup = async () => {
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('Age:', age);
    console.log('Phone Number:', phoneNumber);
    console.log('Gender:', gender);

    if (
      name.length >= 3 &&
      email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
      passwordStrength.hasUpperCase &&
      passwordStrength.hasLowerCase &&
      passwordStrength.hasNumber &&
      passwordStrength.hasSpecialChar &&
      phoneNumber.length === 11
    ) {
      try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const db = getDatabase();
        const usersRef = ref(db, 'Users/Registered');
        const newUserRef = push(usersRef);

        let updatedage = Number(age);
        set(newUserRef, {
          userName: name,
          userEmail: email,
          userPassword: hashedPassword,
          userPhoneNo: phoneNumber,
          userAge: updatedage,
          userGender: gender.toUpperCase(),
          userID: localStorage.getItem('USERID'),
        })
          .then(() => {
            console.log('User data submitted successfully!');
            localStorage.setItem('userEmail', email);
            toast.success(`Signed up successfully`, { position: 'top-center', className: 'toast-success' });
            setTimeout(() => {
              history.push("/login");
            }, 2000);
          })
          .catch((error) => {
            console.error('Error submitting user data:', error.message);
            toast.error(`Error while creating user`, { position: 'top-center', className: 'toast-error' });
          });
      } catch (error) {
        console.error('Error hashing password:', error.message);
        toast.error('Error during signup', { position: 'top-center', className: 'toast-error' });
      }
    } else {
      toast.error('Please fix the validation errors before signing up', { position: 'top-center', className: 'toast-error' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', marginTop: '150px',marginBottom:'150px' }}>
      <div style={{ boxShadow: '0 4px 8px grey'}}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#ffffff', width: '350px' }}>
        <Typography style={{ color: 'hsl(26, 100%, 55%)', fontWeight: 'bold', marginBottom: '16px' }} variant="h5">
          Signup
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
            <PersonOutlineIcon color="primary" style={{ marginRight: '8px',marginTop:'-35px',color:'hsl(26, 100%, 55%)' }} />
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText={name.length < 3 ? 'Name should be at least 3 characters' : ''}
            />
            {name.length >= 3 && <CheckCircleOutlineIcon style={{ color: 'green', marginLeft: '4px' }} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
            <MailOutlineIcon color="primary" style={{ marginRight: '8px' ,marginTop:'-25px',color:'hsl(26, 100%, 55%)'}} />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'Invalid email address' : ''}
            />
            {email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && <CheckCircleOutlineIcon style={{ color: 'green', marginLeft: '4px' }} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <LockOutlinedIcon color="primary" style={{ marginRight: '8px',color:'hsl(26, 100%, 55%)' }} />
              <TextField
                label="Password"
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
              {passwordStrength.hasUpperCase && passwordStrength.hasLowerCase && passwordStrength.hasNumber && passwordStrength.hasSpecialChar && <CheckCircleOutlineIcon style={{ color: 'green', marginLeft: '4px' }} />}
            </div>
            {renderPasswordStrength(passwordStrength.hasUpperCase, 'Uppercase')}
            {renderPasswordStrength(passwordStrength.hasLowerCase, 'Lowercase')}
            {renderPasswordStrength(passwordStrength.hasNumber, 'Number')}
            {renderPasswordStrength(passwordStrength.hasSpecialChar, 'Special Character')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
            <PhoneAndroidIcon color="primary" style={{ marginRight: '8px' ,color:'hsl(26, 100%, 55%)'}} />
            <TextField
              label="Phone Number"
              variant="outlined"
              type="tel"
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              helperText={phoneNumber.length !== 11 ? 'Phone number should be 11 digits' : ''}
            />
            {phoneNumber.length === 11 && <CheckCircleOutlineIcon style={{ color: 'green', marginLeft: '4px' }} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
            <CakeIcon color="primary" style={{ marginRight: '8px' ,color:'hsl(26, 100%, 55%)'}} />
            <TextField
              label="Age"
              variant="outlined"
              type="number"
              fullWidth
              value={age}
              onChange={(e) => setAge(e.target.value)}
              helperText={isNaN(age) ? 'Invalid age' : ''}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
            <WcIcon color="primary" style={{ marginRight: '8px',color:'hsl(26, 100%, 55%)' }} />
            <TextField
              select
              label="Gender"
              variant="outlined"
              fullWidth
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </TextField>
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignup}
          disabled={
            !(name.length >= 3 &&
              email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
              passwordStrength.hasUpperCase &&
              passwordStrength.hasLowerCase &&
              passwordStrength.hasNumber &&
              passwordStrength.hasSpecialChar &&
              phoneNumber.length === 11 && age && gender) 
             
          }
          style={{ marginTop: '20px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s', backgroundColor: 'hsl(26, 100%, 55%)' }}
          onMouseOver={(e) => (e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
          onMouseOut={(e) => (e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)')}
        >
          Signup
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px', color: '#3f51b5' }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </div>
        <ToastContainer position="top-center" autoClose={2000} />
        </div>
    </div>
  );
};

export default Signup;
