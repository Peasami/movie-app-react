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
    const [userInGroup, setUserInGroup] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // when component is rendered, check if user is in the group
    useEffect(() => {
        const checkGroupMembership = async () => {
            let isMember = await checkIfUserIsInGroup(groupId);
            setUserInGroup(isMember);
            console.log("userInGroup: " + isMember);
        };

        const checkAdmin = async () => {
            await axios.get('http://localhost:3001/groups/getAdmin/' + groupId)
            .then(res => {
                console.log("checkAdmin res.data: " + res.data)
                console.log("admin_id: " + res.data[0].account_id + "userinfo: " + userInfo.value.userId + "groupId: " + groupId);
                return res;
            })
            .then(res => res ? setIsAdmin(res.data[0].account_id === userInfo.value.userId) : setIsAdmin(false))
            .catch(err => console.log(err.response.data));
            
        };
    
        checkGroupMembership();
        checkAdmin();
    }, []);

    useEffect(() => {
        console.log("user is admin: ", isAdmin)
    }, [isAdmin]);



    return (
        <div>
            {jwtToken.value.length === 0 ? <h1>Please log in</h1> :
                userInGroup
                    ? <div>
                        <h1>Group view: {groupId}</h1>
                        {isAdmin
                            ? <div id="admin-section">
                                <h1>YOU ARE ADMIN</h1>
                                <button id="delete-group-button" onClick={() => handleDeleteGroup(groupId)}>Delete group</button>
                            </div>
                            : <></>
                        }
                        <GroupMembersForm isAdmin={isAdmin} />
                        <GroupNewsForm groupId={groupId} />
                    </div>
                    : <div>
                        <h1>You are not in this group</h1>
                    </div>
            }
        </div>
    )
}


function handleDeleteGroup(groupId){
    const config = {
        headers: { Authorization: 'Bearer ' + jwtToken.value }
    }

    axios.delete("http://localhost:3001/groups/deleteGroup/" + userInfo.value.userId + "/" + groupId, config)
        .then(res => console.log(res))
        .then(() => window.location.href = "/groups")
        .catch(err => console.log(err.response.data));
}


function GroupMembersForm(adminProps){
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
        getMembers();
    }, []);

    function getMembers(){
        // console.log("members: "+ members)
        axios.get('http://localhost:3001/groups/getMembers/' + groupId)
            .then(res => setMembers(res.data))
            .then(() => getAdminId())
            .catch(err => console.log(err.response.data));
    }

    function getAdminId(){
        axios.get("http://localhost:3001/groups/getAdmin/" + groupId)
            .then(res => {console.log("admin id: "+res.data[0].account_id); return res})
            .then(res => setAdminId(res.data[0].account_id))
            .catch(err => console.log(err.response.data));
    }

    function MemberForm(userProps) {
        return (
          <div key={userProps.account_id} style={{ border: "solid", margin: "12px"}}>
            <h1>{userProps.username}</h1>
            <h3>{userProps.account_id}</h3>
            {userProps.account_id === adminId ? <h1>Admin</h1> : <h1></h1>}
            {adminProps.isAdmin 
                ? userProps.account_id != adminId
                    ? <button onClick={() => removeUserFromGroup(userProps.account_id)}>Remove user</button>
                    : <></> 
                : <></>
            }
          </div>
        )
    }

    function removeUserFromGroup(userId){
        axios.delete("http://localhost:3001/groups/removeUserFromGroup/" + userId + "/" + groupId)
            .then(res => console.log(res))
            .then(() => getMembers())
            .catch(err => console.log(err.response.data));
    }

    return(
        <div>
            <h1>Group members</h1>
            {members.length === 0 ? <h1>No members</h1> : members.map(member => MemberForm(member))}
        </div>
    )
}



function GroupNewsForm(props){

    const [news, setNews] = useState([]);

    // Get news url and id
    function getGroupNews(){
        axios.get('http://localhost:3001/news/groupNews/' + props.groupId)
            .then(res => setNews(res.data.rows))
            .catch(err => console.log(err.response.data));
    }

    // get news news shared with the group
    // when props.groupId changes.
    useEffect(() => {
        getGroupNews();
        console.log("group news: " + props.groupId)
    }, [props.groupId]);

    useEffect(() => {
        console.log("news: "+ typeof(news) + " " + JSON.stringify(news[0]) + " " + news.length);
        
    }, [news]);

    return(
        <div>
            <h1>Group news</h1>
            {news && news.map(news => 
                <a href={news.news_url} key={news.news_id} style={{ border: "solid", margin: "12px"}}>
                    <h3>{news.news_url}</h3>
                </a>
            )}
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