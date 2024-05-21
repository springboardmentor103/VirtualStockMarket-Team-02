import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebars from "../sidebar/Sidebars";
import "./trending.css";
import bg from "../Images/bg.png";
import logo11 from "../Images/icon11.png";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";

export default function Trending() {
  const navigate = useNavigate();
  const [cryptodata, setcryptodata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, seterr] = useState("");
  const { setdispdata, tokenState } = useContext(datacontext);
  useEffect(() => {
    if (tokenState.authtoken) {
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
        const formattedData = data.getresult.data.map((coin) => ({
          name: coin.name,
          price: coin.quote.USD.price,
          percent: coin.quote.USD.percent_change_7d,
          symbol: coin.symbol,
        }));
        setIsLoading(false);
        seterr("");
        setdispdata({ name: data.name, email: data.email });
        setcryptodata(formattedData);
      } else {
        setIsLoading(false);
        seterr(data.message);
        setcryptodata([]);
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
    try {
      setIsLoading(true);
      if (!value) {
        setIsLoading(false);
        getcryptodetails();
        return;
      }
      const response = await fetch(
        `http://localhost:8000/api/single-crypto?coin=${value}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        const paramvalue = value.toUpperCase();
        const formatdata = data.singledata.data[paramvalue].map((coin) => ({
          name: coin.name,
          price: coin.quote.USD.price,
          percent: coin.quote.USD.percent_change_7d,
          symbol: coin.symbol,
        }));
        setcryptodata(formatdata);
        seterr("");
        setIsLoading(false);
      }
      if (!data.success) {
        setcryptodata([]);
        seterr(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert("Internal server error");
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
              <img src={logo11} alt="logo11" className="Trending-logo11" />
              <p>Stocks</p>
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
              <p>Top Stocks</p>
              <button>view all</button>
            </div>
            <div className="stocks-content">
              {!err ? (
                cryptodata.map((singlecoin, index) => (
                  <div className="stocks" key={index}>
                    <i
                      className={`cf cf-${singlecoin.symbol.toLowerCase()}`}
                    ></i>
                    <h2>{singlecoin.name}</h2>
                    <div className="price-container">
                      <p>
                        {typeof singlecoin.price === "number"
                          ? singlecoin.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : singlecoin.price}
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
}
