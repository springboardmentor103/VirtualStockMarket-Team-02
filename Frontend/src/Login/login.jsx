import React from 'react';
import '../Login/login.css'; 
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="login-container">
            <div className="content-wrapper">
                <div className="login-header">
                    <div>Empowering Your Trades: Where Opportunities Meet Expertise</div>
                </div>
                <form className="login-form">
                    <div className="placeholder-heading">
                        Email
                    </div>
                    <div className="input-group">
                        <input type="email" placeholder="Enter Email" required />
                    </div>
                     <div className="placeholder-heading">
                        Password
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Enter Password" required />
                    </div>
                    <div className="form-footer">
                        <label>
                            <input type="checkbox" /> Keep me logged in
                        </label>
                        <Link to="/forgotPassword">Forgot password?</Link>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div className="signup-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
