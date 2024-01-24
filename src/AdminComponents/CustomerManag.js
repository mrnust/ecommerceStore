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
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { database } from '../firebaseconfig';
import { ref, onValue, off, remove } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // transition: 'background-color 0.5s ease',
  // animation: 'colorChange 2s infinite alternate',
  // '@keyframes colorChange': {
  //   '0%': { backgroundColor: 'lightgray' },
  //   '100%': { backgroundColor: 'white' },
  // },
  // '&:hover': {
  //   backgroundColor: '#f5f5f5',
  // },
  height:'60px',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    transform: 'translateY(-5px)', // Add translation effect on hover
    transition: 'transform 0.3s ease', // Add a smooth transition effect
  },
}));

const StyledTableContainer = styled(TableContainer)({
  margin: '20px',
  overflowX: 'auto',
});

const StyledTable = styled(Table)({
  minWidth: 300,
  width: '100%',
  border: '2px solid black', // Add border styling
  borderRadius: '8px',
});

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
});

const StyledActionTableCell = styled(TableCell)({
  fontWeight: 'bold',
  color: 'black',
});

const InteractiveButton = styled(Button)({
  backgroundColor: '#777777',
  color: 'white',

  '&:hover': {
    backgroundColor: 'darkgrey',
  },
});

const SearchContainer = styled('div')({
  margin: '20px',
  width: '100%',
  marginTop:'60px'
  
});

const CardContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px',
});

const StyledCard = styled(Card)({
  width: 300,
  height: 200,
  boxShadow: '0 10px 18px rgba(0, 0, 0, 0.1)',
  border: '0.5px solid #dfd9d9',
  marginBottom: '20px',
});

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

const CustomerManagement = () => {
  const [customerData, setCustomerData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === '') {
      setSearchResults([]);
    } else {
      const results = customerData.filter(
        (customer) =>
          customer.userName.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(results);
    }
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDialog = () => {
    setSelectedCustomer(null);
  };

  const handleDeleteClick = async (userId) => {
     setSelectedCustomer(null);
    const userref = ref(database, `Users/Registered/${userId}`);

    // try {
    //   await remove(userref);
    //   toast.success(`Customer with ID ${userId} deleted successfully`, { position: 'top-center', className: 'toast-success' });
    // } catch (error) {
    //   console.error('Error deleting user:', error.message);
    //   toast.error('Error while deleting user', { position: 'top-center', className: 'toast-error' });
    // }

    toast.success(`Customer with ID ${userId} deleted successfully`, { position: 'top-center', className: 'toast-success' });
    
  };

  useEffect(() => {
    const todoRef = ref(database, 'Users/Registered');

    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const users = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setCustomerData(users);
        console.log(customerData)
      } else {
        setCustomerData([]);
      }
    }

    onValue(todoRef, handleData);

    return () => {
      off(todoRef, 'value', handleData);
    };
  }, []);

  return (
    <>
      <VerticalNavbar />
      <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',marginTop:'30px' }}>
    <CenterContainer>
      <SearchContainer>
        <TextField
          
          label="Search by name"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
        />
      </SearchContainer>

      {searchTerm !== '' && (
        <>
          <CardContainer>
            {searchResults.map((customer) => (
              <StyledCard key={customer.id} onClick={() => handleRowClick(customer)}>
                <StyledCardContent>
                  <Typography style={{ fontWeight: 'bold' }} variant="h6">
                    <span>{customer.userName}</span>
                  </Typography>
                  <Typography>
                    <span>Email: {customer.userEmail}</span>
                  </Typography>
                  <Typography>
                    <span>Phone: {customer.userPhoneNo}</span>
                  </Typography>
                  <Typography>
                    <span>Age: {customer.userAge}</span>
                  </Typography>
                  <Typography>
                    <span>Gender: {customer.userGender}</span>
                  </Typography>
                </StyledCardContent>
              </StyledCard>
            ))}
          </CardContainer>
        </>
      )}

      <Typography class="animate__animated animate__heartBeat" variant="h2" gutterBottom style={{ color: 'black', fontWeight: 'bold',animationIterationCount: 'infinite', animationDelay: '5s' }}>
          Customer table
        </Typography>
      <StyledTableContainer style={{marginTop:'30px'}} component={Paper}>
        <StyledTable style={{animationDelay:'3s'}} className="animate__animated animate__flash" size="small" aria-label="Customer Table">
          <TableHead>
            <TableRow style={{background:"lightgrey"}}>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              {/* <StyledActionTableCell>Action</StyledActionTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {customerData.map((customer) => (
              <StyledTableRow key={customer.id} onClick={() => handleRowClick(customer)}>
                <TableCell>{customer.userName}</TableCell>
                <TableCell>{customer.userEmail}</TableCell>
                <TableCell>{customer.userPhoneNo}</TableCell>
                {/* <StyledActionTableCell>
                  <InteractiveButton onClick={() => handleDeleteClick(customer.id)} variant="contained">
                    Delete
                  </InteractiveButton>
                </StyledActionTableCell> */}
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      <Dialog open={selectedCustomer !== null} onClose={handleCloseDialog}>
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
          <Typography>
            <span>Name: {selectedCustomer?.userName}</span>
          </Typography>
          <Typography>
            <span>Email: {selectedCustomer?.userEmail}</span>
          </Typography>
          <Typography>
            <span>Phone Number: {selectedCustomer?.userPhoneNo}</span>
          </Typography>
          <Typography>
            <span>Age: {selectedCustomer?.userAge}</span>
          </Typography>
          <Typography>
            <span>Gender: {selectedCustomer?.userGender}</span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-center" autoClose={4000} />
        </CenterContainer>
        </div>
      </>
  );
};

export default CustomerManagement;
