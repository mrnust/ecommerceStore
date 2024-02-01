import React, { useState, useEffect } from 'react';
import { database } from "../../firebaseconfig";
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, push, onValue, off, get, update } from "firebase/database";
import { Link } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import OrderDetails from './OrderDetails';
import { useLocation } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import TopNavBar from '../TopNavBar';
import Footer from '../Footer'





const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validations, setValidations] = useState({
    userName: true,
    userEmail: true,
    userPhoneNo: true,
    userAge: true,
  });

  useEffect(() => {
    // Fetch user data from the database and update the state
    // Example: Fetch data based on user ID
    const userId = localStorage.getItem('USERID');
    const userRef = ref(database, 'Users/Registered');
    onValue(userRef, (snapshot) => {
      const usersData = snapshot.val() || {};
      // Find the user with the matching userID
      const currentUser = Object.values(usersData).find(user => user.userID === userId);
      // Set the user data in the state
      setUserData(currentUser || {});
    });

    // Cleanup function to detach the listener when the component unmounts
    return () => {
      off(userRef);
    };
  }, []);

  const validateName = (name) => {
    return name.length >= 3;
  };

  const validateAge = (age) => {
    return !isNaN(age) && parseInt(age, 10) > 0;
  };

  const validatePhoneNumber = (phoneNumber) => {
    return /^\d{11}$/.test(phoneNumber);
  };

  const validateEmail = (email) => {
    return /\b[A-Za-z0-9._%+-]+@(?:yahoo|gmail|hotmail)\.[A-Z|a-z]{2,}\b/.test(email);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

const handleSaveClick = async () => {
  // Save the updated user data to the database
  const userId = localStorage.getItem('USERID');
  const userRef = ref(database, 'Users/Registered');
  const snapshot = await get(userRef);
  const usersData = snapshot.val();

  // Find the user with the matching USERID and get their Firebase-generated key
  let userToUpdateId;
  Object.entries(usersData).forEach(([key, user]) => {
    if (user.userID === userId) {
      userToUpdateId = key;
      console.log('key inside loop ', key)
      console.log('upload id inside loop ', userToUpdateId)
    }
  });
console.log('outside loop',userToUpdateId)
  // Update the specific user's data
  if (userToUpdateId) {
    const specificUserRef = ref(database, `Users/Registered/${userToUpdateId}`);
    await update(specificUserRef, userData);
  }

  // Show success snackbar
  setSnackbarOpen(true);
  // Disable edit mode after saving
  setEditMode(false);
};



  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

const handleInputChange = (field, value) => {
  // Convert the age to a number if the field is 'userAge'
  const processedValue = field === 'userAge' ? parseInt(value, 10) : value;

  setUserData({ ...userData, [field]: processedValue });

  // Validate fields and update validation state
  setValidations({
    ...validations,
    [field]: field === 'userName' ? validateName(value) :
              field === 'userAge' ? validateAge(value) :
              field === 'userPhoneNo' ? validatePhoneNumber(value) :
              field === 'userEmail' ? validateEmail(value) :
              true,
  });
};

  const isFormValid = () => {
    return Object.values(validations).every((valid) => valid) &&
           Object.values(userData).every((value) => value !== '');
  };


    const [topHeaderClass, setTopHeaderClass] = useState("show");
  
   const handleScroll = () => {
    if (window.scrollY >= 50) {
      setTopHeaderClass("hide");
    } else {
      setTopHeaderClass("show");
    }
  };

   useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const location = useLocation();
  const hideHeader = ['/hide'];
  console.log(location.pathname)


  return (
    <>
      {
        !hideHeader.includes(location.pathname)
         && (
            <header className="header trans_300">
              {/* <TopNavBar className={topHeaderClass} /> */}
              <NavBar />
            </header>
          )}
    <div>
    <Paper style={{ padding: 20, maxWidth: 400, margin: 'auto', marginTop: 30 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <TextField
        label="Username"
        fullWidth
        value={userData.userName || ''}
        onChange={(e) => handleInputChange('userName', e.target.value)}
        disabled={!editMode}
        error={!validations.userName}
        helperText={!validations.userName && 'Name should be at least 3 characters'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {validations.userName ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />}
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Email"
        fullWidth
        value={userData.userEmail || ''}
        onChange={(e) => handleInputChange('userEmail', e.target.value)}
        disabled={!editMode}
        error={!validations.userEmail}
        helperText={!validations.userEmail && 'Invalid email format'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {validations.userEmail ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />}
            </InputAdornment>
          ),
        }}
        style={{ marginTop: 10 }}
      />
      <TextField
        label="Phone Number"
        fullWidth
        value={userData.userPhoneNo || ''}
        onChange={(e) => handleInputChange('userPhoneNo', e.target.value)}
        disabled={!editMode}
        error={!validations.userPhoneNo}
        helperText={!validations.userPhoneNo && 'Phone number should be 11 digits'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {validations.userPhoneNo ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />}
            </InputAdornment>
          ),
        }}
        style={{ marginTop: 10 }}
      />
      <TextField
        label="Age"
        fullWidth
        type="number"
        value={userData.userAge || ''}
        onChange={(e) => handleInputChange('userAge', e.target.value)}
        disabled={!editMode}
        error={!validations.userAge}
        helperText={!validations.userAge && 'Age should be a valid number'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {validations.userAge ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />}
            </InputAdornment>
          ),
        }}
        style={{ marginTop: 10 }}
      />
      {editMode ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveClick}
          style={{ marginTop: 10,backgroundColor: 'hsl(26, 100%, 55%)' }}
          disabled={!isFormValid()}
        >
          Save
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditClick}
          style={{ marginTop: 10 ,backgroundColor: 'hsl(26, 100%, 55%)'}}
        >
          Edit
        </Button>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert onClose={handleSnackbarClose} severity="success">
          Profile updated successfully!
        </MuiAlert>
        </Snackbar>
        
      </Paper>

      
      
      {/* <div style={{marginTop:'100px'}}>
        <OrderDetails />
      </div> */}
      <div style={{ marginTop: '100px',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <OrderDetails />
      </div>
      
        {/* <Link style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'20px'}} to="/login">
                Login as Admin
        </Link> */}
      
      </div>
      <Footer />
      </>
  );
};

export default UserProfile;
