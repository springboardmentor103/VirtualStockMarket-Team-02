import React, { createContext, useState } from "react";
export const datacontext = createContext();
export default function Datacontext({ children }) {
  const [tokenState, setTokenState] = useState({
    authtoken: false,
    otptoken: false,
    otpmatchtoken: false,
  });
  const [dispdata, setdispdata] = useState({ name: "", email: "" });

  return (
    <datacontext.Provider
      value={{ tokenState, setTokenState, dispdata, setdispdata }}
    >
      {children}
    </datacontext.Provider>
  );
}
