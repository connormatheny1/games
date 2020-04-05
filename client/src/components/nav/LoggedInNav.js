import React, { useState, useEffect } from 'react'
import axios from "axios"
import UserDropdown from "../panels/UserDropdown"

const LoggedInNav = (props) => {

    const toggleMenu = () => {
        props.toggleMenu(!props.dropdownOpen);
    }

    const logout = () => {
        props.logout()
    }

    return(  
        <UserDropdown onClick={toggleMenu} open={props.dropdownOpen} logout={logout} user={props.user}/>
    )
}

export default LoggedInNav;