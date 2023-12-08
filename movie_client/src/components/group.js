/*
    Parameters to fetch:
        - Group ID
        - Group name
        - Group description
        - Users in group
        - Group admin
        - Group news

    Authentications:
        - check if user is in the group or not.
        - check if user is the admin of the group or not.
*/

import { useParams } from "react-router-dom";
import { jwtToken, userInfo } from "./signals";
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { effect, signal } from "@preact/signals-core";

function Group(){
    // save group id from url to variable
    const { groupId } = useParams();
    let [userInGroup, setUserInGroup] = useState(false);

    // when component is rendered, check if user is in the group
    useEffect(() => {
        const checkGroupMembership = async () => {
            let isTrue = await checkIfUserIsInGroup(groupId);
            setUserInGroup(isTrue);
            console.log("userInGroup: " + isTrue);
        };
    
        checkGroupMembership();
    }, []);


    return(
        <div>
            {jwtToken.value.length === 0 ? <h1>Please log in</h1> :
                userInGroup ? 
                <div>
                    <h1>Group view: {groupId}</h1>
                    <GroupMembersForm />
                    <GroupNewsForm />
                </div>
                :
                <div>
                    <h1>You are not in this group</h1>
                </div>
            }
        </div>
    )
}


function GroupMembersForm(){
    const { groupId } = useParams();
    const [members, setMembers] = useState([]);
    const [adminId, setAdminId] = useState(0);

    useEffect(() => {
        console.log("members: "+ typeof(members) + " " + JSON.stringify(members) + " " + members.length);
        
    }, [members]);

    useEffect(() => {
        console.log("adminId: "+ typeof(adminId) + " " + adminId);
        
    }, [adminId]);

    useEffect(() => {
        // console.log("members: "+ members)
        axios.get('http://localhost:3001/groups/getMembers/' + groupId)
            .then(res => setMembers(res.data))
            .then(() => getAdminId())
            .catch(err => console.log(err.response.data));
    }, []);

    function getAdminId(){
        axios.get("http://localhost:3001/groups/getAdmin/" + groupId)
            .then(res => {console.log("admin id: "+res.data[0].account_id); return res})
            .then(res => setAdminId(res.data[0].account_id))
            .catch(err => console.log(err.response.data));
    }

    function MemberForm(props) {
        return (
          <div key={props.account_id} style={{ border: "solid", margin: "12px"}}>
            <h1>{props.username}</h1>
            <h3>{props.account_id}</h3>
            {props.account_id === adminId ? <h1>Admin</h1> : <h1></h1>}
          </div>
        )
    }

    return(
        <div>
            <h1>Group members</h1>
            {members.length === 0 ? <h1>No members</h1> : members.map(member => MemberForm(member))}
        </div>
    )
}



function GroupNewsForm(){
    return(
        <div>
            <h1>Group news</h1>
        </div>
    )

}



async function checkIfUserIsInGroup(groupId){
    return axios.get('http://localhost:3001/groups/getMembers/' + groupId)
        .then(res => {
            const accountIds = res.data.map(user => user.account_id,);
            console.log("res.data: "+ accountIds);
            console.log(userInfo.value.userId);
            if (accountIds.includes(userInfo.value.userId)){
                console.log("user is in group");
                return true;
            } else {
                console.log("user is not in group");
                return false;
            }
        })
        .catch(err => console.log(err.response.data));
}

export default Group;