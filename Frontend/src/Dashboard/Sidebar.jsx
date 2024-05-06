// Sidebar.js
import React, { useState } from "react";
import "./Sidebar.css";
import {
  AiOutlineDashboard,
  AiOutlineMail,
  AiOutlineAppstore,
} from "react-icons/ai";
import { BiUserCircle, BiBarChartAlt2 } from "react-icons/bi";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { MdLeaderboard, MdOutlineTableChart } from "react-icons/md";

function Sidebar({ onActiveItemChange, isOpen, closeSidebar }) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleItemClick = (item) => {
    setActiveItem(item);
    onActiveItemChange(item); // Notify parent component of the change
    closeSidebar();
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <BiUserCircle className="header-icon" />
        Springboard
      </div>
      <ul className="sidebar-menu">
        <li
          className={activeItem === "dashboard" ? "active" : ""}
          onClick={() => handleItemClick("dashboard")}
        >
          <AiOutlineDashboard />
          Dashboard
        </li>
        <li
          className={activeItem === "accounts" ? "active" : ""}
          onClick={() => handleItemClick("accounts")}
        >
          <AiOutlineDashboard />
          Accounts
        </li>
        <li
          className={activeItem === "app" ? "active" : ""}
          onClick={() => handleItemClick("app")}
        >
          <AiOutlineAppstore />
          App
        </li>
        <li
          className={activeItem === "mailbox" ? "active" : ""}
          onClick={() => handleItemClick("mailbox")}
        >
          <AiOutlineMail />
          Mailbox
        </li>
        <li
          className={activeItem === "uiElements" ? "active" : ""}
          onClick={() => handleItemClick("uiElements")}
        >
          <RiLayoutMasonryFill />
          UI Elements
        </li>
        <li
          className={activeItem === "charts" ? "active" : ""}
          onClick={() => handleItemClick("charts")}
        >
          <BiBarChartAlt2 />
          Charts
        </li>
        <li
          className={activeItem === "tables" ? "active" : ""}
          onClick={() => handleItemClick("tables")}
        >
          <MdOutlineTableChart />
          Tables
        </li>
        <li
          className={activeItem === "leaderboard" ? "active" : ""}
          onClick={() => handleItemClick("leaderboard")}
        >
          <MdLeaderboard />
          LeaderBoard
        </li>
      </ul>
      <div className="sidebar-footer">
        <img
          src="/path_to_profile_image.png"
          alt="Profile"
          className="profile-img"
        />
        Puneet Pandey
        <br />
        helloabc@gmail.com
      </div>
    </div>
  );
}

export default Sidebar;
