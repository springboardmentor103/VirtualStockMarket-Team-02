import React from "react";
import { useNavigate } from "react-router-dom";
import "./Error404Page.css";
import errorImage from "../Images/err.png";
import bg from "../Images/bg.png";

const Error404Page = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-container">
      <img src={bg} alt="bg" className="bg" />
      <div className="error-content">
        <img src={errorImage} alt="404" className="error-image" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <button onClick={handleGoBack} className="go-back-button">
          Go back
        </button>
      </div>
    </div>
  );
};

export default Error404Page;
