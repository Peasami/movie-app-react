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

    // console.log('effect1')
    // store token in sessionStorage
    sessionStorage.setItem('jwtToken', jwtToken);

    // store new bearer token
    const config = {
        headers: {
            Authorization: 'Bearer ' + jwtToken.value
        }
    };

    // Update userInfo
    if(jwtToken.value.length !== 0){
        axios.get('https://movie-app-h3st.onrender.com/account/getUserInfo', config)
            .then(res => {
                userInfo.value = res.data;
            })
            .catch(err => console.log(err.message))
    }else{
        userInfo.value = null;
    }

});

// updates every time userInfo changes
effect(() => {
    // console.log('effect2 ' + JSON.stringify(userInfo.value))
    sessionStorage.setItem('userInfo', userInfo);
});

export { jwtToken, userInfo };