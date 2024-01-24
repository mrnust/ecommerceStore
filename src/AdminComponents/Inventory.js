import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from '@mui/icons-material/Mic';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../firebaseconfig';
import { getDatabase, ref, get,onValue,off,set } from 'firebase/database';
import VerticalNavbar from './Admin_navbar';

const CenterContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
});

const Heading = styled('h2')({
  marginBottom: '20px',
  color: 'black',
});

const StyledTableContainer = styled(TableContainer)({
  margin: '20px',
  overflowX: 'auto',
});

const StyledTable = styled(Table)({
  width: '100%',
  maxWidth: '1200px',
  margin: 'auto',
  border: '2px solid black', // Add border styling
  borderRadius: '8px',
});

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
});

const InteractiveButton = styled(Button)({
  '&:hover': {
    backgroundColor: (theme) => theme.palette.primary.dark,
  },
});

const SearchContainer = styled('div')({
  margin: '20px',
  width: '100%',
});

const CardContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '20px',
});

const StyledCard = styled(Card)({
  width: 290,
  height: 250,
  boxShadow: '0 10px 18px rgba(0, 0, 0, 0.1)',
  border: '0.5px solid #dfd9d9',
  margin: '10px',
});

const StyledCardMedia = styled(CardMedia)({
  height: 140,
});

const UpdateButton = styled(InteractiveButton)({
  marginTop: '10px',
});

const EditContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '20px',
});

const EditTextField = styled(TextField)({
  margin: '10px',
});

const SaveButton = styled(Button)({
  marginTop: '10px',
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

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
const { transcript, listening, resetTranscript, startListening, stopListening,onEnd } = useSpeechRecognition();
  
  const handleRestock = (productId) => {

    const productRef = ref(database, `Products/${productId}/productStock`);
    let updatedStock;
      get(productRef)
    .then((snapshot) => {
      const currentStock = snapshot.val();
      updatedStock = Number( currentStock) + 10;

      return set(productRef, updatedStock);
    })
    .then(() => {
      console.log(`Product ID ${productId} stock has been successfully updated.`);
      // alert(`Product ID ${productId} has been restocked. New stock: ${updatedStock}`);
      toast.success(`Product ID ${productId} has been restocked. New stock: ${updatedStock}`, { position: 'top-center', className: 'toast-success' });
    })
    .catch((error) => {
      console.error(`Error updating product ID ${productId} stock:`, error);
      toast.error(`Error updating product ID ${productId} stock:`, { position: 'top-center', className: 'toast-error' });
    });
    // if (productIndex !== -1) {
    //   const updatedInventory = [...inventoryData];
    //   updatedInventory.splice(productIndex, 1);

    //   alert(`Product ID ${productId} has been restocked.`);
    //   setInventoryData(updatedInventory);

    //   removeProductPermanently(productId);
    // }

    // const todoref = ref(database, 'Products');
    // const array={
    //   productCategory: "Cars",
    //   productContainsImages: true,
    //   productDescription: "Ford model 2022",
    //   productHasReviews: false,
    //   productId: "00f68e67-d31b-48a4-9b4b-d29787b971ga1",
    //   productName: "Ford",
    //   productPrice: 37500,
    //   productRating: 0,
    //   productStock: 4,

    // }
    //   push(todoref, array);
  };

  const removeProductPermanently = (productId) => {
    console.log(`Product ID ${productId} has been permanently removed.`);
  };

  const handleUpdate = (productId) => {
    handleRestock(productId);
    // const productToUpdate = inventoryData.find((product) => product.id === productId);
    // setSelectedProduct({...productToUpdate});
    // setIsEditing(true);

     handleProductRestocked(productId);
  };






const handleProductRestocked = (productId) => {
  // Remove the restocked product from the displayed cards
  const updatedSearchResults = searchResults.filter((product) => product.id !== productId);
  setSearchResults(updatedSearchResults);
  setSearchTerm('');
  };
  

 const handleSaveChanges = () => {
   if (selectedProduct) {
    const { id, productName, productCategory, productPrice, productStock } = selectedProduct;

    // Reference to the specific product node in the database
    const productRef = ref(database, `Products/${id}`);

    // Fetch the current data from the database
    get(productRef)
      .then((snapshot) => {
        const currentData = snapshot.val();

        // Merge the current data with the changes
        const updatedProduct = {
          ...currentData,
          productName,
          productCategory,
          productPrice,
          productStock
          // Omit other attributes that you don't want to modify
        };

        // Update the product in the database
        return set(productRef, updatedProduct);
      })
      .then(() => {
        console.log(`Product ID ${id} has been successfully updated.`);
         toast.success(`Product ID ${id} has been successfully updated.`, { position: 'top-center', className: 'toast-success' });
        
      })
      .catch((error) => {
        console.error(`Error updating product ID ${id}:`, error);
         toast.error(`Error updating product ID ${id}:`, { position: 'top-center', className: 'toast-error' });
      });

    setIsEditing(false);
    setSelectedProduct(null);

     const updatedSearchResults = searchResults.map((product) =>
          product.id === id ? { ...product, ...selectedProduct } : product
        );
        setSearchResults(updatedSearchResults);
  }

};














  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    const results = inventoryData.filter(
      (product) =>
        product.productName.toLowerCase().includes(term.toLowerCase()) ||
        product.productCategory.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(results);
  };

  // useEffect(() => {
  //   const intervalId = setInterval(updateRowColors, 5000);

  //   return () => clearInterval(intervalId);
  // }, []);

  // const updateRowColors = () => {
  //   const rows = document.querySelectorAll('.colored-row');

  //   rows.forEach((row, index) => {
  //     const color = index % 2 === 0 ? 'lightgray' : 'white';
  //     row.style.backgroundColor = color;
  //   });
  // };









  useEffect(() => {

    const todoRef = ref(database, 'Products');

    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filteredProducts = Object.keys(data)
        .map((key) => ({ id: key, ...data[key] }))
        .filter((product) => product.productStock < 7);

      setInventoryData(filteredProducts);
      console.log(filteredProducts);
      } else {
        setInventoryData([]);
      }
    };
    
    // Attach an event listener to update the state when data changes in the database
    onValue(todoRef, handleData);

    return () => {

      off(todoRef, 'value', handleData);
    };
    
  }, []);




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
   const results = inventoryData.filter(
      (product) =>
        product.productName.toLowerCase().includes(transcript.toLowerCase()) ||
        product.productCategory.toLowerCase().includes(transcript.toLowerCase())
    );

    setSearchResults(results);
}, [transcript]);





  return (
    <>
      <VerticalNavbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',marginTop:'100px' }}>
    <CenterContainer>
      <SearchContainer >
        <TextField 
          label="Search by product name or category"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
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
      {isEditing ? (
  <EditContainer style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
    <Typography variant="h4" style={{ color: 'black' }}>
      Edit Product
    </Typography>
    <EditTextField
      label="Product Name"
      variant="outlined"
      value={selectedProduct.productName}
      fullWidth
      onChange={(e) =>
        setSelectedProduct((prevProduct) => ({
          ...prevProduct,
          productName: e.target.value,
        }))
      }
    />
    <EditTextField
      label="Product Category"
      variant="outlined"
      value={selectedProduct.productCategory}
      fullWidth
      onChange={(e) =>
        setSelectedProduct((prevProduct) => ({
          ...prevProduct,
          productCategory: e.target.value,
        }))
      }
    />
    <EditTextField
      label="Product Price"
      variant="outlined"
      value={selectedProduct.productPrice}
      fullWidth
      onChange={(e) =>
        setSelectedProduct((prevProduct) => ({
          ...prevProduct,
          productPrice: e.target.value,
        }))
      }
    />
    <EditTextField
      label="Product Stock"
      variant="outlined"
      value={selectedProduct.productStock}
      fullWidth
      onChange={(e) =>
        setSelectedProduct((prevProduct) => ({
          ...prevProduct,
          productStock: e.target.value,
        }))
      }
          />


          <SaveButton variant="contained" color="primary" onClick={handleSaveChanges}>
            Save Changes
          </SaveButton>
        </EditContainer>
      ) : (
        searchTerm !== '' && (
          <CardContainer>
            {searchResults.map((product) => (
            <StyledCard key={product.id}>
             
              <CardContent>
                <Typography variant="h6">Product ID: {product.productId}</Typography>
                <Typography>
                  <strong>Name:</strong> {product.productName}
                </Typography>
                <Typography>
                  <strong>Category:</strong> {product.productCategory}
                </Typography>
                <Typography>
                  <strong>Price:</strong> {product.productPrice}
                </Typography>
                <Typography>
                  <strong>Stock:</strong> {product.productStock}
                </Typography>
                <UpdateButton variant="contained" color="primary" onClick={() => handleUpdate(product.id)}>
                    {/* Update */}
                    Restock
                </UpdateButton>
              </CardContent>
            </StyledCard>
          ))}
          </CardContainer>
        )
      )}

      <Typography class="animate__animated animate__heartBeat" variant="h2" gutterBottom style={{ color: 'black', fontWeight: 'bold',animationIterationCount: 'infinite', animationDelay: '5s'  }}>
          Items to be restocked
        </Typography>
      <StyledTableContainer component={Paper}>
        <StyledTable style={ {marginTop:'30px',animationDelay:'3s'}} className="animate__animated animate__flash" size="small" aria-label="Inventory Table">
          <TableHead>
            <TableRow style={{backgroundColor:'lightgrey'}}>
              <StyledTableCell>Product ID</StyledTableCell>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Stock</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((row, index) => (
              <StyledTableRow key={row.id} className="colored-row">
                <TableCell>{row.productID}</TableCell>
                <TableCell>{row.productName}</TableCell>
                <TableCell>{row.productCategory}</TableCell>
                <TableCell>{row.productPrice}</TableCell>
                <TableCell>{row.productStock}</TableCell>
                <TableCell>
                  <InteractiveButton variant="contained" color="primary" onClick={() => handleRestock(row.id)}>
                    Restock
                  </InteractiveButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <ToastContainer position="top-center" autoClose={4000} />
        </CenterContainer>
        </div>
      </>
  );
};

export default Inventory;
