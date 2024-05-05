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

function Sidebar() {
  const [activeItem, setActiveItem] = useState("");

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <BiUserCircle className="header-icon" />
        Springboard
      </div>
      <ul className="sidebar-menu">
        <li
          className={activeItem === "dashboard" ? "active" : ""}
          onClick={() => setActiveItem("dashboard")}
        >
          <AiOutlineDashboard />
          Dashboard
        </li>
        <li
          className={activeItem === "accounts" ? "active" : ""}
          onClick={() => setActiveItem("accounts")}
        >
          <AiOutlineDashboard />
          Accounts
        </li>
        <li
          className={activeItem === "app" ? "active" : ""}
          onClick={() => setActiveItem("app")}
        >
          <AiOutlineAppstore />
          App
        </li>
        <li
          className={activeItem === "mailbox" ? "active" : ""}
          onClick={() => setActiveItem("mailbox")}
        >
          <AiOutlineMail />
          Mailbox
        </li>
        <li
          className={activeItem === "uiElements" ? "active" : ""}
          onClick={() => setActiveItem("uiElements")}
        >
          <RiLayoutMasonryFill />
          UI Elements
        </li>
        <li
          className={activeItem === "charts" ? "active" : ""}
          onClick={() => setActiveItem("charts")}
        >
          <BiBarChartAlt2 />
          Charts
        </li>
        <li
          className={activeItem === "tables" ? "active" : ""}
          onClick={() => setActiveItem("tables")}
        >
          <MdOutlineTableChart />
          Tables
        </li>
        <li
          className={activeItem === "leaderboard" ? "active" : ""}
          onClick={() => setActiveItem("leaderboard")}
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
