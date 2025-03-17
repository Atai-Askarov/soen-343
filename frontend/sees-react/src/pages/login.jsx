import React, { useState } from 'react';
import './css/login.css';
import Button from '../components/Button';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic here
        
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className='loginContent'>
            <div className='container'>
                <form onSubmit={handleLogin}>
                    <h2 className='welcome'>Welcome Back!</h2>
                    <label className='text'>
                        Email:
                        <input
                            className='userInput'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label className='text'>
                        Password:
                        <input
                            className='userInput'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    
                    </label>
                    <Button type="submit">Login</Button>
                </form> 
            </div>
        </div>
    );
};

export default LoginPage;
