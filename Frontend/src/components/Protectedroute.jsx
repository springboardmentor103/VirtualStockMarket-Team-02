import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { datacontext } from "../Datacontext";

export default function Protectedroute({ Element }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { setTokenState } = useContext(datacontext);
  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/authstatus", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.success) {
          let newTokenState = {
            authtoken: false,
            otptoken: false,
            otpmatchtoken: false,
          };
          if (data.token === "authToken") {
            newTokenState.authtoken = true;
          } else if (data.token === "otpToken") {
            newTokenState.otptoken = true;
          } else if (data.token === "otpmatchToken") {
            newTokenState.otpmatchtoken = true;
          }
          setTokenState(newTokenState);
        } else {
          if (
            location.pathname === "/login" ||
            location.pathname === "/register" ||
            location.pathname === "/forgetPassword"
          ) {
            navigate(location.pathname);
          }
          if (location.pathname === "/resetPass") {
            navigate("/forgetPassword");
          }
          if (location.pathname === "/dashboard") {
            navigate("/login");
          }
          if (location.pathname === "/account") {
            navigate("/login");
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Error checking authToken:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthToken();
  }, [navigate, location.pathname, setTokenState]);

  if (loading) return null;

  return <Element />;
}
