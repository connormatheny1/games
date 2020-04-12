import React, { Component } from 'react'
import { NavLink } from "react-router-dom"
import LoggedInNav from './LoggedInNav';
import LoggedOutNav from "./LoggedOutNav";
import "../../App.css"

var socket;

class Navigation extends Component {
    constructor() {
        super();
        this.state = {
            dropdownOpen: false,
            endpoint: 'localhost:5000/crazy/rooms'
        };
        //socket = socketIOClient(this.state.endpoint);
    }

    updateDropdown = (bool) => {
        this.setState({ dropdownOpen: bool})
    }

    updateParent = (val) => {
        this.props.updateApp(val)
    }

    updateReg = (val) => {
        this.props.updateReg(val)
    }

    logout = () => {
        this.props.logout()
    }
    
    render() {
        return (
            <nav className="nav">
                <ul className="consistentNav">
                    <li>
                        <NavLink exact to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/crazy/rooms">Crazy 8s</NavLink>
                    </li>
                </ul>
                {
                    this.props.isLoggedIn ? (
                        <LoggedInNav 
                            isLoggedIn={this.props.isLoggedIn}
                            logout={this.logout}
                            toggleMenu={this.updateDropdown}
                            dropdownOpen={this.state.dropdownOpen}
                            user={this.props.user}
                        />
                    )
                    : (
                        <LoggedOutNav
                            updateParent={this.updateParent}
                            updateRegister={this.updateReg}
                            registerOpen={this.props.registerOpen}
                            loginOpen={this.props.loginOpen}
                        />
                    )
                }
            </nav>
        );
    }
}

export { Navigation, socket };