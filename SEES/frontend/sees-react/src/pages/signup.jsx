import React, { useState } from 'react';
import './css/signUp.css';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();
    
        // Basic form validation, subject to change
        if (!email || !password) {
            alert("Please fill out all fields.");
            return;
        }
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        // Password format validation (e.g., minimum 8 characters, at least one number)
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Password must be at least 8 characters long, contain at least one number, one lowercase and one uppercase letter.");
            return;
        }
    
        try {
            // Send the POST request to the server
            const response = await axios.post("http://localhost:5050/api/signUp", { //TODO: Change to the correct backend route
                email,
                password,
            });
    
            // Log response to check the status
            console.log('Server Response:', response);
    
            // Check for successful account creation
            if (response.status === 201) {
                alert("Account created successfully!");
    
                // Redirect to the login page after successful account creation
                navigate("/login");
            } else {
                alert(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            // Log the error for debugging
            console.error("Error creating account:", error);
    
            if (error.response && error.response.status === 409) {
                alert("Email already in use.");
            } else {
                alert("Error creating account. Please try again.");
            }
        }
    };

    return (
        <div className='SignUpContent'>
            <div className='container'>
                <form onSubmit={handleSignUp}>
                    <h2 className='welcome'>Welcome!</h2>
                    <label htmlFor="email" className='text'>Email:</label>
                    <input
                        className="userInput"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className='text'>Password:</label>
                    <input
                        className='userInput'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="button-container">
                        <Button type="submit">Sign Up</Button>
                        <Link to ="/login" className="have-account">Already have an account?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
