import React, { useState } from "react";
import "./getotp.css";
import bg from "../Images/bg.png";
import arrow from "../Images/arrow.png";
import { Link, useNavigate } from "react-router-dom"; // Import Link
import axios from "axios";

function GetOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate;
  const handleVerifyOTP = async (e) => {
    console.log("handleVerifyOTP");
    e.preventDefault();
    try {
      if (!otp) {
        setError("Please enter the OTP.");
        return;
      }
      const response = await axios.post(
        "http://localhost:8000/api/otpmatching",
        { otp },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.success) {
        navigate("/resetPass");
      }
      return;
    } catch (error) {
      setError("Incorrect OTP. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-container3">
      <img src={bg} alt="bg" className="overlay-bg3" />
      <div className="getotp-form-cover">
        <div className="arrow">
          <img src={arrow} alt="arrow" />
        </div>
        <div className="getotp-form-container">
          <h1>
            Empowering Your Trades: Where <br /> Opportunities Meet Expertise
          </h1>
          <h2>Please enter the OTP you received on email</h2>
          <form onSubmit={handleVerifyOTP}>
            <div className="otp">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                name="otp"
                id="otp"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            {error && <div className="error">{error}</div>}
            <div className="submit">
              <button type="submit">Verfy OTP</button>
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

export default GetOtp;
