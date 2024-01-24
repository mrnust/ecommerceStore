import React, { useState, useEffect } from 'react';
import { ref, onValue, update, off } from 'firebase/database';
import { database } from '../../firebaseconfig';
import { Paper, Typography, Button, Snackbar, Card, CardContent, CardActions } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const OrderDetails = () => {
  const userId = localStorage.getItem('USERID');
  const [orders, setOrders] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Fetch user orders from the Orders table in realtime
    const ordersRef = ref(database, `Orders/${userId}`);
    onValue(ordersRef, (snapshot) => {
      const userOrders = snapshot.val() || {};
      const ordersArray = Object.entries(userOrders).map(([orderId, orderData]) => ({
        orderId,
        ...orderData,
      }));
      setOrders(ordersArray);
    });

    // Cleanup function to detach the listener when the component unmounts
    return () => {
      off(ordersRef);
    };
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    // Update the order status to 'CANCELLED'
    const orderRef = ref(database, `Orders/${userId}/${orderId}`);
    await update(orderRef, { status: 'CANCELLED' });

    // Show success snackbar
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Typography style={{ textAlign: 'center', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }} variant="h4" gutterBottom>
        Order Details
      </Typography>
      {orders.map((order) => (
        <Paper key={order.orderId} style={{ margin: '20px 0', padding: '10px',boxShadow: '0 4px 4px grey' }}>
          <Typography variant="h6">Order ID: {order.orderId}</Typography>
          <Card variant="outlined" style={{ boxShadow: '0 4px 8px grey' }}>
            <CardContent>
              {/* Display order details from the cart */}
              {order.cart.map((item, index) => (
                <div key={index}>
                  {/* Display cart details here, adjust as needed */}
                  <Typography variant="subtitle1" > <span style={{fontWeight:'bold'}}>Item {index + 1}:</span> {item.itemCategory}</Typography>
                  <Typography variant="subtitle1"><span style={{fontWeight:'bold'}}> Item Quantity:</span> {item.quantity}</Typography>
                  {/* Include other item details as needed */}
                </div>
              ))}
            </CardContent>
            <CardActions>
              <Typography variant="subtitle1" style={{ marginTop: '10px'}}>
               <span style={{fontWeight:'bold'}}> Status: </span>{order.status === 'CANCELLED' ? 'CANCELLED' : order.status}
              </Typography>
              {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ marginTop: '10px', marginLeft: 'auto' }}
                  onClick={() => handleCancelOrder(order.orderId)}
                >
                  Cancel Order
                </Button>
              )}
            </CardActions>
          </Card>
        </Paper>
      ))}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="success">
          Order Cancelled Successfully!
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default OrderDetails;
