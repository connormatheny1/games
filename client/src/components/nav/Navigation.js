import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import LoggedInNav from './LoggedInNav';
import LoggedOutNav from "./LoggedOutNav";

const Navigation = (props) => {
    const [ dropdownOpen, toggleDropdown ] = useState(false);

    const updateDropdown = (bool) => {
        toggleDropdown(bool)
    }

    const updateParent = (val) => {
        props.updateApp(val)
    }

    const updateReg = (val) => {
        props.updateReg(val)
    }

    const logout = () => {
        props.logout()
    }
    

    return(
        <nav className="nav">
            <ul className="consistentNav">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/crazy">Crazy 8s</Link>
                </li>
            </ul>
            {props.isLoggedIn ? (
                <LoggedInNav isLoggedIn={props.isLoggedIn} logout={logout} toggleMenu={updateDropdown} dropdownOpen={dropdownOpen} user={props.user}/>
            ) : (
                <LoggedOutNav updateParent={updateParent} updateRegister={updateReg} registerOpen={props.registerOpen} loginOpen={props.loginOpen}/>
            )}
        </nav>
    )
}

{/* <li>
                    {
                        props.user.current_room_id !== 0 ? (
                            <Link to="/crazy/rooms">Crazy 8s</Link>
                        ) : (
                            <Link to={`/crazy/rooms/${props.user.current_room_id}`} />
                        )
                    }
                </li> */}

export default Navigation