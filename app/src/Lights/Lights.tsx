import React from 'react';
import Light, { LightProps, ILight } from './Light';
import getHeaders from '../utils/headers';

interface LightsState {
    lights: LightProps[];
    error: boolean;
}

function mapLights(data: []): ILight[] {
    return data.map((light: any) => {
        return {
            _id: light._id,
            name: light.name, 
            status: light.status,
            color: light.color
        }
    });
}

class Lights extends React.Component {
    public state: LightsState = { lights: [], error: false };

    componentDidMount() {
        fetch('http://localhost:8080/lights', { headers: getHeaders() })
            .then(res => { 
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error(); 
                }
            })
            .then(res => this.setState({ ...this.state, lights: res ? mapLights(res) : []}))
            .catch(err => this.setState({ lights: [] }))
    }

    switchLight(id: string, status: boolean) {
        console.log(id, status);
        fetch('http://localhost:8080/light/' + id + '/' + status, {
            method: 'POST',
            headers: getHeaders()
        })
        .then(res => {
            if (res.status === 200) {
                const newLights = this.state.lights.map(light => light._id === id ? {...light, status: status} : light);
                this.setState({lights: newLights});
            } else {
                throw new Error();
            }
        })
        .catch(err => this.setState(({...this.state, error: true})));
    }



    render() {
        return (
            <div>
                <ul>
                    {this.state.lights.map((light: LightProps) => <Light
                        {...light} switchLight={this.switchLight.bind(this)} key={light._id}></Light>)}
                </ul>
            </div>
        )
    }
}

export default Lights;