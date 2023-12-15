import { useState } from "react";
import axios from "axios";
import { jwtToken, userInfo } from "./signals"
import '../stylesheets/login-register.css'
import { Link } from "react-router-dom";


function Login() {
  return (
    <div>
      <LoginForm />
      {jwtToken.value.length === 0 ? '' : <p>Successfully logged in as {userInfo.value ? userInfo.value.username : ""}</p>}
		</div>
  );
}
export const handleLogout = () => {
  if (userInfo && userInfo.value) {
    
    window.location.href = 'https://movie-app-h3st.onrender.com/';
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
    axios.postForm('https://movie-app-h3st.onrender.com/account/login', { username, pw })
      .then(res => jwtToken.value = res.data.jwtToken)
      .catch(err => console.log(err.response.data));
  }

  return (
    <div id='auth-form'>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username"/>
			<div id='pw'>
				<input 
      	  type={showPassword ? "text" : "password"}
      	  placeholder="Password"
      	  value={pw}
      	  onChange={(e) => setPassword(e.target.value)}
      	/>
				<button onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? "Hide" : "Show"}
      	</button>
			</div>


      <button onClick={login}>Login</button>
			{/* 
      <button onClick={() => jwtToken.value = ''}>Logout</button>
			<button onClick={() => console.log('jwtToken: ' + jwtToken.value + '\nuserInfo: ' + JSON.stringify(userInfo.value))}>logindata</button>
			*/}
			<Link to="/register" id="register-link">No account? Register here.</Link>
			</div>
  )
}

export default Login;