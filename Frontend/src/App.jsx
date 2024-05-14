import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Protectedroute from "./components/Protectedroute";
import "./App.css";
import Login from "./Login/login";
import ForgetPassword from "./forgetPassword/forgetPassword";
import GetOtp from "./getotp/getotp";
import Reset from "./resetPass/resetPass";
import Success from "./PassSuccess/PassSuccess";
import Dashboard from "./Dashboard/Dashboard";
import Navbar from "./components/Navbar";
import Register from "./Register/Register";
function App() {
  return (
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
          <Route path="/getotp" element={<Protectedroute Element={GetOtp} />} />
          <Route path="/resetPass" element={<Reset />} />
          <Route path="/PassSuccess" element={<Success />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
