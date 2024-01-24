import React, { useState } from "react";
// import Validator from "../../utils/Validator";
// import { DEFAULT_RULE, EMAIL_RULE } from "../../utils/Validator/rule";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { userRegister } from "../../redux/actions/RegisterAction";
import LoadingButton from "../LoadingButton";

const RegisterForm = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const { name, email, password } = formData;

    // if (!Validator(name, DEFAULT_RULE)) {
    //   console.log("Name Error");
    //   return;
    // }

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
      .userRegister(name, email, password, password)
      .then((res) => {
        console.log(res);
        props.loginClicked();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="login-form">
        <h2>Register</h2>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Name "
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="false"
          />
          <i className="fa fa-user"></i>
        </div>

        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Email "
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="false"
          />
          <i className="fa fa-envelope"></i>
        </div>

        <div className="form-group log-status">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="false"
          />
          <i className="fa fa-lock"></i>
        </div>
        <span className="alert">Invalid Credentials</span>
        <LoadingButton
          type="button"
          className="log-btn"
          loading={loading}
          onClick={handleSubmit}
        >
          Register
        </LoadingButton>
        <div
          onClick={props.loginClicked}
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#c4c4c4",
            cursor: "pointer",
          }}
        >
          Already have an account? Please login.
        </div>
      </div>
    </div>
  );
};

RegisterForm.propTypes = {
  loginClicked: PropTypes.func,
};

// const mapDispatchToProps = {
//   userRegister,
// };
// const mapStoreToProps = (state) => ({
//   register_loading: state.register.register_loading,
//   register_error: state.register.error,
// });

// export default connect(mapStoreToProps, mapDispatchToProps)(RegisterForm);
export default RegisterForm;

