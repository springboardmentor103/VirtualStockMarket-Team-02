import React from "react";
import "../Login/login.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const handleRequestOTP = () => {
    navigate("/reset-password");
  };
  return (
    <div className="login-container">
      <div className="content-wrapper">
        <div className="login-header">
          <div className="header-text">
            Empowering Your Trades: Where Opportunities Meet Expertise
          </div>
        </div>
        <h2>Forgot Your Password?</h2>
        <p>Please enter the email you used to sign in</p>
        <form className="login-form">
          <div className="input-group">
            <input type="email" placeholder="Email Address" required />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Enter OTP" />
          </div>
          <button type="button">
            <div onClick={handleRequestOTP}>Request OTP</div>
          </button>
        </form>
        <div className="signup-link">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
