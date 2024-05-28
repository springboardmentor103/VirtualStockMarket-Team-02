import React, { useContext, useState } from "react";
import "./confirm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { datacontext } from "../Datacontext";

export default function Confirm({ setisLoading }) {
  const { setconfirmshow, confirmshow } = useContext(datacontext);
  console.log(confirmshow);
  return (
    <div className={`confirm-layer ${confirmshow ? "show" : ""}`}>
      <div className="confirm-box">
        <p>Are you sure you want to logout from your account?</p>
        <div className="confirm-btns">
          <button>Cancel</button>
          <button onClick={handleLogOut}>Logout</button>
        </div>
      </div>
    </div>
  );
}
