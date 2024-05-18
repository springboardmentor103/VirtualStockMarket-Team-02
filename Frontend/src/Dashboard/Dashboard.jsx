import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../Dashboard/bg.jpg";
import "./dashboard.css";
import { datacontext } from "../Datacontext";
import Sidebars from "../sidebar/Sidebars";
import logo11 from "../Images/icon11.png";
import logo12 from "../Images/icon12.png";
import logo13 from "../Images/icon13.png";
import logo14 from "../Images/icon14.png";

export default function Dashboard() {
  const { tokenState } = useContext(datacontext);
  const navigate = useNavigate();
  useEffect(() => {
    if (tokenState.authtoken) {
      navigate("/dashboard");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/forgetPassword");
    }
  }, [tokenState, navigate]);
  return (
    <div className="dashboard-container">
      <img src={bg} alt="bg" className="dashboard-bg" />
      <div className="layer"></div>
      <div className="dashboard-content">
        <Sidebars />
        <div className="charts-1">
          <div className="navbar">
            <div className="left">
              <img src={logo11} alt="left" />
              <p>Dashboard</p>
            </div>
            <div className="right">
              <img src={logo12} alt="search" />
              <img src={logo13} alt="bell" />
              <img src={logo14} alt="settings" />
            </div>
          </div>
          <div className="monthly-retail"></div>
        </div>
        <div className="charts-2"></div>
      </div>
    </div>
  );
}
