import React, { useRef, useState, useEffect } from 'react';
import { Typography, TextareaAutosize, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { toast, ToastContainer } from 'react-toastify';
import { database } from '../firebaseconfig';
import { getDownloadURL } from 'firebase/storage';
import { ref, get, onValue, off, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Carousel from 'react-material-ui-carousel';
import VerticalNavbar from './Admin_navbar';

const StyledSliderContainer = styled('div')({
  width: '80%',
  margin: 'auto',
  textAlign: 'center',
  marginTop: '50px',
});

const StyledSliderImage = styled('img')({
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
});

const StyledFormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  marginTop: '30px',
  
});

const StyledForm = styled('form')({
  width: '95%',
  padding: '16px',
 boxShadow: '0 4px 8px grey',
  borderRadius: '8px',
  marginTop: '30px',
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

const SliderComponent = ({ images }) => {
  return (
    <StyledSliderContainer>
      <Carousel>
        {images.map((imageUrl, index) => (
          <StyledSliderImage key={index} src={imageUrl} alt={`Slider Image ${index}`} />
        ))}
      </Carousel>
    </StyledSliderContainer>
  );
};

const validExtensions = ['.jpg', '.jpeg', '.png'];


const Slider = () => {
  const imageInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    const imageRef = ref(database, 'Images/Slider');

    const handleData = async (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        const imageUrls = await Promise.all(
          Object.values(data).map(async (imageName) => {
            const imageUrl = await getDownloadURL(storageRef(getStorage(), imageName));
            return imageUrl;
          })
        );

        setSliderImages(imageUrls);
      } else {
        setSliderImages([]);
      }
    };

    onValue(imageRef, handleData);

    return () => {
      off(imageRef, 'value', handleData);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check the file extension
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!validExtensions.includes(`.${fileExtension}`)) {
        toast.error('Invalid file type. Please upload an image with extension .jpg, .jpeg, or .png.', {
          position: 'top-center',
          className: 'toast-error',
        });
        setSelectedImage(null);
        return;
      }

      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedImage || !descriptionInputRef.current.value) {
      toast.error('Please fill all fields...', {
        position: 'top-center',
        className: 'toast-error',
      });
      return;
    }

    try {
      const storage = getStorage();
      const uniqueFilename = `${uuidv4()}.jpg`;
      const imageRef = storageRef(storage, `images/slider/${uniqueFilename}`);

      await uploadBytes(imageRef, selectedImage);

      const imagesRef = ref(database, 'Images/Slider');
      const snapshot = await get(imagesRef);

      const currpath = `images/slider/${uniqueFilename}`;

      if (snapshot.exists()) {
        const imageData = snapshot.val();
        const imgpath = imageData ? Object.values(imageData).map((image) => image) : [];

        imgpath.push(currpath);

        await set(imagesRef, imgpath);

        toast.success('Image added to Slider', {
          position: 'top-center',
          className: 'toast-success',
        });
      } else {
        const imgpath = [currpath];

        await set(imagesRef, imgpath);

        toast.success('Image added to Slider', {
          position: 'top-center',
          className: 'toast-success',
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image', {
        position: 'top-center',
        className: 'toast-error',
      });
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }

    if (descriptionInputRef.current) {
      descriptionInputRef.current.value = '';
    }
    setSelectedImage(null);
  };

  const handleReset = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }

    if (descriptionInputRef.current) {
      descriptionInputRef.current.value = '';
    }
    setSelectedImage(null);
  };

  return (
    <>
      <VerticalNavbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <StyledFormContainer style={{marginBottom:'20px'}} className="visible">
      <SliderComponent images={sliderImages} />
      <StyledForm className="animate__animated animate__rotateIn">
        <Typography
          class="animate__animated animate__bounce"
          variant="h4"
          gutterBottom
          style={{ color: 'black', fontWeight: 'bold' }}
        >
          Adjust Slidings
        </Typography>

        <StyledLabel>
          {selectedImage ? `Selected image: ${selectedImage.name}` : 'Upload an image of the slider here.'}
          <StyledInputFile
            type="file"
            accept="image/*"
            ref={imageInputRef}
            id="image-upload"
            onChange={handleFileChange}
          />
          <StyledFileUploadText htmlFor="image-upload">Choose File</StyledFileUploadText>
        </StyledLabel>
        <StyledTextarea rowsMin={5} placeholder="Description" ref={descriptionInputRef} />
        <StyledButtonContainer container>
          <Button variant="contained" color="primary" onClick={handleAddProduct}>
            Confirm
          </Button>
          <StyledResetButton variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </StyledResetButton>
        </StyledButtonContainer>
      </StyledForm>
      <ToastContainer position="top-center" autoClose={400} />
        </StyledFormContainer>
        </div>
      </>
  );
};

export default Slider;
