// Dashboard.js
import React from "react";
// import { useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
// import TopBar from './TopBar';
// import StockList from './StockList';
import "./Dashboard.css";

function Dashboard() {
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   // Clear the user from local storage or any other state management you are using

  //   // Redirect to login page
  //   navigate('/dashboard');
  // };

  return (
    <div className="dashboard">
      <Sidebar />
      {/* <div className="main-content">
        <TopBar />
        <StockList />
        <div className="logout-section">
          <h1>Welcome to the Dashboard!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div> */}
    </div>
  );
}

export default Dashboard;
