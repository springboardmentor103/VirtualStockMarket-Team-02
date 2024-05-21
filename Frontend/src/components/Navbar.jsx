import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
export default function Navbar() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/authstatus", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.success) {
          navigate("/TrendingStocks");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking authToken:", error);
        navigate("/login");
      }
    };

    checkAuthToken();
  }, [navigate]);

  return <></>;
}
