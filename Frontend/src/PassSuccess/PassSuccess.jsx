
import React from 'react';
import './PassSuccess.css';
import bg from '../Images/login_page.png';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo_icon from '../Images/pngtree-green-check-mark-png-image_6525691.png'
// import '../Login/login.css';

function login() {
    console.log(bg);
    return (
        
        <div className="login-container">
            <img id='img1' src={bg} alt='bg' />
            <div className="overlay-contant">
                 
                <h1><div className="logo_icon">
                    <img id='img2' src={logo_icon} alt="" className="logo" />
                </div> <br /> Password Changed !</h1>
                
                <p id='small'>
                Your Password has been Changed Successfully.
                </p>
                <div className="form-container">
                    <form>
                    {/* <label> */}
                           
                        {/* </label>
                        <div><input className="text" type="email" placeholder=' Enter New Password' name='email' required /></div>
                        <label>
                            
                        </label>
                        <div><input className="text" type="password" placeholder=' Confirm password' name='password' required /></div> */}

                       <div className ="for-pass">

                       

                            <div className = "forgetpassword">
                                {/* <a href="#" className="forgot-password">Forgot password?</a> */}
                            </div> 
                            </div> 
                        
                    {/* <button class="btn">Request OTP</button> */}
                    {/* <button className='btn'><NavLink to="/getotp">Request OTP</NavLink></button> */}
                    
                    <div><Link to="/" className="btn">Go to Login</Link></div> 
                    {/*<div class = "donthaveacc">
                             <div>
                                <label for = "donthaveacc"> 
                                <span id = "account">Dont have an account?  </span> 
                                <a href="#" class="signup">Signup</a></label>
                            </div> */}

                            {/* <span class ="divsign">
                                <a href="#" class="signup">Signup</a>
                            </span>

                    </div> */}
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default login;
