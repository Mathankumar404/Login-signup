import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Signup.css"
const Signup = () => {
    const[name,setname]=useState("");
      const [password, setPassword] = useState("");
    const navigate=useNavigate();
      const [result, setResult] = useState('');
    const[confirmPassword,setConfirmPassword]=useState("");
    const [error, setError] = useState("");

      const handlepassword = (e) => {
        setPassword(e.target.value);
      };
    const[email,setemail]=useState(null);
      const handlesubmit = async () => {
         if (!email || !password || !email.includes('@gmail.com')) {
  setResult({ message: 'Please enter a valid email and password.' });
  return;
}
if (password!==confirmPassword){
    setError( "⚠️ Passwords do not match" );
  return
}
        const response = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: email, Password: password,name:name })
        });
        const data = await response.json();
        setResult(data || JSON.stringify(data));
      };
    
  return (
     <div className="signup-container">
    <input type="text" value={name} onChange={(e) => setname(e.target.value)} placeholder="Name" />
    <input type="email" value={email || ''} placeholder="Email" onChange={(e) => setemail(e.target.value)} />
    <input type="password" value={password || ''} placeholder="Password" onChange={handlepassword} minLength={8} />
   <input type="password" value={confirmPassword || ''} placeholder="Confirm Password" onChange={(e)=>{setConfirmPassword(e.target.value)}} minLength={8} />

    <button onClick={handlesubmit}>Sign Up</button>
    <h2>{result.message}</h2>
    {result.suggestions && result.suggestions.map((element, index) => (
      <h2 key={index}>{element}</h2>
    ))}
    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

<p className="redirect-text">
  Already registered? <span className="link-text" onClick={() => navigate("/")}>Login</span>
</p>  </div>
  )
}

export default Signup