import React, { useState } from "react";
import axios from "axios";
import { jwtToken } from "./signals";
import '../stylesheets/login-register.css'
function Register({}) {
  const [username, setUsername] = useState("");
  const [pw, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function register() {
    axios.post('http://localhost:3001/account/register', { username, pw })
      .then(res => {
        console.log("käyttäjän luonti onnistui");
        setSuccessMessage("Registration successful! You can now log in.");
        setErrorMessage("");
      })
      .catch(err => {
        if (err.response && err.response.status === 403) {
          setErrorMessage("Username is already in use. Please choose a different username.");
        } else {
          console.error(err.response.data);
        }
      });
  }

  return (
    <div id='auth-form'>
      <h1>Sign up</h1>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <div id='pw'>
				<input
      	  type={showPassword ? "text" : "password"}
      	  value={pw}
      	  onChange={e => setPassword(e.target.value)}
      	  placeholder="Password"
      	/>
      	<button onClick={() => setShowPassword(!showPassword)}>
      	  {showPassword ? "Hide" : "Show"}
      	</button>
			</div>
      <button onClick={register}>Register</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
}

export default Register;
