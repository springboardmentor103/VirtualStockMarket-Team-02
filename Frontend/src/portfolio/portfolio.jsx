import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import Sidebars from "../sidebar/Sidebars";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./portfolio.css";

export default function Portfolio() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [err, setErr] = useState("");
  const { setdispdata, tokenState } = useContext(datacontext);

  const getPortfolioDetails = useCallback(
    async (signal) => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/portfolio", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          signal,
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setdispdata({ name: data.user?.name, email: data.user?.email });
          setPortfolioData(data.totalPortfolio);
          setErr("");
        } else {
          const errorData = await response.json();
          setErr(errorData.message);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setErr("Internal server error");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [setdispdata]
  );

  useEffect(() => {
    if (!tokenState.authtoken) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();
    getPortfolioDetails(controller.signal);

    return () => {
      controller.abort();
    };
  }, [navigate, tokenState.authtoken, getPortfolioDetails]);

  const portfolioSummary = useMemo(
    () =>
      portfolioData && (
        <div className="portfolio-summary">
          <div className="summary-item gains">
            <div className="summary-circle">
              <FaArrowUp />
            </div>
            <div className="summary-text">
              <p>Today's Gains</p>
              <h2>${portfolioData.todayProfit.toFixed(2)}</h2>
            </div>
          </div>
          <div className="summary-item losses">
            <div className="summary-circle">
              <FaArrowDown />
            </div>
            <div className="summary-text">
              <p>Today's Losses</p>
              <h2>${portfolioData.todayLoss.toFixed(2)}</h2>
            </div>
          </div>
          <div className="summary-item gains">
            <div className="summary-circle">
              <FaArrowUp />
            </div>
            <div className="summary-text">
              <p>Overall Gains</p>
              <h2>${portfolioData.totalProfit.toFixed(2)}</h2>
            </div>
          </div>
          <div className="summary-item losses">
            <div className="summary-circle">
              <FaArrowDown />
            </div>
            <div className="summary-text">
              <p>Overall Losses</p>
              <h2>${portfolioData.totalLoss.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      ),
    [portfolioData]
  );

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
        {isLoading && <Loader />}
        {portfolioData && (
          <div className="portfolio-details">
            {portfolioSummary}
            <div className="balance-container">
              <h2>Balance</h2>
              <p>${portfolioData.totalAmount.toFixed(2)}</p>
              <span>+${portfolioData.totalProfit.toFixed(2)}</span>
            </div>
          </div>
        )}
        {err && <div className="error">{err}</div>}
      </div>
    </div>
  );
}
