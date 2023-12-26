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
  border: '0.5px solid #dfd9d9',
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

const Home = () => {
  // State for pending orders
  const [pendingOrders, setPendingOrders] = useState([]);

  // State for delivered orders
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  // Fetch pending orders and delivered orders data from Firebase or your backend API
  // Set pendingOrders and deliveredOrders using setPendingOrders and setDeliveredOrders

  useEffect(() => {
    // Fetch pending orders data from Firebase or your backend API
    // Set pendingOrders using setPendingOrders
    const pendingOrdersData = [
      // Pending orders data
      { orderId: 1, userId: 101, productName: 'Product A', dateOfOrder: '2023-04-01', amount: 50, status: 'Pending', paymentStatus: 'Paid' },
      { orderId: 2, userId: 102, productName: 'Product B', dateOfOrder: '2023-04-02', amount: 30, status: 'Pending', paymentStatus: 'Pending' },
      
      // Add more pending orders data as needed
    ];

    setPendingOrders(pendingOrdersData);

    // Fetch delivered orders data from Firebase or your backend API
    // Set deliveredOrders using setDeliveredOrders
    const deliveredOrdersData = [
      // Delivered orders data
      { orderId: 3, userId: 103, productName: 'Product C', dateOfOrder: '2023-03-15', amount: 25, status: 'Delivered', paymentStatus: 'Paid' },
      { orderId: 4, userId: 104, productName: 'Product D', dateOfOrder: '2023-03-20', amount: 40, status: 'Delivered', paymentStatus: 'Paid' },
      // Add more delivered orders data as needed
    ];

    setDeliveredOrders(deliveredOrdersData);
  }, []);

  return (
    <CenterContainer>
      {/* Pending Orders Table */}
      <Heading>Pending Orders</Heading>
      <StyledTableContainer component={Paper}>
        <StyledTable size="small" aria-label="Pending Orders Table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>User ID</StyledTableCell>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Date of Order</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Payment Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingOrders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>{order.productName}</TableCell>
                <TableCell>{order.dateOfOrder}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* Delivered Orders Table */}
      <Heading>Delivered Orders</Heading>
      <StyledTableContainer component={Paper}>
        <StyledTable size="small" aria-label="Delivered Orders Table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>User ID</StyledTableCell>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Date of Order</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Payment Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveredOrders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>{order.productName}</TableCell>
                <TableCell>{order.dateOfOrder}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </CenterContainer>
  );
};

export default Home;
