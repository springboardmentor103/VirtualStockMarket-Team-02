import React, { useState } from "react";
import "../Login/login.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

function ForgotPassword() {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleOtpGeneration = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setLoading(true); // Set loading to true when API call starts
      try {
        const data = { email };
        fetch("http://localhost:8000/api/otpgenerate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            setLoading(false); // Set loading to false when response is received
            if (data.success) {
              setShowOtpInput(true);
            } else {
              alert("Unable to send OTP, please try again");
            }
          })
          .catch((error) => {
            setLoading(false); // Ensure loading is set to false on error
            console.error("Error:", error);
          });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      alert("Invalid email");
    }
  };

  const handleOtpVerification = async () => {
    setLoading(true); // Set loading to true when API call starts
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
          setLoading(false); // Set loading to false when response is received
          if (data.success) {
            navigate("/reset-password", { state: { email: email } });
          } else {
            alert("OTP verification failed, please try again");
          }
        })
        .catch((error) => {
          setLoading(false); // Ensure loading is set to false on error
          console.error("Error:", error);
        });
    } catch (error) {
      setLoading(false);
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
        {loading ? (
          <Loader />
        ) : !showOtpInput ? (
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
              <button type="button" onClick={handleOtpGeneration}>
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
              <button type="button" onClick={handleOtpVerification}>
                Continue
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
