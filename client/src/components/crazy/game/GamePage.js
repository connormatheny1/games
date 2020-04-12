/* eslint-disable no-debugger, no-console, no-unused-vars */
import React, { Component } from "react"
import Chat from "./Chat"
import Game from "./Game"
import PlayerList from "./PlayerList"
import axios from "axios"
import { socket } from "../../nav/Navigation"

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
import { render } from "react-dom";

class GamePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            playerListOpen: true,
            playerListIcon: 'double-chevron-left',
            num: 0,
            creator: '',
            time: '',
            minIntent: false,
            users: [],
        }
    }
    
    // useEffect( () => {
    //     const fetchData = async () => {
    //         const result = await axios.get(`/crazy/rooms/${props.roomId}`)
    //         setInfo(result.data)
    //     }
    //     fetchData()
    // }, [])

    playerListToggle = () => {
        if(!this.state.playerListOpen){
            this.setState({
                playerListIcon: 'double-chevron-left'
            })
        }
        else{
            this.setState({
                playerListIcon: 'double-chevron-right'
            })
        }
    }

    dialogHeader = () => (
        <div className={Classes.DIALOG_HEADER}>
            <H5 className="dialogHead" style={{fontWeight:'normal'}}>
                <span>Players in room:&nbsp; 
                    <b>
                        length
                    </b>
                </span>
                <span style={ 0 < 3 ? {color: '#A82A2A'} : {color: '#0D8050'}}>(min. 3)</span>
            </H5>
        </div> 
    )
    
    render(){
        return(
            <>
                {
                    this.state.playerListOpen ? (
                            <div className="gameCont">
                                <div className="roomInfoHeader">
                                    <div className="left">
                                        <H3><span style={{fontWeight: "normal"}}>Room</span> {this.props.roomId}</H3>
                                    </div>
                                    <div className="right">
                                        <span><Icon icon="new-person"/>Created by:&nbsp;<b>creator</b></span>
                                        <span>
                                            <Icon icon="time"/> Room created:&nbsp;
                                            <b>
                                                Dates
                                                {/* {new Date(info.rows.created_at).toDateString()}, {new Date(info.rows.created_at).toLocaleTimeString('en-US')} */}
                                            </b>
                                        </span>
                                    </div>
                                </div>
                                <div className="gameBody">
                                    <div className="playerListCont">
                                        <Drawer 
                                            title={this.dialogHeader()} 
                                            isCloseButtonShown={false} 
                                            isOpen={this.state.playerListOpen} 
                                            usePortal={false} 
                                            hasBackdrop={false} 
                                            lazy={true}
                                            position={Position.LEFT}
                                            size="260px" 
                                            className="drawer"
                                            onClose={() => {this.setplayerListOpen(false)}}
                                            canOutsideClickClose={false}
                                            canEscapeKeyClose={false}
                                        >
                                            <PlayerList user={this.props.user} users={this.state.users} />
                                        </Drawer>
                                        <Button icon={this.state.playerListIcon} minimal="true" onClick={this.playerListToggle} className="drawer-button" style={ this.state.playerListOpen ? {left: '238px'} : {left: '0px'}}/>
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
}

export default GamePage;