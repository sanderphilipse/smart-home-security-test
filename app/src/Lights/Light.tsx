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
    switchLight(id: string, status: boolean): void;
}

const Light = (props: LightProps) => {
    function switchLight(event: any): void {
        props.switchLight(props._id, !props.status);
    }
    return (
        <div>
            <span>{props.name}</span> <Button onClick={switchLight}>{props.status === LightStatus.ON ? 'On' : 'Off'}</Button>
        </div>
    )
}

export default Light;