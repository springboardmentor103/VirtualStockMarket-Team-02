import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Protectedroute from "./components/Protectedroute";
import "./App.css";
import Login from "./Login/login";
import ForgetPassword from "./forgetPassword/forgetPassword";
import Dashboard from "./Dashboard/Dashboard";
import Navbar from "./components/Navbar";
import Register from "./Register/Register";
import ResetPass from "./resetPass/resetPass";
import Datacontext from "./Datacontext";
import Trending from "./Trending Stocks/Trending";

function App() {
  return (
    <Datacontext>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<Navbar />} />
            <Route path="/login" element={<Protectedroute Element={Login} />} />
            <Route
              path="/dashboard"
              element={<Protectedroute Element={Dashboard} />}
            />
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
          </Routes>
        </div>
      </BrowserRouter>
    </Datacontext>
  );
}

export default App;
