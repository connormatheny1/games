import React, { useState, useEffect } from "react"
import { Event } from "react-socket-io"
import {
    Button,

} from "@blueprintjs/core"
const PlayerList = props => {
    const [numUsers, setNumUsers] = useState()
    const [disabledJoin, setDisabledJoin] = useState()
    const [btnStateStyle, setBtnStateStyle] = useState({
        boxShadow: '-5px -5px 20px #fff,  5px 5px 20px #BABECC',
    })
    const img = [
        {val: 0, path:require("../../../images/avatars/0.png")},
        {val: 1, path:require("../../../images/avatars/1.png")},
        {val: 2, path:require("../../../images/avatars/2.png")},
        {val: 3, path:require("../../../images/avatars/3.png")},
        {val: 4, path:require("../../../images/avatars/4.png")},
        {val: 5, path:require("../../../images/avatars/5.png")},
        {val: 6, path:require("../../../images/avatars/6.png")},
        {val: 7, path:require("../../../images/avatars/7.png")},
        {val: 8, path:require("../../../images/avatars/8.png")},
    ]

    const joinHoverIn = () => {
        setBtnStateStyle({
            boxShadow: '-2px -2px 5px #fff, 2px 2px 5px #BABECC'
        })
    }

    // const joinHoverOut = () => {
    //     setBtnStateStyle({
    //         boxShadow: '-5px -5px 20px #fff,  5px 5px 20px #BABECC',
    //     })
    // }

    const joinClick = () => {
        setBtnStateStyle({
            boxShadow: 'inset 1px 1px 2px #BABECC, inset -1px -1px 2px #fff'
        })
        setBtnStateStyle({
            boxShadow: '-5px -5px 20px #fff,  5px 5px 20px #BABECC',
        })
    }


    return(
        <div className="playerListComp">
            {
                props.users.map((user, i) => (
                    <div className="player-list-item" key={i}>
                        <div>
                            <img src={img[user.avatar].path} height={35} width={35}></img>
                            <span>{user.username}</span>
                        </div>
                        <Button
                            className="joinButton"
                            disabled={user.username === props.user.username ? false : true}
                            style={btnStateStyle}
                            onMouseEnter={joinHoverIn}
                            onClick={joinClick}
                        >JOIN</Button>
                    </div>
                ))
            }
            <Event event="user-connected" handler={() => console.log('foofofofofooo')}/>
        </div>
    )
}

export default PlayerList;