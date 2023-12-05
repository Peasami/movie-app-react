// Stores jwtToken and userInfo in sessionStorage
import { effect, signal } from '@preact/signals-react'
import axios from 'axios';

// initializes token with value if there is one in sessionStorage
const jwtToken = signal(getSessionToken());

const userInfo = signal(getSessionUserInfo());

// returns jwtToken stored in sessionStorage
function getSessionToken() {
  const t = sessionStorage.getItem('jwtToken');

  // if token is null, returns empty and not null value
  return t===null || t==='null' ? '' : t;
}

function getSessionUserInfo() {
    const t = sessionStorage.getItem('userInfo');
  
    // if token is null, returns empty and not null value
    return t===null || t==='null' ? '' : t;
  }

// updates every time jwtToken changes
effect(() => {
    // store token in sessionStorage
    sessionStorage.setItem('jwtToken', jwtToken);
    sessionStorage.setItem('userInfo', userInfo);

    // store new bearer token
    const config = {
        headers: {
            Authorization: 'Bearer ' + jwtToken.value
        }
    };

    // Update userInfo
    if(jwtToken.value.length !== 0){
        axios.get('http://localhost:3001/account/getUserInfo', config)
            .then(res => {
                userInfo.value = res.data;
            })
            .catch(err => console.log(err.message))
    }else{
        userInfo.value = null;
    }

});

export { jwtToken, userInfo };