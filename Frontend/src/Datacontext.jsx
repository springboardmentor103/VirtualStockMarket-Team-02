import React, { createContext, useState, useEffect } from "react";
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
  const fetchCryptoDetails = async (symbol) => {
    const apiKey =
      "2babadd99f2ac6cb23d7659bc079e03f512022b2bb179042552955994ff94d6f"; // replace with your actual API key
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apiKey}`;
    const res = await fetch(url);
    const responsedata = await res.json();
    if (res.ok) {
      const data = responsedata.RAW[symbol].USD;
      const details = {
        open: data.OPENDAY,
        high: data.HIGHDAY,
        low: data.LOWDAY,
        close: data.PRICE,
        volume: data.VOLUME24HOUR,
        avgVolume: data.VOLUME24HOURTO,
        marketCap: data.MKTCAP,
        imageurl: `https://www.cryptocompare.com${data.IMAGEURL}`,
      };
      return details;
    }
  };
  useEffect(() => {
    const storedSymbol = localStorage.getItem("symbol");
    if (storedSymbol) {
      const parsedSymbol = JSON.parse(storedSymbol);
      if (parsedSymbol) {
        setselectedcrypto(parsedSymbol);
      }
    } else {
      setselectedcrypto(null);
    }
  }, []);

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
        fetchCryptoDetails,
      }}
    >
      {children}
    </datacontext.Provider>
  );
}
