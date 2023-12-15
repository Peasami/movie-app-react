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
import '../stylesheets/groups.css'
function Group(){
    // save group id from url to variable
    const { groupId } = useParams();
    const [userInGroup, setUserInGroup] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [groupName, setGroupName] = useState("");

    // when component is rendered, check if user is in the group
    useEffect(() => {
        const checkGroupMembership = async () => {
            let isMember = await checkIfUserIsInGroup(groupId);
            setUserInGroup(isMember);
            console.log("userInGroup: " + isMember);
        };

        const checkAdmin = async () => {
            await axios.get('https://movie-app-h3st.onrender.com/groups/getAdmin/' + groupId)
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

    useEffect(() => {
        const config = {
            headers: { Authorization: 'Bearer ' + jwtToken.value }
        }

        axios.get('https://movie-app-h3st.onrender.com/groups/getGroup/' + groupId, config)
            .then(res => setGroupName(res.data[0].community_name))
            .catch(err => console.log(err.response.data));
    }, [groupId]);


    return (
        <div>
            {jwtToken.value.length === 0 ? <h1>Please log in</h1> :
                userInGroup
                    ? <div>
                        <h1 id="group-name">{groupName}</h1>
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

    axios.delete("https://movie-app-h3st.onrender.com/groups/deleteGroup/" + userInfo.value.userId + "/" + groupId, config)
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
        axios.get('https://movie-app-h3st.onrender.com/groups/getMembers/' + groupId)
            .then(res => setMembers(res.data))
            .then(() => getAdminId())
            .catch(err => console.log(err.response.data));
    }

    function getAdminId(){
        axios.get("https://movie-app-h3st.onrender.com/groups/getAdmin/" + groupId)
            .then(res => {console.log("admin id: "+res.data[0].account_id); return res})
            .then(res => setAdminId(res.data[0].account_id))
            .catch(err => console.log(err.response.data));
    }

    function MemberForm(userProps) {
        return (
          <div id=".group-list" key={userProps.account_id}>
            <h3>- {userProps.username}{userProps.account_id === adminId ? (<span id="group-admin"> (Admin)</span>) : null}</h3>
            {/* 
            <h3>{userProps.account_id}</h3>
            */}
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
        
        const config = {
            headers: { Authorization: 'Bearer ' + jwtToken.value }
        }

        axios.delete("https://movie-app-h3st.onrender.com/groups/removeUserFromGroup/" + userId + "/" + groupId, config)
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
        axios.get('https://movie-app-h3st.onrender.com/news/groupNews/' + props.groupId)
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
                <a href={news.news_url} key={news.news_id}>
                    <p id="news-url">{news.news_url}</p>
                </a>
            )}
        </div>
    )

}

async function checkIfUserIsInGroup(groupId){
    return axios.get('https://movie-app-h3st.onrender.com/groups/getMembers/' + groupId)
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