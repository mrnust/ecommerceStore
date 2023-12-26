import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

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
  minWidth: 300,
  width: '100%',
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
  flexWrap: 'wrap',
  justifyContent: 'center',
});

const StyledCard = styled(Card)({
  width: 250, // Adjust the width as needed
  height: 300, // Adjust the height as needed
    boxShadow: '0 10px 18px rgba(0, 0, 0, 0.1)',
  border:'0.5px solid #dfd9d9'
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


const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    

  const handleRestock = (productId) => {
    // Implement your restock logic here
    const productIndex = inventoryData.findIndex((product) => product.id === productId);

    if (productIndex !== -1) {
      const updatedInventory = [...inventoryData];
      updatedInventory.splice(productIndex, 1);

      alert(`Product ID ${productId} has been restocked.`);
      setInventoryData(updatedInventory);

      // Now, call a separate function to permanently remove the product from the array
      // This function can also include logic for backend deletion if needed
      removeProductPermanently(productId);
    }
  };

  const removeProductPermanently = (productId) => {
    // Logic to permanently remove the product from the array (not just in the state)
    // You can also include logic for backend deletion if needed
    console.log(`Product ID ${productId} has been permanently removed.`);
  };

     const handleUpdate = (productId) => {
    const productToUpdate = inventoryData.find((product) => product.id === productId);
    setSelectedProduct(productToUpdate);
    setIsEditing(true);
  };

      const handleSaveChanges = () => {
    // Implement logic to save changes to the backend
    setIsEditing(false);
    setSelectedProduct(null);
    // You may want to update the inventoryData state based on the changes made
  };
    
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter the inventoryData based on the search term
    const results = inventoryData.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(results);
  };

  useEffect(() => {
    // Fetch inventory data from Firebase or your backend API
    // Set inventoryData using setInventoryData
    const initialData = [
      { id: 1, name: 'Shirts', category: 'Category X', lastRestocked: '2023-01-01', image: 'https://example.com/imageA.jpg' },
      { id: 2, name: 'Pants', category: 'Category Y', lastRestocked: '2023-02-01', image: 'https://example.com/imageB.jpg' },
        { id: 3, name: 'Football', category: 'Category Z', lastRestocked: '2023-03-01', image: 'https://example.com/imageC.jpg' },
        { id: 4, name: 'Iphone X', category: 'Category Z', lastRestocked: '2023-03-01', image: 'https://example.com/imageC.jpg' },
         { id: 5, name: 'Hair Color', category: 'Category Z', lastRestocked: '2023-03-01', image: 'https://example.com/imageC.jpg' },
          { id: 6, name: 'Bottle', category: 'Category Z', lastRestocked: '2023-03-01', image: 'https://example.com/imageC.jpg' },
        // Add more data as needed
    ];

    setInventoryData(initialData);
  }, []);

  return (
        <CenterContainer>
      <SearchContainer>
        <TextField
          label="Search by product name or category"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
        />
      </SearchContainer>
      {isEditing ? (
        <EditContainer>
          <Typography variant="h4" style={{color:'black'}}>Edit Product</Typography>
          <EditTextField
            label="Product Name"
            variant="outlined"
            value={selectedProduct.name}
            fullWidth
            onChange={(e) =>
              setSelectedProduct((prevProduct) => ({
                ...prevProduct,
                name: e.target.value,
              }))
            }
          />
          <EditTextField
            label="Category"
            variant="outlined"
            value={selectedProduct.category}
            fullWidth
            onChange={(e) =>
              setSelectedProduct((prevProduct) => ({
                ...prevProduct,
                category: e.target.value,
              }))
            }
          />
          {/* Add other fields as needed */}
          <SaveButton variant="contained" color="primary" onClick={handleSaveChanges}>
            Save Changes
          </SaveButton>
        </EditContainer>
      ) : (
        searchTerm !== '' && (
          <CardContainer>
            {searchResults.map((product) => (
              <StyledCard key={product.id}>
                <StyledCardMedia component="img" alt={product.name} height="140" image={product.image} />
                <CardContent>
                  <Typography variant="h6">Product ID: {product.id}</Typography>
                  <Typography>Name: {product.name}</Typography>
                  <Typography>Category: {product.category}</Typography>
                  <UpdateButton variant="contained" color="primary" onClick={() => handleUpdate(product.id)}>
                    Update
                  </UpdateButton>
                </CardContent>
              </StyledCard>
            ))}
          </CardContainer>
        )
          )}
          
           <Heading>Inventory Table</Heading>
      <StyledTableContainer component={Paper}>
        <StyledTable size="small" aria-label="Inventory Table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Product ID</StyledTableCell>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Last Restocked</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.lastRestocked}</TableCell>
                <TableCell>
                  <InteractiveButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleRestock(row.id)}
                  >
                    Restock
                  </InteractiveButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </CenterContainer>
  );
};

export default Inventory;
