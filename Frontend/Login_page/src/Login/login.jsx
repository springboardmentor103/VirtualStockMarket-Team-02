import React from 'react';
import bg from 'C:/Users/SHREYA DHADSE/Desktop/Lakshitaa/sample/src/Login/login_page.jpg';
import '../Login/login.css';

function login() {
    console.log(bg);
    return (
        <div className="login-container">
            <img src={bg} alt='bg' />
            <div className="overlay-contant">
                <h1>Empowering Your Trades: Where <br /> Opportunities Meet Expertise</h1>
                <p>Login</p>
                <div className="form-container">
                    <form>
                        <label>
                            E-mail
                        </label>
                        <input className="text" type="email" placeholder=' Enter Email' name='email' required />
                        <label>
                            Password
                        </label>
                        <input className="text" type="password" placeholder=' Enter password' name='password' required />

                       <div class ="for-pass">

                       <div class = "keepmein">
                                <input type="checkbox" name="keepLoggedIn" />  
                                <label for = "keepin"> 
                                <span id = "keepme">Keep me logged in </span> </label>
                            </div>

                            <div class = "forgetpassword">
                                <a href="#" className="forgot-password">Forgot password?</a>
                            </div> 
                            </div> 
                        
                    <button class="btn">Login</button>

                    <div class = "donthaveacc">
                            <div>
                                <label for = "donthaveacc"> 
                                <span id = "account">Dont have an account?  </span> </label>
                            </div>

                            <div class ="divsign">
                                <a href="#" class="signup">Signup</a>
                            </div>

                    </div>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default login;
