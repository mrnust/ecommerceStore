import React, { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from '@mui/icons-material/Mic';
import { IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../firebaseconfig';
import { getDatabase, ref, get, push, onValue, off, set, remove } from 'firebase/database';
import VerticalNavbar from './Admin_navbar';

const Container = styled('div')({
  minHeight: '80vh',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Heading = styled('h2')({
  marginBottom: '20px',
  color: 'black',
  fontWeight: 'bold',
  textAlign: 'center',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // transition: 'background-color 0.5s ease',
  // animation: 'colorChange 2s infinite alternate',
  // '@keyframes colorChange': {
  //   '0%': { backgroundColor: 'lightgray' },
  //   '100%': { backgroundColor: 'white' },
  // },
  //  '&:hover': {
  //   backgroundColor: '#f5f5f5',
  // },

    '&:hover': {
    backgroundColor: '#f5f5f5',
    transform: 'translateY(-5px)', // Add translation effect on hover
    transition: 'transform 0.3s ease', // Add a smooth transition effect
  },
}));

const ActionCell = styled(TableCell)({
  display: 'flex',
  gap: '8px',
});

const StyledEditButton = styled(Button)({
  backgroundColor: 'blue',
  color: 'white',
  '&:hover': {
    backgroundColor: 'darkblue',
  },
});

const StyledDeleteButton = styled(Button)({
  backgroundColor: '#777777',
  color: 'white',
  '&:hover': {
    backgroundColor: 'darkgrey',
  },
});

const CenteredFormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '400px',
  margin: '70px auto',
  padding: '20px',
 boxShadow: '0 4px 8px grey',
  borderRadius: '8px',
});

const FormButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
  width: '100%',
});

const StyledFormButton = styled(Button)({
  width: '48%',
});
const SearchContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px',
  marginBottom: '20px',
});

const StyledSearchBar = styled(TextField)({
  width: '90%',
  // maxWidth: '300px',
});
const PromoCodeTable = () => {
const { transcript, listening, resetTranscript, startListening, stopListening,onEnd } = useSpeechRecognition();
  const [nameError, setNameError] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
const [validations, setValidations] = useState({
  name: false,
  discount: false,
  expiryDate: false, // If needed, add more fields and their validations
});
  

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState({});
  const [promoCodesList, setPromoCodesList] = useState([]);
  const [categories, setCategoies] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [promocode, setPromocode] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPromoCodesList((prevList) =>
        prevList.map((promoCode) => ({
          ...promoCode,
          bgColor: getRandomColor(),
        }))
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const todoRef = ref(database, 'Categories');

    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categ = Object.values(data);
        setCategoies(categ);
        console.log(categ);
      } else {
        setCategoies([]);
      }
    };

    onValue(todoRef, handleData);

    return () => {
      off(todoRef, 'value', handleData);
    };

  }, [selectedCategories]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

useEffect(() => {
  const todoRef = ref(database, 'Promo Codes');

  const handleData = (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const currentDate = new Date();

      // Map over the promo codes, check the expiry date, and delete if necessary
      const pro = Object.entries(data).map(([id, promo]) => {
        // Parse the expiry date string to a Date object
        const expiryDate = new Date(promo.expiryDate);

        // Check if the expiry date is in the past
        if (expiryDate < currentDate) {
          // Expiry date has passed, delete the promo code
          const promoRef = ref(database, `Promo Codes/${id}`);
          remove(promoRef);
          return null; // Return null for expired promo codes
        } else {
          return { id, ...promo }; // Return the promo code if not expired
        }
      }).filter(Boolean); // Filter out null values (expired promo codes)

      setPromocode(pro);
      console.log(pro);
    } else {
      setPromocode([]);
    }
  };

  onValue(todoRef, handleData);

  return () => {
    off(todoRef, 'value', handleData);
  };
}, []);


  const handleEditClick = (promoCode) => {
    setSelectedPromoCode(promoCode);
    console.log(selectedPromoCode);
    setSelectedCategories(promoCode.applicableProducts)
    setEditDialogOpen(true);
  };



  const handleDeleteClick = async (promoCodeId) => {
  const promoCodesRef = ref(database, `Promo Codes/${promoCodeId}`);

  // Remove the promo code with the specified id
  await remove(promoCodesRef);

    // alert(`Promo code with id ${promoCodeId} deleted successfully`);
     toast.success(`Promo code with id ${promoCodeId} deleted successfully`, { position: 'top-center', className: 'toast-success' });

  };
  


  const handleDialogClose = () => {
    setEditDialogOpen(false);
  };




  const handleUpdateClick = async () => {
    const updateddis=Number( selectedPromoCode.discountPercent)
  const updatedPromoCode = {
    code: selectedPromoCode.code,
    expiryDate: selectedPromoCode.expiryDate,
    discountPercent: updateddis,
    applicableProducts: selectedCategories,
    // bgColor: getRandomColor(),
  };

  await set(ref(database, `Promo Codes/${selectedPromoCode.id}`), updatedPromoCode);
 toast.success(`Promo code updated successfully.`, { position: 'top-center', className: 'toast-success' });
  // Update the local promo codes list with the updated promo code
  setPromoCodesList((prevList) =>
    prevList.map((promoCode) =>
      promoCode.id === selectedPromoCode.id ? { ...promoCode, ...updatedPromoCode } : promoCode
    )
    );
    

    setEditDialogOpen(false);
    selectedPromoCode.expiryDate = '';
    setSelectedCategories([]);
  };
  


  

  const handleInputChange = (fieldName, value) => {
    setSelectedPromoCode((prevPromoCode) => ({
      ...prevPromoCode,
      [fieldName]: value,
    }));

    // Validation for Promo Code Name
    if (fieldName === 'name') {
      const isValidName = value.length === 5 ;
      setValidations((prevValidations) => ({
        ...prevValidations,
        name: isValidName,
      }));
      setNameError(isValidName ? '' : 'Name should be of 5 characters and only contain letters.');
    }

    // Validation for Discount
    if (fieldName === 'discount') {
      const isValidDiscount = !isNaN(value) && value >= 0 && value <= 100;
      setValidations((prevValidations) => ({
        ...prevValidations,
        discount: isValidDiscount,
      }));
      setDiscountError(isValidDiscount ? '' : 'Discount should be between 0 and 100.');
    }
  };


  const handleDateChange = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);

    setSelectedPromoCode((prevPromoCode) => ({
      ...prevPromoCode,
      expiryDate: date,
    }));

    // Validation for Expiry Date
    const isValidDate = selectedDate > currentDate;
    setValidations((prevValidations) => ({
      ...prevValidations,
      expiryDate: isValidDate,
    }));
    setExpiryDateError(isValidDate ? '' : 'Expiry date should be after the current date.');
  };



 
  const handleAddClick = () => {

         const { name, expiryDate, discount } = selectedPromoCode;

    // Validation checks
    // if (
    //   name.length !== 5 ||
    //   !/^[a-zA-Z]+$/.test(name) ||
    //   isNaN(discount) ||
    //   discount < 0 ||
    //   discount > 100 ||
    //   !validations.expiryDate ||
    //   selectedCategories.length === 0
    // ) {
    //   toast.error('Please enter all required and valid fields.', {
    //     position: 'top-center',
    //     className: 'toast-error',
    //   });
    //   return;
    // }


//     if (nameError || discountError || expiryDateError || selectedCategories) {
//   toast.error('Please enter all required and valid fields.', {
//     position: 'top-center',
//     className: 'toast-error',
//   });
//   return;
// }


  //   console.log(selectedPromoCode.expiryDate)
  //     setValidations({
  //   name: false,
  //   discount: false,
  //   expiryDate: false,
  // });

     const updateddis = Number(selectedPromoCode.discount);
    
    const newPromoCode = {
     
    code: selectedPromoCode.name,
    expiryDate: selectedPromoCode.expiryDate,
    discountPercent: updateddis,
    applicableProducts: selectedCategories,
    //  bgColor: getRandomColor(),
  };

  const promoCodesRef = ref(database, 'Promo Codes');

  // Push new promo code to the database
  push(promoCodesRef, newPromoCode)
    .then(() => {
      console.log('Promo code added successfully to the database');
      //  toast.success('Promo code added successfully to the database', { position: 'top-center', className: 'toast-success' });
      setSelectedPromoCode({
        name: '',
        expiryDate: '',
        discount: '',
      });
      setSelectedCategories([]);
      toast.success('Promo code added successfully ', { position: 'top-center', className: 'toast-success' });
    })
    .catch((error) => {
      console.error('Error adding promo code:', error);
      alert(`Failed to add promo code. Error: ${error.message}`);
      toast.error(`Failed to add promo code. Error: ${error.message}`, { position: 'top-center', className: 'toast-error' });
    });


     setSelectedPromoCode({ name: '', expiryDate: '', discount: '' });
    setSelectedCategories([]);
          setValidations({
          name: false,
          discount: false,
          expiryDate: false,
        });
  };
  
  const handleVoiceSearch = () => {
  if (listening) {
    SpeechRecognition.stopListening();
  } else {
    // Start listening and reset the transcript
    SpeechRecognition.startListening();
    resetTranscript();
  }
};

// Set up an effect to update searchTerm whenever transcript changes
useEffect(() => {
  setSearchTerm(transcript);
}, [transcript]);


  


  return (
    <>
      <VerticalNavbar/>
    <Container>
      <CenteredFormContainer className="animate__animated animate__rotateIn" >
        <Typography class="animate__animated animate__bounce" variant="h4" gutterBottom style={{ color: 'black', fontWeight: 'bold' }}>
          Add Promo Code
        </Typography>
        <TextField
          label="Promo Code Name"
          name="name"
          value={selectedPromoCode.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          variant="outlined"
          margin="normal"
          helperText={selectedPromoCode.name?.length > 0  && !validations.name ? 'Name should be of 5 characters' : ''}
          // error={!validations.name}
            error={(selectedPromoCode?.name && selectedPromoCode?.name.trim() !== '') && !validations.name}
           InputProps={{
            endAdornment: (selectedPromoCode.name !== '' && validations.name) ? (
              <InputAdornment position="end" style={{ width: '14px' }}>
                <CheckIcon style={{ color: 'green' }} />
              </InputAdornment>
            ) : null,
          }}
          
        />
        
        
        <TextField
          label="Discount (%)"
          type="number"
          name="discount"
          value={selectedPromoCode.discount}
          onChange={(e) => handleInputChange('discount', e.target.value)}
          variant="outlined"
          margin="normal"
           helperText={
            (selectedPromoCode.discount < 0 || selectedPromoCode.discount > 100)
              ? 'Discount should be between 0 and 100.'
              : ''
          }
          // error={selectedPromoCode.discount !== '' && !validations.discount}
            error={(selectedPromoCode?.discount && selectedPromoCode?.discount.trim() !== '') && !validations.discount}
           InputProps={{
            endAdornment: (selectedPromoCode.discount !== '' && validations.discount) ? (
              <InputAdornment position="end">
                <CheckIcon style={{ color: 'green' }} />
              </InputAdornment>
            ) : null,
          }}
        />
        <TextField
          label="Expiry Date"
          type="date"
          name="expiryDate"
          style={{marginTop:'10px'}}
          value={selectedPromoCode.expiryDate}
          onChange={(e) => handleDateChange(e.target.value)}
          fullWidth
          variant="outlined"
           error={(selectedPromoCode?.expiryDate && selectedPromoCode?.expiryDate.trim() !== '') && !validations.expiryDate}
  helperText={
    (selectedPromoCode?.expiryDate && selectedPromoCode?.expiryDate.trim() !== '') && !validations.expiryDate
      ? 'Should be after the current date.'
      : ''
  }
         InputLabelProps={{
          style: {
            color: validations.expiryDate ? 'green' : 'red',
             fontSize: '18px',
            color: 'gray',
            marginLeft: '5px',
          },
          shrink: true,
        }}
          sx={{ backgroundColor: 'white', borderRadius: '4px' }}
          
        />

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="categories-label">Select Categories</InputLabel>
          <Select
            labelId="categories-label"
            id="categories"
            multiple
            value={selectedCategories}
            onChange={(e) => setSelectedCategories(e.target.value)}
            label="Select Categories"
            fullWidth
            displayEmpty
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormButtonContainer>
          <StyledFormButton onClick={handleAddClick} color="primary" variant="contained" disabled={!validations.name || !validations.discount || !validations.expiryDate || selectedCategories.length === 0} >
            Add
          </StyledFormButton>
          <StyledFormButton
            onClick={() => {
              setSelectedPromoCode({ name: '', expiryDate: '', discount: '' });
              setSelectedCategories([]);
                    setValidations({
                    name: false,
                    discount: false,
                    expiryDate: false,
                  });
            }}
            color="secondary"
            variant="contained"
          >
            Reset
          </StyledFormButton>
        </FormButtonContainer>
      </CenteredFormContainer>
  
      
      
       <Typography class="animate__animated animate__heartBeat" variant="h2" gutterBottom style={{ color: 'black', fontWeight: 'bold',animationIterationCount: 'infinite', animationDelay: '5s'  }}>
          List of Promo Codes
      </Typography>
      <SearchContainer>
          <StyledSearchBar
            label="Search Promo Code"
            fullWidth
            margin="normal"
            variant="outlined"
            value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
           InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleVoiceSearch}>
                <MicIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
          />
        </SearchContainer>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',marginTop:'30px' }}>
      <TableContainer style={{border: '2px solid black', animationDelay:'3s',// Add border styling
  borderRadius: '8px',}} className="animate__animated animate__flash" component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead style={{backgroundColor: 'lightgrey',}}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}> Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Expiry Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Discount (%)</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Applicable Categories</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promocode
              .filter((promo) =>
                promo.code.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((promoCode) => (
              <StyledTableRow key={promoCode.id} style={{ backgroundColor: promoCode.bgColor }}>
                <TableCell>{promoCode.code}</TableCell>
                <TableCell>{promoCode.expiryDate}</TableCell>
                <TableCell>{promoCode.discountPercent}</TableCell>
                <TableCell>{promoCode.applicableProducts.join(', ')}</TableCell>
                <ActionCell>
                  <StyledEditButton onClick={() => handleEditClick(promoCode)}>Edit</StyledEditButton>
                  <StyledDeleteButton onClick={() => handleDeleteClick(promoCode.id)}>
                    Delete
                  </StyledDeleteButton>
                </ActionCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
</div>
      <Dialog open={editDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Promo Code</DialogTitle>
        <DialogContent>
          <TextField
          label="Promo Code Name"
          value={selectedPromoCode.code}
          onChange={(e) => handleInputChange('code', e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Discount (%)"
          value={selectedPromoCode.discountPercent}
          onChange={(e) => handleInputChange('discountPercent', e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
          <TextField
            label="Expiry Date"
            type="date"
            value={selectedPromoCode.expiryDate}
            onChange={(e) => handleDateChange(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="categories-label">Select Categories</InputLabel>
            <Select
              labelId="categories-label"
              id="categories"
              multiple
              value={selectedCategories}
              onChange={(e) => setSelectedCategories(e.target.value)}
              label="Select Categories"
              fullWidth
              displayEmpty
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateClick} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-center" autoClose={4000} />
      </Container>
      </>
  );
};

export default PromoCodeTable;
