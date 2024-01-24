import React, { useState } from "react";
// import { connect } from "react-redux";
// import { userLogin } from "../../redux/actions/LoginAction";
// import jumpTo from "../../modules/Navigation";
// import Validator from "../../utils/Validator";
// import { DEFAULT_RULE, EMAIL_RULE } from "../../utils/Validator/rule";
import PropTypes from "prop-types";
import LoadingButton from "../LoadingButton";

const LoginForm = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const { email, password } = formData;

    // if (!Validator(email, EMAIL_RULE)) {
    //   console.log("email Error");
    //   return;
    // }

    // if (!Validator(password, DEFAULT_RULE)) {
    //   console.log("Password Error");
    //   return;
    // }

    setLoading(true);

    props
      .userLogin(email, password)
      .then((res) => {
        console.log(res);
        setLoading(false);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Email "
            id="UserName"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="false"
          />
          <i className="fa fa-user"></i>
        </div>
        <div className="form-group log-status">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            id="Passwod"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="false"
          />
          <i className="fa fa-lock"></i>
        </div>
        <span className="alert">Invalid Credentials</span>
        <a className="link" href="#" onClick={props.forgotPasswordClicked}>
          Lost your password?
        </a>
        <LoadingButton
          type="button"
          className="log-btn"
          loading={loading}
          onClick={handleSubmit}
        >
          Log in
        </LoadingButton>
        <div
        //   onClick={props.registerClicked}
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#c4c4c4",
            cursor: "pointer",
          }}
        >
          New user? Please Register
        </div>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  forgotPasswordClicked: PropTypes.func,
  registerClicked: PropTypes.func,
};

// const mapDispatchToProps = {
//   userLogin,
// };

// const mapStoreToProps = (state) => ({
//   login_loading: state.login.login_loading,
//   login_error: state.login.error,
// });

// export default connect(mapStoreToProps, mapDispatchToProps)(LoginForm);
export default LoginForm;

