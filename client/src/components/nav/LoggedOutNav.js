/* eslint-disable no-debugger, no-console, no-unused-vars */
import React from 'react';

const LoggedOutNav = (props) => {

    const handleClick = (event) => {
        props.updateParent(!props.loginOpen)
    }

    const handleRegisterClick = (event) => {
        props.updateRegister(!props.registerOpen)
    }

    return(
        <ul className="loggedOutNav">
            <li style={props.registerOpen ? {"border": "1px solid #106ba3", "backgroundColor":"white"} : {"border": "none"}}>
                <a
                    href="#root" 
                    onClick={handleRegisterClick} 
                    style={props.registerOpen ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}
                >
                    Register
                </a>
            </li>
            <li style={props.loginOpen ? {"border": "1px solid #106ba3", "backgroundColor":"white"} : {"border": "none"}}>
                <a
                    href="#root" 
                    onClick={handleClick}
                    style={props.loginOpen ? {"fontWeight": "bold"} : {"fontWeight": "normal"}}
                >
                    Login
                </a>
            </li>
        </ul>
    )
}

export default LoggedOutNav