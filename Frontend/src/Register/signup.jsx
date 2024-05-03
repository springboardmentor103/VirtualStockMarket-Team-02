import React from 'react';
import "../Login/login.css"
function Signup() {
    return (
        <div className="login-container"> 
            <div className="content-wrapper">
                <div className="login-header">
                    <div>Empowering Your Trades: Where Opportunities Meet Expertise</div>
                </div>
                <form className="login-form">
                    <div className="placeholder-heading">Email</div>
                    <div className="input-group">
                        <input type="email" placeholder="Enter Email" required />
                    </div>
                    <div className="placeholder-heading">Password</div>
                    <div className="input-group">
                        <input type="password" placeholder="Enter Password" required />
                    </div>
                    <div className="placeholder-heading">Confirm Password</div>
                    <div className="input-group">
                        <input type="password" placeholder="Confirm Password" required />
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
