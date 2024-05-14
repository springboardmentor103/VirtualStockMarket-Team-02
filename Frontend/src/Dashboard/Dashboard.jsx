import React from "react";
import bg from "../Dashboard/bg.jpg";
import "./dashboard.css";
export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <img src={bg} alt="bg" className="dashboard-bg" />
    </div>
  );
}
