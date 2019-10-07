import React from 'react';
import Light, { ILight, LightStatus } from './Light';

interface LightsProps {
    lights: ILight[];
    error: boolean;
    switchLight(id: string, status: LightStatus): void;
}

const Lights = (props: LightsProps) => {

        return (
            <div>
                <h2>Lights</h2>
                <ul>
                    {props.lights.map((light: ILight) => <Light
                        {...light} switchLight={props.switchLight} key={light._id}></Light>)}
                </ul>
            </div>
        )
}

export default Lights;