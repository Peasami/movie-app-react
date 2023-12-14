import { Link, useParams } from "react-router-dom";
import { jwtToken, userInfo } from "./signals";
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { effect, signal } from "@preact/signals-core";
import '../stylesheets/groups.css'
function Groups() {

  // shows loginForm only if user has jwtToken (logged in)
  return (
    <div>
      <a id="home-page-link" href="/groups">Groups:</a>
      {jwtToken.value.length === 0 ?<h1></h1> : <CreateGroupForm />}
      {jwtToken.value.length === 0 ?<h1></h1> : <ShowRequestsForm />}
      {jwtToken.value.length === 0 ?<h1></h1> : <YourGroupsForm />}
      <ShowGroupsForm />   
		</div>
  );

}
/*
// Shows all groups
*/
function ShowGroupsForm() {

  const [groups, setGroups] = useState([]);

  // stores jwtToken from signals.js
  const config = {
    headers: { Authorization: 'Bearer ' + jwtToken.value }
  }


  // gets groups from database
  function getGroups() {
    axios.get('http://localhost:3001/groups/getGroupsWithAdmin', config)
      .then(res => setGroups(res.data))
      .catch(err => console.log(err.response.data));
  }

  function GroupForm(props) {
    return (

          <div className='group-item' key={props.community_id}>
            <h1 id="group-name">{props.community_name}</h1>
            <p id="group-desc">{props.community_desc}</p>
            <p id='group-admin'>{"Admin: "+props.username}</p>
            {jwtToken.value.length === 0 ? <p>Log in to join group</p> : <JoinGroupButton groupId={props.community_id}/>}
          </div>

    )
  }


  // gets groups when component is rendered
  useEffect(() => {
    getGroups();
  }, []);

  return (
    // creates a form for each group
      <ul className='group-list'>
        <li >
          {groups.map(group => GroupForm(group))}
        </li>
      </ul>
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
    axios.post('http://localhost:3001/groups/addRequest', requestBody, config)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  }

  return (
    <div>
      <button id='group-btn' onClick={joinGroup}>Join Group</button>
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

  return (
    <div>
    {window.location.pathname === "/groups" && (   
      <div id='create-group'>
        <input placeholder="Add Group Name" value={groupName} onChange={e => setGroupName(e.target.value)} />
        <input placeholder="Add Group Description" value={groupDesc} onChange={e => setGroupDesc(e.target.value)} />
        <button id='group-btn' onClick={createGroup}>Create Group</button>
      </div>
    )}
    </div>
  )
}

/*
// Show group requests for admin
*/
function ShowRequestsForm(){


  // stores requests from database
  const [requests, setRequests] = useState([""]);

  // Shows notification
  const [showNote, setShowNote] = useState("");

  // get requests from database from groups where the user is admin
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
      setTimeout(GetRequests, 250);
    }
  }

  // create form for a single request
  function RequestForm(props){
    // if props is empty, return nothing
    if (props === "") {
      return <></>;
    }

    return(
      <div>
      {window.location.pathname === "/groups" && (
        
        <div style={{border: "solid", borderColor: "pink", margin: "12px"}}>
          <h1>{props.username + "  " + props.community_name + "  " + props.account_community_id}</h1>
          <button id='group-btn'onClick={() => acceptRequest(props.account_community_id)}>Accept request</button>
          <button id='group-btn'onClick={() => rejectRequest(props.account_community_id)}>Decline request</button>
        </div>    
        
      )}
      </div>

    );
  }

  // stores jwtToken from signals.js
  const config = {
    headers: { Authorization: 'Bearer ' + jwtToken.value }
  }

  // change pending status to false in table account_community
  function acceptRequest(requestId){
    axios.put('http://localhost:3001/groups/acceptRequest/' + requestId, null, config)
      .then(() => console.log("request accepted"))
      .then(() => GetRequests())
      .then(() => showNoteForTime("Request accepted", 3000))
      .catch(err => console.log(err.response));
  }

  // delete table account_community from database
  function rejectRequest(requestId){
    axios.delete('http://localhost:3001/groups/rejectRequest/' + requestId, config)
      .then(() => console.log("request rejected"))
      .then(() => GetRequests())
      .then(() => showNoteForTime("Request rejected", 3000))
      .catch(err => console.log(err.response));
  }

  // Shows note for a certain time
  function showNoteForTime(note, time){
    setShowNote(note);
    setTimeout(() => setShowNote(null), time);
  }



  // get requests when component is rendered
  useEffect(() => {
    GetRequests();
  }, []);


  return(
    <div>
    {window.location.pathname === "/groups" && (
      <div>
      {requests && requests.length > 0
        ?
        <div id="requests-form" style={{ border: "solid", margin: "12px" }}>
          <h1>Requests</h1>
          {console.log("requests: " + JSON.stringify(requests))}
          {requests.map((request) => (RequestForm(request)
          ))}
          {showNote ? <NotificationForm note={showNote} /> : <></>}
        </div>
        : <></>
      }
      </div>
    )}
    </div>
  )

}

// Shows any notification
// props.note = notification text
function NotificationForm(props) {

  return (
    <div>
      {window.location.pathname === "/groups" && (

        <div>
          <h1>{props.note}</h1>
        </div>

      )}
    </div>

  )
}



/*
// Show groups where the user is member or admin
*/
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
      axios.get('http://localhost:3001/groups/getUsersGroup/' + JSON.stringify(userInfo.value.userId))
        .then(res => {
          setGroups(res.data.rows);
        })
        .catch(err => console.log(err.response));
    }else{
      console.log("userInfo has no value")
      setTimeout(GetGroups, 250);
    }
  }

  useEffect(() => {
    GetGroups();
  }, []);

  function GroupForm(props){
    const groupLink = "http://localhost:3000/groups/" + props.community_id;
    return(
      <div>
      {window.location.pathname === "/groups" && (
        
        <Link to={groupLink}>
          <div>
            <h1>{props.community_name}</h1>
            {
              props.pending ? <h2>PENDING</h2> : 
              props.admin_id===userInfo.value.userId ? <h2>ADMIN</h2> : <h2>MEMBER</h2>
            }
          </div>
        </Link>
        
      )}
      </div>

    )
  }

  return(
    <div>
    {window.location.pathname === "/groups" && (
      
      <div>
        <h1>Your Groups</h1>
        {groups.map(group => <h1 key={group.community_id}>{GroupForm(group)}</h1>)}
      </div>
      
    )}
    </div>

  )
}



export default Groups;