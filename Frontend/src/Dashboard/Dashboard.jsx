import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../Dashboard/bg.jpg";
import "./dashboard.css";
import { datacontext } from "../Datacontext";

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
      <div className="sidebar-container">
        <div className="sidebar"></div>
      </div>
    </div>
  );
}
