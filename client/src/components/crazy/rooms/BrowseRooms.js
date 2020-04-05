import React, { useState, useEffect } from "react"
import axios from "axios"
import {
    H3,
    HTMLTable,
} from "@blueprintjs/core"

const BrowseRooms = (props) => {
    return(
        <div className="browseRooms">
            <H3>Active Rooms</H3>
            {/* <p>{JSON.stringify(props.join)}</p> */}
            <HTMLTable striped="true" large="true" interactive="true" condensed="false">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Room Name</th>
                        <th>Created by</th>
                        <th>Members</th>
                        <th>Created at</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.rooms.length ? (
                            props.rooms.map((room, i) => {
                                return(
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{room[1]}</td>
                                        <td>{room[2]}</td>
                                        <td>{room[4]}</td>
                                        <td>{new Date(room[3]).toDateString()}</td>
                                    </tr>
                                )
                            })
                        ) : null
                    }
                </tbody>
            </HTMLTable>
            
        </div>
    )
}

export default BrowseRooms;