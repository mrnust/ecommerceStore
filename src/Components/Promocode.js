import React, { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/system';

// Mock data for demonstration
const promoCodes = [
  { id: 1, name: 'CODE1', expiryDate: '2023-12-31', discount: 10 },
  { id: 2, name: 'CODE2', expiryDate: '2023-12-15', discount: 20 },
  { id: 3, name: 'CODE3', expiryDate: '2023-12-15', discount: 20 },
  { id: 4, name: 'CODE4', expiryDate: '2023-12-15', discount: 20 },
  { id: 5, name: 'CODE5', expiryDate: '2023-12-15', discount: 20 },
  { id: 6, name: 'CODE6', expiryDate: '2023-12-15', discount: 20 },
];

const Container = styled('div')({
  minHeight: '80vh', // Set to 80% of viewport height
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Heading = styled('h2')({
  marginBottom: '20px',
  color: 'black',
  fontWeight: 'bold',
  textAlign: 'center', // Center align the heading
});

const ActionCell = styled(TableCell)({
  display: 'flex',
  gap: '8px', // Add separation between buttons
});

const StyledEditButton = styled(Button)({
  backgroundColor: 'blue',
  color: 'white',
  '&:hover': {
    backgroundColor: 'darkblue',
  },
});

const StyledDeleteButton = styled(Button)({
  backgroundColor: 'purple',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(128, 0, 128, 0.8)',
  },
});

const CenteredFormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '400px',
  margin: '20px auto', // Center the form
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
});

const FormButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
  width: '100%',
});

const StyledFormButton = styled(Button)({
  width: '48%', // Adjust button width
});

const PromoCodeTable = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState({});
  const [promoCodesList, setPromoCodesList] = useState(promoCodes); // Initialize with mock data

  const handleEditClick = (promoCode) => {
    setSelectedPromoCode(promoCode);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (promoCodeId) => {
    // Implement your delete logic here
    alert(`Promo code with id ${promoCodeId} deleted successfully`);
    const updatedPromoCodes = promoCodesList.filter((code) => code.id !== promoCodeId);
    setPromoCodesList(updatedPromoCodes);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleUpdateClick = () => {
    // Implement your update logic here
    setEditDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPromoCode((prevPromoCode) => ({
      ...prevPromoCode,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    // Handle date changes here
    setSelectedPromoCode((prevPromoCode) => ({
      ...prevPromoCode,
      expiryDate: date,
    }));
  };

  const handleAddClick = () => {
    // Implement your add logic here
    // You can validate the form data and add a new promo code to the list
    setPromoCodesList((prevList) => [
      ...prevList,
      {
        id: prevList.length + 1,
        name: selectedPromoCode.name,
        expiryDate: selectedPromoCode.expiryDate,
        discount: selectedPromoCode.discount,
      },
    ]);

    // Clear form data
    setSelectedPromoCode({
      name: '',
      expiryDate: '',
      discount: '',
    });
  };

  return (
    <Container>
      {/* Form */}
      <CenteredFormContainer>
        <Heading>Add Promo Code</Heading>
        <TextField
          label="Promo Code Name"
          name="name"
          value={selectedPromoCode.name}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Discount (%)"
          name="discount"
          value={selectedPromoCode.discount}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
        label="Expiry Date"
        type="date"
        name="expiryDate"
        value={selectedPromoCode.expiryDate}
        onChange={(e) => handleDateChange(e.target.value)}
        variant="filled" // Change the variant to filled
        margin="normal"
        InputLabelProps={{ style: {
            color: 'gray', // Change the text 
            fontSize: '18px', // Change the font size
            marginLeft:'5px'
      // Add any other styling properties as needed
        }, shrink: true }}
        InputProps={{
        placeholder: '',
        // readOnly: true, // Make the input read-only to prevent user input
        }}
        sx={{ backgroundColor: 'white', borderRadius: '4px'}} // Add styling
        />
        <FormButtonContainer>
          <StyledFormButton onClick={handleAddClick} color="primary" variant="contained">
            Add
          </StyledFormButton>
          <StyledFormButton onClick={() => setSelectedPromoCode({ name: '', expiryDate: '', discount: '' })} color="secondary" variant="contained">
            Reset
          </StyledFormButton>
        </FormButtonContainer>
      </CenteredFormContainer>

      {/* Promo Codes Table */}
      <Heading>Promo codes</Heading>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Promo Code ID</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Promo Code Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Expiry Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Discount (%)</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promoCodesList.map((promoCode) => (
              <TableRow key={promoCode.id}>
                <TableCell>{promoCode.id}</TableCell>
                <TableCell>{promoCode.name}</TableCell>
                <TableCell>{promoCode.expiryDate}</TableCell>
                <TableCell>{promoCode.discount}</TableCell>
                <ActionCell>
                  <StyledEditButton onClick={() => handleEditClick(promoCode)}>Edit</StyledEditButton>
                  <StyledDeleteButton onClick={() => handleDeleteClick(promoCode.id)}>Delete</StyledDeleteButton>
                </ActionCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Promo Code</DialogTitle>
        <DialogContent>
          <TextField
            label="Promo Code Name"
            value={selectedPromoCode.name}
            onChange={(e) => handleInputChange(e)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Discount (%)"
            value={selectedPromoCode.discount}
            onChange={(e) => handleInputChange(e)}
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
    </Container>
  );
};

export default PromoCodeTable;
