import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../Images/bg.png";
import Sidebars from "../sidebar/Sidebars";
import logo11 from "../Images/icon11.png";
import Loader from "../Loader/Loader";
import up from "../Images/up.png";
import down from "../Images/down.png";
import { datacontext } from "../Datacontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  Paper,
  TableRow,
} from "@mui/material";
import "./Buysell.css";
export default function Buysell() {
  const navigate = useNavigate();

  const { tokenState, selectedcrypto, setactivecolor, fetchCryptoDetails } =
    useContext(datacontext);
  const [isLoading, setIsLoading] = useState(false);
  const [cryptodatas, setcryptodatas] = useState(null);
  useEffect(() => {
    if (tokenState.authtoken) {
      setactivecolor({
        Dashboard: "white",
        Account: "#cec4c4",
        Orderhistory: "#cec4c4",
        Portfolio: "#cec4c4",
        Leaderboard: "#cec4c4",
      });
      navigate("/Buy-Sell");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/forgetPassword");
    }
  }, [tokenState, navigate]);
  const getcryptodetail = async () => {
    try {
      setIsLoading(true);
      if (selectedcrypto) {
        const response = await fetch(
          `http://localhost:8000/api/single-crypto?coin=${selectedcrypto.coin}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          const selectedCoinData = data.singledata.data[
            selectedcrypto.coin
          ].find((coin) => coin.name === selectedcrypto.name);
          if (selectedCoinData) {
            const details = await fetchCryptoDetails(selectedCoinData.symbol);
            const formattedData = {
              name: selectedCoinData.name,
              price: selectedCoinData.quote.USD.price,
              percent: selectedCoinData.quote.USD.percent_change_7d,
              symbol: selectedCoinData.symbol,
              imageurl: details.imageurl,
              open: details.open,
              high: details.high,
              low: details.low,
              volume: details.volume,
              avgVolume: details.avgVolume,
              marketCap: details.marketCap,
            };

            setIsLoading(false);
            //seterr("");
            setcryptodatas(formattedData);
          } else {
            setIsLoading(false);
            //seterr(`No data found for crypto ${selectedcrypto.name}`);
            setcryptodatas(null);
          }
        } else {
          setIsLoading(false);
          //seterr(data.message);
          setcryptodatas(null);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Internal Server Error", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      //alert("Internal Server error");
    }
  };

  useEffect(() => {
    if (selectedcrypto) {
      getcryptodetail();
    } else {
      navigate("/TrendingStocks");
    }
  }, [selectedcrypto, navigate]);

  return (
    <div className="buysell-container">
      {isLoading ? <Loader /> : ""}
      <img src={bg} alt="bg" className="buysell-bg" />
      <Sidebars />
      <div className="buysell-right-cover">
        <div className="buysell-right-container">
          <div className="title-container">
            <img
              src={logo11}
              alt="logo11"
              onClick={() => navigate("/TrendingStocks")}
            />
            <p onClick={() => navigate("/TrendingStocks")}>Crypto Detail</p>
          </div>
          {cryptodatas ? (
            <div className="crypto-info-container">
              <div className="crypto-heading-container">
                <div className="crypto-pic">
                  <img
                    src={cryptodatas ? cryptodatas.imageurl : ""}
                    alt="crypto-pic"
                  />

                  <div className="crypto-identify">
                    <p>{cryptodatas ? cryptodatas.symbol : ""}</p>
                    <span>{cryptodatas ? cryptodatas.name : ""}</span>
                  </div>
                </div>
                <div className="crypto-price-container">
                  <h3>
                    $
                    {cryptodatas
                      ? typeof cryptodatas.price === "number"
                        ? cryptodatas.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : cryptodatas.price
                      : ""}
                  </h3>
                  <span
                    className={`${
                      cryptodatas
                        ? cryptodatas.percent > 0
                          ? "up"
                          : "down"
                        : ""
                    }`}
                  >
                    <img
                      src={
                        cryptodatas ? (cryptodatas.percent > 0 ? up : down) : ""
                      }
                      alt="trend"
                    />
                    {cryptodatas
                      ? typeof cryptodatas.percent === "number"
                        ? Math.abs(cryptodatas.percent).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : cryptodatas.percent
                      : ""}
                    %
                  </span>
                </div>
              </div>
              <div className="stats-container">
                <div className="head">Statistics</div>
                <div className="table-wrapper">
                  <TableContainer
                    component={Paper}
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              color: "white",
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                            }}
                            align="center"
                          >
                            Open
                          </TableCell>
                          <TableCell
                            style={{
                              color: "white",
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                            }}
                            align="center"
                          >
                            High
                          </TableCell>
                          <TableCell
                            style={{
                              color: "white",
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                            }}
                            align="center"
                          >
                            Low
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            style={{
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                              color: "#ffffffe1",
                            }}
                            align="center"
                          >
                            {cryptodatas
                              ? `$ ${cryptodatas.open.toFixed(2)}`
                              : ""}
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                              color: "#ffffffe1",
                            }}
                            align="center"
                          >
                            {cryptodatas
                              ? `$ ${cryptodatas.high.toFixed(2)}`
                              : ""}
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                              color: "#ffffffe1",
                            }}
                            align="center"
                          >
                            {cryptodatas
                              ? `$ ${cryptodatas.low.toFixed(2)}`
                              : ""}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      <TableRow></TableRow>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              color: "white",
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                              paddingTop: "20px",
                            }}
                            align="center"
                          >
                            Volume
                          </TableCell>
                          <TableCell
                            style={{
                              color: "white",
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                              paddingTop: "20px",
                            }}
                            align="center"
                          >
                            Avg.Volume
                          </TableCell>
                          <TableCell
                            style={{
                              color: "white",
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                              paddingTop: "20px",
                            }}
                            align="center"
                          >
                            Market Cap
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            style={{
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                              color: "#ffffffe1",
                            }}
                            align="center"
                          >
                            {cryptodatas ? cryptodatas.volume.toFixed(2) : ""}
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                              color: "#ffffffe1",
                            }}
                            align="center"
                          >
                            {cryptodatas
                              ? cryptodatas.avgVolume.toFixed(2)
                              : ""}
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: "0px",
                              margin: "0px",
                              padding: "0px",
                              color: "#ffffffe1",
                            }}
                            align="center"
                          >
                            {cryptodatas
                              ? cryptodatas.marketCap.toFixed(2)
                              : ""}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                {/*<div className="values">
                <div className="value-1">
                  <div>
                    <p>Open</p>
                    <span>
                      {cryptodatas ? cryptodatas.open.toFixed(2) : ""}
                    </span>
                  </div>
                  <div>
                    <p>High</p>
                    <span>
                      {cryptodatas ? cryptodatas.high.toFixed(2) : ""}
                    </span>
                  </div>
                  <div>
                    <p>Low</p>
                    <span>{cryptodatas ? cryptodatas.low.toFixed(2) : ""}</span>
                  </div>
                </div>
                <div className="value-2">
                  <div>
                    <p>Volume</p>
                    <span>
                      {cryptodatas ? cryptodatas.volume.toFixed(2) : ""}
                    </span>
                  </div>
                  <div>
                    <p>Avg.Volume</p>
                    <span>
                      {cryptodatas ? cryptodatas.avgVolume.toFixed(2) : ""}
                    </span>
                  </div>
                  <div>
                    <p>Market Cap</p>
                    <span>
                      {cryptodatas ? cryptodatas.marketCap.toFixed(2) : ""}
                    </span>
                  </div>
                </div>
              </div>*/}
                <div className="btns">
                  <button onClick={() => navigate("/buy")}>Buy</button>
                  <button onClick={() => navigate("/sell")}>Sell</button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
