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
    let { groupId } = useParams();

    return(
        <div>
            <h1>Group view: {groupId}</h1>
            {authorization}
        </div>
    )
}

function authorization(){
    const config = {
        headers: { Authorization: `Bearer ${jwtToken.value}` }
    };
    axios.get('http://localhost:3001/groups/authorization', config)
        .then(res => console.log(res.data))
        .catch(err => console.log(err.response.data));
}

export default Group;