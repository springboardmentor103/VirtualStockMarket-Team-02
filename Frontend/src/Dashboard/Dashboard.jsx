// Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user from local storage or any other state management you are using
    
    // Redirect to login page
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <button onClick={handleLogout}>Logout</button>
      {/* Additional dashboard content goes here */}
    </div>
  );
}

export default Dashboard;
