import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { database } from "../../firebaseconfig";
import { ref, onValue, off,set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";
import PaymentForm from "../PaymentForm.js";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast, ToastContainer } from 'react-toastify';

const OrderSummaryPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cart, setCart] = useState([]);
  const [amount, setAmount] = useState([]);
  const [address, setAddress] = useState("");
  const [userId, setUserId] = useState("");
  const [fireBaseOrderCart, setFireBaseOrderCart] = useState([]);
  const [fireBaseOrderUser, setfireBaseOrderUser] = useState([]);
  const [isPlaceOrderDisabled, setIsPlaceOrderDisabled] = useState(false);
  const [userdata,setuserData]=useState({})
  const history = useHistory();
  const stripePromise = loadStripe('pk_test_51OPInkDkA3rml0kyjnxWaTMgz0upX158ixBKbPPWaYNnNGzDSzc2uJc5AIt4TUanIeWjiMN14vLqxfQbTTv2d4jU00rL21APEf');

  useEffect(() => {
    getCartItems();
    getAmountDetails();
    // Retrieve user ID from localStorage, replace 'USER_ID_KEY' with the actual key you are using
    const storedUserId = localStorage.getItem("USERID");
    setUserId(storedUserId);
  }, []);

  const getAmountDetails = () => {
    let Amount = [];
    if (localStorage.AMOUNT) {
      Amount = JSON.parse(localStorage.AMOUNT);
      setAmount(Amount);
    } else {
      setAmount([]);
    }
  };

  const getCartItems = () => {
    let Cart = [];
    if (localStorage.SCLOCALCART) {
      Cart = JSON.parse(localStorage.SCLOCALCART);
      setCart(Cart);
    } else {
      setCart([]);
    }
  };

  const renderCartItem = (item) => {
    return (
      <div key={item.productID} className="basket--item">
        <div className="basket--item--img">
          <img src={item.productImage} alt="no" />
        </div>
        <div className="basket--item--details">
          <div className="basket--item--title">{item.productName}</div>
          <div className="basket--item--quantity">
            Quantity:{item.productQuantity}
          </div>
          <div className="basket--item--price">
            Price: <span>${item.productPrice * item.productQuantity}</span>
          </div>
        </div>
      </div>
    );
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };
  const fetchCartData = () => {
    const user_id = localStorage.getItem('USERID');
    const Cartref = ref(database, `Carts/${user_id}`);
    const handleCartData = (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (data) {
        const orderArrays = Object.values(data);
        const CartList = orderArrays.flatMap((orderArray) =>
          orderArray.map((item) => ({
            itemCategory: item.category,
            itemID: item.itemID,
            quantity: item.quantity,
          }))
        );

        console.log("cart list", CartList);
        setFireBaseOrderCart(CartList);
      } else {
        console.log("error");
      }
    };

    onValue(Cartref, handleCartData);

    return () => {
      off(Cartref, "value", handleCartData);
    };
  };

  const fetchuserData = () => {
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
  

  const Orderbutton = () => {
    // 1)Fetch data of Cart against particular user
    let array = JSON.parse(localStorage.getItem('SCLOCALCART'));
            const arr=array.map(({ productID, productQuantity, productCategory }) => ({
                            itemID: productID,
                            quantity: productQuantity,
                            itemCategory: productCategory
                            }));
     // fetch amount object from local storage

    console.log(amount)
    
     // generate orderId by uuid

       const orderID = uuidv4();
        console.log('orderid ', orderID);

     // get user by userid which is in local storage

        fetchuserData();
        
    const orderObject = {
      "amount": amount,
      "cart": arr,
      "deliveryLocation": {
        "address": {
          "city": address,
          "general": "949494949"
        }
      },
      "orderID": orderID,
      "paymentMethod": paymentMethod,
      "receiver": {
        "receiverName": userdata.userName,
        "receiverPhoneNo": userdata.userPhoneNo
      },//hardcoded as I don't have component, kindly put the user fetched using fetchUser function in your code
      "status": "PENDING",
      "timeStamp": Date.now()
    }

    //Finally write a firebase ftn to push this object against (Orders/`${userID}`/`${orderID}`)
      const orderRef = ref(database, `Orders/${userId}/${orderID}`);

        set(orderRef, orderObject)
           .then(() => {
            toast.success(`Order placed successfully`, {
                position: 'top-center',
                className: 'toast-success',
            });

            // Adding a delay before navigating to the next page
            setTimeout(() => {
                localStorage.removeItem('SCLOCALCART');
                localStorage.removeItem('AMOUNT');
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
  };
  // const handleStripePayment = async () => {
  //   if (paymentMethod === "creditCard") {
  //     history.push("/stripePaymentForm");
  //   }
  // };
  const handlePlaceOrder = () => {

    if (paymentMethod == '') {
      toast.error(`Enter the payment Method...`, {
                position: 'top-center',
                className: 'toast-error',
      });
      return;
    }
    if (address == '') {
      toast.error(`Enter the address...`, {
                position: 'top-center',
                className: 'toast-error',
      });
      return;
    }
    if (paymentMethod === "CREDIT_DEBIT_CARD") {
      localStorage.setItem('count', 0);
      // Disable Place Order button and clear input fields
      
      setAddress("");
      //code to show stripe form
    } else if (paymentMethod === "CASH_ON_DELIVERY") {
      localStorage.setItem('count', 0);
      console.log("hello")
      // Show orange alert with confetti and redirect to "/"
      
      Orderbutton();
      // history.push("/");
    }
  };
  return (
    <>
    <div style={{ marginTop: "10vh" }} className="container">
      <div className="row">
        <div className="col-md-8">
          <div className="order-summary bg-light p-4 rounded">
            <h2>Order Summary</h2>
            <>{cart.map(renderCartItem)}</>
            <div className="total--price-container">
              <h4>
                SubTotal{" "}
                <span style={{ color: "#FE4C50" }}>${amount.itemTotal}</span>{" "}
              </h4>
              <h4>
                Delivery Charges{" "}
                <span style={{ color: "#FE4C50" }}>${amount.deliverFee}</span>{" "}
              </h4>
              <h4>
                Grand Total{" "}
                <span style={{ color: "#FE4C50" }}>${amount.grandTotal}</span>
              </h4>
              <button
              disabled={isPlaceOrderDisabled}
                onClick={()=>handlePlaceOrder()}
                // onClick={Orderbutton()}
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  borderRadius: "25px",
                  backgroundColor: "orange",
                  color: "white",
                  textDecoration: "none",
                  transition: "background-color 0.3s, color 0.3s",
                  border:'1px solid orange'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "black";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "orange";
                  e.target.style.color = "white";
                }}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>

        <div className="container mt-4 col-md-4">
          <div className="checkout-details column">
            {/* Address Details */}
            <div className="address-details bg-light p-4 rounded mb-4">
              <h3>Address Details</h3>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 210 }} className="mb-4">
                <InputLabel id="demo-simple-select-standard-label">
                  Country
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // value={address}
                  label="Country"
                >
                  <MenuItem value="">
                  </MenuItem>
                  <MenuItem value={"Pakistan"}>Pakistan</MenuItem>
                  <MenuItem value={"US"}>US</MenuItem>
                  <MenuItem value={"China"}>China</MenuItem>
                  <MenuItem value={"France"}>France</MenuItem>
                  <MenuItem value={"UK"}>UK</MenuItem>
                </Select>
              </FormControl>
              <TextField id="outlined-basic" label="City/State" variant="outlined" className="mb-4"/>
              <TextField id="outlined-basic" label="Street Address" variant="outlined" onChange={(e) => setAddress(e.target.value)} className="mb-4"/>
            </div>
            {/* Payment Method */}
            <div className="payment-method bg-light p-4 rounded">
              <h3>Payment Method</h3>
              {/* Payment method buttons */}
              <div style={{display:'flex',justifyContent:'center',alignItems:'center'}} className="payment-buttons">
                <button
                  className={`btn btn-outline-secondary btn-block mb-2 ${
                    paymentMethod === "CREDID_DEBIT_CARD" ? "active" : ""
                  }`}
                  onClick={() => {setIsPlaceOrderDisabled(true);
                    handlePaymentMethodSelect("CREDID_DEBIT_CARD")}}
                >
                  Credit Card
                </button>
                <button style={{position:'relative',top:'-3px',marginLeft:'5px'}}
                  className={`btn btn-outline-secondary btn-block ${
                    paymentMethod === "CASH_ON_DELIVERY" ? "active" : ""
                  }`}
                  onClick={() => handlePaymentMethodSelect("CASH_ON_DELIVERY")}
                >
                  Cash On Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {paymentMethod === "CREDID_DEBIT_CARD" && 
      <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>}
    </div>
    <ToastContainer position="top-center" autoClose={4000} />
    </>
  );
};

export default OrderSummaryPage;
