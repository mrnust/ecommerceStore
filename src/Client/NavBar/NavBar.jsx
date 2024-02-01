import React, { useEffect, useState } from "react";
import HomeCartView from "../HomeCartView";
import MobileMenu from "../MobileMenu";
import MediaQuery from "react-responsive";
import device from "../../modules/mediaQuery";
import { Link, useHistory } from "react-router-dom";
import "./NavBar.css"
import "../../assets/css/style.css"
import "../../assets/css/responsive.css"
import '@fortawesome/fontawesome-free/css/all.css';
import logo from '../../assets/images/logo.jpeg'
const NavBar = (
  {
    // cart,
    // modalShow,
    // activeclass,
    // showHideModal,
    // handleMenuClicked,
  }
) => {
  const [cart, setCart] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [activeclass, setActiveClass] = useState(false);
  const [c,setC]=useState(Number(localStorage.getItem('count')))
  const history = useHistory();

  useEffect(() => {
    setC(localStorage.getItem('count'));
  }, [localStorage.getItem('count')])
  
  const getCartItems = () => {
    let Cart = [];
    if (localStorage.SCLOCALCART) {
      Cart = localStorage.SCLOCALCART;
      Cart = JSON.parse(Cart);
      setCart(Cart);
      console.log(cart);
    } else {
      setCart([]);
    }
  };
  const showHideModal = () => {
    getCartItems();
    setModalShow(!modalShow);
  };

  const handleMenuClicked = () => {
    setActiveClass(!activeclass);
  };
  const clearCart = () => {
    setCart([]);
    localStorage.setItem("SCLOCALCART", JSON.stringify([]));
    localStorage.setItem('count', 0);
  };

  // Update cart quantity function to be passed to HomeCartView
  const updateCartQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.productID === productId
        ? { ...item, productQuantity: newQuantity }
        : item
    );
    setCart(updatedCart);

    // Update the local storage with the updated cart
    localStorage.setItem("SCLOCALCART", JSON.stringify(updatedCart));
  };

  // Remove item from cart function to be passed to HomeCartView
  const removeItem = (productId) => {
    // Remove the item from the local state
    const updatedCart = cart.filter((item) => item.productID !== productId);
    setCart(updatedCart);

    // Update the local storage with the updated cart
    localStorage.setItem("SCLOCALCART", JSON.stringify(updatedCart));
  };
  const handleCategoryClick = (category) => {
    // history.push(`/categories?category=${category}`);
    history.push({
      pathname: '/categories',
      state: { category },
    });
  };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to handle the dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="main_nav_container">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-right">
            <div className="logo_container">
              <div>
                {/* <Link to="/fashion-cube"> */}
                <img style={{
                width: '100px',
                height: '100px',
                // Media query for adjusting styles on smaller screens
                '@media (max-width: 600px)': {
                  width: '50px', // Adjust the width as needed for small screens
                  height: '50px', // Adjust the height as needed for small screens
                },
              }} src={logo} />
                ZEPHYR
              </div>

              {/* </Link> */}
            </div>
            <nav className="navbar">
              <ul className="navbar_menu">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li style={{marginTop:'5px'}}  className={`mega-drop-down ${isDropdownOpen ? "open" : ""}`}
                onMouseEnter={toggleDropdown}
                onMouseLeave={toggleDropdown} >
                   <a>
                    Categories{" "}
                    <i className={`fa fa-angle-down ${isDropdownOpen ? "rotate" : ""}`}></i>
                  </a>
                  <ul className="dropdown-categories">
                    <li onClick={() => handleCategoryClick("APPAREL")}>
                      <a >Apparel</a>
                    </li>
                    <li onClick={() => handleCategoryClick("BAGS")}>
                      <a>Bags</a>
                    </li>
                    <li onClick={() => handleCategoryClick("EYEWEAR")}>
                      <a>EyeWear</a>
                    </li>
                    <li onClick={() => handleCategoryClick("FOOTWEAR")}>
                      <a>FootWear</a>
                    </li>
                    <li onClick={() => handleCategoryClick("JEWELLERY")}>
                      <a>Jewellery</a>
                    </li>
                    <li onClick={() => handleCategoryClick("WATCHES")}>
                      <a>Watches</a>
                    </li>
                  </ul>
                  {/* </Link> */}
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
              <ul className="navbar_user">
                <li>
                  {/* <a href="#">
                    <i style={{ fontSize: '18px',marginLeft:'15px' }} className="fa fa-search " aria-hidden="true"></i>
                  </a> */}
                </li>
                {/* Add a conditional rendering for the user profile link */}
                {localStorage.getItem('USERSTATUS') !== 'GUEST' ? (
                  <Link to="/viewProfile">
                    <i style={{ fontSize: '18px',color:'black',position:'relative',left:'-20px'}} className="fa fa-user" aria-hidden="true"></i>
                  </Link>
                ) : (
                  // You can add a disabled style or render null based on your requirement
                  <span style={{ fontSize: '18px', color: 'gray',position:'relative',left:'-30px' }}>
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </span>
                )}
                <li className="checkout">
                  {/* <a href="#" onClick={() => showHideModal()}> */}
                  <div onClick={() => showHideModal()}>
                    <i style={{ fontSize: '18px' }} className="fas fa-shopping-bag"></i>
                    {
                      // cart.totalQty !== undefined &&
                      <span style={{marginLeft:'-10px'}} id="checkout_items" className="checkout_items">
                        {/* {cart.totalQty} */}{c}
                      </span>
                    }
                  </div>
                  {/* </a> */}
                </li>
              </ul>
              {/* <div
                className="hamburger_container"
                // onClick={() => this.handleMenuClicked()}
              >
                <i className="fa fa-bars" aria-hidden="true"></i>
              </div> */}
            </nav>
          </div>
        </div>
      </div>
      <MediaQuery query={device.max.tabletL}>
        <MobileMenu activeClass={activeclass} onClose={handleMenuClicked} />
      </MediaQuery>
      {modalShow ? (
        <HomeCartView
          cart={cart}
          show={modalShow}
          onHide={showHideModal}
          clearCart={clearCart}
          updateCartQuantity={updateCartQuantity}
          removeItem={removeItem}
        />
      ) : null}
    </div>
  );
};

export default NavBar;
