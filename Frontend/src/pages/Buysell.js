import Ellipse from "../components/Ellipse";
import React, { useState } from 'react';
import Button from "../components/Button";
import "./Buysell.css";


const Buysell = () => {
  const [buyData, setBuyData] = useState(null);
  const [sellData, setSellData] = useState(null);

  const handleBuyButtonClick = () => {
    console.log('Buy button clicked');
    fetch('http://localhost:8000/api/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
      .then(response => {
        // console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Buy data received:', data);
        setBuyData(data);
      })
      .catch(error => console.error('Error fetching buy data:', error));
  };

  const handleSellButtonClick = () => {
    console.log('Sell button clicked');
    fetch('http://localhost:8000/api/sell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Sell data received:', data);
        setSellData(data);
      })
      .catch(error => console.error('Error fetching sell data:', error));
  };

  


  return (
        <div className="portfolio">

          <div className="portfolio1">
          <div />
            <div className="portfolio-item" />
            <div className="portfolio-inner" />
            <Ellipse ellipseEllipse7="/ellipse-8.svg" ellipseIconOverflow="unset" ellipseIconPosition="absolute" ellipseIconTop="918px" ellipseIconLeft="264px" />
            <Ellipse ellipseEllipse7="/ellipse-8.svg" ellipseIconOverflow="unset" ellipseIconPosition="absolute" ellipseIconTop="498px" ellipseIconLeft="1000px" />
            
            <img className="portfolio-child1" alt="" src="/rectangle-18.svg" />
            <div className="side-bar">

              <img className="intersect-icon" alt="" src="/intersect.svg" />
              <img className="intersect-icon1" alt="" src="/intersect1@2x.png" />
              <div className="springboard">Springboard</div>

              <div className="personal">PERSONAL</div>
              
              <div className="button7">
                <div className="dashboard">Accounts</div>
                <img className="group-icon account" alt="" src="/group@2x.png" />
                <img className="icon-chevron-right-arrow-icon" alt="" src="/-icon-chevron-right-arrow-icon.svg"/>
              </div>
              
              <div className="button">
                <div className="dashboard">Dashboard</div>
                <img className="icon-alternate-tachometer" alt="" src="/-icon-alternate-tachometer.svg" />
                <img className="icon-chevron-right-arrow-icon" alt="" src="/-icon-chevron-right-arrow-icon.svg"/>
              </div>

              <div className="button1">
                <div className="dashboard">App</div>
                <img className="icon-app-menu" alt="" src="/-icon-app-menu.svg" />
                <img className="icon-chevron-right-arrow-icon" alt="" src="/-icon-chevron-right-arrow-icon.svg"/>
              </div>

              <div className="button2">
                <div className="dashboard">Mailbox</div>
                <img className="icon-mail" alt="" src="/-icon-mail.svg" />
                <img className="icon-chevron-right-arrow-icon" alt="" src="/-icon-chevron-right-arrow-icon.svg"/>
              </div>

              <div className="button3">
                <div className="dashboard">UI Elements</div>
                <img className="icon-mail" alt="" src="/-icon-laptop.svg" />
                <img className="icon-chevron-right-arrow-icon" alt="" src="/-icon-chevron-right-arrow-icon.svg"/>
              </div>

              <div className="chartstables-layouts">{`CHARTS,TABLES & LAYOUTS`}</div>

              <div className="button4">
                <div className="dashboard">Charts</div>
                <img className="icon-partition charts" alt="" src="/-icon-partition.svg" />
                <img className="icon-chevron-right-arrow-icon" alt="" src="/-icon-chevron-right-arrow-icon.svg"/>
              </div>

              <div className="button5">
                <div className="dashboard">Tables</div>
                <img className="icon-partition table" alt="" src="/-icon-tables-bold.svg"/>
                <img className="icon-chevron-right-arrow-icon" alt="" src="/-icon-chevron-right-arrow-icon.svg"/>
              </div>

              <div className="button6">
                <div className="dashboard">LeaderBoard</div>
                <img className="icon-partition leaderboard" alt="" src="/-icon-tables-bold.svg"/>
                <img className="icon-chevron-right-arrow-icon1" alt="" src="/-icon-chevron-right-arrow-icon.svg"/>
              </div>
              <Ellipse ellipseEllipse7="/ellipse-9.svg" />
                
              <div className="ellipse-div" /> 
              <div className="ellipse-div2" /> 
              <Button />
            </div>
          </div>

          {/* -------------------------------------Stocks Details--------------------------------- */}
          <img className="icon-chevron-left" alt="" src="/-icon-chevronleft@2x.png" />
            <h2 className="home1">
              <p className="stocks">Stock Details</p>
            </h2>

            <div className="nasdaq">
              <div className="twtr">MSFT</div>
              <div className="body">
                <div className="twitter-inc">Microsoft</div>
              </div>
            </div> 
            <div className="div6">$302.1</div>
            <div className="percent">
              <img className="triangle-icon" alt="" src="/triangle.svg" />
              <div className="div5">0.23%</div>
            </div>

          {/* -------------------------------------Statistics--------------------------------- */}
          <div className="statistics">
            <div className="statistics1">Statistics</div>
            <div className="open">
              <div className="open1">Open</div>
              <div className="div4">224.54</div>
            </div>
            <div className="high">
              <div className="high1">High</div>
              <div className="div3">227.29</div>
            </div>
            <div className="low">
              <div className="low1">Low</div>
              <div className="div2">224.10</div>
            </div>
            <div className="volume">
              <div className="avg-volume1">Volume</div>
              <div className="div1">834,146</div>
            </div>
            <div className="avg-volume">
              <div className="avg-volume1">Avg. Volume</div>
              <div className="div">1,461,009</div>
            </div>
            <div className="market-cap">
              <div className="market-cap1">Market Cap</div>
              <div className="b">43.419B</div>
            </div>
          </div>

          {/* -------------------------------------Buttons--------------------------------- */}
              <div onClick={handleSellButtonClick} className="buttonslargenormalrest3" style={{ left: "71.5%" }}>
                <div className="base9" style={{ backgroundColor: "#d40000" }} />
                <button className="edit-text-here2">Sell</button>
              </div>
              <div onClick={handleBuyButtonClick} className="buttonslargenormalrest3">
                <div className="base9" style={{ backgroundColor: "#04491c" }} />
                <button className="edit-text-here2">Buy</button>
              </div>

            {/* Display data received from backend */}
            {buyData && <div className="buy-data">{JSON.stringify(buyData)}</div>}
            {sellData && <div className="sell-data">{JSON.stringify(sellData)}</div>}
          </div>
  );
};
export default Buysell;