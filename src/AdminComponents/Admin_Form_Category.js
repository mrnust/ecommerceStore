import React, { useRef, useEffect } from 'react';
import { Typography, TextField, TextareaAutosize, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import '../App.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../firebaseconfig';
import { getDatabase, ref, get, push, onValue, off, set, remove } from 'firebase/database';



const StyledFormContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'auto',
  opacity: 0,

  animation: 'blinkingEntrance 1.5s ease-in-out forwards', // Combined blinking and entrance animation
  '@keyframes blinkingEntrance': {
    '0%': { opacity: 0 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.7 },
  },
  transition: 'opacity 0.5s ease-in-out',
  '&.visible': {
    opacity: 1,
    animation: 'blinking 1.5s infinite alternate', // Blinking animation
  },
});

const StyledForm = styled('form')({
  width: '80%',
  maxWidth: 400,
  padding: '16px',
  boxShadow: '0px 14px 10px 10px rgba(0, 0, 0, 0.1)', // Add box shadow
  borderRadius: '8px',
});

const StyledButtonContainer = styled(Grid)({
  marginTop: '16px',
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledResetButton = styled(Button)({
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: 'purple',
    color: '#ffffff',
  },
});

const StyledTextarea = styled(TextareaAutosize)({
  width: '93%',
  marginTop: '10px',
  padding: '8px',
  fontSize: '16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  resize: 'vertical',
  minHeight: '100px',
});

const AddCategoryForm = () => {
  const nameInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

    const handleAddCategory = () => {
    const categoryName = nameInputRef.current.value;
    const categoryDescription = descriptionInputRef.current.value;

    if (!categoryName) {
      // alert('Please enter the name of the category.');
      // toast.error('Please enter the name of the category.');
       toast.error('Please enter the name of the category.', { position: 'top-center', className: 'toast-error' });
      return;
    }


    const categoriesRef = ref(database, 'Categories');
    push(categoriesRef, categoryName)
      .then(() => {
        console.log('Category added successfully to the database');
        //alert('Category added successfully...');
        // toast.success('Category added successfully...');

        toast.success('Category added successfully...', { position: 'top-center', className: 'toast-success' });
       
        handleReset();
      })
      .catch((error) => {
        //console.error('Error adding category:', error);
        //  toast.error(`Failed to add category. Error: ${error.message}`);
        // alert(`Failed to add category. Error: ${error.message}`);
         toast.error(`Failed to add category. Error: ${error.message}`, { position: 'top-center', className: 'toast-error' });
      });
      
      handleReset();
  };

  const handleReset = () => {
    if (nameInputRef.current) {
      nameInputRef.current.value = '';
    }

    if (descriptionInputRef.current) {
      descriptionInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const formContainer = document.getElementById('categoryFormContainer');
    if (formContainer) {
      formContainer.classList.add('visible');
    }
  }, []);

  return (
    <StyledFormContainer id="categoryFormContainer">
      <StyledForm>
        <Typography variant="h5" gutterBottom style={{ color: 'black', fontWeight: 'bold' }}>
          Add Category
        </Typography>
        <TextField
          label="Enter name of a category"
          fullWidth
          margin="normal"
          variant="outlined"
          inputRef={nameInputRef}
        />
        <StyledTextarea rowsMin={5} placeholder="Description of a category" ref={descriptionInputRef} />
        <StyledButtonContainer container>
          <Button variant="contained" color="primary" onClick={handleAddCategory}>
            Add Category
          </Button>
          <StyledResetButton variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </StyledResetButton>
        </StyledButtonContainer>
      </StyledForm>
       <ToastContainer position="top-center" autoClose={4000} />
    </StyledFormContainer>
  );
};

export default AddCategoryForm;
