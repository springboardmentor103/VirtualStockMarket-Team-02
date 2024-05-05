import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Login/login.css";

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
     const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check for empty fields before proceeding
        if (!email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const data = {
            email: email,
            password: password,
            name: email.split('@')[0]  // Assuming the name is derived from the email
        };

        fetch('http://localhost:8000/api/createuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === false) {
                if (data.message.email && data.message.email.includes("Email already exists.")) {
                    alert('Email already exists.');
                } else {
                    // Handle other potential error messages
                    alert(data.message.email ? data.message.email[0] : 'Signup failed!');
                }
            } else {
                console.log('Success:', data);
                // alert('Signup successful!');
                navigate('/dashboard');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Signup failed!');
        });
    };

    return (
        <div className="login-container"> 
            <div className="content-wrapper">
                <div className="login-header">
                    <div>Empowering Your Trades: Where Opportunities Meet Expertise</div>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="placeholder-heading">Email</div>
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Enter Email" 
                            required 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="placeholder-heading">Password</div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Enter Password" 
                            required 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="placeholder-heading">Confirm Password</div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            required 
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
                <div className="signup-link">
                    Already have an account? <a href="/">Login</a>
                </div>
            </div>
        </div>
    );
}

export default Signup;
