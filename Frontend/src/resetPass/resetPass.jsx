import React, { useState } from "react";
import "./resetPass.css";
import bg from "../Images/bg.png";
import arrow from "../Images/arrow.png";
import { Link } from "react-router-dom";
import axios from "axios";

function ResetPass() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      if (!newPassword || !confirmPassword) {
        setError("Please enter both new and confirm passwords.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/newpassword",
        { newPassword }
      );

      // Redirect to PassSuccess component
      return;
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-container4">
      <img src={bg} alt="bg" className="overlay-bg4" />
      <div className="resetPass-form-cover">
        <div className="arrow">
          <img src={arrow} alt="arrow" />
        </div>
        <div className="resetPass-form-container">
          <h1>
            Empowering Your Trades: Where <br /> Opportunities Meet Expertise
          </h1>
          <h2>Reset Your Password?</h2>
          <form onSubmit={handleResetPassword}>
            <div className="newPass">
              <label htmlFor="newPass">New Password</label>
              <br />
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                name="newPass"
                id="newPass"
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="confirmPass">
              <label htmlFor="confirmPass">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                name="confirmPass"
                id="confirmPass"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error">{error}</div>}
            <div className="submit">
              <button type="submit">
                <Link to="/PassSuccess">Save</Link>
              </button>
            </div>
          </form>
          <div className="signup-link-container">
            <span>
              Don’t have an account?
              <Link to="/signup" className="sign-link">
                Signup
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPass;
