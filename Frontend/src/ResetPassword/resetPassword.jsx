import React from "react";
import "../Login/login.css";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/password-changed");
  };

  return (
    <div className="login-container">
      <div className="content-wrapper">
        <div className="login-header">
          <div className="header-text">
            Empowering Your Trades: Where Opportunities Meet Expertise
          </div>
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
          <button type="submit" onClick={handleSubmit}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
