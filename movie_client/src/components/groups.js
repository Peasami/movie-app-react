import { useParams } from "react-router-dom";

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
    
}

export default Groups;