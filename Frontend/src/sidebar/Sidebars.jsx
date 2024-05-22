import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import logo1 from "../Images/icon1.png";
import logo2 from "../Images/icon2.png";
import logo3 from "../Images/icon3.png";
import logo4 from "../Images/icon4.png";
import logo5 from "../Images/icon5.png";
import logout from "../Images/icon6.png";
import logo9 from "../Images/icon9.png";
import logo10 from "../Images/icon10.png";
import profile from "../Images/profile.png";
import { datacontext } from "../Datacontext";
import ham from "../Images/hamburger.png";
import close from "../Images/close.png";
import int from "../Images/Intersect.png";
import Loader from "../Loader/Loader";
export default function Sidebars() {
  const navigate = useNavigate();
  const [display, setdisplay] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const { dispdata, activecolor, setactivecolor } = useContext(datacontext);
  const handlesidebarclick = () => {
    setdisplay(!display);
  };
  const handleLogOut = async () => {
    try {
      setisLoading(true);
      const response = await fetch("http://localhost:8000/api/logoutuser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setisLoading(false);
        alert(data.message);
        navigate(0);
      } else {
        setisLoading(false);
        alert(data.message);
      }
    } catch (error) {
      setisLoading(false);
      alert("internal error");
    }
  };
  return (
    <div
      className={`${display ? "sidebar-container show" : "sidebar-container"}`}
    >
      {isLoading ? <Loader /> : ""}
      <div className={`${display ? "sidebar show" : "sidebar"}`}>
        <div
          className={`${display ? "ham show" : "ham"}`}
          onClick={handlesidebarclick}
        >
          <img src={`${display ? close : ham}`} alt="ham" />
        </div>
        <div className={`${display ? "img-container show" : "img-container"}`}>
          <img src={int} alt="logo" />
          <p>Springboard</p>
        </div>
        <div className="sidebar-links-1">
          <p className={`${display ? "show" : ""}`}>PERSONAL</p>
          <div
            className="sidebar-link"
            onClick={() => {
              navigate("/TrendingStocks");
              setactivecolor({
                Dashboard: "white",
                Account: "#cec4c4",
                Orderhistory: "#cec4c4",
                Portfolio: "#cec4c4",
                Leaderboard: "#cec4c4",
              });
            }}
          >
            <div className="part-1">
              <img
                src={logo2}
                alt="logo1"
                className={`${display ? "img1 show" : "img1"}`}
              />
              <span
                style={{ color: activecolor.Dashboard }}
                className={`${display ? "show" : ""}`}
              >
                Dashboard
              </span>
            </div>
            <img
              src={logo9}
              alt="left"
              className={`${display ? "img2 show" : "img2"}`}
            />
          </div>
          <div
            className="sidebar-link"
            onClick={() => {
              navigate("/ Account");
              setactivecolor({
                Dashboard: "#cec4c4",
                Account: "white",
                Orderhistory: "#cec4c4",
                Portfolio: "#cec4c4",
                Leaderboard: "#cec4c4",
              });
            }}
          >
            <div className="part-1">
              <img
                src={logo1}
                alt="logo1"
                className={`${display ? "img1 show" : "img1"}`}
              />
              <span
                className={`${display ? "show" : ""}`}
                style={{ color: activecolor.Account }}
              >
                Accounts
              </span>
            </div>
            <img
              src={logo9}
              alt="left"
              className={`${display ? "img2 show" : "img2"}`}
            />
          </div>
          <div
            className="sidebar-link"
            onClick={() => {
              navigate("/OrderHistory");
              setactivecolor({
                Dashboard: "#cec4c4",
                Account: "#cec4c4",
                Orderhistory: "white",
                Portfolio: "#cec4c4",
                Leaderboard: "#cec4c4",
              });
            }}
          >
            <div className="part-1">
              <img
                src={logo3}
                alt="logo1"
                className={`${display ? "img1 show" : "img1"}`}
              />
              <span
                className={`${display ? "show" : ""}`}
                style={{ color: activecolor.Orderhistory }}
              >
                Order History
              </span>
            </div>
            <img
              src={logo9}
              alt="left"
              className={`${display ? "img2 show" : "img2"}`}
            />
          </div>
          <div
            className="sidebar-link"
            onClick={() => {
              navigate("/Portfolio");
              setactivecolor({
                Dashboard: "#cec4c4",
                Account: "#cec4c4",
                Orderhistory: "#cec4c4",
                Portfolio: "white",
                Leaderboard: "#cec4c4",
              });
            }}
          >
            <div className="part-1">
              <img
                src={logo4}
                alt="logo1"
                className={`${display ? "img1 show" : "img1"}`}
              />
              <span
                className={`${display ? "show" : ""}`}
                style={{ color: activecolor.Portfolio }}
              >
                Portfolio
              </span>
            </div>
            <img
              src={logo9}
              alt="left"
              className={`${display ? "img2 show" : "img2"}`}
            />
          </div>
          <div
            className="sidebar-link"
            onClick={() => {
              navigate("/Leaderboard");
              setactivecolor({
                Dashboard: "#cec4c4",
                Account: "#cec4c4",
                Orderhistory: "#cec4c4",
                Portfolio: "#cec4c4",
                Leaderboard: "#white",
              });
            }}
          >
            <div className="part-1">
              <img
                src={logo5}
                alt="logo1"
                className={`${display ? "img1 show" : "img1"}`}
              />
              <span
                className={`${display ? "show" : ""}`}
                style={{ color: activecolor.Leaderboard }}
              >
                Leaderboard
              </span>
            </div>
            <img
              src={logo9}
              alt="left"
              className={`${display ? "img2 show" : "img2"}`}
            />
          </div>
        </div>
        <div className="bottom-container">
          <div className="sidebar-links-2">
            <div className="sidebar-link" onClick={handleLogOut}>
              <div className="part-1">
                <img
                  src={logout}
                  alt="logo1"
                  className={`${display ? "img1 show" : "img1"}`}
                />
                <span className={`${display ? "show" : ""}`}>Log Out</span>
              </div>
              <img src={logo9} alt="left" className="img2" />
            </div>
          </div>
          <div
            className={`${
              display ? "profile-container show" : "profile-container"
            }`}
          >
            <div className={`${display ? "profile-pic show" : "profile-pic"}`}>
              <img src={profile} alt="pic" />
            </div>
            <div
              className={`${
                display ? "profile-content show" : "profile-content"
              }`}
            >
              <p>{dispdata.name}</p>
              <p>{dispdata.email}</p>
            </div>
            <div className={`${display ? "down show" : "down"}`}>
              <img src={logo10} alt="down" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
