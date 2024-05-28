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
  TableRow,
  TableHead,
  Paper,
} from "@mui/material";
import "./Orderhistory.css";

export default function Orderhistory() {
  const navigate = useNavigate();
  const [orderdata, setorderdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, seterr] = useState("");
  const { setdispdata, tokenState, fetchCryptoDetails } =
    useContext(datacontext);

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
      const response = await fetch("http://localhost:8000/api/dashboard", {
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const formattedDataPromises = data.user.purchases.map(async (coin) => {
          const details = await fetchCryptoDetails(coin.cryptoSymbol);

          return {
            name: coin.cryptoname,
            price: coin.volume,
            percent: coin.percent,
            symbol: coin.cryptoSymbol,
            type: coin.purchaseType,
            status: coin.status,
            timestamp: coin.timestamp,
            imageurl: details.imageurl,
          };
        });
        const formattedData = await Promise.all(formattedDataPromises);
        if (formattedData.length === 0) {
          setIsLoading(false);
          seterr(
            "No Purchase or Selling record found. Try your first purchase to add a record to Order history."
          );
          setdispdata({ name: data.user.name, email: data.user.email });
          setorderdata(formattedData);
        } else {
          setIsLoading(false);
          seterr("");
          setdispdata({ name: data.user.name, email: data.user.email });
          setorderdata(formattedData);
        }
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
            {/*<TableContainer component={Paper} className="order-content">
              <Table>
                <TableHead>


                </TableHead>
              
                <TableBody>
                  {!err ? (
                    orderdata.map((singlecoin, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <i className={cf cf-${singlecoin.symbol.toLowerCase()} yellow-symbol}></i>
                        </TableCell>
                        <TableCell style={{ color: "white" }}>
                          {singlecoin.name}
                        </TableCell>
                        <TableCell
                          style={{ color: singlecoin.type === "BUY" ? "green" : "red" }}
                        >
                          {singlecoin.type}
                        </TableCell>
                        <TableCell style={{ color: "white", fontSize: "1.2rem" }}>
                          {typeof singlecoin.price === "number"
                            ? singlecoin.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : singlecoin.price}
                          $
                        </TableCell>
                        <TableCell style={{ color: "white", fontSize: "1.3rem" }}>
                          {new Date(singlecoin.timestamp).toLocaleString()}
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
                </TableContainer>*/}

            <TableContainer
              component={Paper}
              style={{
                backgroundColor: "#454140",
                marginTop: "1rem",
                overflowY: "scroll",
                maxHeight: "100%",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "white",
                        margin: "0px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                      }}
                      align="center"
                    >
                      Icon
                    </TableCell>
                    <TableCell
                      style={{
                        color: "white",
                        margin: "0px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                      }}
                      align="center"
                    >
                      Name
                    </TableCell>
                    <TableCell
                      style={{
                        color: "white",
                        margin: "0px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                      }}
                      align="center"
                    >
                      Order Type
                    </TableCell>
                    <TableCell
                      style={{
                        color: "white",
                        margin: "0px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                      }}
                      align="center"
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      style={{
                        color: "white",
                        margin: "0px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                      }}
                      align="center"
                    >
                      Time
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!err ? (
                    orderdata.map((singlecoin, index) => (
                      <TableRow key={index} hover>
                        <TableCell
                          align="center"
                          style={{
                            maxWidth: "50px",
                            width: "50px",
                            margin: "0px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                          }}
                          //style={{ maxWidth: "80px", width: "80px" }}
                        >
                          <img
                            src={singlecoin.imageurl}
                            alt="crypto"
                            style={{ width: "100%" }}
                          />
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            color: "white",
                            margin: "0px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                            fontSize: "1rem",
                          }}
                          //style={{ color: "white", fontSize: "1rem" }}
                        >
                          {singlecoin.name}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            color: singlecoin.type === "BUY" ? "green" : "red",
                            fontSize: "1rem",
                            margin: "0px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                          }}
                        >
                          {singlecoin.type}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            color: "white",
                            margin: "0px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                            fontSize: "1rem",
                          }}
                          //style={{ color: "white", fontSize: "1rem" }}
                        >
                          {typeof singlecoin.price === "number"
                            ? singlecoin.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : singlecoin.price}
                          $
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            color: "white",
                            margin: "0px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                            fontSize: "1rem",
                          }}
                        >
                          {new Date(singlecoin.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        style={{
                          color: "white",
                          textAlign: "center",
                          borderBottom: "0px",
                        }}
                      >
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
/*import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebars from "../sidebar/Sidebars";
import bg from "../Images/bg.png";
import logo11 from "../Images/icon11.png";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";
import "./Orderhistory.css";
export default function Orderhistory() {
  const navigate = useNavigate();
  const [orderdata, setorderdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, seterr] = useState("");
  const { setdispdata, tokenState, setactivecolor, setselectedcrypto } =
    useContext(datacontext);
  useEffect(() => {
    setselectedcrypto(null);
    localStorage.removeItem("symbol");
    if (tokenState.authtoken) {
      setactivecolor({
        Dashboard: "#cec4c4",
        Account: "#cec4c4",
        Orderhistory: "white",
        Portfolio: "#cec4c4",
        Leaderboard: "#cec4c4",
      });
      navigate("/OrderHistory");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/forgetPassword");
    }
  }, [tokenState, navigate]);
  const getorderdetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/dashboard", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        const formattedData = data.user.purchases.map((coin) => ({
          name: coin.cryptoname,
          price: coin.volume,
          percent: coin.percent,
          symbol: coin.cryptoSymbol,
          type: coin.purchaseType,
          status: coin.status,
        }));
        if (formattedData.length === 0) {
          setIsLoading(false);
          seterr(
            "No Purchase or Selling record found. Try your first purchase to add a record to Order history."
          );
          setdispdata({ name: data.user.name, email: data.user.email });
          setorderdata(formattedData);
        } else {
          setIsLoading(false);
          seterr("");
          setdispdata({ name: data.user.name, email: data.user.email });
          setorderdata(formattedData);
        }
      } else {
        setIsLoading(false);
        seterr(data.message);
        setorderdata([]);
      }
    } catch (error) {
      setIsLoading(false);
      alert("Internal server error");
    }
  };
  useEffect(() => {
    getorderdetails();
  }, []);
  return (
    <div className="orderhistory-container">
      {isLoading ? <Loader /> : ""}
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
            <div className="order-content">
              {!err ? (
                orderdata.map((singlecoin, index) => (
                  <div className="order" key={index}>
                    <i
                      className={`cf cf-${singlecoin.symbol.toLowerCase()}`}
                    ></i>
                    <h2>{singlecoin.name}</h2>
                    <h2
                      style={{
                        color: singlecoin.type === "BUY" ? "green" : "red",
                      }}
                    >
                      {singlecoin.type}
                    </h2>
                    <h2>{singlecoin.status}</h2>
                    <div className="price-container">
                      <p>
                        {typeof singlecoin.price === "number"
                          ? singlecoin.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : singlecoin.price}
                        $
                      </p>
                      <p
                        className={`${singlecoin.percent > 0 ? "up" : "down"}`}
                      >
                        {typeof singlecoin.percent === "number"
                          ? singlecoin.percent.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : singlecoin.percent}
                        %
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="error">{err}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}*/
