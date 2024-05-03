import React, { useState } from "react";
import "./forgetPassword.css";
import bg from "../Images/login_page.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// ...

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false); // New state variable

  

const navigate = useNavigate(); // Instantiate useNavigate

const handleForgotPassword = async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior
  try {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const response = await axios.post("http://localhost:8000/api/otpgenerate", { email });
    const data = response.data;

    if (data.success) {
      navigate('/getotp'); // Navigate to Get OTP page
    } else {
      setError("Failed to generate OTP. Please try again later.");
    }
  } catch (error) {
    setError("Something went wrong. Please try again later.");
    console.error("Error:", error);
  }
};

  // const handleForgotPassword = async () => {
  //   try {
  //     if (!email) {
  //       setError("Please enter your email address.");
  //       return;
  //     }

  //     const response = await axios.post("http://localhost:8000/api/otpgenerate", { email });
  //     const data = response.data;

  //     if (data.success) {
  //       setOtpGenerated(true); // Set otpGenerated to true upon successful OTP generation
  //     } else {
  //       setError("Failed to generate OTP. Please try again later.");
  //     }
  //   } catch (error) {
  //     setError("Something went wrong. Please try again later.");
  //     console.error("Error:", error);
  //   }
  // };

  return (
    <div className="login-container">
      {/* <img src={bg} alt="bg" /> */}
      <div className="overlay-contant">
        <h1>
          Empowering Your Trades: Where <br /> Opportunities Meet Expertise
        </h1>
        <p>Forgot Your Password ?</p>
        <p>Please enter the email you used to sign in</p>
        <div className="form-container">
          <form>
            <label>Email</label>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <div className="error">{error}</div>}
            <div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="btn"
              >
                Request OTP
              </button>
            </div>
            {otpGenerated && <Link to="/getotp" className="btn">Go to Get OTP</Link>} {/* Show link upon successful OTP generation */}
          </form>
        </div>
        <div className="donthaveacc">
          <div>
            <span id="account">Don't have an account?</span>
            <Link to="/signup" className="signup">Signup</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
