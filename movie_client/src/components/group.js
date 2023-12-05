import { useParams } from "react-router-dom";
import { jwtToken, userInfo } from "./signals";
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { effect, signal } from "@preact/signals-core";

function Group(){
    let { groupId } = useParams();
    console.log(groupId);

    return(
        <div>
            <h1>Group view: {groupId}</h1>
        </div>
    )
}

export default Group;