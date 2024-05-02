import React, { useState } from 'react';
import './getotp.css';
import bg from '../Images/login_page.png';
import { Link } from 'react-router-dom'; // Import Link
import axios from 'axios';

function GetOtp() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleVerifyOTP = async () => {
        try {
            if (!otp) {
                setError("Please enter the OTP.");
                return;
            }

            const response = await axios.post('http://localhost:8000/api/otpmatching', { otp });
            
            // Redirect to ResetPass component
            return <Link to="/resetPass">Go to Reset Password</Link>;
        } catch (error) {
            setError("Incorrect OTP. Please try again.");
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <img src={bg} alt='bg' />
            <div className="overlay-contant">
                <h1>Empowering Your Trades: Where <br /> Opportunities Meet Expertise</h1>
                <p>Forgot Your Password ?</p>
                <p>Please enter the OTP you received on email</p>
                <div className="form-container">
                    <form onSubmit={handleVerifyOTP}>
                        <label>Enter OTP</label>
                        <div>
                            <input type="text" placeholder='Enter OTP' value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <div>
                            <button type="submit" className="btn">Verify OTP</button>
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

export default GetOtp;
