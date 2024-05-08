import React, { useState } from "react";
import "../Login/login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleOtpGeneration = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      try {
        const data = {
          email: email,
        };

        fetch("http://localhost:8000/api/otpgenerate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log(data);
              setShowOtpInput(true);
            } else {
              alert("Unable to send otp, please try again");
            }
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("invalid email");
    }
  };

  const handleOtpVerification = async () => {
    try {
      const data = {
        email: email,
        otp: otp,
      };
      fetch("http://localhost:8000/api/otpmatching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
            navigate("/reset-password");
          } else {
            alert("Unable to send otp, please try again");
          }
        });
    } catch (error) {
      console.log(error);
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
        <h2>Forgot Your Password?</h2>
        {!showOtpInput ? (
          <>
            <p>Please enter the email you used to sign in</p>
            <form className="login-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="button" onClick={() => handleOtpGeneration()}>
                Request OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <p>Please enter the otp</p>
            <form className="login-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
              <button type="button" onClick={() => handleOtpVerification()}>
                Save
              </button>
            </form>
          </>
        )}
        <div className="signup-link">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
