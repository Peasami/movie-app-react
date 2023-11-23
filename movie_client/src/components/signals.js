// stores jwtoken
import { signal } from '@preact/signals-react'

// initializes token with value if there is one in sessionStorage
const jwtToken = signal(getSessionToken());

// returns jwtToken stored in sessionStorage
function getSessionToken() {
  const t = sessionStorage.getItem('jwtToken');

  // if token is null, returns empty and not null value
  return t===null || t==='null' ? '' : t;
}

// updates every time jwtToken changes
effect(() => {
    // store token in sessionStorage
    sessionStorage.setItem('jwtToken', jwtToken);

    // store new bearer token
    const config = {
        headers: {
            Authorization: 'Bearer ' + jwtToken.value
        }
    };

});