import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import "./PaymentForm.css";
import { toast, ToastContainer } from 'react-toastify';
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import { database } from "../../firebaseconfig";
import { ref, onValue, off, set, get } from "firebase/database";


const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
    const [userdata, setuserData] = useState({});
  const [userId, setUserId] = useState(localStorage.getItem('USERID'));

  const history = useHistory();


  const fetchClientSecret = async () => {
    // Fetch the client secret from your server
    const response = await axios.get('http://localhost:3001/create-payment-intent', {
      params: { amount: 1599 }, // Pass any amount you want
    });
    console.log('Axios Response:', response);
    setClientSecret(response.data.clientSecret);
  };

    const fetchuserData = async () => {
  const userref = ref(database, `Users/Registered`);

  const handleuserdata = (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const userlist = Object.keys(data).map((key) => ({ id: key, ...data[key] }));

      // Find the user with matching userID
      const currentUser = userlist.find((user) => user.userID === userId);

      if (currentUser) {
          console.log('Found User:', currentUser);
          let abc = [];
          abc = currentUser;
        setuserData(abc);
         console.log(userdata)
          console.log('use state ', userdata.userName,userdata.userPhoneNo)
        // Add your logic here based on the currentUser or any other data
        // ...
      } else {
        console.log('User not found.');
      }
    } else {
      console.log('No user data available.');
    }
  };

  onValue(userref, handleuserdata);

  return () => {
    off(userref, 'value', handleuserdata);
  };
  };


  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      
      fetchClientSecret();
      if (!stripe || !elements) {
        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        return;
      }
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error('Payment failed:', error.message);
        toast.error(`Payment failed..`, {
          position: 'top-center',
          className: 'toast-error',
        });
      } else if (paymentIntent) {
        console.log('Payment succeeded:', paymentIntent);
    
        try {
        
          const cartArray = JSON.parse(localStorage.getItem('SCLOCALCART'));
          const cartItems = cartArray.map(({ productID, productQuantity, productCategory }) => ({
            itemID: productID,
            quantity: productQuantity,
            itemCategory: productCategory
          }));

      
          const amount = JSON.parse(localStorage.AMOUNT);

          // 3) Generate orderId by uuid
          const orderID = uuidv4();
          console.log('orderid ', orderID);

          await fetchuserData();

          // 5) Prepare order object
          const orderObject = {
            amount: amount,
            cart: cartItems,
            deliveryLocation: {
              address: {
                city: "pakistan",
                general: "949494949"
              }
            },
            orderID: orderID,
            paymentMethod: "CREDIT_DEBIT_CARD",
            receiver: {
              receiverName: userdata.userName,
              receiverPhoneNo: userdata.userPhoneNo
            },
            status: "PENDING",
            timeStamp: Date.now()
          };

          // 6) Write to Firebase Orders table
          const orderRef = ref(database, `Orders/${userId}/${orderID}`);
          set(orderRef, orderObject)
            .then(() => {
              // 7) After order is placed successfully, update product stock
              const productsRef = ref(database, "Products");
              const productUpdates = cartItems.map((item) => {
                const productRef = ref(database, `Products/${item.itemID}`);
                return get(productRef)
                  .then((snapshot) => {
                    const productData = snapshot.val();
                    if (productData) {
                      const newStock = productData.productStock - item.quantity;
                      return set(productRef, { ...productData, productStock: newStock });
                    }
                    return null;
                  })
                  .catch((error) => {
                    console.error('Error updating product stock:', error);
                    return null;
                  });
              });

              // 8) Wait for all product stock updates to complete
              return Promise.all(productUpdates);
            })
            .then(() => {
              // 9) Order placed and product stock updated successfully
              toast.success(`Payment done sucessfully..`, {
                position: 'top-center',
                className: 'toast-success',
              });

              // Adding a delay before navigating to the next page
              setTimeout(() => {
                localStorage.removeItem('SCLOCALCART');
                localStorage.removeItem('AMOUNT');
                localStorage.setItem('count', 0);
                history.push("/");
              }, 3000); // Adjust the delay as needed
            })
            .catch((error) => {
              console.error('Error saving order to Firebase:', error);
              toast.error(`Order Failed to Placed...`, {
                position: 'top-center',
                className: 'toast-error',
              });
              // Handle the error as needed
            });
        }
        catch (e) {
          toast.error(`PLS try again...`, {
            position: 'top-center',
            className: 'toast-error',
          });
        }

        // Adjust the delay as needed
      }
    } catch (e) {
      toast.error(`PLS try again...`, {
            position: 'top-center',
            className: 'toast-error',
          });
    }
  };
  const cardElementStyle = {
    base: {
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
      backgroundColor: '#fff',
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    },
  };
  return (
    <>
    <form onSubmit={handlePayment} className="payment-form">
      <CardElement className="card-element" options={{ style: cardElementStyle }}/>
      <button style={{
                  // display: "inline-block",
                  // padding: "10px 20px",
                  borderRadius: "25px",
                  backgroundColor: "orange",
                  color: "white",
                  // textDecoration: "none",
                  transition: "background-color 0.3s, color 0.3s",
                  border: '1px solid orange',
                  marginBottom:'20px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "black";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "orange";
                  e.target.style.color = "white";
                }} type="submit" disabled={!stripe}>
        Pay
      </button>
      </form>
      <ToastContainer position="top-center" autoClose={4000} />
      </>
  );
};

export default PaymentForm;
