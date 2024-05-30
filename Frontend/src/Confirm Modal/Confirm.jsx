import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./confirm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { datacontext } from "../Datacontext";

export default function Confirm({ setisLoading }) {
  const { setconfirmshow, confirmshow } = useContext(datacontext);

  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      setconfirmshow(false);
      setisLoading(true);
      const response = await fetch("http://localhost:8000/api/logoutuser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setisLoading(false);
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
            navigate(0);
          },
        });
        //alert(data.message);
        //navigate(0);
      } else {
        setisLoading(false);
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
    } catch (error) {
      setisLoading(false);
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
      //alert("internal error");
    }
  };
  console.log(confirmshow);
  return (
    <div className={`confirm-layer ${confirmshow ? "show" : ""}`}>
      <div className="confirm-box">
        <p>Are you sure you want to logout from your account?</p>
        <div className="confirm-btns">
          <button onClick={() => setconfirmshow(false)}>Cancel</button>
          <button onClick={handleLogOut}>Logout</button>
        </div>
      </div>
    </div>
  );
}
