import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import Sidebars from "../sidebar/Sidebars";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
} from "@mui/material";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./portfolio.css";

export default function Portfolio() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [err, setErr] = useState("");
  const { setdispdata, tokenState, fetchCryptoDetails } =
    useContext(datacontext);
  const [cryptoquantitylist, setcryptoquantitylist] = useState(null);

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
  const getUserCryptoQuantity = useCallback(
    async (signal) => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/dashboard", {
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
          const sortedcrypto = data.user.purchases;
          if (sortedcrypto.length === 0) {
            setErr("You have no Crypto Holdings yet.");
            return;
          }

          const cryptoQuantities = {};
          const fetchedDetails = {};

          const fetchAllDetails = async () => {
            for (const purchase of sortedcrypto) {
              const {
                cryptoname,
                quantity,
                purchaseType,
                cryptoSymbol,
                cashbalance,
              } = purchase;

              // Fetch details only if not already fetched
              if (!fetchedDetails[cryptoSymbol]) {
                const details = await fetchCryptoDetails(cryptoSymbol);
                fetchedDetails[cryptoSymbol] = details.imageurl;
              }

              if (!cryptoQuantities[cryptoname]) {
                cryptoQuantities[cryptoname] = {
                  quantity: 0,
                  imageurl: fetchedDetails[cryptoSymbol],
                  symbol: cryptoSymbol,
                  order: purchaseType,
                  cash: cashbalance,
                };
              }

              if (purchaseType === "BUY") {
                cryptoQuantities[cryptoname].quantity += quantity;
                cryptoQuantities[cryptoname].order = purchaseType;
                cryptoQuantities[cryptoname].cash = cashbalance;
              } else {
                cryptoQuantities[cryptoname].quantity -= quantity;
                cryptoQuantities[cryptoname].order = purchaseType;
                cryptoQuantities[cryptoname].cash = cashbalance;
              }
            }

            // Convert the aggregated quantities object into an array of objects

            const sortedCrypto = Object.keys(cryptoQuantities).map(
              (cryptoname) => ({
                cryptoname,
                quantity: cryptoQuantities[cryptoname].quantity,
                imageurl: cryptoQuantities[cryptoname].imageurl,
                symbol: cryptoQuantities[cryptoname].symbol,
                order: cryptoQuantities[cryptoname].order,
                cash: cryptoQuantities[cryptoname].cash,
              })
            );

            setcryptoquantitylist(sortedCrypto);
          };

          fetchAllDetails();

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
    getUserCryptoQuantity(controller.signal);

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
      {isLoading && <Loader />}
      <div className="portfolio-bg"></div>
      <Sidebars />
      <div className="portfolio-content">
        <div className="portfolio-header">
          <p>Portfolio</p>
          {tokenState.user && (
            <div className="user-email-box">
              <button className="logout">Logout</button>
              <div className="user-email">{tokenState.user.email}</div>
            </div>
          )}
        </div>
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
        <div className="crypto-list-container">
          <p>Crypto Holdings</p>
          {cryptoquantitylist && (
            <TableContainer
              component={Paper}
              style={{
                backgroundColor: "transparent",
                height: "85%",
                maxHeight: "100%",
                overflowY: "scroll",
              }}
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
                      Order Type
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
                      Quantity
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
                      Balance
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!err ? (
                    cryptoquantitylist.map((singlecoin, index) => (
                      <TableRow
                        key={index}
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
                          {singlecoin.cryptoname}
                        </TableCell>
                        <TableCell
                          style={{
                            color: singlecoin.order === "BUY" ? "green" : "red",
                            margin: "0px",
                            paddingLeft: "0px",
                            paddingRight: "0px",
                          }}
                          align="center"
                        >
                          {singlecoin.order}
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
                          {singlecoin.quantity} {singlecoin.symbol}
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
                          $ {Number(singlecoin.cash).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        style={{
                          color: "white",
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
          )}
        </div>
      </div>
    </div>
  );
}
