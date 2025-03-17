import React, { useState } from 'react';
import './css/signUp.css';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        // Handle sign up logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className='SignUpContent'>
            <div className='container'>
                <form onSubmit={handleSignUp}>
                    <h2 className='welcome'>Welcome!</h2>
                    <label className='text'>Email:</label>
                    <input
                        className="userInput"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className='text'>Password:</label>
                    <input
                        className='userInput'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="button-container">
                        <Button type="submit">Sign Up</Button>
                        <Link to ="/signup" className="have-account">Already have an account?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
