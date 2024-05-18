import React, { useState, useEffect } from "react";
import "../Login/login.css";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../Loader/Loader";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      navigate("/forgot-password"); // Redirect back if no email is found
    }
  }, [location, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:8000/api/newpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      setLoading(false);

      if (response.ok) {
        navigate("/password-changed");
      } else {
        alert(`Failed to reset password: ${responseData.message}`);
      }
    } catch (error) {
      setLoading(false); // Ensure loading is set to false in case of an error
      console.error("Error:", error);
    }
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
        {loading ? (
          <Loader />
        ) : (
          <>
            <p>Enter new password</p>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Enter New Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit">Save</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
