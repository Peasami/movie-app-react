import { useParams } from "react-router-dom";
import { jwtToken, userInfo } from "./signals";
import axios from "axios";

function Groups() {


  return (
    <div>
      <h1>groups view</h1>
      <CreateGroupForm />
    </div>
  );
}

// Creates a group if user is logged in
function CreateGroupForm(){

  // stores jwtToken from signals.js
  const config = {
    headers: { Authorization: 'Bearer ' + jwtToken.value }
  }

  const bodyParameters = {
    adminId: JSON.stringify(userInfo.value.userId),
    groupId: "4321",
    groupName: "TestGroup"
  }

  function createGroup(){
    axios.post('http://localhost:3001/groups/createGroup', bodyParameters, config)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  }
  
  return (
    <div>
      <button onClick={createGroup}>Create Group</button>
    </div>
  )
}

export default Groups;