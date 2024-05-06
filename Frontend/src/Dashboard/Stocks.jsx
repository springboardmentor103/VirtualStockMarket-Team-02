import React, { useState } from "react";
import "./Stocks.css";
import twitterlogo from "../logos/twitter.png";
import googlelogo from "../logos/google.png";
import msft from "../logos/microsoft.png";
import nike from "../logos/nike.png";
import spot from "../logos/spotify.png";
import nflx from "../logos/netflix.png";
import amzn from "../logos/amazon.png";
import { Link } from "react-router-dom";

const stockData = [
  { name: "TWTR", logo: twitterlogo, price: 63.98, trend: "down" },
  { name: "GOOGL", logo: googlelogo, price: 2840, trend: "up" },
  { name: "MSFT", logo: msft, price: 302.1, trend: "down" },
  { name: "NIKE", logo: nike, price: 169.8, trend: "down" },
  { name: "SPOT", logo: spot, price: 226.9, trend: "up" },
  { name: "NFLX", logo: nflx, price: 354.9, trend: "down" },
  { name: "AMZN", logo: amzn, price: 1840, trend: "up" },
];

function Stocks() {
  const [search, setSearch] = useState("");

  const filteredStocks =
    search.length === 0
      ? stockData
      : stockData.filter((stock) =>
          stock.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="stocks-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="stocks-list">
        <h2 className="stocks-title">Top Stocks</h2>
        {filteredStocks.map((stock) => (
          <Link to={`/stock/${stock.name}`} key={stock.name}>
            <div className="stock-item" key={stock.name}>
              <div className="stock-logo">
                <img src={stock.logo} alt={stock.name} />
              </div>
              <div className="stock-details">
                <span className="stock-name">{stock.name}</span>
                <span className="stock-price">${stock.price.toFixed(2)}</span>
              </div>
              <div className={`stock-trend ${stock.trend}`}>
                {/* Trend line placeholder */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Stocks;
