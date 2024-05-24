import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebars from "../sidebar/Sidebars";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import "./portfolio.css";

export default function Portfolio() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [err, setErr] = useState("");
  const { setdispdata, tokenState } = useContext(datacontext);

  useEffect(() => {
    if (!tokenState.authtoken) {
      navigate("/login");
      return; 
    }

    console.log("Token:", tokenState.authtoken); 

    const getPortfolioDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/portfolio", {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include' 
        });

        console.log("Response Status:", response.status); 
        console.log("Response Headers:", response.headers); 

        const data = await response.json();
        if (response.ok) {
          setIsLoading(false);
          setErr("");
          setdispdata({ name: data.user?.name, email: data.user?.email });
          setPortfolioData(data.totalPortfolio);
        } else {
          console.error("Error response:", data);
          setIsLoading(false);
          setErr(data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setIsLoading(false);
        setErr("Internal server error");
      }
    };

    getPortfolioDetails();
  }, [navigate, setdispdata, tokenState]);

  return (
    <div className="portfolio-container">
      <div className="portfolio-bg"></div>
      <Sidebars />
      <div className="portfolio-content">
        <div className="portfolio-header">
          <h1>Portfolio</h1>
          {tokenState.user && (
            <div className="user-email-box">
              <button className="logout">Logout</button>
              <div className="user-email">{tokenState.user.email}</div>
            </div>
          )}
        </div>
        {isLoading ? <Loader /> : ""}
        <div className="portfolio-details">
          <div className="portfolio-summary">
            <div className="summary-item gains">
              <div className="summary-circle">
                <FaArrowUp />
              </div>
              <div className="summary-text">
                <p>Today's Gains</p>
                <h2>${portfolioData ? portfolioData.todayProfit.toFixed(2) : "-"}</h2>
              </div>
            </div>
            <div className="summary-item losses">
              <div className="summary-circle">
                <FaArrowDown />
              </div>
              <div className="summary-text">
                <p>Today's Losses</p>
                <h2>${portfolioData ? portfolioData.todayLoss.toFixed(2) : "-"}</h2>
              </div>
            </div>
            <div className="summary-item gains">
              <div className="summary-circle">
                <FaArrowUp />
              </div>
              <div className="summary-text">
                <p>Overall Gains</p>
                <h2>${portfolioData ? portfolioData.totalProfit.toFixed(2) : "-"}</h2>
              </div>
            </div>
            <div className="summary-item losses">
              <div className="summary-circle">
                <FaArrowDown />
              </div>
              <div className="summary-text">
                <p>Overall Losses</p>
                <h2>${portfolioData ? portfolioData.totalLoss.toFixed(2) : "-"}</h2>
              </div>
            </div>
          </div>
          <div className="balance-container">
            <h2>Balance</h2>
            <p>${portfolioData ? portfolioData.totalAmount.toFixed(2) : "-"}</p>
            <span>+${portfolioData ? portfolioData.totalProfit.toFixed(2) : "-"}</span>
          </div>
        </div>
        {err && <div className="error">{err}</div>}
      </div>
    </div>
  );
}
