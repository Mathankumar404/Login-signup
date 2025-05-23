import './App.css';
import {  Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
function App() {
  return (
     <> 
  <Routes>
<Route path="/" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/forgotpassword" element={<ForgotPassword />} />

</Routes>
       </>
      
  );
}

export default App;
