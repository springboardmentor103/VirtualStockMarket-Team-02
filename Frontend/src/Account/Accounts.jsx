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
import Loader from "../Loader/Loader";
export default function Account() {
  const navigate = useNavigate();

  const { tokenState, setactivecolor, setselectedcrypto } =
    useContext(datacontext);
  const [changeData, setchangeData] = useState({
    name: "",
    email: "",
    otp: "",
    color: "",
  });
  const [err, seterr] = useState({ name: "", email: "", otp: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showotpscreen, setshowotpscreen] = useState(false);
  const fillbg = localStorage.getItem("color");

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
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setIsLoading(false);
          setchangeData({
            name: data.user.name,
            email: data.user.email,
            otp: "",
            color: data.user.color,
          });
        }
      } catch (error) {
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
      }
    };

    fetchUserDetails();
  }, []);
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
      const response = await fetch("http://localhost:8000/api/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        if (
          data.user.email === changeData.email &&
          data.user.name === changeData.name
        ) {
          setIsLoading(false);
          toast.error("Full Name and Email already exist.", {
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
        if (data.user.email !== changeData.email) {
          const responsesendtoken = await fetch(
            "http://localhost:8000/api/sendverificationemail",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: data.user.email }),
              credentials: "include",
            }
          );
          const datatoken = await responsesendtoken.json();
          console.log(datatoken);
          if (responsesendtoken.ok) {
            setIsLoading(false);
            setshowotpscreen(true);
            toast.success(
              `Your OTP has been successfully sent to email ${data.user.email}`,
              {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              }
            );
          }
        }
        if (data.user.name !== changeData.name) {
          const updateuser = await fetch(
            "http://localhost:8000/api/updateuser",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: changeData.name,
              }),
              credentials: "include",
            }
          );
          const updateinfo = await updateuser.json();
          console.log(updateinfo);
          if (updateuser.ok) {
            setIsLoading(false);
            toast.success(`Your Details have been successfully updated.`, {
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
        }
      }
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
    }
  };
  const handleotpverify = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (!changeData.otp) {
        setIsLoading(false);
        seterr({ name: "", email: "", otp: "OTP is Required" });
        return;
      }
      const response = await fetch("http://localhost:8000/api/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        const verifytoken = await fetch(
          "http://localhost:8000/api/verifyemail",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: data.user.email,
              verificationToken: changeData.otp,
            }),
            credentials: "include",
          }
        );
        const verify = await verifytoken.json();
        console.log(verify);
        if (verifytoken.ok) {
          setIsLoading(false);
          seterr({ name: "", email: "", otp: "" });
          toast.success(`Your OTP has been successfully verified`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

          const updateuser = await fetch(
            "http://localhost:8000/api/updateuser",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: changeData.name,
                email: changeData.email,
              }),
              credentials: "include",
            }
          );
          const userinfo = await updateuser.json();
          console.log(userinfo);
          if (updateuser.ok) {
            setIsLoading(false);
            toast.success(`Your Details have been successfully updated.`, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              onClose: () => {
                setshowotpscreen(false);
              },
            });
          }
        }
        if (!verify.success) {
          setIsLoading(false);
          toast.error(`${verify.message}`, {
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
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(`Internal server error`, {
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
      [name]: name === "otp" ? value.slice(0, 6) : value,
    }));
  };
  return (
    <div className="account-container">
      {isLoading ? <Loader /> : ""}
      <img src={bg} alt="bg" className="account-bg" />
      <Sidebars />
      <div className="account-right-cover">
        <div className="account-right-container">
          <div className="title-container">
            {/*<img src={logo11} alt="logo11" />*/}
            <p>Account</p>
          </div>
          <div className="profile-info-container">
            <div
              className="profile-pic"
              style={{ backgroundColor: changeData.color }}
            >
              <p>{changeData.name.charAt(0).toLocaleUpperCase()}</p>
            </div>
            <form
              onSubmit={showotpscreen ? handleotpverify : handleChange}
              className="fields-cover"
            >
              <div
                className={`field-container name-field ${
                  showotpscreen ? "show" : ""
                }`}
              >
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
              <div
                className={`field-container email-field ${
                  showotpscreen ? "show" : ""
                }`}
              >
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
              <div
                className={`field-container otp-field ${
                  showotpscreen ? "show" : ""
                }`}
              >
                <span>OTP</span>
                <div className="field">
                  <input
                    type="number"
                    placeholder="Enter OTP"
                    name="otp"
                    value={changeData.otp}
                    onChange={handleInputChange}
                  />
                  <p>{err.otp}</p>
                </div>
              </div>
              <button type="submit">{showotpscreen ? "Verify" : "Save"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
