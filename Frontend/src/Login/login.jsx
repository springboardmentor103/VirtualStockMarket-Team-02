import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Login/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for programmatically navigation

  const handleSubmit = (event) => {
    event.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    fetch("http://localhost:8000/api/loginuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      //   .then((response) => response.json())

      .then((response) => {
        console.log("Full HTTP Response:", response.headers.getSetCookie());
        return response.json();
      })
      .then((data) => {
        // console.log("Login response:", data);
        if (data.success) {
          //   console.log(data, "111111111");
          // alert('Login successful!');
          navigate("/dashboard"); // Navigate to the dashboard after successful login
        } else {
          alert(
            "Login failed: " +
              (data.message.password || "Please check your credentials")
          );
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Login failed: Network error");
      });
  };

  return (
    <div className="login-container">
      <div className="content-wrapper">
        <div className="login-header">
          <div>Empowering Your Trades: Where Opportunities Meet Expertise</div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="placeholder-heading">Email</div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="placeholder-heading">Password</div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-footer">
            <label>{/* <input type="checkbox" /> Keep me logged in */}</label>
            <Link to="/forgotPassword">Forgot password?</Link>
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
