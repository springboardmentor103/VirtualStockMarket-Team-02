import React, { useState, useEffect, useContext } from "react";
import "./resetPass.css";
import bg from "../Images/bg.png";
import arrow from "../Images/arrow.png";
import { useNavigate } from "react-router-dom";
import PassSuccess from "../PassSuccess/PassSuccess";
import Loader from "../Loader/Loader";
import { datacontext } from "../Datacontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ForgetPassword() {
  const { tokenState, setTokenState } = useContext(datacontext);

  const navigate = useNavigate();

  useEffect(() => {
    if (tokenState.authtoken) {
      navigate("/TrendingStocks");
    } else if (tokenState.otptoken) {
      navigate("/forgetPassword");
    }
  }, [tokenState, navigate]);
  const [resetData, setResetData] = useState({
    password: "",
    confirmpassword: "",
  });
  const [err, seterr] = useState({
    password: "",
    confirmpassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const validate = await validation(resetData);
      if (!validate) {
        setIsLoading(false);
        return;
      }
      const response = await fetch("http://localhost:8000/api/newpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (response.ok && data.success) {
        setIsLoading(false);
        toast.success(
          "You have successfully created new password, now proceed to login.",
          {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            onClose: () => {
              seterr({
                password: "",
                confirmpassword: "",
              });
              setTokenState({
                authtoken: false,
                otptoken: false,
                otpmatchtoken: false,
              });
            },
          }
        );
        /*alert(
          "You have successfully created new password, now proceed to login."
        );
        seterr({
          password: "",
          confirmpassword: "",
        });
        setTokenState({
          authtoken: false,
          otptoken: false,
          otpmatchtoken: false,
        });*/
      } else {
        //console.log(typeof data.message);
        if (typeof data.message === "object") {
          setIsLoading(false);
          seterr({
            password: data.message[0].password,
            confirmpassword: "",
          });
        }
        if (typeof data.message === "string") {
          setIsLoading(false);
          toast.error(`${data.message}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          //alert(data.message);
        }
      }
    } catch (error) {
      //console.log(error);
      setIsLoading(false);
      toast.error(`Internal Server Error`, {
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
    }
  };

  const validation = async (data) => {
    let isValid = true;
    const errors = { password: "", confirmpassword: "" };
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
    if (!data.confirmpassword) {
      errors.confirmpassword = "Confirm Password required.";
      isValid = false;
    } else {
      if (isValidPassword(data.confirmpassword).length === 0) {
        if (data.confirmpassword.length < 8) {
          errors.confirmpassword = "Confirm Password must be min 8 characters";
          isValid = false;
        }
      }
      if (isValidPassword(data.confirmpassword).length > 0) {
        if (data.confirmpassword.length < 8) {
          errors.confirmpassword = "Confirm Password must be min 8 characters";
          const passerr = isValidPassword(data.confirmpassword);
          errors.confirmpassword =
            errors.confirmpassword +
            " and must contain atleast " +
            passerr.join(" ");
          isValid = false;
        } else {
          const passerr = isValidPassword(data.confirmpassword);

          errors.confirmpassword =
            "Confirm Password must atleast contain " + passerr.join(" ");
          isValid = false;
        }
      }
    }
    if (data.password !== data.confirmpassword) {
      errors.password = "Password and Confirm Password should be same";
      //errors.confirmpassword = "Password and Confirm Password should be same";
      isValid = false;
    }
    seterr(errors);
    return isValid;
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
    setResetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  if (!tokenState.otpmatchtoken) {
    return <PassSuccess />;
  } else {
    return (
      <div className="reset-container">
        {isLoading ? <Loader /> : ""}
        <img src={bg} alt="bg" className="overlay-bg" />
        <div className="reset-form-cover">
          <div className="arrow">
            <img src={arrow} alt="arrow" />
          </div>
          <div className="reset-form-container">
            <h1>
              Empowering Your Trades: Where <br /> Opportunities Meet Expertise
            </h1>
            <h2>RESET YOUR PASSWORD?</h2>
            <p>ENTER NEW PASSWORD</p>
            <form onSubmit={handleResetPassword}>
              <div className="password">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className={`${err.password ? "err" : ""}`}
                  placeholder="Enter New Password"
                  value={resetData.password}
                  onChange={handleInputChange}
                />
                <span>{err.password}</span>
              </div>
              <div className="confirmpassword">
                <input
                  type="password"
                  name="confirmpassword"
                  id="confirmpassword"
                  className={`${err.confirmpassword ? "err" : ""}`}
                  placeholder="Confirm Password"
                  value={resetData.confirmpassword}
                  onChange={handleInputChange}
                />
                <span>{err.confirmpassword}</span>
              </div>
              <div className="submit">
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgetPassword;
