import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Stocks from "./Stocks";
import Accounts from "./Accounts";
// import Mailbox from "./Mailbox";
// import UIElements from "./UIElements";
// import Charts from "./Charts";
// import Tables from "./Tables";
// import LeaderBoard from "./LeaderBoard";
import { FaBars } from "react-icons/fa";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);

  const renderContent = () => {
    switch (activeItem) {
      case "accounts":
        return <Accounts />;
      // case "mailbox":
      //   return <Mailbox />;
      // case "app":
      //   return <App />;
      // case "uiElements":
      //   return <UIElements />;
      // case "charts":
      //   return <Charts />;
      // case "tables":
      //   return <Tables />;
      // case "leaderboard":
      //   return <LeaderBoard />;
      case "dashboard":
      default:
        return (
          <div className="stocks-section">
            <Stocks />
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <FaBars
        className={`menu-icon ${isSidebarOpen ? "hidden" : ""}`}
        onClick={toggleSidebar}
      />
      <Sidebar
        onActiveItemChange={setActiveItem}
        isOpen={isSidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
      <div
        className="main-content"
        onClick={() => isSidebarOpen && setSidebarOpen(false)}
      >
        {renderContent()}
      </div>

      {/* <FaBars
        className="menu-icon"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar onActiveItemChange={setActiveItem} isOpen={isSidebarOpen} />
      <div className="main-content">{renderContent()}</div> */}
    </div>
  );
}

export default Dashboard;
