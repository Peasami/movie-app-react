import { useState } from "react";
import axios from "axios";
import { jwtToken, userInfo } from "./signals"



function Login() {
  return (
    <div>
      <LoginForm />
      {jwtToken.value.length === 0 ? <h1>Log in</h1> : <h1>Logged in as {userInfo.value ? JSON.stringify(userInfo.value.username) : ""}</h1>}
    </div>
  );
}
export const handleLogout = () => {
  if (userInfo && userInfo.value) {
    
    window.location.href = 'http://localhost:3000/';
    jwtToken.value = "" 
  } else {
    
    console.error("User information is not available during logout");
  }
};

// Fields for username and password
function LoginForm() {

  const [username, setUsername] = useState("");
  const [pw, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  

  function login() {
    axios.postForm('http://localhost:3001/account/login', { username, pw })
      .then(res => jwtToken.value = res.data.jwtToken)
      .catch(err => console.log(err.response.data));
  }
  const ReDirectToRegister = () => {
    
    window.location.href = 'http://localhost:3000/register';
  };

  return (
    <div>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username"/>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={pw}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? "Hide" : "Show"} Password
      </button>
      <button onClick={login}>Login</button>
      <button onClick={() => jwtToken.value = ''}>Logout</button>
      <button onClick={() => console.log('jwtToken: ' + jwtToken.value + '\nuserInfo: ' + JSON.stringify(userInfo.value))}>logindata</button>
      <button onClick={ReDirectToRegister}>Register</button>
    </div>
  )
}

export default Login;