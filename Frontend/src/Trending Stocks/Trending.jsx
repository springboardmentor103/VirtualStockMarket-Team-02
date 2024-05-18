import React from "react";
import Sidebars from "../sidebar/Sidebars";
import "./trending.css";
import bg from "../Images/bg.png";
import logo11 from "../Images/icon11.png";
export default function Trending() {
  return (
    <div className="Trending-container">
      <img src={bg} alt="bg" className="Trending-bg" />
      <Sidebars />
      <div className="Trending-stocks-container">
        <div className="search-container">
          <div className="left">
            <img src={logo11} alt="logo11" className="Trending-logo11" />
            <p>Stocks</p>
          </div>
          <div className="right">
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      </div>
    </div>
  );
}
