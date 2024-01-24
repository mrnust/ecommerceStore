import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import PropTypes from "prop-types";
import "./style.css";

const LoginRegister = (props) => {
  const [showLogin, setShowLogin] = useState(props.showlogin);

  const handleHide = () => {
    setShowLogin(false);
    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      id="loginModal"
      className="modal fade login"
    >
      <Modal.Body>
        <div className="modal--close--button" onClick={handleHide}>
          <i className="fas fa-times"></i>
        </div>
        {props.login ? (
          <LoginForm registerClicked={props.registerClicked} />
        ) : (
          <RegisterForm loginClicked={props.loginClicked} />
        )}
      </Modal.Body>
    </Modal>
  );
};

LoginRegister.propTypes = {
  showlogin: PropTypes.bool,
  onHide: PropTypes.func,
  login: PropTypes.bool,
  registerClicked: PropTypes.func,
  loginClicked: PropTypes.func,
};

export default LoginRegister;
