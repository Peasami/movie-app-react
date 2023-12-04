import { useParams } from "react-router-dom";
import { jwtToken, userInfo } from "./signals";
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { effect, signal } from "@preact/signals-core";

function Groups() {

  // shows loginForm only if user has jwtToken (logged in)
  return (
    <div>
      <h1>groups view</h1>
      {jwtToken.value.length === 0 ? <h1>Log in to create group</h1> : <CreateGroupForm />}
      <ShowRequestsForm />
      <YourGroupsForm />
      <ShowGroupsForm />
      <button onClick={() => console.log('userinfo: ' + JSON.stringify(userInfo.value))}>userinfo</button>
    </div>
  );

}


/*
// Shows all groups
*/
function ShowGroupsForm() {

  const [groups, setGroups] = useState([]);

  // gets groups from database
  function getGroups() {
    axios.get('http://localhost:3001/groups/getGroups')
      .then(res => setGroups(res.data))
      .catch(err => console.log(err.response.data));
  }

  // create form for a group
  function groupForm(props) {
    return (
      <div key={props.community_id} style={{ width: "300px", height: "150px", border: "solid" }}>
        <h1>{props.community_name}</h1>
        <h3>{props.community_desc}</h3>
        {jwtToken.value.length === 0 ? <h1>Log in to join group</h1> : <JoinGroupButton groupId={props.community_id}/>}
      </div>
    )
  }

  // gets groups when component is rendered
  useEffect(() => {
    getGroups();
  }, []);

  return (
    // creates a form for each group
    <div>
      {groups.map(group => groupForm(group))}
    </div>

  )
}


/*
// Creates a button to join a group
*/
function JoinGroupButton(groupId) {

  const requestBody = {
    accountId: userInfo.value.userId,
    groupId: groupId.groupId
  }

  // stores jwtToken from signals.js
  const config = {
    headers: { Authorization: 'Bearer ' + jwtToken.value }
  }
  function joinGroup() {
    console.log("hello")
    axios.post('http://localhost:3001/groups/addRequest', requestBody, config)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  }

  return (
    <div>
      <button onClick={joinGroup}>Join Group</button>
    </div>
  )
}

/*
// Creates a group if user is logged in
*/
function CreateGroupForm() {

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

  function createGroup() {
    axios.post('http://localhost:3001/groups/createGroup', bodyParameters, config)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  }

  // assign to button for testing
  function print() {
    console.log(adminId);
  }

  return (
    <div>
      <input value={groupName} onChange={e => setGroupName(e.target.value)} />
      <input value={groupDesc} onChange={e => setGroupDesc(e.target.value)} />
      <button onClick={createGroup}>Create Group</button>
    </div>
  )
}



/*
// Show group requests for admin
*/
function ShowRequestsForm(){

  const [requests, setRequests] = useState([""]);

  function GetRequests(){
    if (userInfo.value === null) {
      console.log("userInfo is null")
      return;
    }

    const config = {
      headers: { Authorization: 'Bearer ' + jwtToken.value }
    }

    if(typeof userInfo.value.userId !== "undefined"){
      axios.get('http://localhost:3001/groups/getRequests/' + JSON.stringify(userInfo.value.userId), config)
        .then(res => {
          setRequests(res.data)
        })
        .catch(err => console.log(err.response));
    }else{
      console.log("userInfo has no value")
      setTimeout(GetRequests, 250);
    }
  }

  useEffect(() => {
    GetRequests();
  }, []);

  return(
    <div style={{border: "solid"}}>
      <h1>Requests</h1>
      {requests.map(request => <h1>{request.username + "  " + request.community_name}</h1>)}
    </div>
  )

}


function YourGroupsForm(){

  const [groups, setGroups] = useState([""]);

  function GetGroups(){
    if (userInfo.value === null) {
      console.log("userInfo is null")
      return;
    }

    const config = {
      headers: { Authorization: 'Bearer ' + jwtToken.value }
    }

    if(typeof userInfo.value.userId !== "undefined"){
      axios.get('http://localhost:3001/groups/getYourGroups/' + JSON.stringify(userInfo.value.userId))
        .then(res => {
          setGroups(res.data)
        })
        .catch(err => console.log(err.response));
    }else{
      console.log("userInfo has no values")
      setTimeout(GetGroups, 250);
    }
  }

  useEffect(() => {
    GetGroups();
  }, []);

  return(
    <div style={{border: "solid"}}>
      <h1>Your Groups</h1>
      {groups.map(group => <h1>{group.community_name}</h1>)}
    </div>
  )
}



export default Groups;