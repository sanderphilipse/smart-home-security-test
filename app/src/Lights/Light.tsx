import React, { MouseEvent } from 'react';
import { Button } from 'react-bootstrap';

export interface LightProps {
    id: string;
    name: string;
    status: boolean;
    color: string;
    switchLight(event: any): void;
}

const Light = (props: LightProps) => {
    return (
        <div key={props.id}>
            <span>{props.name}</span> <Button onClick={props.switchLight}>{props.status ? 'On' : 'Off'}</Button>
        </div>
    )
}

export default Light;