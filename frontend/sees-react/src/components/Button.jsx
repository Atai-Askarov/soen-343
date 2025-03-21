import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import "./css/button.css";

const Button = ({ onClick, children, type = "button" }) => {
  return (
    <button type={type} className="adjust-button" onClick={onClick}>
      {children}
    </button>
  );
};

// Add prop validation using PropTypes
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

export default Button;
