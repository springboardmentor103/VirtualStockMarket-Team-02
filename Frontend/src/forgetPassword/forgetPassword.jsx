import React, { useState, useEffect, useContext } from "react";
import "./forgetPassword.css";
import bg from "../Images/bg.png";
import arrow from "../Images/arrow.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";

function ForgetPassword() {
  const navigate = useNavigate();

  const { tokenState, setTokenState } = useContext(datacontext);
  useEffect(() => {
    if (tokenState.authtoken) {
      navigate("/TrendingStocks");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    }
  }, [tokenState, navigate]);

  const [forgetData, setForgetData] = useState({
    email: "",
    otp: "",
  });
  const [err, seterr] = useState({
    email: "",
    otp: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const handleForgotPassword = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const validate1 = await validation1(forgetData);
      if (!validate1) {
        setIsLoading(false);
        return;
      }
      const response1 = await fetch("http://localhost:8000/api/otpgenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgetData.email }),
        credentials: "include",
      });
      const data1 = await response1.json();
      if (response1.ok && data1.success) {
        setIsLoading(false);
        alert(
          "You have generated the otp, Enter the OTP received in your email."
        );
        seterr({
          otp: "",
          email: "",
        });
        setTokenState({
          authtoken: false,
          otptoken: true,
          otpmatchtoken: false,
        });
      } else {
        if (data1.message.email) {
          setIsLoading(false);
          seterr({
            email: data1.message.email[0],
            otp: "",
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      alert("Internal server error.");
    }
  };
  const handleOtpMatching = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const validate2 = await validation2(forgetData);
      if (!validate2) {
        setIsLoading(false);
        return;
      }
      const response2 = await fetch("http://localhost:8000/api/otpmatching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: forgetData.otp }),
        credentials: "include",
      });
      const data2 = await response2.json();
      if (response2.ok && data2.success) {
        setIsLoading(false);
        alert("You have Entered correct otp, continue to create new password.");
        seterr({
          otp: "",
          email: "",
        });
        setTokenState({
          authtoken: false,
          otptoken: false,
          otpmatchtoken: true,
        });
        navigate("/resetPass");
      } else {
        if (typeof data2.message === "object") {
          setIsLoading(false);
          seterr({
            email: "",
            otp: data2.message.otp[0],
          });
        }
        if (typeof data2.message === "string") {
          setIsLoading(false);
          seterr({
            email: "",
            otp: "OTP expired. Please refresh the page.",
          });
          setTimeout(() => {
            navigate(0);
          }, 1000);
        }
      }
    } catch (error) {
      setIsLoading(false);
      alert("Internal server error.");
    }
  };

  const validation1 = async (data) => {
    let isValid = true;
    const errors = { email: "", otp: "" };
    if (!data.email) {
      errors.email = "Email required.";
      isValid = false;
    } else {
      if (!isValidEmail(data.email)) {
        errors.email = "Invalid email format.";
        isValid = false;
      }
    }
    seterr(errors);
    return isValid;
  };
  const validation2 = async (data) => {
    let isValid = true;
    const errors = { email: "", otp: "" };
    if (!data.otp) {
      errors.otp = "OTP is required.";
      isValid = false;
    }
    seterr(errors);
    return isValid;
  };
  const isValidEmail = (email) => {
    const emailRegex =
      /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
    return emailRegex.test(email);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForgetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="forgotpassword-container">
      {isLoading ? <Loader /> : ""}
      <img src={bg} alt="bg" className="overlay-bg" />
      <div className="forgotpassword-form-cover">
        <div className="arrow">
          <img src={arrow} alt="arrow" />
        </div>
        <div className="forgotpassword-form-container">
          <h1>
            Empowering Your Trades: Where <br /> Opportunities Meet Expertise
          </h1>
          <h2>FORGOT YOUR PASSWORD?</h2>
          <p>
            {tokenState.otptoken
              ? "PLEASE ENTER THE OTP YOU RECEIVED IN EMAIL"
              : "PLEASE ENTER THE EMAIL YOU USED TO SIGN IN"}
          </p>
          <form
            onSubmit={
              tokenState.otptoken ? handleOtpMatching : handleForgotPassword
            }
          >
            <div className={`email ${tokenState.otptoken ? "hide" : ""}`}>
              <input
                type="text"
                name="email"
                id="email"
                className={`${err.email ? "err" : ""}`}
                placeholder="Enter Email"
                value={forgetData.email}
                onChange={handleInputChange}
              />
              <span>{err.email}</span>
            </div>
            <div className={`otp ${tokenState.otptoken ? "" : " hide"}`}>
              <input
                type="text"
                name="otp"
                id="otp"
                className={`${err.otp ? "err" : ""}`}
                placeholder="Enter OTP"
                value={forgetData.otp}
                onChange={handleInputChange}
              />
              <span>{err.otp}</span>
            </div>
            <div className="submit">
              <button type="submit">
                {tokenState.otptoken ? "Match OTP" : "Request OTP"}
              </button>
            </div>
          </form>
          <div className="signup-link-container">
            <span>
              Don’t have an account?
              <Link to="/login" className="sign-link">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
