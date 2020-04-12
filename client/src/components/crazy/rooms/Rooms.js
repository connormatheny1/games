import React, { Component } from "react"
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom"
import BrowseRooms from "./BrowseRooms"
import socketIOClient from "socket.io-client"
var socket;
class Rooms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            endpoint: 'localhost:5000/crazy/rooms',
            rooms: [],
        };
        socket = socketIOClient(this.state.endpoint);
    }

    componentDidMount(){
        socket.emit('user-on-rooms', this.props.user.username)
    }

    updateUserRoom = (res) => {
        this.props.updateUserRoom(res)
    }

    updateIsInRoom = () => {
        this.props.updateIsInRoom()
    }

    createRoomSocketEvt = (evt, data) => {
        socket.on(evt, (data) => {
            console.log('room created')
            this.joinRoomSocketEvt('creator-join-room')
        })
    }

    joinRoomSocketEvt = (evt) => {
        socket.emit(evt, {username: this.props.user.username, room: })
    }

    setUserRoomId = (o) => {
        this.props.setUserRoomId(o)
    }
    
    render(){
        return(
            <div className="roomCont">
                <div className="roomsLeft">
                    <CreateRoom
                        setUserRoomId={this.setUserRoomId}
                        socket={socket}
                        createRoomSocketEvt={this.createRoomSocketEvt}
                        user={this.props.user}
                        updateUserRoom={this.updateUserRoom}
                    />
                    <JoinRoom
                        user={this.props.user}
                        updateIsInRoom={this.updateIsInRoom}
                        inRoom={this.props.inRoom}
                        updateUserRoom={this.updateUserRoom}
                    />
                </div>
                <BrowseRooms rooms={this.state.rooms} />
            </div>
        )
    }
}

export default Rooms;












    // useEffect(() => {
    //     const createSocket = () => {
    //         const socket = socketIOClient('http://localhost:5000/');
    //         socket.emit("user-on-rooms", props.user.username)
    //     }
    //     createSocket()
    // })
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const res = await axios.get('/crazy/rooms')
    //         for(let i = 0; i < res.data.rows.length; i++){
    //             let tmp = [
    //                 [
    //                     res.data.rows[i].rid,
    //                     res.data.rows[i].room_name,
    //                     res.data.rows[i].creator,
    //                     res.data.rows[i].created_at,
    //                     res.data.join.rows[i].count
    //                 ]
    //             ]
    //             setRooms(tmp)
    //         }
    //     }
    //     fetchData();
    // }, [])