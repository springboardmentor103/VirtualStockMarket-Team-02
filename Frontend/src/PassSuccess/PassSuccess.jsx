import React from "react";
import "./PassSuccess.css";
import { useNavigate } from "react-router-dom";
import bg from "../Images/bg.png";
import arrow from "../Images/arrow.png";
import logo_icon from "../Images/pngtree-green-check-mark-png-image_6525691.png";

function PassSuccess() {
  const navigate = useNavigate();
  const handlenavigate = () => {
    navigate("/login");
  };
  return (
    <div className="pass-container">
      <img src={bg} alt="bg" className="overlay-bg" />
      <div className="pass-form-cover">
        <div className="arrow">
          <img src={arrow} alt="arrow" />
        </div>
        <div className="pass-form-container">
          <div className="image-tick">
            <img src={logo_icon} alt="logo" />
            <h2>Password Changed!</h2>
          </div>
          <div className="text-box">
            <p>Your Password has been Changed Successfully.</p>
          </div>
          <button onClick={handlenavigate}>Go to Login</button>
        </div>
      </div>
    </div>
  );
}

export default PassSuccess;
