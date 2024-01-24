import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./style.css";

function LoadingButton(props) {
  const { type, className, loading, onClick, style, children } = props;

  return (
    <button
      type={type}
      className={classNames("btn btn-wide", className, {
        "btn-wait": loading,
      })}
      style={style}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Please Wait..." : <span>{children}</span>}
    </button>
  );
}

LoadingButton.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

LoadingButton.defaultProps = {
  className: "btn-primary btn-7",
  loading: false,
  type: "button",
};

export default LoadingButton;
