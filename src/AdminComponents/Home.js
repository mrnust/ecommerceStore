import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getDatabase, ref, onValue, off, get, set } from 'firebase/database';
import { database } from '../firebaseconfig';
import Chart from 'chart.js/auto';
import { toast, ToastContainer } from 'react-toastify';
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';
import VerticalNavbar from './Admin_navbar';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#f5f5f5',
    transform: 'translateY(-5px)',
    transition: 'transform 0.3s ease',
  },
}));

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [userdata, setuserdata] = useState([]);

  useEffect(() => {
    const ordersRef = ref(database, 'Orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.keys(data).map((userId) => {
          const userOrders = Object.values(data[userId]).map((order) => ({ userId, ...order }));
          return userOrders;
        }).flat();

        setOrders(ordersArray);
      }
    });


    return () => off(ordersRef);
  }, []);

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const markAsDelivered = async (username, orderId) => {
    const usersRef = ref(database, 'Users/Registered');
    const usersSnapshot = await get(usersRef);
    const usersData = usersSnapshot.val();
    setuserdata(usersData);
    console.log(userdata);
    const usersArray = Object.entries(usersData || {}).map(([userId, userData]) => ({
      userId,
      ...userData
    }));
    console.log(usersArray);

    const matchingUsers = usersArray.filter(user => user.userName === username);
     console.log('matching user  ',matchingUsers);
    const userId = matchingUsers[0].userID;
   

    const orderef = ref(database, `Orders/${userId}`);
    const orderSnapshot = await get(orderef);
    const ordersData = orderSnapshot.val();

    if (!ordersData) {
      console.error('No orders found for the user');
      return;
    }

    const ordersArray = Object.entries(ordersData || {}).map(([orderId, orderData]) => ({
      orderId,
      ...orderData
    }));

    const orderMatch = ordersArray.find(order => order.orderID === orderId);

    if (!orderMatch) {
      console.error(`Order with ID ${orderId} not found`);
      return;
    }

    const dbref = ref(database, `Orders/${userId}/${orderId}`);
    get(dbref)
      .then((snapshot) => {
        const currentData = snapshot.val();

        // Merge the current data with the changes
        const updatedOrder = {
          ...currentData,
          status: "DELIVERED"
        };

        // Update the product in the database
        return set(dbref, updatedOrder);
      })
      .then(() => {
        console.log(`Order delivered..`);
        // Update the pie chart after marking an order as delivered
          toast.success('Order Delevered successfully ', { position: 'top-center', className: 'toast-success' });
        const updatedCategoryQuantity = calculateCategoryQuantity(orders);
        updatePieChart(updatedCategoryQuantity);
      })
      .catch((error) => {
        console.error(`Failed:`, error);
           toast.error(`Failed to deliever order. Error: ${error.message}`, { position: 'top-center', className: 'toast-error' });
      });
  };

  const calculateCategoryQuantity = (orders) => {
    const categoryQuantity = {
      APPAREL: 0,
      FOOTWEAR: 0,
      EYEWEAR: 0,
      WATCHES: 0,
      JEWELLERY: 0,
      BAGS: 0,
    };
    console.log("orderss" ,orders)
    orders.forEach((order) => {
      order.cart.forEach((item) => {
        categoryQuantity[item.itemCategory] += item.quantity;
      });
    });
      console.log(categoryQuantity)
    return categoryQuantity;
  };

// Function to update the pie chart
const updatePieChart = (categoryQuantity) => {
  const ctx = document.getElementById('categoryPieChart').getContext('2d');

  // Check if there is an existing chart and destroy it
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  const myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryQuantity),
      datasets: [{
        data: Object.values(categoryQuantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
      }],
    },
  });
};

  
  

  //  bar chart---------------------------------------------


 const updateBarChart = (categoryQuantity) => {
    const ctx = document.getElementById('categoryBarChart');
    if (!ctx) {
      console.error("Bar chart canvas element not found");
      return;
    }

   
    // Check if there is an existing chart and destroy it
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    const myBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(categoryQuantity),
        datasets: [{
          label: 'Quantity',
          data: Object.values(categoryQuantity),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
          ],
        }],
      },
    });
  };



    useEffect(() => {
    const initialCategoryQuantity = calculateCategoryQuantity(orders);
    updatePieChart(initialCategoryQuantity);
    updateBarChart(initialCategoryQuantity);
  }, [orders]);

  // useEffect(() => {
  //   const initialCategoryQuantity = calculateCategoryQuantity(orders);
  //   updatePieChart(initialCategoryQuantity);
  // }, [orders]);

  return (
    <>
      <VerticalNavbar/>
      <div style={{ width: '30%', margin: '60px auto' }}>
        <Typography variant="h5" gutterBottom style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>
          Category Distribution (Pie Chart)
        </Typography>
        <canvas id="categoryPieChart"></canvas>
      </div>
      <div style={{ width: '45%', margin: '20px auto' }}>
        <Typography variant="h5" gutterBottom style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>
          Category Distribution (Bar Chart)
        </Typography>
              <canvas id="categoryBarChart"></canvas>
       </div>

         {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '30%', margin: '20px auto' }}>
              <canvas id="categoryPieChart"></canvas>
            </div>
            <div style={{ width: '30%', margin: '20px auto' }}>
              <canvas id="categoryBarChart"></canvas>
            </div>
      </div> */}

    

      {/* <div style={{ width: '40%', margin: '60px auto' }}>
        <canvas id="categoryPieChart"></canvas>
      </div> */}
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' ,justifyContent:'center'}}>
      <Typography class="animate__animated animate__heartBeat"  variant="h2" gutterBottom style={{marginTop:'50px', color: 'black', fontWeight: 'bold',animationIterationCount: 'infinite', animationDelay: '5s'   }}>
        Orders History
      </Typography>
      <Select
        value={statusFilter}
        onChange={handleStatusFilterChange}
        style={{ marginBottom: 20 ,marginTop:'30px'}}
      >
        <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="DELIVERED">Delivered</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
        <MenuItem value="ALL">All</MenuItem>
      </Select>

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' ,justifyContent:'center',marginTop:'30px'}}>
      <TableContainer className="animate__animated animate__flash" component={Paper} style={{ width: '80%', margin: '0 auto',marginBottom:'10px',animationDelay:'3s' }}>
        <Table style={{ border: '2px solid black', borderRadius: '8px' }}>
          <TableHead style={{ backgroundColor: 'lightgrey' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell style={{ fontWeight:'bold' }}>Status</TableCell>
      <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
      </TableRow>
      </TableHead>
      <TableBody>
      {orders
      .filter((order) => statusFilter === 'ALL' || order.status === statusFilter)
      .map((order) => (
      <StyledTableRow key={order.orderID}>
      <TableCell>{order.orderID}</TableCell>
      <TableCell>{order.receiver.receiverName}</TableCell>
      <TableCell>{order.amount.grandTotal}</TableCell>
      <TableCell>{order.status}</TableCell>
      <TableCell>
      {order.status === 'PENDING' && (
      <Button
      onClick={() => markAsDelivered(order.receiver.receiverName, order.orderID)}
      style={{ backgroundColor: 'blue', color: 'white' }}
      sx={{ '&:hover': { backgroundColor: '#007bff' } }}
      >
      Mark as Delivered
      </Button>
      )}
      {order.status === 'DELIVERED' && (
      <span style={{ color: 'green' }}>Order Delivered</span>
            )}
      {order.status === 'CANCELLED' && (
                  <span style={{ color: 'red' }}>Order Cancelled</span>
                )}
      </TableCell>
      </StyledTableRow>
      ))}
      </TableBody>
      </Table>
          </TableContainer>
          </div>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
      </>
      );
      };

      export default Home;