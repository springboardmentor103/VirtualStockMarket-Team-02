import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/login.css";
import bg from "../Images/bg.png";
import arrow from "../Images/arrow.png";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [err, seterr] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { tokenState, setTokenState } = useContext(datacontext);
  useEffect(() => {
    if (tokenState.authtoken) {
      navigate("/dashboard");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/login");
    }
  }, [tokenState, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!validation(loginData)) {
        setIsLoading(false);
        return;
      }
      const response = await fetch("http://localhost:8000/api/loginuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
        alert("You have successfully logged in.");
        navigate("/dashboard");
        setLoginData({
          email: "",
          password: "",
        });
        seterr({
          email: "",
          password: "",
        });
        setTokenState({
          authtoken: true,
          otptoken: false,
          otpmatchtoken: false,
        });
      } else {
        if (data.message.email) {
          setIsLoading(false);
          seterr({
            email: "Use the Email used to create your account.",
            password: "",
          });
        }
        if (data.message.password) {
          setIsLoading(false);
          seterr({ email: "", password: "Enter correct password." });
        }
      }
    } catch (error) {
      setIsLoading(false);
      alert("Server Error.");
    }
  };
  const validation = (data) => {
    let isValid = true;
    const errors = { email: "", password: "" };
    if (!data.email) {
      errors.email = "Email required.";
      isValid = false;
    } else {
      if (!isValidEmail(data.email)) {
        errors.email = "Invalid email format.";
        isValid = false;
      }
    }
    if (!data.password) {
      errors.password = "Password required.";
      isValid = false;
    } else {
      if (isValidPassword(data.password).length === 0) {
        if (data.password.length < 8) {
          errors.password = "Password must be min 8 characters";
          isValid = false;
        }
      }
      if (isValidPassword(data.password).length > 0) {
        if (data.password.length < 8) {
          errors.password = "Password must be min 8 characters";
          const passerr = isValidPassword(data.password);
          errors.password =
            errors.password + " and must contain atleast " + passerr.join(" ");
          isValid = false;
        } else {
          const passerr = isValidPassword(data.password);

          errors.password =
            "Password must atleast contain " + passerr.join(" ");
          isValid = false;
        }
      }
    }

    seterr(errors);
    return isValid;
  };

  const isValidEmail = (email) => {
    const emailRegex =
      /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    let errors = [];
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("one uppercase letter");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("one lowercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("one number");
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("one special character");
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      {isLoading ? <Loader /> : ""}
      <img src={bg} alt="bg" className="overlay-bg" />
      <div className="login-form-cover">
        <div className="arrow">
          <img src={arrow} alt="arrow" />
        </div>
        <div className="login-form-container">
          <h1>
            Empowering Your Trades: Where <br /> Opportunities Meet Expertise
          </h1>
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="email">
              <label htmlFor="email">Email</label>
              <br />
              <input
                type="text"
                name="email"
                id="email"
                className={`${err.email ? "err" : ""}`}
                placeholder="Enter Email"
                value={loginData.email}
                onChange={handleInputChange}
              />
              <span>{err.email}</span>
            </div>
            <div className="password">
              <label htmlFor="password">Password</label>
              <br />
              <input
                type="password"
                name="password"
                id="password"
                className={`${err.password ? "err" : ""}`}
                placeholder="Enter password"
                value={loginData.password}
                onChange={handleInputChange}
              />
              <span>{err.password}</span>
            </div>
            <div className="check-link-container">
              <div className="checkbox">
                <input type="checkbox" name="checkbox" id="checkbox" required />
                <label htmlFor="checkbox">Keep me logged in</label>
              </div>
              <div>
                <Link to="/forgetPassword" className="link">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="submit">
              <button type="submit">Login</button>
            </div>
          </form>
          <div className="signup-link-container">
            <span>
              Don’t have an account?
              <Link to="/register" className="sign-link">
                Signup
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
