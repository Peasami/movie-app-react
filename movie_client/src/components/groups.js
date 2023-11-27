import { useParams } from "react-router-dom";
import { jwtToken, userInfo } from "./signals";
import axios from "axios";
import { useState } from "react";

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

  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");

  // stores jwtToken from signals.js
  const config = {
    headers: { Authorization: 'Bearer ' + jwtToken.value }
  }

  const adminId = JSON.stringify(userInfo.value.userId);

  const bodyParameters = {
    adminId: adminId,
    groupDesc: groupDesc,
    groupName: groupName
  }

  function createGroup(){
    axios.post('http://localhost:3001/groups/createGroup', bodyParameters, config)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  }

  // button for testing
  function print(){
    console.log(adminId);
  }
  
  return (
    <div>
      <input value={groupName} onChange={e => setGroupName(e.target.value)}/>
      <input value={groupDesc} onChange={e => setGroupDesc(e.target.value)}/>
      <button onClick={createGroup}>Create Group</button>
    </div>
  )
}

export default Groups;