/* eslint-disable no-debugger, no-console, no-unused-vars */
import React, { useState, useEffect } from "react"
import axios from "axios"
import {
    Button,
    ButtonGroup,
    InputGroup,
    Intent,
    FormGroup,
    H3,
    Icon,
    Tooltip,
    Callout
} from "@blueprintjs/core";

const LoginModal = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [uInput, setUInput] = useState()
    const [usernameIntent, setUsernameIntent] = useState()
    const [visible, setVisible] = useState(props.isOpen);
    const [user, setUser] = useState();

    const handleLockClick = () => setShowPassword(!showPassword);
    const lockButton = (
        <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
            <Button
                icon={showPassword ? "unlock" : "lock"}
                intent={Intent.WARNING}
                minimal={true}
                onClick={handleLockClick}
            />
        </Tooltip>
    )

    const handleLoginClick = () => {  
        axios.post('/users/login', { username, password })
            .then(res => {
                props.updateUser(res)
                console.log(res)
            })
            .then(toggle())
            .catch(err => console.log(err))
    } 

    const handleClearForm = () => {
        setPassword('');
        setUsername('')
        uInput.focus()
    }

    const usernameFocus = () => {
        setUsernameIntent(Intent.SUCCESS)
    }

    const toggle = () => {
        setVisible(!visible)
        props.updateApp(visible);
    }

    const handleEnterKey = (e) => {
        if(username && password && e.key === "Enter"){
            axios.post('/users/login', { username, password })
                .then(res => props.updateUser(res))
                .then(toggle())
                .catch(err => console.log(err))
        }
    }

    return(
        <Callout 
            className="login"
            style={props.isOpen ? {display:'flex'} : {display:'none'}}
        >
            <div className="loginContainer">
                <H3>Sign in</H3>
                <FormGroup
                    label="Username"
                    labelFor="usernameInput"
                    labelInfo="(required)"
                >
                    <InputGroup 
                        large={true}
                        id="usernameInput"
                        value={username}
                        icon="user"
                        intent={usernameIntent}
                        rightElement={<Button icon="person" minimal={true} intent={Intent.PRIMARY}/>}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={usernameFocus}
                        inputRef={(input) => {setUInput(input)}}
                    />
                </FormGroup>
                <FormGroup
                    label="Password"
                    labelFor="passwordInput"
                    labelInfo="(required)"
                >
                    <InputGroup
                        id="password"
                        value={password}
                        large={true}
                        rightElement={lockButton}
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => handleEnterKey(e)}
                    />
                </FormGroup>
                <ButtonGroup
                    alignText="center"
                    fill={true}
                    large={false}
                    vertical={false}
                    className="btn-group"
                >
                    <Button 
                        intent={Intent.PRIMARY}
                        outlined="true"
                        onClick={handleLoginClick}
                    >
                        LOGIN
                    </Button>
                    <Button
                        intent={Intent.PRIMARY}
                        outlined="true"
                        onClick={handleClearForm}
                    >
                        CLEAR
                    </Button>
                </ButtonGroup>
                <Button
                    className="close-modal"
                    icon="cross"
                    intent={Intent.PRIMARY}
                    minimal={true}
                    onClick={toggle}
                />
            </div>
        </Callout>
    )
}

export default LoginModal;