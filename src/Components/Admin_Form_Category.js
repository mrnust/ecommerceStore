import React, { useRef } from 'react';
import { Typography, TextField, TextareaAutosize, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import '../App.css'; 

const StyledFormContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'auto',


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
    color: '#ffffff'
  },
});
const StyledTextarea = styled(TextareaAutosize)({
  width: '93%',
  marginTop: '10px',
  padding: '8px',
  fontSize: '16px', // Increase font size
  borderRadius: '4px',
  border: '1px solid #ccc',
  resize: 'vertical',
  minHeight: '100px', 
});

const AddCategoryForm = () => {

  const nameInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  const handleAddCategory = () => {
    alert("Item added.....")
  };

  const handleReset = () => {
    // Handle reset logic here
     if (nameInputRef.current) {
    nameInputRef.current.value = '';
  }

  if (descriptionInputRef.current) {
    descriptionInputRef.current.value = '';
  }
  };

  return (
    <StyledFormContainer>
      <StyledForm>
        <Typography variant="h5"  gutterBottom style={{ color: 'black',fontWeight: 'bold' }}>
          Add Category
        </Typography>
        <TextField label="Enter name of a category" fullWidth margin="normal" variant="outlined" inputRef={nameInputRef}/>
        <StyledTextarea rowsMin={5} placeholder="Description of a category" ref={descriptionInputRef}/>
        <StyledButtonContainer container>
          <Button variant="contained" color="primary" onClick={handleAddCategory}>
            Add Category
          </Button>
          <StyledResetButton variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </StyledResetButton>
        </StyledButtonContainer>
      </StyledForm>
    </StyledFormContainer>
  );
};

export default AddCategoryForm;
