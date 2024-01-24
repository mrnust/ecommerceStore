// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   BrowserRouter,
//   useLocation
// } from "react-router-dom";
// import BaseLayout from "../Components/Client/BaseLayout/BaseLayout";
// import TopNavBar from "../Components/Client/TopNavBar";
// import Footer from "../Components/Client/Footer";
// import ContactPage from "../Components/Client/ContactPage";
// import CategoriesPage from "../Components/Client/CategoriesPage";
// import NavBar from "../Components/Client/NavBar/NavBar";
// import OrderSummaryPage from "../Components/Client/OrderSummaryPage";
// import ProductDetailsPage from "../Components/Client/ProductDetailsPage";
// import PaymentForm from "../Components/Client/PaymentForm.js";
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// // import { useLocation } from "react-router-dom";


// export default function ClientLayout() {
//   const [topHeaderClass, setTopHeaderClass] = useState("show");
//   const stripePromise = loadStripe('pk_test_51OPInkDkA3rml0kyjnxWaTMgz0upX158ixBKbPPWaYNnNGzDSzc2uJc5AIt4TUanIeWjiMN14vLqxfQbTTv2d4jU00rL21APEf');
//   const handleScroll = () => {
//     if (window.scrollY >= 50) {
//       setTopHeaderClass("hide");
//     } else {
//       setTopHeaderClass("show");
//     }
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const location = useLocation();
//   const hideHeader = ['/hide'];
//   console.log(location.pathname)
//   return (
//     <BrowserRouter>
//       <div className="main-wrapper">
//         <div className="super_container">
//         {
//         !hideHeader.includes(location.pathname)
//          && (
//             <header className="header trans_300">
//               <TopNavBar className={topHeaderClass} />
//               <NavBar />
//             </header>
//           )}
//           {/* <header className="header trans_300">
//             <TopNavBar className={topHeaderClass} />
//             <NavBar />
//           </header> */}
//           <Switch>
//             <Route path="/" exact component={BaseLayout} />
//             <Route path="/contact" component={ContactPage} />
//             <Route path="/categories" component={CategoriesPage} />
//             <Route path="/orderSummary" component={OrderSummaryPage} />
//             <Route path="/productDetailsPage" component={ProductDetailsPage} />
//             <Route path="/stripePaymentForm">
//               <Elements stripe={stripePromise}>
//                 <PaymentForm />
//               </Elements>
//               </Route>
//             {/* <Route path="/checkout" component={CheckoutPage} /> */}
//             {/* <Route path="/product-details" component={ProductDetailsPage} /> */}
//           </Switch>
//           <Footer />
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }
