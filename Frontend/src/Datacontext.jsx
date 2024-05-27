import React, { createContext, useState } from "react";
export const datacontext = createContext();
export default function Datacontext({ children }) {
  const [tokenState, setTokenState] = useState({
    authtoken: false,
    otptoken: false,
    otpmatchtoken: false,
  });
  const [dispdata, setdispdata] = useState({ name: "", email: "" });
  const [selectedcrypto, setselectedcrypto] = useState(null);
  const [activecolor, setactivecolor] = useState({
    Dashboard: "#cec4c4",
    Account: "#cec4c4",
    Orderhistory: "#cec4c4",
    Portfolio: "#cec4c4",
    Leaderboard: "#cec4c4",
  });

  return (
    <datacontext.Provider
      value={{
        tokenState,
        setTokenState,
        dispdata,
        setdispdata,
        activecolor,
        setactivecolor,
        selectedcrypto,
        setselectedcrypto,
      }}
    >
      {children}
    </datacontext.Provider>
  );
}
