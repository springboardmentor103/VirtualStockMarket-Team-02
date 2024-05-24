import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebars from "../sidebar/Sidebars";
import bg from "../Images/bg.png";
import logo11 from "../Images/icon11.png";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./Orderhistory.css";

export default function Orderhistory() {
  const navigate = useNavigate();
  const [orderdata, setorderdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, seterr] = useState("");
  const { setdispdata, tokenState } = useContext(datacontext);

  useEffect(() => {
    if (tokenState.authtoken) {
      navigate("/OrderHistory");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/forgetPassword");
    }
  }, [tokenState, navigate]);

  const getorderdetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/purchase-details", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        const formattedData = data.user.purchases.map((coin) => ({
          name: coin.cryptoname,
          price: coin.volume ?? 0, // Handle undefined price
          percent: coin.percent ?? 0, // Handle undefined percent
          symbol: coin.cryptoSymbol,
          type: coin.purchaseType,
          status: coin.status,
        }));
        setIsLoading(false);
        seterr("");
        setdispdata({ name: data.user.name, email: data.user.email });
        setorderdata(formattedData);
      } else {
        setIsLoading(false);
        seterr(data.message);
        setorderdata([]);
      }
    } catch (error) {
      setIsLoading(false);
      alert("Internal server error");
    }
  }, [setdispdata]);

  useEffect(() => {
    getorderdetails();
  }, [getorderdetails]);

  return (
    <div className="orderhistory-container">
      {isLoading && <Loader />}
      <img src={bg} alt="bg" className="orderhistory-bg" />
      <Sidebars />
      <div className="orderhistory-stocks-container">
        <div className="history-title-container">
          <div className="title-container">
            <img src={logo11} alt="logo11" className="orderhistory-logo11" />
            <p>Order History</p>
          </div>
          <div className="history-container">
            <div className="history-title">
              <p>Recent Orders</p>
            </div>
            <TableContainer component={Paper} className="order-content">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "black" }}>Crypto</TableCell>
                    <TableCell style={{ color: "black" }}>Type</TableCell>
                    <TableCell style={{ color: "black" }}>Status</TableCell>
                    <TableCell style={{ color: "black" }}>Price</TableCell>
                    <TableCell style={{ color: "black" }}>Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!err ? (
                    orderdata.map((singlecoin, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <i className={`cf cf-${singlecoin.symbol.toLowerCase()} yellow-symbol`}></i>
                        </TableCell>
                        <TableCell
                          style={{ color: singlecoin.type === "BUY" ? "green" : "red" }}
                        >
                          {singlecoin.type}
                        </TableCell>
                        <TableCell style={{ color: "black" }}>
                          {singlecoin.status}
                        </TableCell>
                        <TableCell style={{ color: "black", fontSize: "1.2rem" }}>
                          {typeof singlecoin.price === "number"
                            ? singlecoin.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : singlecoin.price}
                          $
                        </TableCell>
                        <TableCell
                          style={{ color: singlecoin.percent > 0 ? "green" : "red" }}
                        >
                          {typeof singlecoin.percent === "number"
                            ? singlecoin.percent.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : singlecoin.percent}
                          %
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} style={{ color: "black", textAlign: "center" }}>
                        {err}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

