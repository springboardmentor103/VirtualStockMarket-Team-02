// StockDetail.js
import React from "react";
import { useParams } from "react-router-dom";
import "./DetailedStocks.css";

function StockDetail({ stocks }) {
  const { stockId } = useParams();
  const stock = stocks.find((s) => s.name === stockId);

  return (
    <div className="stock-detail-container">
      <h1>{stock.name} Details</h1>
      <div>
        <img src={stock.logo} alt={stock.name} style={{ width: "100px" }} />
        <p>Price: ${stock.price}</p>
        <p>Trend: {stock.trend}</p>
      </div>
    </div>
  );
}

export default StockDetail;
