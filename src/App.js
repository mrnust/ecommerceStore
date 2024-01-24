// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch,useLocation } from 'react-router-dom';
import AddCategoryForm from './AdminComponents/Admin_Form_Category';
import AddProductForm from './AdminComponents/Admin_Form_Product';
import VerticalNavbar from './AdminComponents/Admin_navbar';
import Home from './AdminComponents/Home';
import Slider from './AdminComponents/Slider';
import Inventory from './AdminComponents/Inventory';
import Promocode from './AdminComponents/Promocode';
import CustomerManag from './AdminComponents/CustomerManag';

import ForgotPassword from './AdminComponents/ForgotPassword';
import BaseLayout from './Client/BaseLayout/BaseLayout.jsx'
import { loadStripe } from '@stripe/stripe-js';
// import TopNavBar from "../Components/Client/TopNavBar";
import NavBar from "./Client/NavBar/NavBar.jsx";
import TopNavBar from "./Client/TopNavBar";
import ContactPage from './Client/ContactPage';
import CategoriesPage from './Client/CategoriesPage';
import OrderSummaryPage from './Client/OrderSummaryPage';
import ProductDetailsPage from './Client/ProductDetailsPage';
import PaymentForm from "./Client/PaymentForm.js";
import { Elements } from '@stripe/react-stripe-js';
import Footer from "./Client/Footer";
import Login from './Client/CheckoutForms/Login.js';
import Signup from './Client/CheckoutForms/Signup.js';
import UpdateProfile from './Client/UpdateProfile/index.jsx'

function App() {

    const [topHeaderClass, setTopHeaderClass] = useState("show");
  const stripePromise = loadStripe('pk_test_51OPInkDkA3rml0kyjnxWaTMgz0upX158ixBKbPPWaYNnNGzDSzc2uJc5AIt4TUanIeWjiMN14vLqxfQbTTv2d4jU00rL21APEf');
  const handleScroll = () => {
    if (window.scrollY >= 50) {
      setTopHeaderClass("hide");
    } else {
      setTopHeaderClass("show");
    }
  };

   useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const location = useLocation();
  const hideHeader = ['/hide'];
  console.log(location.pathname)

  return (
    <Router>
      <div className="main-wrapper">
        <div className="super_container">
        {/* {
        !hideHeader.includes(location.pathname)
         && (
            <header className="header trans_300">
              <TopNavBar className={topHeaderClass} />
              <NavBar />
            </header>
          )} */}
          <Switch>
            {/* <Route path="/" exact component={Home} />
            <Route path="/addProduct" component={AddProductForm} />
            <Route path="/addCategory" component={AddCategoryForm} />
            <Route path="/slider" component={Slider} />
            <Route path="/inventory" component={Inventory} />
            <Route path="/promocode" component={Promocode} />
            <Route path="/customerManagement" component={CustomerManag} />
            <Route path="/signup" component={Signup}/>
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword}/> */}

                <Route path="/" exact component={BaseLayout} />
                <Route path="/admin" exact component={Home} />
            

                <Route path="/addProduct" component={AddProductForm} />
                <Route path="/addCategory" component={AddCategoryForm} />
                <Route path="/slider" component={Slider} />
                <Route path="/inventory" component={Inventory} />
                <Route path="/promocode" component={Promocode} />
                <Route path="/customerManagement" component={CustomerManag} />
            

                <Route path="/contact" component={ContactPage} />
                <Route path="/categories" component={CategoriesPage} />
                <Route path="/orderSummary" component={OrderSummaryPage} />
                <Route path="/productDetailsPage" component={ProductDetailsPage} />
                <Route path="/login" component={Login} />
                <Route path="/Signup" component={Signup} />
                <Route path="/stripePaymentForm">
                  <Elements stripe={stripePromise}>
                    <PaymentForm />
                  </Elements>
               </Route>
                <Route path="/signup" component={Signup}/>
                <Route path="/login" component={Login} />
                <Route path="/viewProfile" component={UpdateProfile}/>
            
          </Switch>
          {/* <Footer /> */}
          
        </div>
      </div>
    </Router>
  );
}

export default App;
