import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { getDepartments } from '../../services/DepartmentService';
import { getCartByUserId } from '../../services/cartService';

const NavBarContainer = () => {
  // const [cart, setCart] = useState({});
  // const [modalShow, setModalShow] = useState(false);
  // const [activeclass, setActiveClass] = useState(false);

  useEffect(() => {
    // Fetch departments
    // getDepartments()
    //   .then((response) => setDepartments(response.data))
    //   .catch((error) => console.error('Error fetching departments:', error));

    // Fetch cart by user ID
    // getCartByUserId()
    //   .then((response) => setCart(response.data))
    //   .catch((error) =>console.error('Error fetching cart:', error));
    
    // setCart({items: {},
    //   totalPrice: 0,
    //   totalQty: 0,})
  }, []);
  

  // const showHideModal = () => {
  //   setModalShow(!modalShow);
  // };

  // const handleMenuClicked = () => {
  //   setActiveClass(!activeclass);
  // };

  return (
    <NavBar
      // cart={cart}
      // modalShow={modalShow}
      // activeclass={activeclass}
      // showHideModal={showHideModal}
      // handleMenuClicked={handleMenuClicked}
    />
  );
};

export default NavBarContainer;
