import React, { useEffect, useState, useContext } from "react";
import bg from "../Images/bg.png";
import Sidebars from "../sidebar/Sidebars";
import "./LeaderBoard.css";
import { datacontext } from "../Datacontext";
import Loader from "../Loader/Loader";

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tokenState } = useContext(datacontext);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/leaderboard", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response data:", data);

        if (data && Array.isArray(data.topUsers)) {
          setUsers(data.topUsers);
        } else {
          throw new Error("API response format is incorrect");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [tokenState]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="leader-board">
      <img src={bg} alt="Background" className="account-bg" />
      <Sidebars />
      <main className="account-right-cover">
        <div className="account-right-container">
          <div className="title-container">
            <p>LeaderBoard</p>
          </div>
          <div className="profile-info-container">
            {users.map((user, index) => (
              <div key={index} className="user-row">
                <div className="user-info">
                  <div className="badge-parent">
                    <div className={`badge badge-${index + 1}`}>{index + 1}</div>
                    <div className="initial">{user.userName.charAt(0)}</div>
                  </div>
                  <div className="user-details">
                    <div className="user-icon">{user.userName.charAt(0)}</div>
                    <div className="user-text">
                      <h3 className="user-name">{user.userName}</h3>
                      <div className="user-score">{user.totalProfit}</div>
                      <div className="user-username">{user.userEmail}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderBoard;
