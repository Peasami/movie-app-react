import { useParams } from "react-router-dom";
import { jwtToken } from "./signals";
import axios from "axios";

function Groups() {


  return (
    <div>
      <h1>groups view</h1>
      <CreateGroupForm />
    </div>
  );
}

function CreateGroupForm(){
  // create group only if user is logged in using jwtToken

  const config = {
    headers: { Authorization: 'Bearer ' + jwtToken.value }
  }

  const bodyParameters = {
    groupId: "1234",
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