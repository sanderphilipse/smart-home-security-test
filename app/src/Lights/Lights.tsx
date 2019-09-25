import React from 'react';
import Light, { LightProps } from './Light';
import getHeaders from '../utils/headers';

interface LightsState {
    lights: LightProps[];
}

class Lights extends React.Component {
    public state: LightsState = { lights: [] };

    componentDidMount() {
        fetch('http://localhost:8080/lights', { headers: getHeaders() })
            .then(res => { 
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error(); 
                }
            })
            .then(res => this.setState({ ...this.state, lights: res ? res : []}))
            .catch(err => this.setState({ lights: [] }))
    }



    render() {
        return (
            <div>
                <ul>
                    {this.state.lights.map((light: LightProps) => <Light
                        {...light}></Light>)}
                </ul>
            </div>
        )
    }
}

export default Lights;