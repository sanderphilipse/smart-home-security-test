import React from 'react';
import { Button } from 'react-bootstrap';

export interface FridgeProps {
    _id: string;
    name: string;
    getFridge(id: string, authorizationCode: string): Promise<FridgeItem[]>;
    error: boolean;
}

export interface FridgeItem {
    item: string;
    count: number;
}

interface FridgeState {
    authorizationCode: string;
    contentsError: boolean;
    contentsSuccess: boolean;
    contents: FridgeItem[];
}


class Fridge extends React.Component<FridgeProps> {
    public state: FridgeState;

    constructor(props: FridgeProps) {
        super(props);
        this.state = { authorizationCode: '', contentsError: false, contentsSuccess: false, contents: [] };
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.id !== undefined) {
            this.setState(
                { ...this.state, authorizationCode: event.currentTarget.value }
            );
        }
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.getFridge(this.props._id, this.state.authorizationCode)
            .then((contents) => {this.setState({...this.state, contents: contents, contentsError: false, contentsSuccess: true})})
            .catch(error => {this.setState({...this.state, contentsError: true, contentsSuccess: false})});
    }

    render() {
        return !this.props.name ? null : (
            <div className="fridge-component">
                <h2>Your fridge</h2>
                <h3 className="fridge-name"><b>Fridge name: </b>{this.props.name}</h3>
                <form>
                    <div><label className="form-label">Authorization code</label><input value={this.state.authorizationCode} onChange={this.handleChange}></input></div>
                    <div>{this.state.contentsError ? 'Wrong authorization code' : null}</div>
                    <Button type="submit" onClick={this.handleSubmit}>Get Fridge Contents</Button>
                </form>
                <ul>
                    {this.state.contents ? this.state.contents.map((item) => <div key={item.item}>{item.item} - {item.count}</div>) : null}
                </ul>
            </div>
        )
    }
}

export default Fridge;