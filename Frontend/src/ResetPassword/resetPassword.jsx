import React from 'react';
import "../Login/login.css"

function ResetPassword() {
    return (
        <div className="login-container"> 
            <div className="content-wrapper">
                <div className="login-header">
                    <div className="header-text">Empowering Your Trades: Where Opportunities Meet Expertise</div>
                </div>
                <h2>Reset Your Password</h2>
                <p>Enter new password</p>
                <form className="login-form">
                    <div className="input-group">
                        <input type="password" placeholder="Enter New Password" required />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Confirm Password" required />
                    </div>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
