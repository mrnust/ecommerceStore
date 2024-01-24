// import React from 'react'
// import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
// import AddCategoryForm from '../Components/Admin_Form_Category';
// import AddProductForm from '../Components/Admin_Form_Product';
// import VerticalNavbar from '../Components/Admin_navbar';
// import Home from '../Components/Home';
// import Slider from '../Components/Slider';
// import Inventory from '../Components/Inventory';
// import Promocode from '../Components/Promocode';
// import CustomerManag from '../Components/CustomerManag';
// import TopNavBar from '../Components/Client/TopNavBar';
// import NavBar from '../Components/Client/NavBar/NavBar';
// export default function AdminLayout() {
//   const location = useLocation();
//   const hideHeader = ['/admin'];
//   return (
//        <Router>
//       <div className="App">
//         <header className="App-header">
//         {!hideHeader.includes(location.pathname) && (
//             <header className="header trans_300">
//               {/* <TopNavBar className={topHeaderClass} /> */}
//               <NavBar />
//             </header>
//           )}
//           <VerticalNavbar />

//           <Switch>
//             <Route path="/admin" exact component={Home} />
//             <Route path="/admin/addProduct" component={AddProductForm} />
//             <Route path="/admin/addCategory" component={AddCategoryForm} />
//             <Route path="/admin/slider" component={Slider} />
//             <Route path="/admin/inventory" component={Inventory} />
//             <Route path="/admin/promocode" component={Promocode} />
//             <Route path="/admin/customerManagement" component={CustomerManag} />
//           </Switch>
//         </header>
//       </div>
//     </Router>
//   )
// }
