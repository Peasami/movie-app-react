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

// Fields for username and password
// Handles getting and storing jwtToken
function LoginForm() {

  const [username, setUsername] = useState("");
  const [pw, setPassword] = useState("");

  function login() {
    axios.postForm('http://localhost:3001/account/login', { username, pw })
      .then(res => jwtToken.value = res.data.jwtToken)
      .catch(err => console.log(err.response.data));
  }

  return (
    <div>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input value={pw} onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      <button onClick={() => jwtToken.value = ''}>Logout</button>
      <button onClick={() => console.log('jwtToken: ' + jwtToken.value + '\nuserInfo: ' + JSON.stringify(userInfo.value))}>logindata</button>
    </div>
  )
}

export default Login;