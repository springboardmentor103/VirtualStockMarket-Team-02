import React, { useState, useEffect, useContext } from "react";
import "./register.css";
import bg from "../Images/bg.png";
import arrow from "./arrow.png";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate();
  const { tokenState } = useContext(datacontext);
  useEffect(() => {
    if (tokenState.authtoken) {
      navigate("/TrendingStocks");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/register");
    }
  }, [tokenState, navigate]);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [err, seterr] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showotp, setshowotp] = useState(false);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Perform validation
    const validate = await validation1(signupData);

    if (!validate) {
      // If validation fails, stop the signup process and set loading to false
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/checkemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: signupData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${data.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            /*setSignupData({
              email: "",
              password: "",
              name: "",
            });
            seterr({
              name: "",
              email: "",
              password: "",
            });
            navigate("/login");*/
            setshowotp(true);
          },
        });
      }
      if (!data.success) {
        seterr((prevErr) => ({
          ...prevErr,
          email: data.message,
        }));
      }
      /*if (data.message.email) {
        seterr((prevErr) => ({
          ...prevErr,
          email: data.message.email[0],
        }));
      }*/
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validation1 = async (data) => {
    let isValid = true;
    const errors = { email: "", password: "", name: "", otp: "" };

    if (!data.name) {
      errors.name = "FullName required.";
      isValid = false;
    } else {
      const hasSpecialChars = /[^\w\s]/.test(data.name); // Regular expression for special characters
      if (data.name.length < 3) {
        errors.name = "Full Name must be at least 3 characters long.";
        isValid = false;
      } else if (hasSpecialChars) {
        errors.name = "Full Name cannot contain special characters.";
        isValid = false;
      }
    }

    if (!data.email) {
      errors.email = "Email required.";
      isValid = false;
    } else {
      if (!isValidEmail(data.email)) {
        errors.email = "Invalid email format.";
        isValid = false;
      } else {
        const res = await isActiveEmail(data.email);
        if (res.success && !res.valid) {
          errors.email = "Your Email Address is invalid.";
          isValid = false;
        }
      }
    }

    if (!data.password) {
      errors.password = "Password required.";
      isValid = false;
    } else {
      const passerr = isValidPassword(data.password);
      if (passerr.length > 0 || data.password.length < 8) {
        errors.password =
          "Password must be at least 8 characters long and must contain at least " +
          passerr.join(", ");
        isValid = false;
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

  const isActiveEmail = async (email) => {
    const url = `https://ipqualityscore-ipq-proxy-detection-v1.p.rapidapi.com/json/email/JPvN22bzJRDtHVsameBKGVqN6w0fJhf6/${email}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "ad2b41a87cmsh35c394c0619fefcp115506jsna018fdad8030",
        "X-RapidAPI-Host":
          "ipqualityscore-ipq-proxy-detection-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Internal Server Error.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      //alert("Internal server error.");
      return;
    }
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
  const handleotp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Perform validation
    const validate = await validation2(signupData);

    if (!validate) {
      // If validation fails, stop the signup process and set loading to false
      setIsLoading(false);
      return;
    }
    const response = await fetch("http://localhost:8000/api/crosscheckemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signupData.email,
        verificationToken: signupData.otp,
      }),
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      toast.success("OTP has been verified.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      const responsecreate = await fetch(
        "http://localhost:8000/api/createuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        }
      );

      const createdata = await responsecreate.json();
      if (responsecreate.ok) {
        setIsLoading(false);
        toast.success("You have successfully created account.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            setSignupData({
              email: "",
              password: "",
              name: "",
              otp: "",
            });
            seterr({
              name: "",
              email: "",
              password: "",
              otp: "",
            });
            setshowotp(false);
            navigate("/login");
          },
        });
      }
    }
    if (!data.success) {
      setIsLoading(false);
      seterr({ name: "", email: "", password: "", otp: `${data.message}` });
    }
  };
  const validation2 = async (data) => {
    let isValid = true;
    const errors = { email: "", password: "", name: "", otp: "" };

    if (!data.otp) {
      errors.otp = "OTP required.";
      isValid = false;
    }

    seterr(errors);
    return isValid;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: name === "otp" ? value.slice(0, 6) : value,
    }));
  };
  return (
    <div className="signup-container">
      {isLoading ? <Loader /> : ""}
      <img src={bg} alt="bg" className="overlay-bg" />
      <div className="signup-form-cover">
        <div className="arrow">
          <img src={arrow} alt="arrow" />
        </div>
        <div className="signup-form-container">
          <h1>
            Empowering Your Trades: Where <br /> Opportunities Meet Expertise
          </h1>
          <h2>Signup</h2>
          <form onSubmit={showotp ? handleotp : handleSignupSubmit}>
            <div className={showotp ? "name" : "name show"}>
              <input
                type="text"
                name="name"
                id="name"
                className={`${err.name ? "err" : ""}`}
                placeholder="Full Name"
                value={signupData.name}
                onChange={handleInputChange}
              />
              <span>{err.name}</span>
            </div>
            <div className={showotp ? "email" : "email show"}>
              <input
                type="text"
                name="email"
                id="email"
                className={`${err.email ? "err" : ""}`}
                placeholder="Email Address"
                value={signupData.email}
                onChange={handleInputChange}
              />
              <span>{err.email}</span>
            </div>
            <div className={showotp ? "password" : "password show"}>
              <input
                type="password"
                name="password"
                id="password"
                className={`${err.password ? "err" : ""}`}
                placeholder="Password"
                value={signupData.password}
                onChange={handleInputChange}
              />
              <span>{err.password}</span>
            </div>
            <div className={`${showotp ? "otp show" : "otp"}`}>
              <input
                type="number"
                name="otp"
                id="otp"
                className={`${err.otp ? "err" : ""}`}
                placeholder="OTP"
                value={signupData.otp}
                onChange={handleInputChange}
              />
              <span>{err.otp}</span>
            </div>
            <div
              className={`${
                showotp ? "check-link-container" : "check-link-container show"
              }`}
            >
              <div className="checkbox">
                <input
                  type="checkbox"
                  name="checkbox"
                  id="checkbox"
                  required={!showotp}
                />
                <label htmlFor="checkbox">
                  I agree to the Terms of Services and Privacy Policy
                </label>
              </div>
            </div>
            <div className="submit">
              <button type="submit">
                {!showotp ? "Create an Account" : "Verify OTP"}
              </button>
            </div>
          </form>
          <div className="login-link-container">
            <span>
              Already a member?
              <Link to="/login" className="sign-link">
                Log in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
