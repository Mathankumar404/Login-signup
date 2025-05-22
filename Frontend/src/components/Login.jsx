import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Login.css"
const Login = () => {
    const[email,setemail]=useState(null);
    const[password,setPassword]=useState(null);
    const navigate=useNavigate();
      const [result, setResult] = useState('');

    const handlesubmit = async () => {
      if (!email || !password || !email.includes('@gmail.com')) {
  setResult({ message: 'Please enter a valid email and password.' });
  return;
}
        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: email, Password: password,})
        });
        const data = await response.json();
        setResult(data || JSON.stringify(data));
      };
    
  return (
    <div className="login-container">
    <input type="email" value={email || ''} placeholder='Email' onChange={(e)=>setemail(e.target.value)} />
    <input type="password" value={password || ''} placeholder='Password' onChange={(e)=>setPassword(e.target.value)} minLength={8} required />
    <button onClick={handlesubmit}>Login</button>
    <h2>{result.message}</h2>
<p className="redirect-text">
  Don’t have an account? <span className="link-text" onClick={() => navigate("/signup")}>Sign up</span>
</p>
  </div>
  )
}

export default Login