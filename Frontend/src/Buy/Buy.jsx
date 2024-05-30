import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../Images/bg.png";
import Sidebars from "../sidebar/Sidebars";
import logo11 from "../Images/icon11.png";
import Loader from "../Loader/Loader";
import up from "../Images/up.png";
import down from "../Images/down.png";
import { datacontext } from "../Datacontext";
import "./buy.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Buy() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cryptodetails, setcryptodetails] = useState(null);
  const [disable, setdisable] = useState(false);

  const {
    tokenState,
    selectedcrypto,
    setselectedcrypto,
    setactivecolor,
    fetchCryptoDetails,
  } = useContext(datacontext);
  const [count, setcount] = useState(0);
  useEffect(() => {
    if (tokenState.authtoken) {
      setactivecolor({
        Dashboard: "white",
        Account: "#cec4c4",
        Orderhistory: "#cec4c4",
        Portfolio: "#cec4c4",
        Leaderboard: "#cec4c4",
      });
      navigate("/buy");
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
            const responsecash = await fetch(
              "http://localhost:8000/api/portfolio",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );
            const portfoliodetails = await responsecash.json();

            const responsecryptoquantity = await fetch(
              "http://localhost:8000/api/dashboard",
              {
                credentials: "include",
              }
            );
            const cryptoquantity = await responsecryptoquantity.json();
            const sumofcryptoquantity = cryptoquantity.user.purchases
              .filter((item) => item.cryptoname === selectedCoinData.name)
              .reduce((acc, item) => acc + item.quantity, 0);
            const formattedData = {
              name: selectedCoinData.name,
              price: selectedCoinData.quote.USD.price,
              percent: selectedCoinData.quote.USD.percent_change_7d,
              symbol: selectedCoinData.symbol,
              imageurl: details.imageurl,
              open: details.open,
              close: details.close,
              cashbalance: portfoliodetails.totalPortfolio.totalAmount,
              quantity: sumofcryptoquantity,
            };

            setIsLoading(false);
            //seterr("");
            setcryptodetails(formattedData);
          } else {
            setIsLoading(false);
            setcryptodetails(null);
            //seterr(`No data found for crypto ${selectedcrypto.name}`);
          }
        } else {
          setIsLoading(false);
          toast.error(`${data.message}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            onClose: () => {
              setcryptodetails(null);
            },
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Internal Server Error.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      alert("Internal server error");
    }
  };
  useEffect(() => {
    if (selectedcrypto) {
      console.log(selectedcrypto);
      getcryptodetail();
    } else {
      navigate("/TrendingStocks");
    }
  }, [navigate, selectedcrypto]);
  const handlePurchase = async () => {
    try {
      if (!count) {
        toast.error("Purchase quantity required.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        //alert(`Purchase quantity required.`);
        return;
      }
      if (count === 0 || count === "0") {
        toast.error(
          `Purchase ${cryptodetails.name} quantity must be greater than 0.`,
          {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
        /*alert(
          `Purchase ${cryptodetails.name} quantity must be greater than 0.`
        );*/
        return;
      }
      if (cryptodetails.price.toFixed(2) * count < 1) {
        toast.error(`Purchase amount must be at least $1.`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        //alert(`Purchase amount must be at least $1.`);
        return;
      }

      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cryptoSymbol: cryptodetails.symbol,
          quantity: count,
          cryptoname: cryptodetails.name,
        }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
        toast.success(`${data.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            setselectedcrypto(null);
            setcount(0);
            navigate("/OrderHistory");
          },
        });
        //setselectedcrypto(null);
        //setcount(0);
        //alert(data.message);
        //navigate("/OrderHistory");
      }
      if (!data.success) {
        setIsLoading(false);

        toast.error(`${"Not enough crypto currency to buy"}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        //alert(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Internal Server Error!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      //alert("Internal Server Error.");
    }
  };
  const handleIncreament = () => {
    console.log("count", typeof count, count);
    setcount((prevCount) => {
      const newCount = prevCount + 1;
      if (cryptodetails.price * newCount > cryptodetails.cashbalance) {
        setdisable(true);
      } else {
        setdisable(false);
      }

      return newCount;
    });
  };
  const handleDecreament = () => {
    if (count <= 1) {
      setcount((prevCount) => {
        const newCount = prevCount - 0.01;
        if (cryptodetails.price * newCount > cryptodetails.cashbalance) {
          setdisable(true);
        } else {
          setdisable(false);
        }

        return newCount;
      });
    }
    if (count <= 0) {
      setcount(0);
    }
    if (count > 1) {
      setcount((prevCount) => {
        const newCount = prevCount - 1;
        if (cryptodetails.price * newCount > cryptodetails.cashbalance) {
          setdisable(true);
        } else {
          setdisable(false);
        }

        return newCount;
      });
    }
  };
  return (
    <div className="buy-container">
      {isLoading ? <Loader /> : ""}
      <img src={bg} alt="bg" className="buy-bg" />
      <Sidebars />
      <div className="buy-right-cover">
        <div className="buy-right-container">
          <div className="title-container">
            <img
              src={logo11}
              alt="logo11"
              onClick={() => navigate("/Buy-Sell")}
            />
            <p onClick={() => navigate("/Buy-Sell")}>Buy/Sell</p>
          </div>
          {cryptodetails ? (
            <div className="buy-info-container">
              <div className="buy-heading-container">
                <div className="buy-crypto">
                  <div className="buy-crypto-info">
                    <img
                      src={cryptodetails ? cryptodetails.imageurl : ""}
                      alt="crypts"
                    />
                    <div className="buy-crypto-name">
                      <p>{cryptodetails ? cryptodetails.name : ""}</p>
                      <span>{cryptodetails ? cryptodetails.symbol : ""}</span>
                    </div>
                  </div>
                  <div className="buy-price-container">
                    <h3>
                      $
                      {cryptodetails
                        ? typeof cryptodetails.price === "number"
                          ? cryptodetails.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : cryptodetails.price
                        : ""}
                    </h3>
                    <span
                      className={`${
                        cryptodetails
                          ? cryptodetails.percent > 0
                            ? "up"
                            : "down"
                          : ""
                      }`}
                    >
                      <img
                        src={
                          cryptodetails
                            ? cryptodetails.percent > 0
                              ? up
                              : down
                            : ""
                        }
                        alt="trend"
                      />
                      {cryptodetails
                        ? typeof cryptodetails.percent === "number"
                          ? Math.abs(cryptodetails.percent).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : cryptodetails.percent
                        : ""}
                      %
                    </span>
                  </div>
                  <div className="buy-crypto-stats">
                    <div>
                      <p>Open</p>
                      <span>
                        {cryptodetails ? cryptodetails.open.toFixed(2) : ""}
                      </span>
                    </div>
                    <div>
                      <p>Close</p>
                      <span>
                        {cryptodetails ? cryptodetails.close.toFixed(2) : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="buy-quantity-box">
                  <div className="buy-quantity">
                    <p>Please specify how many units you are going to buy?</p>
                    <div className="buy-quantity-counter">
                      <div className="plus" onClick={handleIncreament}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                      <div className="counter-value">
                        <input
                          type="number"
                          value={count}
                          placeholder="Enter Units to Buy"
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            setcount(Number(inputValue));
                            if (
                              cryptodetails.price * inputValue >
                              cryptodetails.cashbalance
                            ) {
                              setdisable(true);
                            } else {
                              setdisable(false);
                            }
                          }}
                        />
                      </div>
                      <div className="minus" onClick={handleDecreament}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="crypto-holdings">
                      <p>
                        Total Lots for sell: {cryptodetails.quantity.toFixed(5)}
                      </p>
                      <p>
                        Cash Balance: ${cryptodetails.cashbalance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handlePurchase}
                    disabled={disable}
                    className={`${disable ? "disabled" : ""}`}
                  >
                    $ {""}
                    {count === "" || count === 0
                      ? 0
                      : (cryptodetails.price * count).toFixed(2)}
                  </button>
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
