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
    let [isUserInGroup, setIsUserInGroup] = useState(false);

    useEffect(() => {
        setIsUserInGroup(checkIfUserIsInGroup(groupId));
    }, []);

    return(
        <div>
            {jwtToken.value.length === 0 ? <h1>Please log in</h1> :
                
                <div>
                    <h1>Group view: {groupId}</h1>
                </div>
            }
        </div>
    )
}

function checkIfUserIsInGroup(groupId){
    axios.get('http://localhost:3001/groups/getGroupUsers/' + groupId)
        .then(res => {
            const accountIds = res.data.map(user => user.account_id);
            console.log(accountIds);
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