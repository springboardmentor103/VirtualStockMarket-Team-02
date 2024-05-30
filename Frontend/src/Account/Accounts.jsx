import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../Images/bg.png";
import profile from "../Images/profile.png";
import Sidebars from "../sidebar/Sidebars";
import logo11 from "../Images/icon11.png";
import { datacontext } from "../Datacontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Account.css";
export default function Account() {
  const navigate = useNavigate();

  const { dispdata, tokenState, setactivecolor, setselectedcrypto } =
    useContext(datacontext);
  const [changeData, setchangeData] = useState({
    name: dispdata.name,
    email: dispdata.email,
    password: "*********",
  });
  const [err, seterr] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setselectedcrypto(null);
    localStorage.removeItem("symbol");
    if (tokenState.authtoken) {
      setactivecolor({
        Dashboard: "#cec4c4",
        Account: "white",
        Orderhistory: "#cec4c4",
        Portfolio: "#cec4c4",
        Leaderboard: "#cec4c4",
      });
      navigate("/Account");
    } else if (tokenState.otpmatchtoken) {
      navigate("/resetPass");
    } else if (tokenState.otptoken) {
      navigate("/forgetPassword");
    }
  }, [tokenState, navigate]);
  const validation = async (data) => {
    let isValid = true;
    const errors = { email: "", password: "", name: "" };
    if (!data.name) {
      errors.name = "Full Name required.";
      isValid = false;
    } else {
      if (data.name.length < 3) {
        errors.name = "Full Name must be atleast 3  characters.";
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
  const handleChange = async (e) => {
    console.log("clicked");
    e.preventDefault();

    try {
      setIsLoading(true);

      const validate = await validation(changeData);

      if (!validate) {
        setIsLoading(false);
        return;
      }
      const response = await fetch("http://localhost:8000/api/updateuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changeData),
      });
      const data = await response.json();
    } catch (error) {
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
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setchangeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="account-container">
      <img src={bg} alt="bg" className="account-bg" />
      <Sidebars />
      <div className="account-right-cover">
        <div className="account-right-container">
          <div className="title-container">
            {/*<img src={logo11} alt="logo11" />*/}
            <p>Account</p>
          </div>
          <div className="profile-info-container">
            <div className="profile-pic">
              <img src={profile} alt="pic" />
            </div>
            <form onSubmit={handleChange} className="fields-cover">
              <div className="field-container">
                <span>Full name</span>
                <div className="field">
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    name="name"
                    value={changeData.name}
                    onChange={handleInputChange}
                  />
                  <p>{err.name}</p>
                </div>
              </div>
              <div className="field-container">
                <span>Email</span>
                <div className="field">
                  <input
                    type="text"
                    placeholder="Enter Email"
                    name="email"
                    value={changeData.email}
                    onChange={handleInputChange}
                  />
                  <p>{err.email}</p>
                </div>
              </div>
              <div className="field-container">
                <span>Password</span>
                <div className="field">
                  <input
                    type="text"
                    name="password"
                    placeholder="Enter Password"
                    value={changeData.password}
                    onChange={handleInputChange}
                  />
                  <p>{err.password}</p>
                </div>
              </div>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
