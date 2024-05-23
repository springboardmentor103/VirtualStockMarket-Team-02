import React, { useEffect, useState, useContext } from "react";
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
  const getorderdetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/dashboard", {
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const formattedData = data.user.purchases.map((coin) => ({
          name: coin.cryptoname,
          price: coin.volume,
          percent: coin.percent,
          symbol: coin.cryptoSymbol,
          type: coin.purchaseType,
          status: coin.status,
        }));
        console.log(formattedData);
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
}
