import React, { useRef, useState, useEffect } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  Typography,
  TextField,
  TextareaAutosize,
  Button,
  Grid,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@mui/system';
import { database } from '../firebaseconfig';
import { getDatabase, ref, get, push, onValue, off, set, remove } from 'firebase/database';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { InputAdornment, IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { ContentCutOutlined } from '@mui/icons-material';
import VerticalNavbar from './Admin_navbar';



const StyledFormContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'auto',

  boxShadow: '5px 5px 5px 5px rgba(0, 0, 0, 0.1)',
  // '@keyframes blinkingEntrance': {
  //   '0%': { opacity: 0, boxShadow: '5px 5px 5px 5px rgba(0, 0, 0, 0.1)' },
  //   '50%': { opacity: 1, boxShadow: '8px 8px 8px 8px rgba(0, 0, 0, 0.1)' },
  //   '100%': { opacity: 0.7, boxShadow: '5px 5px 5px 5px rgba(0, 0, 0, 0.1)' },
  // },
  // transition: 'opacity 0.5s ease-in-out, box-shadow 0.3s ease-in-out',
  // '&.visible': {
  //   opacity: 1,
  //   animation: 'blinking 1.5s infinite alternate',
  // },
});

const StyledForm = styled('form')({
  width: '100%',
  maxWidth: 400,
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px grey'
});

const shakeAnimation = `@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}`;

const StyledShakingInput = styled(TextField)({
  '&.shake': {
    animation: `${shakeAnimation} 0.5s ease-in-out`,
  },
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
  transition: 'border-color 0.3s ease-in-out',
  '&:focus': {
    borderColor: 'purple',
  },
  '&:hover': {
    borderColor: 'purple',
  },
});


const StyledTableContainer = styled(TableContainer)({
  marginTop: '20px',
  width: '100%', // Make the table container full-width,,
  overflowX:'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center', // Center vertically
});
const StyledTable = styled(Table)({
  width: '100%',
  maxWidth: '1200px', // Set a maximum width for the table
  margin: 'auto', // Center the table
  border: '2px solid black', // Add border styling
  borderRadius: '8px',

});


const StyledTableHead = styled(TableHead)({
  backgroundColor: 'lightgrey',
});

const StyledTableRow = styled(TableRow)({
  // '&:hover': {
  //   backgroundColor: '#f5f5f5',
  // },
    '&:hover': {
    backgroundColor: '#f5f5f5',
    transform: 'translateY(-5px)', // Add translation effect on hover
    transition: 'transform 0.3s ease', // Add a smooth transition effect
  },
});

const StyledTableHeaderCell = styled(TableCell)({
  fontWeight: 'bold',
});

const StyledTableBodyCell = styled(TableCell)({
  fontSize: '16px',
});

  const CenteredContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
    minHeight: '100vh', // This ensures the container takes at least the full height of the viewport
  marginTop:'100px'
});



const StyledActionButton = styled(Button)({
  marginRight: '8px',
  '&.update': {
    backgroundColor: 'blue',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: 'darkblue',
    },
  },
  '&.delete': {
    backgroundColor: '#777777',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: 'darkgrey',
    },
  },
});


const AddProductForm = () => {

   const { transcript, listening, resetTranscript, startListening, stopListening,onEnd } = useSpeechRecognition();

  const [isDescriptionValid, setIsDescriptionValid] = useState(false);

    const [isNameValid, setIsNameValid] = useState(false);
  const [isPriceValid, setIsPriceValid] = useState(false);
  const [isStockValid, setIsStockValid] = useState(false);
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [stockError, setStockError] = useState('');

  
  const formContainerRef = useRef(null);
  const nameInputRef = useRef(null);
  const [category, setCategory] = useState('');
  const imageInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [cate, setcat] = useState([]);
  const [products, setProducts] = useState([]);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState(0);
  const [updatedQuantity, setUpdatedQuantity] = useState(0);
  const [updatedCategory, setUpdatedCategory] = useState('');
    const updatedDescriptionInputRef = useRef(null);
  const [imagePaths, setImagePaths] = useState([]);
      const [categoryFilter, setCategoryFilter] = useState('ALL');

const handleFileChange = (e) => {
    const files = e.target.files;
    console.log(files);
    if (files) {
      setSelectedImages([...selectedImages, ...files]);
    }
  };


  //  const handleVoiceSearch = () => {
  //   if (listening) {
  //     SpeechRecognition.stopListening();
  //   } else {
  //     SpeechRecognition.startListening();
      
  //    }
     
  //     handleSearchByVoice();
  
    
  //   }

  // const handleSearchByVoice = () => {
  //   console.log("transcript", transcript)
  //   setSearchTerm(transcript);
  //   resetTranscript();
  // };



// ...

// ...

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

const isAlpha = (str) => /^[a-zA-Z]+$/.test(str);
  

  const handleAddProduct = async () => {

    if (
      !nameInputRef.current.value ||
      !category ||
      !descriptionInputRef.current.value ||
      !price ||
      !stock
    ) {
      toast.error('Please enter all input fields...', {
        position: 'top-center',
        className: 'toast-error',
      });
      nameInputRef.current.classList.add('shake');
      return;
    }
 const name = nameInputRef.current.value;
    const priceNumber = parseFloat(price);
    const stockNumber = parseInt(stock, 10);
    const pid = uuidv4();



    // Check for minimum product name length
  if (!isAlpha(name) || name.length < 3) {
    setNameError('Name should contain only alphabets and be at least 3 characters long');
    setIsNameValid(false);
    return;
  } else {
    setNameError('');
    setIsNameValid(true);
  }

  

    // Check for negative price
    if (priceNumber < 0) {
      setPriceError('Price cannot be negative');
      setIsPriceValid(false);
    } else {
      setPriceError('');
      setIsPriceValid(true);
    }

    // Check for negative stock
    if (stockNumber < 0) {
      setStockError('Stock cannot be negative');
      setIsStockValid(false);
    } else {
      setStockError('');
      setIsStockValid(true);
    }


    
    const productDetails = {
      productID: pid,
      productName: nameInputRef.current.value,
      productCategory: category,
      productDescription: descriptionInputRef.current.value,
      productPrice: priceNumber,
      productStock: stockNumber,
      productHasReviews: false,
      productRating: 0,
      productContainsImages: !!selectedImages,
    };
    
    const proref = ref(database, `Products/${pid}`);

set(proref, productDetails)
  .then(() => {
    console.log('Prdouct added..')
    toast.success('Product added successfully...', {
      position: 'top-center',
      className: 'toast-success',
    });
    console.log(pid)
  })
  .catch((error) => {
    console.error('Error adding product:', error);
    toast.error('Failed to add product', {
      position: 'top-center',
      className: 'toast-error',
    });
  });

    console.log(selectedImages)
let uploadedImagePaths = [];
       try {
      if (selectedImages.length > 0) {
        const storage = getStorage();
        const imagePromises = selectedImages.map(async (image, index) => {
          const uniqueFilename = `${uuidv4()}_${index}.jpg`;
          const imageRef = storageRef(storage, `images/products/${pid}/${uniqueFilename}`);
          await uploadBytes(imageRef, image);
          // -----
          const imagePath = `images/products/${pid}/${uniqueFilename}`;
          uploadedImagePaths.push( imagePath );
          // console.log(uploadedImagePaths);
        });

         console.log('uploadimages,', uploadedImagePaths);
        // ----
        // const uploadedImagePaths = await Promise.all(imagePromises);
        setImagePaths(uploadedImagePaths);

        await Promise.all(imagePromises);

        toast.success('Images uploaded successfully', {
          position: 'top-center',
          className: 'toast-success',
        });
        console.log('Images uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error uploading images', {
        position: 'top-center',
        className: 'toast-error',
      });
    }
    

    const imagesRef = ref(database, `Images/Products/${pid}`);
    // const imagesData = uploadedImagePaths.map((path, index) => ({ index, path }));
    console.log(uploadedImagePaths)
   set(imagesRef, uploadedImagePaths)
      .then(() => {
        console.log('Image paths pushed to Images/Products/pid...');
        toast.success('Images added to Img table', {
        position: 'top-center',
        className: 'toast-success',
      });
      })
      .catch((error) => {
        console.error('Error pushing image paths to Images/Products/pid:', error);
        toast.error('Failed to add images to Img table', {
        position: 'top-center',
        className: 'toast-error',
      });
      });
         
    handleReset();
    
  };

  const handleReset = () => {
    if (nameInputRef.current) {
      nameInputRef.current.value = '';
    }

    setCategory('');
    // setSelectedImage(null);
setSelectedImages([])

    setPrice('');
    setStock('');
    if (descriptionInputRef.current) {
      descriptionInputRef.current.value = '';
    }
  };

    const handleOpenUpdateDialog = (product) => {
    setSelectedProduct(product);
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setSelectedProduct({});
    setIsUpdateDialogOpen(false);
  };




  useEffect(() => {
    formContainerRef.current.classList.add('visible');
  }, []);

  useEffect(() => {
    const todoRef = ref(database, 'Categories');
    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categories = Object.values(data);
        setcat(categories);
      } else {
        setcat([]);
      }
    };

    onValue(todoRef, handleData);

    return () => {
      off(todoRef, 'value', handleData);
    };
  }, []);






  const handleUpdateProduct = (product) => {
     
    setSelectedProduct(product);
    setUpdatedName(product.productName);
    setUpdatedPrice(product.productPrice);
    setUpdatedQuantity(product.productStock);
    setUpdatedCategory(product.productCategory);

    //  setSelectedProduct(product);
     console.log(selectedProduct);
    setIsUpdateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProduct({});
    setIsUpdateDialogOpen(false);
  };

  const handleSaveChanges = async () => {

    console.log(selectedProduct.id);

    const updatedPriceFloat = parseFloat(updatedPrice);
    const updatedStock=Number(updatedQuantity)
     const productRef = ref(database, `Products/${selectedProduct.id}`);

    // Fetch the current data from the database
    get(productRef)
      .then((snapshot) => {
        const currentData = snapshot.val();

        // Merge the current data with the changes
         const updatedProduct = {
        ...currentData,
        productName: updatedName,
        productPrice: updatedPriceFloat,
        productStock: updatedStock,
        productCategory: updatedCategory,
        productDescription: updatedDescriptionInputRef.current.value,
      };

      console.log('Updated Product:', updatedProduct);
        // Update the product in the database
        return set(productRef, updatedProduct);
      })
      .then(() => {
        console.log(`Product ID ${selectedProduct.id} has been successfully updated.`);
         toast.success(`Product ID ${selectedProduct.id} has been successfully updated.`, { position: 'top-center', className: 'toast-success' });
        
      })
      .catch((error) => {
        console.error(`Error updating product ID ${selectedProduct.id}:`, error);
         toast.error(`Error updating product ID ${selectedProduct.id}:`, { position: 'top-center', className: 'toast-error' });
      });

    

      setSelectedProduct({});
     setIsUpdateDialogOpen(false);
  };
   
 

  const handleDeleteProduct = async (productId) => {
    
    try {
        const promoCodesRef = ref(database, `Products/${productId}`);

  // Remove the promo code with the specified id
  await remove(promoCodesRef);

    // alert(`Promo code with id ${promoCodeId} deleted successfully`);
     toast.success(`Product with id ${productId} deleted successfully`, { position: 'top-center', className: 'toast-success' });
    }
    catch (e) {
       toast.error(`Error while deleting  ${productId}`, { position: 'top-center', className: 'toast-error' });
       console.log('failed to delete', e)
    }
   
  };




    useEffect(() => {
    const productRef = ref(database, 'Products');
    const handleProductData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
          const productList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setProducts(productList);
        console.log(products);
      } else {
        setProducts([]);
      }
    };

    onValue(productRef, handleProductData);

    return () => {
      off(productRef, 'value', handleProductData);
    };
    }, []);
  
   const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on the search term
const filteredProducts = products.filter((product) => {
  const matchesSearchTerm = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = categoryFilter === 'ALL' || product.productCategory === categoryFilter;
  return matchesSearchTerm && matchesCategory;
});

  
  
  
  return (
    <>
      <VerticalNavbar/>
      <CenteredContainer>
      <StyledFormContainer className="animate__animated animate__rotateIn" ref={formContainerRef}>
        <StyledForm>
          <Typography class="animate__animated animate__bounce" variant="h3" gutterBottom style={{ color: 'black', fontWeight: 'bold' }}>
            Add Product
          </Typography>
         <StyledShakingInput
  label="Enter name of product"
  fullWidth
  margin="normal"
  variant="outlined"
  inputRef={nameInputRef}
   onChange={(e) => {
        // Validate product name length
        const name = e.target.value;
        if (!isAlpha(name) || name.length < 3) {
          setNameError('Name should contain only alphabets and be at least 3 characters long');
          setIsNameValid(false);
        } else {
          setNameError('');
          setIsNameValid(true);
        }
      }}
  error={!!nameError}
  helperText={nameError}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        {nameInputRef.current && nameInputRef.current.value.length >= 3 && (
          <>
            {isNameValid ? (
              <CheckCircleOutlineIcon style={{ color: 'green' }} />
            ) : (
              <CancelIcon style={{ color: 'red' }} />
            )}
          </>
        )}
      </InputAdornment>
    ),
  }}
/>
          <StyledLabel>
        <StyledShakingInput
  label="Enter price"
  fullWidth
  margin="normal"
  variant="outlined"
  type="number"
  inputProps={{ step: '0.01' }}
  value={price}
  onChange={(e) => {
    // Validate price
    const priceValue = parseFloat(e.target.value);
    if (priceValue <= 0 ) {
      setPriceError('Price cannot be negative and zero');
      setIsPriceValid(false);
    } else {
      setPriceError('');
      setIsPriceValid(true);
    }
    setPrice(e.target.value);
  }}
  error={!!priceError}
  helperText={priceError}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        {price && isPriceValid && <CheckCircleOutlineIcon style={{ color: 'green' }} />}
        {price && !isPriceValid && priceError && <CancelIcon style={{ color: 'red' }} />}
      </InputAdornment>
    ),
  }}
/>
     <StyledShakingInput
  label="Enter stock"
  fullWidth
  margin="normal"
  variant="outlined"
  type="number"
  value={stock}
  onChange={(e) => {
    // Validate stock
    const stockValue = parseInt(e.target.value, 10);
    if (stockValue <= 0) {
      setStockError('Stock cannot be negative and zero');
      setIsStockValid(false);
    } else {
      setStockError('');
      setIsStockValid(true);
    }
    setStock(e.target.value);
  }}
  error={!!stockError}
  helperText={stockError}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        {stock && isStockValid && <CheckCircleOutlineIcon style={{ color: 'green' }} />}
        {stock && !isStockValid && stockError && <CancelIcon style={{ color: 'red' }} />}
      </InputAdornment>
    ),
  }}
/>

            <Select
              style={{ marginTop: '10px' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
              fullWidth
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Select category
              </MenuItem>
              {cate.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </StyledLabel>
          <StyledLabel>
        {selectedImages.length > 0
  ? `Selected image${selectedImages.length === 1 ? '' : 's'}: ${selectedImages.length} file${selectedImages.length === 1 ? '' : 's'}`
  : 'Upload images of the product here.'}
        <StyledInputFile
          type="file"
          accept="image/*"
          ref={imageInputRef}
          id="image-upload"
          onChange={handleFileChange}
          multiple // Enable multiple file selection
        />
        <StyledFileUploadText htmlFor="image-upload">Choose Files</StyledFileUploadText>
      </StyledLabel>

          <StyledTextarea
            rowsMin={5}
            placeholder="Description of product"
            ref={descriptionInputRef}
             onChange={(e) => {
            // Validate description length
            const description = e.target.value;
            if (description.length === 0) {
              setIsDescriptionValid(false);
            } else {
              setIsDescriptionValid(true);
            }
          }}
          />
          <StyledButtonContainer container>
            <Button  variant="contained" color="primary" onClick={handleAddProduct}  disabled={
              !(
                  isNameValid &&
                  isPriceValid &&
                  isStockValid &&
                  nameInputRef.current.value.trim() !== '' &&
                  price.trim() !== '' &&
                  stock.trim() !== '' &&
                  category !== '' &&
                  selectedImages.length > 0 &&
                  descriptionInputRef.current.value.trim() !== ''
                )
            }>
              Add Product
            </Button>
            <StyledResetButton variant="outlined" color="secondary" onClick={handleReset} >
              Reset
            </StyledResetButton>
          </StyledButtonContainer>

        </StyledForm>

      </StyledFormContainer>
 
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <StyledTableContainer style={{ marginTop: '100px' }}>
         <TextField
        id="searchProduct"
        label="Search Product"
        fullWidth
        margin="normal"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
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
        <Select
            style={{ marginTop: '60px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            displayEmpty
            fullWidth
            variant="outlined"
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {cate.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        
         <Typography class="animate__animated animate__heartBeat" variant="h2" gutterBottom style={{marginTop:'50px', color: 'black', fontWeight: 'bold',animationIterationCount: 'infinite', animationDelay: '5s' }}>
            List of  Products
          </Typography>
          <StyledTable style={{marginBottom:'20px',marginTop:'20px',animationDelay:'3s'}} className="animate__animated animate__flash">
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>Name</StyledTableHeaderCell>
                <StyledTableHeaderCell>Price</StyledTableHeaderCell>
                <StyledTableHeaderCell>Category</StyledTableHeaderCell>
                <StyledTableHeaderCell>Stock</StyledTableHeaderCell>
                <StyledTableHeaderCell>Action</StyledTableHeaderCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <StyledTableRow key={product.id}>
                  <StyledTableBodyCell>{product.productName}</StyledTableBodyCell>
                  <StyledTableBodyCell>{product.productPrice}</StyledTableBodyCell>
                  <StyledTableBodyCell>{product.productCategory}</StyledTableBodyCell>
                  <StyledTableBodyCell>{product.productStock}</StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <StyledActionButton
                      className="update"
                      onClick={() => handleUpdateProduct(product)}
                    >
                      Update
                    </StyledActionButton>
                    <StyledActionButton
                      className="delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </StyledActionButton>
                  </StyledTableBodyCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
</div>
       <Dialog open={isUpdateDialogOpen} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            id="updateProductName"
            label="Product Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            
            
          />
          <TextField
            id="updateProductPrice"
            label="Product Price"
            fullWidth
            margin="normal"
            variant="outlined"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)}
            
            
            type="number"
            InputProps={{ step: '0.01' }}
          />
          <TextField
            id="updateProductStock"
            label="Product Stock"
            fullWidth
            margin="normal"
            variant="outlined"
            value={updatedQuantity}
            onChange={(e) => setUpdatedQuantity(e.target.value)}
            
            // InputLabelProps={{ shrink: !!selectedProduct?.productStock }}
            
            type="number"
          />
          <Select
            label="Product Category"
            value={updatedCategory}
            onChange={(e) => setUpdatedCategory(e.target.value)}
            displayEmpty
            fullWidth
            variant="outlined"
          >
            <MenuItem value="" disabled>
              Select category
            </MenuItem>
            {cate.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
          <TextareaAutosize
            id="updateProductDescription"
            placeholder="Product Description"
            rowsMin={5}
            ref={updatedDescriptionInputRef}
            style={{ width: '93%',
            marginTop: '10px',
            padding: '8px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            resize: 'vertical',
            minHeight: '100px',
            transition: 'border-color 0.3s ease-in-out',
            '&:focus': {
              borderColor: 'purple',
            },
            '&:hover': {
              borderColor: 'purple',
            },}}
            defaultValue={selectedProduct?.productDescription}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-center" autoClose={400} />
      </CenteredContainer>
      </>
  );
};

export default AddProductForm;
