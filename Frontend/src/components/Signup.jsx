import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Signup.css"
const Signup = () => {
    const[name,setname]=useState("");
      const [password, setPassword] = useState("");
      const [passwordStrength, setPasswordStrength] = useState('');

    const navigate=useNavigate();
      const [result, setResult] = useState('');
    const[confirmPassword,setConfirmPassword]=useState("");
    const [error, setError] = useState("");
const evaluatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 1) setPasswordStrength("❌ Poor");
  else if (strength === 2) setPasswordStrength("⚠️ Moderate");
  else if (strength >= 3) setPasswordStrength("✅ Strong");
};
      const handlepassword = (e) => {
        const value = e.target.value;
        setPassword(value);
       evaluatePasswordStrength(value);

      };
      const getColor = (strength) => {
  if (strength.includes("Strong")) return "green";
  if (strength.includes("Moderate")) return "orange";
  return "red";
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
  <input
    type="text"
    value={name}
    onChange={(e) => setname(e.target.value)}
    placeholder="Name"
  />
  <input
    type="email"
    value={email || ''}
    placeholder="Email"
    onChange={(e) => setemail(e.target.value)}
  />
  <input
    type="password"
    value={password || ''}
    placeholder="Password"
    onChange={handlepassword}
    minLength={8}
  />

  {/* Password Strength Indicator */}
  {passwordStrength && password &&(
  <small style={{ color: getColor(passwordStrength), display: 'block', marginTop: '4px' }}>
    Strength: {passwordStrength}
  </small>
)}

  <input
    type="password"
    value={confirmPassword || ''}
    placeholder="Confirm Password"
    onChange={(e) => setConfirmPassword(e.target.value)}
    minLength={8}
  />

  <button onClick={handlesubmit}>Sign Up</button>
  <h2>{result.message}</h2>
  {result.suggestions && result.suggestions.map((element, index) => (
    <h2 key={index}>{element}</h2>
  ))}
  {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

  <p className="redirect-text">
    Already registered? <span className="link-text" onClick={() => navigate("/")}>Login</span>
  </p>
</div>

  )
};

export default Signup