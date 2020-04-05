import React, { useState, useEffect } from "react";
import Rooms from "./rooms/Rooms"
import GamePage from "./game/GamePage"
//import socket from "../socketconnect";
import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
    useRouteMatch,
    Redirect
  } from "react-router-dom";

const Crazy = props => {
    let { path, url } = useRouteMatch();

    const updateUserRoom = (res) => {
        props.updateUserRoom(res)
    }
    return(
        <main className="crazy-main">
            <div className="crazyCont">
                {
                    props.user.isLoggedIn ? (
                            props.user.room_id ? (
                                <GamePage roomId={props.user.room_id} user={props.user}/>
                            ) : (
                                <Rooms user={props.user} updateUserRoom={updateUserRoom}/>
                            )
                    ) : (
                        <p>Please login to view this content. Not registered? Register.</p>
                    )
                }
            </div>
        </main>
    )
}

export default Crazy;