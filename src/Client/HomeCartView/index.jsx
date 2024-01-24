import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import EmptyCart from "../../assets/images/empty_cart.png";
import { database } from "../../firebaseconfig";
import { v4 as uuidv4 } from "uuid";
import { getDatabase, ref, push, onValue, off, get } from "firebase/database";
import { useHistory } from "react-router-dom";
import OrderSummaryPage from "../OrderSummaryPage";
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const HomeCartView = ({
  cart,
  clearCart,
  updateCartQuantity,
  removeItem,
  onHide,
  ...modalProps
}) => {
  const [userId, setUserId] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [promoCodes, setPromoCodes] = useState([]);
  const [enteredPromoCode, setEnteredPromoCode] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const history = useHistory();

  useEffect(() => {
    // Retrieve promo codes from Firebase
    const promoCodesRef = ref(database, "Promo Codes");
    onValue(promoCodesRef, (snapshot) => {
      const promoCodesData = snapshot.val();
      if (promoCodesData) {
        const promoCodesArray = Object.values(promoCodesData);
        setPromoCodes(promoCodesArray);
      }
    });

    return () => {
      // Cleanup on component unmount
      off(promoCodesRef);
    };
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    updateCartQuantity(itemId, newQuantity);
  };

  const handlePromoCodeChange = (e) => {
    setEnteredPromoCode(e.target.value);
  };

  const applyPromoCode = () => {
    const matchingPromoCode = promoCodes.find(
      (code) => code.code === enteredPromoCode
    );

    if (matchingPromoCode) {
      // Apply 15% discount
      const discountPercentage = matchingPromoCode.discountPercent;
      const discountAmount =
        (discountPercentage / 100) *
        cart.reduce(
          (total, item) => total + item.productPrice * item.productQuantity,
          0
        );

      // Set the discounted amount and update the total
      setDiscountedAmount(discountAmount);
       toast.success(`Promocode applied..`, { position: 'top-center', className: 'toast-success' });
    } else {
      // Promo code not found or invalid, reset the discounted amount
      setDiscountedAmount(0);
       toast.error(`Promocode not found..`, { position: 'top-center', className: 'toast-error' });
    }
  };

  const handleCheckout = () => {
    // Step 1: Generate a random user id using uuidv4
    // const userId = uuidv4();
    // 2. Save user id to local storage
    // localStorage.setItem("USERID", userId);
//-------------------------------------------------------------------------------------------
    //Step 1(revised): Get userId from local storage

    let user = "";
    if (localStorage.USERID) {
      user = localStorage.USERID;
      setUserId(user);
    } else {
      setUserId("");
    }
    console.log("user:", user);
    //Step 2(revised):Get userStatus(loggedIn?) from local storage
    let status = "";
    if (localStorage.USERSTATUS) {
      status = localStorage.USERSTATUS;
      setUserStatus(status);
    }
    console.log("user status:", userStatus);
    // 3. Create amount object
    const amount = {
      deliverFee: 200,
      discount: discountedAmount, // Updated to include the discount
      grandTotal:
        cart.reduce(
          (total, item) => total + item.productPrice * item.productQuantity,
          0
        ) +
        200 -
        discountedAmount,
      itemTotal: cart.reduce(
        (total, item) =>
          total + item.productPrice * item.productQuantity,
        0
      ),
    };

    // 4. Save amount object to local storage
    localStorage.setItem("AMOUNT", JSON.stringify(amount));

    // 5. Prepare cart data for Firebase
    const firebaseData = {};
    console.log(cart);
    cart.forEach((item, index) => {
      const cartItem = {
        itemID: item.productID,
        quantity: item.productQuantity,
        itemCategory: item.productCategory,
      };
      firebaseData[index] = cartItem;
    });

    // 6. Save cart data to Firebase Realtime Database
    const cartRef = ref(database, `Carts/${userId}`);
    push(cartRef, firebaseData, (error) => {
      if (error) {
        console.error("Error saving cart to Firebase:", error);
        // Handle the error as needed
      } else {
        console.log("Cart data saved successfully!");
        // You may want to perform additional actions or navigate to a success page here
      }
    });
    //If user logged in: got to ordersummary page otherwise go to login/signup page
    if (userStatus === "LOGGED_IN") {
      history.push("/orderSummary");
      onHide();
    } else {
      // redirect to loin/Signup form
      history.push("/login")
      onHide();
    }
  };

  const renderCartItem = (item) => {
    return (
      <div key={item.productID} className="basket--item">
        <div className="basket--item--img">
          <img src={item.productImage} alt="invalid property" />
        </div>
        <div className="basket--item--details">
          <div className="basket--item--title">{item.productName}</div>
          <div className="basket--item--quantity">
            Quantity:{" "}
            <span>
              <input
              style={{width:"30px"}}
                type="number"
                value={item.productQuantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value, 10);
                  handleQuantityChange(
                    item.productID,
                    isNaN(newQuantity) ? 1 : newQuantity
                  );
                }}
              />
            </span>
          </div>
          <div className="basket--item--price">
            Price: <span>${item.productPrice * item.productQuantity}</span>
          </div>
          <div className="basket--item--remove">
            <i
              className="fas fa-trash-alt"
              onClick={() => removeItem(item.productID)}
            ></i>
          </div>
        </div>
      </div>
    );
  };

  const isCartEmpty = !cart || cart.length === 0;

  return (
    <Modal {...modalProps} className="right" onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
        {!isCartEmpty && (
          <span className="checkout--btn" onClick={clearCart}>
            Clear Cart
          </span>
        )}
      </Modal.Header>
      <Modal.Body className="modal-body-content">
        {!isCartEmpty ? (
          <>
            {cart.map(renderCartItem)}
            <div className="promo-code-container" style={{display:"flex",flexDirection:"row", justifyContent:"stretch",alignItems:"center"}}>
            <TextField id="filled-basic" label="Enter Promo Code" variant="filled" value={enteredPromoCode}
                onChange={handlePromoCodeChange} style={{}}/>
              {/* <input
                type="text"
                placeholder="Enter Promo Code"
                value={enteredPromoCode}
                onChange={handlePromoCodeChange}
              /> */}
              <Button onClick={applyPromoCode} variant="contained" style={{height:"57px"}}>Apply</Button>
              {/* <button onClick={applyPromoCode}>Apply</button> */}
            </div>
            <div className="total--price-container">
              <h3 style={{ textAlign: "center", paddingTop:"0.75em"}}>
                Total:{" "}
                <span style={{ color: "#FE4C50" }}>
                  $
                  {cart.reduce(
                    (total, item) =>
                      total + item.productPrice * item.productQuantity,
                    0
                  ) + 200 - discountedAmount}
                </span>
              </h3>
              <button
                className="btn btn-wide log-btn"
                style={{ marginTop: 20 }}
                onClick={() => handleCheckout()}
              >
                Checkout
              </button>
            </div>
          </>
        ) : (
          <div className="empty--basket">
            <>
              <img src={EmptyCart} className="img-fluid" alt="Empty Cart" />
              <h4 style={{ textAlign: "center" }}>Empty cart</h4>
            </>
          </div>
        )}
      </Modal.Body>
       <ToastContainer position="top-center" autoClose={2000} />
    </Modal>
  );
};

export default HomeCartView;
