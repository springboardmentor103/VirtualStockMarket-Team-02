import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Login/login";
import Signup from "./Register/signup";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ResetPassword from "./ResetPassword/resetPassword";
import Dashboard from "./Dashboard/Dashboard";
import StockDetail from "./Dashboard/StockDetail";
import PasswordChanged from "./Passwordchanged/PasswordChanged";

import twitterlogo from "./logos/twitter.png";
import googlelogo from "./logos/google.png";
import msft from "./logos/microsoft.png";

const stockData = [
  {
    name: "TWTR",
    logo: twitterlogo, // Ensure you have imported these logos at the top of your file
    price: 63.98,
    trend: "down",
    description:
      "Twitter, Inc. operates as a platform for public self-expression and conversation in real time.",
    marketCap: "29.5B",
    peRatio: 21.45, // Price/Earnings Ratio
    highYear: 80.75,
    lowYear: 54.12,
  },
  {
    name: "GOOGL",
    logo: googlelogo,
    price: 2840,
    trend: "up",
    description:
      "Alphabet Inc., through its subsidiaries, provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.",
    marketCap: "1.5T",
    peRatio: 35.82,
    highYear: 3030.93,
    lowYear: 2050.12,
  },
  {
    name: "MSFT",
    logo: msft,
    price: 302.1,
    trend: "down",
    description:
      "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.",
    marketCap: "2.2T",
    peRatio: 35.67,
    highYear: 349.67,
    lowYear: 256.84,
  },
  // Add additional stock entries here...
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-changed" element={<PasswordChanged />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/stock/:stockId"
          element={<StockDetail stocks={stockData} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
