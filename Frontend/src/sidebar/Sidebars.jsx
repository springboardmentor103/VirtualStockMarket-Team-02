import React from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import logo1 from "../Images/icon1.png";
import logo2 from "../Images/icon2.png";
import logo3 from "../Images/icon3.png";
import logo4 from "../Images/icon4.png";
import logo5 from "../Images/icon5.png";
import logo6 from "../Images/icon6.png";
import logo7 from "../Images/icon7.png";
import logo8 from "../Images/icon8.png";
import logo9 from "../Images/icon9.png";
import logo10 from "../Images/icon10.png";
import profile from "../Images/profile.png";

import int from "../Images/Intersect.png";
export default function Sidebars() {
  const navigate = useNavigate();
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <div className="img-container">
          <img src={int} alt="logo" />
          <p>Springboard</p>
        </div>
        <div className="sidebar-links-1">
          <p>PERSONAL</p>
          <div
            className="sidebar-link"
            onClick={() => {
              navigate("/account");
            }}
          >
            <div className="part-1">
              <img src={logo1} alt="logo1" className="img1" />
              <span>Accounts</span>
            </div>
            <img src={logo9} alt="left" className="img2" />
          </div>
          <div
            className="sidebar-link"
            onClick={() => {
              navigate("/Dashboard");
            }}
          >
            <div className="part-1">
              <img src={logo2} alt="logo1" className="img1" />
              <span style={{ color: "white" }}>Dashboard</span>
            </div>
            <img src={logo9} alt="left" className="img2" />
          </div>
          <div className="sidebar-link">
            <div className="part-1">
              <img src={logo3} alt="logo1" className="img1" />
              <span>App</span>
            </div>
            <img src={logo9} alt="left" className="img2" />
          </div>
          <div className="sidebar-link">
            <div className="part-1">
              <img src={logo4} alt="logo1" className="img1" />
              <span>Mailbox</span>
            </div>
            <img src={logo9} alt="left" className="img2" />
          </div>
          <div className="sidebar-link">
            <div className="part-1">
              <img src={logo5} alt="logo1" className="img1" />
              <span>UI Elements</span>
            </div>
            <img src={logo9} alt="left" className="img2" />
          </div>
        </div>
        <div className="sidebar-links-2">
          <p style={{ marginTop: "1.5rem" }}>CHARTS,TABLES & LAYOUTS</p>
          <div className="sidebar-link">
            <div className="part-1">
              <img src={logo6} alt="logo1" className="img1" />
              <span>Charts</span>
            </div>
            <img src={logo9} alt="left" className="img2" />
          </div>
          <div className="sidebar-link">
            <div className="part-1">
              <img src={logo7} alt="logo1" className="img1" />
              <span>Tables</span>
            </div>
            <img src={logo9} alt="left" className="img2" />
          </div>
          <div className="sidebar-link">
            <div className="part-1">
              <img src={logo8} alt="logo1" className="img1" />
              <span>Leaderboard</span>
            </div>
            <img src={logo9} alt="left" className="img2" />
          </div>
        </div>
        <div className="profile-container">
          <div className="profile-pic">
            <img src={profile} alt="pic" />
          </div>
          <div className="profile-content">
            <p>Puneet Pandey</p>
            <p>helloabc@gmail.com</p>
          </div>
          <div className="down">
            <img src={logo10} alt="down" />
          </div>
        </div>
      </div>
    </div>
  );
}
