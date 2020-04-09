import React, { useState, useEffect } from "react"
import Chat from "./Chat"
import Game from "./Game"
import PlayerList from "./PlayerList"
import axios from "axios"
import socketIOClient from 'socket.io-client'
import { Socket } from "react-socket-io"
import {
    H3,
    H4,
    H5,
    Card,
    Drawer,
    Icon,
    Elevation,
    Position,
    Button,
    Portal,
    Overlay,
    Classes,
} from "@blueprintjs/core"

const GamePage = (props) => {
    const [info, setInfo] = useState({})
    const [playerListOpen, setplayerListOpen] = useState(true);
    const [playerListIcon, setPlayerListIcon] = useState('double-chevron-left')
    const [num, setNum] = useState(0)
    const [creator, setCreator] = useState('')
    const [time, setTime] = useState('')
    const [minIntent, setMinIntent] = useState(false)
    const [_socket, set_Socket] = useState()
    const [endpoint, setEndpoint] = useState(`http://localhost:5000/crazy/rooms/`)
    const [users, setUsers] = useState()
    const [rooms, setRooms] = useState()

    const options = { transports: ['websockets'] }

    useEffect( () => {
        const fetchData = async () => {
            const result = await axios.get(`/crazy/rooms/${props.roomId}`)
            setInfo(result.data)
        }
        const onSocket = (socket) => {
            
        }
        const openSocket = () => {
            const socket = socketIOClient(endpoint)
            socket.emit("user-joined-room", {roomId: props.roomId, username: props.user.username})
            socket.on('user-connected', (data) => {
                console.log(data)
                if(users == null){
                    setUsers(data)
                }
                else{
                    
                }
            })
        }
        fetchData()
        openSocket()
        
    }, [])

    const playerListToggle = () => {
        if(!playerListOpen){
            setPlayerListIcon('double-chevron-left')
        }
        else{
            setPlayerListIcon('double-chevron-right')
        }
        setplayerListOpen(!playerListOpen)
    }

    const dialogHeader = () => (
        <div className={Classes.DIALOG_HEADER}>
            <H5 className="dialogHead" style={{fontWeight:'normal'}}>
                <span>Players in room:&nbsp; 
                    <b>
                        {info.users.length}
                    </b>
                </span>
                <span style={ info.users.length < 3 ? {color: '#A82A2A'} : {color: '#0D8050'}}>(min. 3)</span>
            </H5>
        </div> 
    )
    
    
    

    return(
        <>
            {
                info.exists ? (
                        <div className="gameCont">
                            <div className="roomInfoHeader">
                                <div className="left">
                                    <H3>{info.rows.room_name}</H3>
                                    <p>&nbsp;(id:{info.rows.rid})</p>
                                </div>
                                <div className="right">
                                    <span><Icon icon="new-person"/>Created by:&nbsp;<b>{info.rows.creator}</b></span>
                                    <span>
                                        <Icon icon="time"/> Room created:&nbsp;
                                        <b>
                                            {new Date(info.rows.created_at).toDateString()}, {new Date(info.rows.created_at).toLocaleTimeString('en-US')}
                                        </b>
                                    </span>
                                </div>
                            </div>
                            <div className="gameBody">
                                <div className="playerListCont">
                                    <Drawer 
                                        title={dialogHeader()} 
                                        isCloseButtonShown={false} 
                                        isOpen={playerListOpen} 
                                        usePortal={false} 
                                        hasBackdrop={false} 
                                        lazy={true}
                                        position={Position.LEFT}
                                        size="260px" 
                                        className="drawer"
                                        onClose={() => {setplayerListOpen(false)}}
                                        canOutsideClickClose={false}
                                        canEscapeKeyClose={false}
                                    >
                                        <PlayerList user={props.user} users={info.users} />
                                    </Drawer>
                                    <Button icon={playerListIcon} minimal="true" onClick={playerListToggle} className="drawer-button" style={ playerListOpen ? {left: '238px'} : {left: '0px'}}/>
                                </div>
                                <div>
                                    <Game />
                                </div>
                                <div>
                                    <Chat />
                                </div>
                            </div>
                        </div>
                ) : (
                    <p>How did you even get to this page?</p>
                )
            }
        </>
    )
}

export default GamePage;