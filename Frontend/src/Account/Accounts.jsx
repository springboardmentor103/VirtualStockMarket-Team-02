import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../Images/bg.png";
import profile from "../Images/profile.png";
import Sidebars from "../sidebar/Sidebars";
import logo11 from "../Images/icon11.png";
import { datacontext } from "../Datacontext";

import "./Account.css";
export default function Account() {
  const navigate = useNavigate();

  const { dispdata, tokenState } = useContext(datacontext);
  useEffect(() => {
    if (tokenState.authtoken) {
      navigate("/Account");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/forgetPassword");
    }
  }, [tokenState, navigate]);
  return (
    <div className="account-container">
      <img src={bg} alt="bg" className="account-bg" />
      <Sidebars />
      <div className="account-right-cover">
        <div className="account-right-container">
          <div className="title-container">
            <img src={logo11} alt="logo11" />
            <p>Account</p>
          </div>
          <div className="profile-info-container">
            <div className="profile-pic">
              <img src={profile} alt="pic" />
            </div>
            <div className="fields-cover">
              <div className="field-container">
                <span>Username</span>
                <div className="field">{dispdata.name}</div>
              </div>
              <div className="field-container">
                <span>Email</span>
                <div className="field">{dispdata.email}</div>
              </div>
              <div className="field-container">
                <span>Password</span>
                <div className="field">********</div>
              </div>
            </div>
            <button>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
