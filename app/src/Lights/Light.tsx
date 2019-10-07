import React from 'react';
import { Button } from 'react-bootstrap';

export enum LightStatus {
    ON, OFF, OFFLINE
}

export interface ILight {
    _id: string;
    name: string;
    status: LightStatus;
    color: string;
}
export interface LightProps extends ILight {
    switchLight(id: string, status: LightStatus): void;
}

function lightSwitch(status: LightStatus): LightStatus {
    
    return status === LightStatus.OFF ? LightStatus.ON : LightStatus.OFF;
}

const Light = (props: LightProps) => {
    function switchLight(event: any): void {
        props.switchLight(props._id, lightSwitch(props.status));
    }
    return (
        <div>
            <span>{props.name}</span> <Button onClick={switchLight}>{props.status === LightStatus.ON ? 'On' : 'Off'}</Button>
        </div>
    )
}

export default Light;