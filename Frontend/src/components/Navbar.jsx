import { useNavigate } from "react-router-dom";
import React, { useEffect, useContext } from "react";
import { datacontext } from "../Datacontext";

export default function Navbar() {
  const navigate = useNavigate();
  const { tokenState } = useContext(datacontext);

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/login");
    } else if (tokenState.authtoken) {
      navigate("/TrendingStocks");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/forgetPassword");
    }
  }, [tokenState, navigate]);

  return <></>;
}
