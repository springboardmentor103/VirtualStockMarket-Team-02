import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Protectedroute({ Element }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/authstatus", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.success) {
          navigate("/dashboard");
        } else {
          if (location.pathname === "/register") {
            navigate("/register");
          } else if (location.pathname === "/login") {
            navigate("/login");
          } else if (location.pathname === "/forgetPassword") {
            navigate("/forgetPassword");
          } else if (location.pathname === "/getotp") {
            navigate("/getotp");
          } else {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error checking authToken:", error);
        // Navigate to login route if there's an error
        navigate("/login");
      }
    };

    checkAuthToken();
  }, [navigate, location]);

  return <Element />;
}
