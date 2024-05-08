import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./PasswordChanged.css";
import doneicon from "../logos/Done.png";

function PasswordChanged() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="login-container">
      <div className="content-wrapper" style={{ textAlign: "center" }}>
        <div className="login-header">
          <div className="status-icon">
            <img src={doneicon} alt="Checkmark" />
          </div>
          <h3>Password Changed!</h3>
          <div className="password-content">
            Your Password has been Changed Successfully.
          </div>
          <div className="button">
            <button onClick={() => navigate("/dashboard")}>
              Go To Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordChanged;
