import React, { useState } from 'react';
import LoginRegister from "../LoginRegisterModal";
// import Auth from "../../modules/Auth";

const TopNavBar = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [login, setLogin] = useState(true);

  const showHideModal = () => {
    setModalShow(false);
  };

  const loginClicked = () => {
    setModalShow(true);
    setLogin(true);
  };

  const registerClicked = () => {
    setModalShow(true);
    setLogin(false);
  };

  const logout = () => {
    // Auth.logout();
    window.location.reload();
  };

  return (
    <div className={`top_nav ${props.className}`}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="top_nav_left">
              free shipping on all u.s orders over $50
            </div>
          </div>
          <div className="col-md-6 text-right">
            <div className="top_nav_right">
              <ul className="top_nav_menu">
                {/* <li className="currency">
                  <a href="#">
                    usd
                    <i className="fa fa-angle-down"></i>
                  </a>
                  <ul className="currency_selection">
                    <li>
                      <a href="#">cad</a>
                    </li>
                    <li>
                      <a href="#">aud</a>
                    </li>
                    <li>
                      <a href="#">eur</a>
                    </li>
                    <li>
                      <a href="#">gbp</a>
                    </li>
                  </ul>
                </li> */}

                <li className="language">
                  <a href="#">
                    English
                    <i className="fa fa-angle-down"></i>
                  </a>
                  <ul className="language_selection">
                    <li>
                      <a href="#">French</a>
                    </li>
                    <li>
                      <a href="#">Italian</a>
                    </li>
                    <li>
                      <a href="#">German</a>
                    </li>
                    <li>
                      <a href="#">Spanish</a>
                    </li>
                  </ul>
                </li>

                {/* {Auth.getUserDetails() !== undefined &&
                Auth.getUserDetails() !== null &&
                Auth.getToken() !== undefined ? (
                  <li className="account">
                    <a href="#">
                      {`Welcome ${Auth.getUserDetails().user_name}`}
                      <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="account_selection">
                      <li>
                        <a href="#" onClick={logout}>
                          <i
                            className="fas fa-sign-in-alt"
                            aria-hidden="true"
                          ></i>
                          Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : ( */}

                  <li className="account">
                    <a href="#">
                      My Account
                      <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="account_selection">
                      <li>
                        <a style={{marginLeft:'-45px'}} href="#" onClick={loginClicked}>
                          <i
                            className="fas fa-sign-in-alt"
                            aria-hidden="true"
                          ></i>
                          Sign In
                        </a>
                      </li>
                      <li>
                        <a style={{marginLeft:'-45px'}} href="#" onClick={registerClicked}>
                          <i
                            className="fa fa-user-plus"
                            aria-hidden="true"
                          ></i>
                          Register
                        </a>
                      </li>
                  </ul>
                  
                </li>
                
                {/* )} */}
              </ul>
            </div>
            
          </div>
          
        </div>
        
      </div>
      {modalShow ? (
        <LoginRegister
          show={modalShow}
          login={login}
          registerClicked={registerClicked}
          loginClicked={loginClicked}
          onHide={showHideModal}
        />
      ) : null}
      
    </div>
    
  );
};

export default TopNavBar;
            