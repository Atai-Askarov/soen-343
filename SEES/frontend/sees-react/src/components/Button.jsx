import React from 'react'
import './css/button.css'

const Button = ({ onClick, children, type = 'button' }) => {
    return (
        <button type={type} className='adjust-button' onClick={onClick}>
            {children}
        </button>
    );
};

//To make your button, follow this skeleton: <button type="wantedType(e.g "submit")" className="custom-button">Button Text</button>
export default Button;
