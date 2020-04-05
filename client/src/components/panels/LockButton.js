import React, { useState, useEffect } from 'react';
import {
    Button,
    Tooltip,
    Intent,
} from "@blueprintjs/core"

const LockButton = (props) => {
    const [disabled, setDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleLockClick = () => setShowPassword(!showPassword);

    return(
        <Tooltip content={`${props.showPassword ? "Hide" : "Show"} Password`} disabled={disabled}>
            <Button
                icon={props.showPassword ? "unlock" : "lock"}
                intent={Intent.WARNING}
                minimal={true}
                onClick={props.onClick}
            />
        </Tooltip>
    )
}

export default LockButton;