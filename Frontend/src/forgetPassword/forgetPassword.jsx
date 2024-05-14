import React, { useState } from "react";
import "./forgetPassword.css";
import bg from "../Images/bg.png";
import arrow from "../Images/arrow.png";
import { Link } from "react-router-dom";
function ForgetPassword() {
  const [forgetData, setForgetData] = useState({
    email: "",
    otp: "",
  });
  const [err, seterr] = useState({
    email: "",
    otp: "",
  });
  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/otpgenerate",
        { email: forgetData.email }
      );
      /*const data=await response.json();*/
      console.log(response.data);

      return;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForgetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="login-container2">
      <img src={bg} alt="bg" className="overlay-bg2" />
      <div className="forgotpassword-form-cover">
        <div className="arrow">
          <img src={arrow} alt="arrow" />
        </div>
        <div className="forgotPassword-form-container">
          <h1>
            Empowering Your Trades: Where <br /> Opportunities Meet Expertise
          </h1>
          <h2>FORGET YOU PASSWORD ?</h2>
          <h2>PLEASE ENTER THE EMAIL YOU USED TO SIGN IN</h2>
          <form>
            <div className="email">
              <label htmlFor="email">Email</label>
              <br />
              <input
                type="email"
                placeholder="Email Address"
                value={forgetData.email}
                name="email"
                id="email"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="submit">
              <button type="button" onClick={handleForgotPassword}>
                <Link to="/getotp">Request OTP</Link>
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

export default ForgetPassword;
