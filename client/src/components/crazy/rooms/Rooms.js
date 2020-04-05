import React, { useState, useEffect } from "react"
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom"
import BrowseRooms from "./BrowseRooms"
import axios from "axios";

const Rooms = props => {
    const [rooms, setRooms] = useState([])
    const [join, setJoin] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('/crazy/rooms')
            for(let i = 0; i < res.data.rows.length; i++){
                let tmp = [
                    [
                        res.data.rows[i].rid,
                        res.data.rows[i].room_name,
                        res.data.rows[i].creator,
                        res.data.rows[i].created_at,
                        res.data.join.rows[i].count
                    ]
                ]
                setRooms(tmp)
            }
        }
        fetchData()
    }, [])

    const updateUserRoom = (res) => {
        props.updateUserRoom(res)
    }

    return(
        <div className="roomCont">
            <div className="roomsLeft">
                <CreateRoom user={props.user} updateUserRoom={updateUserRoom}/>
                <JoinRoom user={props.user} updateUserRoom={updateUserRoom}/>
            </div>
            <BrowseRooms rooms={rooms} join={join}/>
        </div>
    )
}

export default Rooms;