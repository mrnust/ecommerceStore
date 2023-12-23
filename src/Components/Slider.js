import React, { useRef,useState } from 'react';
import { Typography, TextareaAutosize, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';

const StyledFormContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
    minHeight: 'auto',

});

const StyledForm = styled('form')({
  width: '95%',
//   maxWidth: 400,
  padding: '16px',
  boxShadow: '5px 5px 5px 5px rgba(0, 0, 0, 0.1)',
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

const StyledLabel = styled('label')({
  display: 'block',
  marginTop: '10px',
    fontSize: '16px',
  color: 'rgba(0, 0, 0, 0.87)',
});

const StyledInputFile = styled('input')({
  display: 'none',
});

const StyledFileUploadText = styled('span')({
  cursor: 'pointer',
  textDecoration: 'underline',
  color: 'blue',
    marginLeft: '5px',
//   display: 'inline',
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

const Slider = () => {

  const imageInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file.name);
    } else {
      setSelectedImage(null);
    }
  };
    const handleAddProduct = () => {
      if ( !selectedImage || !descriptionInputRef.current.value) {
      alert('Please fill in all required fields.');
      return;
    }
    alert('Product added...');
    // Handle add product logic here
  };

  const handleReset = () => {
    // Handle reset logic here
    

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }

    if (descriptionInputRef.current) {
      descriptionInputRef.current.value = '';
      }
      setSelectedImage(null);
  };

  return (
    <StyledFormContainer>
      <StyledForm>
        <Typography variant="h5" gutterBottom style={{ color: 'black', fontWeight: 'bold' }}>
          Adjust Slidings 
        </Typography>
        
        <StyledLabel>
          {selectedImage ? `Selected image: ${selectedImage}` : 'Upload an image of the product here.'}
          <StyledInputFile
          
            type="file"
            accept="image/*"
            ref={imageInputRef}
            id="image-upload"
            onChange={handleFileChange}
          />
          <StyledFileUploadText htmlFor="image-upload">Choose File</StyledFileUploadText>
        </StyledLabel>
        <StyledTextarea
          rowsMin={5}
          placeholder="Description"
          ref={descriptionInputRef}
        />
        <StyledButtonContainer container>
          <Button variant="contained" color="primary" onClick={handleAddProduct}>
            Confirm
          </Button>
          <StyledResetButton variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </StyledResetButton>
        </StyledButtonContainer>
      </StyledForm>
    </StyledFormContainer>
  );
};

export default Slider;