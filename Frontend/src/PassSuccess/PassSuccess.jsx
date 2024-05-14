import React from "react";
import "./PassSuccess.css";
import { Link } from "react-router-dom";
import bg from "../Images/bg.png";
import arrow from "../Images/arrow.png";
import logo_icon from "../Images/pngtree-green-check-mark-png-image_6525691.png";

function LoginSuccess() {
  return (
    <div className="login-container5">
      <img src={bg} alt="Background" className="overlay-bg5" />
      <div className="passSuccess-form-cover">
        <div className="arrow">
          <img src={arrow} alt="arrow" />
        </div>
        <div className="logo-icon">
          <img src={logo_icon} alt="Logo" />
        </div>
        <div className="passSuccess-form-container">
          <h2>Password Changed!</h2>
          <h2>
            Your password has been Changed<br></br>Successfully.
          </h2>
          <div className="submit">
            <button>
              <Link to="/">Go to Login</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSuccess;
