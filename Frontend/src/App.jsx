import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Protectedroute from "./components/Protectedroute";
import "./App.css";
import Login from "./Login/login";
import ForgetPassword from "./forgetPassword/forgetPassword";
import Navbar from "./components/Navbar";
import Register from "./Register/Register";
import ResetPass from "./resetPass/resetPass";
import Datacontext from "./Datacontext";
import Trending from "./Trending Stocks/Trending";
import Orderhistory from "./order history/Orderhistory";
import Account from "./Account/Accounts";
import Buysell from "./BuySell/Buysell";
import Buy from "./Buy/Buy";
import Sell from "./sell/Sell";
import LeaderBoard from "./Leaderboard/LeaderBoard";
import Portfolio from "./portfolio/portfolio";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Datacontext>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<Protectedroute Element={Navbar} />} />
            <Route path="/login" element={<Protectedroute Element={Login} />} />

            <Route
              path="/register"
              element={<Protectedroute Element={Register} />}
            />
            <Route
              path="/forgetPassword"
              element={<Protectedroute Element={ForgetPassword} />}
            />
            <Route
              path="/resetPass"
              element={<Protectedroute Element={ResetPass} />}
            />
            <Route
              path="/TrendingStocks"
              element={<Protectedroute Element={Trending} />}
            />
            <Route
              path="/OrderHistory"
              element={<Protectedroute Element={Orderhistory} />}
            />
            <Route
              path="/Account"
              element={<Protectedroute Element={Account} />}
            />
            <Route
              path="/Buy-Sell"
              element={<Protectedroute Element={Buysell} />}
            />
            <Route path="/buy" element={<Protectedroute Element={Buy} />} />
            <Route path="/sell" element={<Protectedroute Element={Sell} />} />
            <Route
              path="/Leaderboard"
              element={<Protectedroute Element={LeaderBoard} />}
            />
            <Route
              path="/portfolio"
              element={<Protectedroute Element={Portfolio} />}
            />
          </Routes>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </Datacontext>
  );
}

export default App;
