import React from 'react'
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