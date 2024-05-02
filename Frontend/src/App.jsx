import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Login/login";
import Forgot_Password from './forgetPassword/forgetPassword';
import GetOtp from './getotp/getotp';
import Reset from './resetPass/resetPass';
import Success from './PassSuccess/PassSuccess'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/forgetPassword' element={<Forgot_Password/>}></Route>
        <Route path='/getotp' element={<GetOtp/>}></Route>
        <Route path='/resetPass' element={<Reset/>}></Route>
        <Route path='/PassSuccess' element={<Success/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
