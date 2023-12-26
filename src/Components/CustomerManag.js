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
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '20px',
});

const StyledCard = styled(Card)({
  width: 250,
  height: 200,
  boxShadow: '0 10px 18px rgba(0, 0, 0, 0.1)',
  border: '0.5px solid #dfd9d9',
  marginBottom: '20px',
});

const StyledCardMedia = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
});

const BoldText = styled('span')({
  fontWeight: 'bold',
  marginBottom: '5px',
});

const CustomerManagement = () => {
  const [customerData, setCustomerData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // If the search term is empty, display all customers in the table
    if (term === '') {
      setSearchResults([]);
    } else {
      // Filter the customerData based on the search term
      const results = customerData.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term.toLowerCase()) ||
          customer.email.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(results);
    }
  };

  useEffect(() => {
    // Fetch customer data from Firebase or your backend API
    // Set customerData using setCustomerData
    const initialData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', registrationDate: '2023-01-01' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', registrationDate: '2023-02-01' },
      { id: 3, name: 'Jeff Benzos', email: 'jeff@example.com', registrationDate: '2023-03-01' },
      { id: 4, name: 'Elon Musk', email: 'elon@example.com', registrationDate: '2023-04-01' },
      // Add more data as needed
    ];

    setCustomerData(initialData);
  }, []);

  return (
    <CenterContainer>
      <SearchContainer>
        <TextField
          label="Search by name or email"
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
              <StyledCard key={customer.id}>
                <StyledCardMedia>
                  <Typography variant="h6">
                    <BoldText>{customer.name}</BoldText>
                  </Typography>
                  <Typography>
                    <BoldText>Email:</BoldText> {customer.email}
                  </Typography>
                  <Typography>
                    <BoldText>Date of Registration:</BoldText> {customer.registrationDate}
                  </Typography>
                </StyledCardMedia>
              </StyledCard>
            ))}
          </CardContainer>
        </>
      )}

      <Heading>Customer Table</Heading>
      <StyledTableContainer component={Paper}>
        <StyledTable size="small" aria-label="Customer Table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Date of Registration</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customerData.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.registrationDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </CenterContainer>
  );
};

export default CustomerManagement;
