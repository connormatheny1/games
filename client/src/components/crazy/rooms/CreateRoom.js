import React, { useState, useEffect } from "react"
import axios from "axios"
import {
    Card,
    Button,
    ButtonGroup,
    InputGroup,
    Icon,
    H3,
    H5,
    Tooltip,
    Intent,
    Label,
    Toaster,
    Toast,
    ToasterPosition,
    Position,
    Radio,
    RadioGroup,
    FormGroup,
    Popover,
    PopoverInteractionKind
} from "@blueprintjs/core"


const CreateRoom = props => {
    const [roomName, setRoomName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [disabled, setDisabled] = useState(false)
    const [helperTextOpen, setHelperTextOpen] = useState(false)
    const [formIntent, setFormIntent] = useState(Intent.PRIMARY)
    const [showErrorText, setShowErrorText] = useState(false)
    const [errorHelperText, setErrorHelperText] = useState("All fields are needed")

    const setUsernameAsDisplayName = () => {
        if(!disabled){
            setDisplayName(props.user.username)
            setDisabled(true)
        }
        else{
            setDisabled(false)
        }
    }
    
    const userIcon = (
        <Button 
            icon="user"
            minimal="true"
            onClick={setUsernameAsDisplayName}
        />
    )

    const randomIcon = (
        <Button 
            icon="random"
            minimal="true"
        />
    )

    const toggleHelperText = () => {
        setHelperTextOpen(!helperTextOpen)
    }

    const updateUser = (res) => {
        props.updateUserRoom(res)
    }

    const createRoom = () => {
        if(roomName && displayName){
            const data = {
                roomName: roomName,
                displayName: displayName,
                username: props.user.username
            }
            axios.post('/crazy/createRoom', data)
                .then(res => updateUser(res))
                .catch(err => console.log(err))
        }
        else{
            console.log('Please enter correct info')
            setDisplayName('');
            setRoomName('');
            setHelperTextOpen(true)
            setFormIntent(Intent.DANGER)
            setShowErrorText(true)
        }
    }

    return(
        <Card className="createRoom">
            <H3>Create a room</H3>
            <div className="flex-row">

                <FormGroup
                    helperText={
                        helperTextOpen && showErrorText ? errorHelperText : null
                    }
                >
                    <Label intent={formIntent}>
                        Room Name {/* <Icon icon="info-sign" iconSize={14} /> */}
                        <InputGroup
                            id="roomName"
                            large={false}
                            type="text"
                            placeholder="Name your room"
                            rightElement={randomIcon}
                            intent={formIntent}
                            onChange={(e) => setRoomName(e.currentTarget.value)}
                        />
                    </Label>
                </FormGroup> 

                <FormGroup
                    helperText={
                        helperTextOpen ? (
                            !showErrorText ?
                                "The name you'd like to use in this room, or click the icon in the box to the right of this field to display your username" 
                                : errorHelperText
                            ) : null
                    }
                >
                    <Label intent={formIntent}>
                        Display Name <Icon icon="help" iconSize={14}  onClick={toggleHelperText}/>
                        <InputGroup
                            id="displayName"
                            large={false}
                            type="text"
                            placeholder="Name in this room"
                            rightElement={userIcon}
                            value={displayName}
                            disabled={disabled}
                            onChange={(e) => setDisplayName(e.currentTarget.value)}
                            intent={formIntent}
                        />
                    </Label>
                </FormGroup> 
            </div>
            <Button
                className="createButton"
                intent={Intent.PRIMARY}
                outlined="true"
                text="CREATE"
                onClick={createRoom}
                fill="true"
            />
        </Card>
    )
}

export default CreateRoom;