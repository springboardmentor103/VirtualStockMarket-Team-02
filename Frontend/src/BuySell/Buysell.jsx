import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../Images/bg.png";
import Sidebars from "../sidebar/Sidebars";
import logo11 from "../Images/icon11.png";
import Loader from "../Loader/Loader";
import crypto from "../Images/micro.png";
import { datacontext } from "../Datacontext";
import "./Buysell.css";
export default function Buysell() {
  const navigate = useNavigate();
  const { tokenState, selectedcrypto } = useContext(datacontext);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (tokenState.authtoken) {
      navigate("/Buy-Sell");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/forgetPassword");
    }
    console.log(selectedcrypto);
  }, [tokenState, navigate]);
  return (
    <div className="buysell-container">
      {isLoading ? <Loader /> : ""}
      <img src={bg} alt="bg" className="buysell-bg" />
      <Sidebars />
      <div className="buysell-right-cover">
        <div className="buysell-right-container">
          <div className="title-container">
            <img src={logo11} alt="logo11" />
            <p>Stock Detail</p>
          </div>
          <div className="crypto-info-container">
            <div className="crypto-heading-container">
              <div className="crypto-pic">
                <img src={crypto} alt="crypto-image" />
                <div className="crypto-identify">
                  <p>{selectedcrypto.symbol}</p>
                  <span>{selectedcrypto.name}</span>
                </div>
              </div>
              <div className="crypto-price-container">
                <h3>
                  $
                  {typeof selectedcrypto.price === "number"
                    ? selectedcrypto.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : selectedcrypto.price}
                </h3>
                <span>
                  {typeof selectedcrypto.percent === "number"
                    ? selectedcrypto.percent.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : selectedcrypto.percent}
                  %
                </span>
              </div>
            </div>
            <div className="stats-container">
              <div className="head">Statistics</div>
              <div className="values">
                <div className="value-1">
                  <div>
                    <p>Open</p>
                    <span>224.5</span>
                  </div>
                  <div>
                    <p>High</p>
                    <span>224.5</span>
                  </div>
                  <div>
                    <p>Low</p>
                    <span>224.5</span>
                  </div>
                </div>
                <div className="value-2">
                  <div>
                    <p>Volume</p>
                    <span>224.5</span>
                  </div>
                  <div>
                    <p>Avg.Volume</p>
                    <span>224.5</span>
                  </div>
                  <div>
                    <p>Market Cap</p>
                    <span>224.5</span>
                  </div>
                </div>
              </div>
              <div className="btns">
                <button>Buy</button>
                <button>Sell</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
