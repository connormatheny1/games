/* eslint-disable no-debugger, no-console, no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../../App.css"
import {
    Callout,
    Button,
    ButtonGroup,
    InputGroup,
    Icon,
    H4,
    H5,
    Tooltip,
    Intent,
    Toaster,
    Toast,
    ToasterPosition,
    Position,
    Radio,
    RadioGroup
} from "@blueprintjs/core"

const RegisterModal = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [passwordConf, setPasswordConf] = useState('')
    const [errors, setErrors] = useState([])
    const [toasts, setToasts] = useState([]);
    const [usernameIntent, setUsernameIntent] = useState()
    const [toastIntent, setToastIntent] = useState(Intent.PRIMARY)
    const [visible, setVisible] = useState(props.isOpen);
    const [avatarChoice, setAvatarChoice] = useState(0)
    const [uInput, setUInput] = useState()
    const [arr, setArr] = useState([
        {val: 0, path:require("../../images/avatars/0.png")},
        {val: 1, path:require("../../images/avatars/1.png")},
        {val: 2, path:require("../../images/avatars/2.png")},
        {val: 3, path:require("../../images/avatars/3.png")},
        {val: 4, path:require("../../images/avatars/4.png")},
        {val: 5, path:require("../../images/avatars/5.png")},
        {val: 6, path:require("../../images/avatars/6.png")},
        {val: 7, path:require("../../images/avatars/7.png")},
        {val: 8, path:require("../../images/avatars/8.png")},
    ])
    const handleLockClick = () => setShowPassword(!showPassword);
    
    const lockButton = (
        <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`} disabled={disabled}>
            <Button
                icon={showPassword ? "unlock" : "lock"}
                intent={Intent.WARNING}
                minimal={true}
                onClick={handleLockClick}
            />
        </Tooltip>
    )
    const emailIcon = (
        <Button 
            icon="envelope"
            minimal={true}
        />
    )
    const userIcon = (
        <Button 
            icon="user"
            minimal={true}
        />
    )
    const user = (
        <Button 
            icon="user"
            minimal={true}
        />
    )

    const success = (res) => {
        console.log(res)
        setToastIntent(Intent.SUCCESS)
        setToasts(prev => [...prev, res.data.success])
    }

    const error = (res) => {
        console.log(res)
        setToastIntent(Intent.DANGER)
        setToasts(prev => [...prev, res.data.errors])
        console.log("Errors: " + res.data.errors)
        console.log("Data: " + res.data)
    }

    const handleToasts = (res) => {
        if(res.registered){
            console.log(res.data)
            axios.post('login', { username, password })
                .then(res => props.updateUser(res))
                .then(toggle())
                .catch(err => console.log(err))
        }
        else{
            console.log(res.data)
        }
    }

    const toggle = () => {
        setVisible(!visible)
        props.updateApp(visible);
    }

    const handleClearForm = () => {
        setPassword('');
        setUsername('')
        setEmail('');
        setPasswordConf('')
        uInput.focus()
    }

    const usernameFocus = () => {
        setUsernameIntent(Intent.SUCCESS)
    }

    const submitForm = () => {
        const data = {
            username: username,
            email: email,
            password: password,
            passwordConf: passwordConf,
            avatar: avatarChoice
        }
        axios.post("/users/register", data)
            .then(res => handleToasts(res))
            .catch(err => console.log(err))
    }

    const handleAvatarCheck = (val) => {
        setAvatarChoice(parseInt(val))

    }

    const setChecked = (val) => {

    }

    const handleEnterKey = (e) => {
        if(username && email && passwordConf && password && avatarChoice >= 0 && e.key === "Enter"){
            const data = {
                username: username,
                email: email,
                password: password,
                passwordConf: passwordConf,
                avatar: avatarChoice
            }
            axios.post("/users/register", data)
                .then(res => handleToasts(res))
                .catch(err => console.log(err))
        }
    }

    return(
        <Callout className="register" style={props.isOpen ? {display:'flex'} : {display:'none'}}
            onKeyPress={(e) => handleEnterKey(e)}
        >
            <div className="registerContainer">
                <H4>Please Register Below</H4>                    
                <InputGroup 
                    name="username"
                    large={true}
                    placeholder="Username"
                    type="text"
                    rightElement={userIcon}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={usernameFocus}
                    inputRef={(input) => {setUInput(input)}}
                />
                <InputGroup 
                    name="email"
                    large={true}
                    placeholder="Email"
                    rightElement={emailIcon}
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputGroup
                    name="password"
                    large={true}
                    placeholder="Password"
                    rightElement={lockButton}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroup
                    name="passwordConf"
                    large={true}
                    placeholder="Password Confirmation"
                    rightElement={lockButton}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPasswordConf(e.target.value)}
                />
                <div className="avatarChoicesCont">
                    <H5>Pick an avatar</H5>
                    <div className="avatarChoices">
                        <RadioGroup
                            onChange={(e) => { handleAvatarCheck(e.currentTarget.value) }}
                        >
                            {
                                arr.map(i => {
                                    return(
                                        <Radio
                                            onClick={setChecked}
                                            key={i.val} 
                                            value={i.val}
                                            inline={true}
                                            labelElement={<img alt="label element for radio buttons" src={i.path} height={45} width={45}></img>}
                                        />                                  
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                </div>
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
                        onClick={submitForm}
                    >
                        REGISTER
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

export default RegisterModal;