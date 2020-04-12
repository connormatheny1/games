/* eslint-disable no-debugger, no-console, no-unused-vars */
import React, { useState, useEffect } from "react";
import {
    H3,
    H5,
    Card,
    Elevation,
    Button,
    FileInput,
    Collapse,
    Radio,
    RadioGroup
} from "@blueprintjs/core"
import axios from "axios";

const UserProfile = (props) => {
    const { username, gamesplayed, avatar, gameswon} = props
    const [changeOpen, setChangeOpen] = useState(false)
    const [fileUploaded, setFileUploaded] = useState(false)
    const [newAvatar, setNewAvatar] = useState();
    const [avatarPicked, setAvatarPicked] = useState(false);
    const [loading, setLoading] = useState(false)

    const handleChangeClick = () => {
        setChangeOpen(!changeOpen);
    }
    const img = [
        {val: 0, path:require("../../images/avatars/0.png")},
        {val: 1, path:require("../../images/avatars/1.png")},
        {val: 2, path:require("../../images/avatars/2.png")},
        {val: 3, path:require("../../images/avatars/3.png")},
        {val: 4, path:require("../../images/avatars/4.png")},
        {val: 5, path:require("../../images/avatars/5.png")},
        {val: 6, path:require("../../images/avatars/6.png")},
        {val: 7, path:require("../../images/avatars/7.png")},
        {val: 8, path:require("../../images/avatars/8.png")},
    ]

    const avatarClicked = (val) => {
        setNewAvatar(val)
        setAvatarPicked(true);
    }

    const updateAv = () => {
        setLoading(true)
        axios.put("/update", {val: newAvatar, username: props.user.username })
            .then(res => console.log(res))
            .then(setLoading(false))
            .catch(err => console.log(err));
        props.updateAvatar(newAvatar)
        window.location.reload()
    }

    return(
        <main className="profile-page">
            <div className="profile-page-container">
                {
                    props.user.isLoggedIn ? (
                        <H3>{props.user.username}'s profile</H3>
                    ) : 
                    (
                        <H5>{props.user.username}</H5>
                    )
                }
                
                { 
                    props.user.isLoggedIn ? (
                        <>
                            <Card className="profile-section" elevation={Elevation.ONE}>
                                <H3>Personal Info</H3>
                                <p>Username: {props.user.username}</p>
                                <p>Email: {props.user.email}</p>
                                <p>Avatar: &nbsp; 
                                    {
                                        props.user.avatar >= 0 ? (
                                            <img src={img[props.user.avatar].path} alt="user avatar icon" height={35} width={35}></img>
                                        ) : (
                                            <i className="fas fa-user-circle"></i>
                                        )
                                    }
                                    <Button 
                                        small={true}
                                        type="button"
                                        minimal={true}
                                        onClick={handleChangeClick}
                                    >Change</Button>
                                </p>
                                <Collapse isOpen={changeOpen} className="update-avatar">
                                    <RadioGroup
                                        onChange={(e) => {avatarClicked(parseInt(e.currentTarget.value))}}
                                    >
                                        {
                                            img.map(i => {
                                                return(
                                                    <Radio
                                                        key={i.val} 
                                                        value={i.val}
                                                        inline={true}
                                                        labelElement={<img src={i.path} alt="user avatar label element" height={30} width={30}></img>}
                                                    />                                  
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                    {
                                        avatarPicked ? (
                                            <Button
                                                loading={loading}
                                                onClick={updateAv}
                                            >
                                                Update
                                            </Button>
                                        ) : null
                                    }
                                </Collapse>
                            </Card>
                            <Card className="profile-section" elevation={Elevation.ONE}>
                                <H3>Record</H3>
                                <p>Total games: {props.user.gamesplayed}</p>
                                <p>Games won: {props.user.gameswon}</p>
                            </Card>
                        </>
                    ) : null 
                }
            </div>
        </main>
    )
}

export default UserProfile;