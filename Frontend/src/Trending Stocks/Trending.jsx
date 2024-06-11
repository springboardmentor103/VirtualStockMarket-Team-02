import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebars from "../sidebar/Sidebars";
import "./trending.css";
import bg from "../Images/bg.png";
import logo11 from "../Images/icon11.png";
import up from "../Images/up.png";
import down from "../Images/down.png";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  Paper,
  TableRow,
} from "@mui/material";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";

export default function Trending() {
  const navigate = useNavigate();
  const [cryptodata, setcryptodata] = useState([]);

  const [filteredCryptoData, setFilteredCryptoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, seterr] = useState("");
  const {
    setdispdata,
    tokenState,
    setselectedcrypto,
    setactivecolor,
    fetchCryptoDetails,
  } = useContext(datacontext);
  useEffect(() => {
    setselectedcrypto(null);
    localStorage.removeItem("symbol");
    if (tokenState.authtoken) {
      setactivecolor({
        Dashboard: "white",
        Account: "#cec4c4",
        Orderhistory: "#cec4c4",
        Portfolio: "#cec4c4",
        Leaderboard: "#cec4c4",
      });
      navigate("/TrendingStocks");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/forgetPassword");
    }
  }, [tokenState, navigate]);
  const [crypto, setcrypto] = useState("");
  const getcryptodetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/crypto-data", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        const formattedDataPromises = data.getresult.data.map(async (coin) => {
          const details = await fetchCryptoDetails(coin.symbol);

          return {
            name: coin.name,
            price: coin.quote.USD.price,
            percent: coin.quote.USD.percent_change_7d,
            symbol: coin.symbol,
            imageurl: details.imageurl,
          };
        });

        const formattedData = await Promise.all(formattedDataPromises);
        setIsLoading(false);
        seterr("");
        setdispdata({ name: data.name, email: data.email });
        setcryptodata(formattedData);
        setFilteredCryptoData(formattedData);
      } else {
        setIsLoading(false);
        seterr(data.message);
        setcryptodata([]);
        setFilteredCryptoData([]);
      }
    } catch (error) {
      setIsLoading(false);
      alert("Internal server error");
    }
  };
  useEffect(() => {
    getcryptodetails();
  }, []);
  const handleCryptoChange = async (e) => {
    const { value } = e.target;
    setcrypto(value);
    if (!value) {
      setFilteredCryptoData(cryptodata);
      seterr("");
      return;
    }
    const filteredData = cryptodata.filter((coin) =>
      coin.name.toLowerCase().startsWith(value.toLowerCase())
    );
    if (filteredData.length === 0) {
      seterr(`No crypto name ${value} available`);
      setFilteredCryptoData([]);
    } else {
      seterr("");
      setFilteredCryptoData(filteredData);
    }
  };

  const handleSelectedCrypto = async (symbol, index) => {
    if (filteredCryptoData[index]) {
      localStorage.setItem(
        "symbol",
        JSON.stringify({
          coin: filteredCryptoData[index].symbol,
          name: filteredCryptoData[index].name,
        })
      );
      setselectedcrypto({
        coin: filteredCryptoData[index].symbol,
        name: filteredCryptoData[index].name,
      });
      navigate("/Buy-Sell");
    }
  };

  return (
    <div className="Trending-container">
      {isLoading ? <Loader /> : ""}
      <img src={bg} alt="bg" className="Trending-bg" />
      <Sidebars />
      <div className="Trending-stocks-container">
        <div className="Trend-container">
          <div className="search-container">
            <div className="left">
              {/*<img src={logo11} alt="logo11" className="Trending-logo11" />*/}
              <p>Crypto</p>
            </div>
            <div className="right">
              <input
                type="text"
                placeholder="Search..."
                name="crypto"
                value={crypto}
                onChange={handleCryptoChange}
              />
            </div>
          </div>
          <div className="stocks-container">
            <div className="stocks-title">
              <p>My Cryptos</p>
            </div>
            <TableContainer
              component={Paper}
              style={{ backgroundColor: "transparent", height: "100%" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "white",
                        backgroundColor: "#454140",
                        margin: "0px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                      }}
                      align="center"
                    ></TableCell>
                    <TableCell
                      style={{
                        color: "white",
                        backgroundColor: "#454140",
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
                        backgroundColor: "#454140",
                        margin: "0px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                      }}
                      align="center"
                    >
                      Price
                    </TableCell>
                    <TableCell
                      style={{
                        color: "white",
                        backgroundColor: "#454140",
                        margin: "0px",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                      }}
                      align="center"
                    >
                      24H Change
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!err ? (
                    filteredCryptoData.map((singlecoin, index) => (
                      <TableRow
                        key={index}
                        onClick={() =>
                          handleSelectedCrypto(singlecoin.symbol, index)
                        }
                        style={{ cursor: "pointer" }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "gray",
                          },
                        }}
                      >
                        <TableCell
                          align="center"
                          style={{
                            maxWidth: "50px",
                            width: "50px",
                            margin: "0px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                          }}
                        >
                          <img
                            src={singlecoin.imageurl}
                            alt="crypt"
                            style={{
                              width: "100%",
                            }}
                          />
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
                          {singlecoin.name}
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
                          $
                          {typeof singlecoin.price === "number"
                            ? singlecoin.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : singlecoin.price}
                        </TableCell>
                        <TableCell
                          style={{
                            ...(singlecoin.percent > 0
                              ? { color: "green" }
                              : { color: "red" }),
                            margin: "0px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                          }}
                          align="center"
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={singlecoin.percent > 0 ? up : down}
                              alt="crypto percent"
                              style={{ width: 15, marginRight: 5 }}
                            />
                            <p style={{ margin: 0 }}>
                              {typeof singlecoin.percent === "number"
                                ? Math.abs(singlecoin.percent).toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )
                                : singlecoin.percent}
                              %
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        style={{
                          color: "red",
                          textAlign: "center",
                          margin: "0px",
                          paddingLeft: "0px",
                          paddingRight: "0px",
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

            {/*<div className="stocks-content">
              {!err ? (
                filteredCryptoData.map((singlecoin, index) => (
                  <div
                    className="stocks"
                    key={index}
                    onClick={() =>
                      handleSelectedCrypto(singlecoin.symbol, index)
                    }
                  >
                    <img src={singlecoin.imageurl} alt="crypt" />
                    <h2>{singlecoin.name}</h2>
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
                        <img
                          src={singlecoin.percent > 0 ? up : down}
                          alt="crypting"
                        />
                        {typeof singlecoin.percent === "number"
                          ? Math.abs(singlecoin.percent).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : singlecoin.percent}
                        %
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="error">{err}</div>
              )}
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
}
