import React, { useState } from 'react';
import './resetPass.css';
import bg from '../Images/login_page.png';
import { Link } from 'react-router-dom'; 
import axios from 'axios';

function ResetPass() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            if (!newPassword || !confirmPassword) {
                setError("Please enter both new and confirm passwords.");
                return;
            }

            if (newPassword !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            const response = await axios.post('http://localhost:8000/api/newpassword', { newPassword });
            
            // Redirect to PassSuccess component
            return <Link to="/PassSuccess">Go to Password Success</Link>;
        } catch (error) {
            setError("Something went wrong. Please try again later.");
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <img src={bg} alt='bg' />
            <div className="overlay-contant">
                <h1>Empowering Your Trades: Where <br /> Opportunities Meet Expertise</h1>
                <p>Reset Your Password?</p>
                <p id='small'>Enter new Password</p>
                <div className="form-container">
                    <form onSubmit={handleResetPassword}>
                        <label>New Password</label>
                        <div>
                            <input type="password" placeholder='Enter New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <label>Confirm Password</label>
                        <div>
                            <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <div>
                            <button type="submit" className="btn">Save</button>
                        </div>
                    </form>
                </div>
                <div className="donthaveacc">
                    <div>
                        <span id="account">Don't have an account?</span>
                        <Link to="/signup" className="signup">Signup</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPass;
