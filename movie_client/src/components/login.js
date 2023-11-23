import { useState } from "react";
import axios from "axios";
import { jwtToken } from "./signals"

function Login() {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }

  // Fields for username and password
  // Handles getting and storing jwtToken
  function LoginForm() {

    const [username, setUsername] = useState("");
    const [pw, setPassword] = useState("");

    function login() {
      axios.postForm('http://localhost:3001/account/login', {username, pw})
        .then(res => jwtToken.value = res.data.jwtToken)
        .catch(err => console.log(err.response.data));
    }

    return (
      <div>
        <input value={username} onChange={e => setUsername(e.target.value)}/>
        <input value={pw} onChange={e => setPassword(e.target.value)}/>
        <button onClick={login}>Login</button>
        <button onClick={() => jwtToken.value = ''}>Logout</button>
        <button onClick={() => console.log(jwtToken.value)}>value</button>
      </div>
    )
  }
  
  export default Login;