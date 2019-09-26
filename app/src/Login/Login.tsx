import React, { FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FormControlProps } from 'react-bootstrap';
import { isNullOrUndefined } from 'util';
interface LoginState {
    username: string;
    password: string;
    error: boolean;
    loggedIn: boolean;
    name: string;
}

interface LoginProps {
    username?: string;
    password?: string;
    error?: boolean;
    loggedIn?: boolean;
    name: string;
}

class Login extends React.Component<LoginProps> {
    public state: LoginState


    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: false,
            loggedIn: !isNullOrUndefined(sessionStorage.getItem('jwt')),
            name: props.name
        }
    }

    handleChange = (event: React.FormEvent<FormControlProps>) => {
        if (event.currentTarget.id !== undefined) {
            this.setState(
                { ...this.state, [event.currentTarget.id]: event.currentTarget.value }
            );
        }
    }

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const username = this.state.username;
        const password = this.state.password;
        fetch('http://localhost:8080/auth', { method: 'POST', body: JSON.stringify({ username: username, password: password }) })
            .then(res => {
                if (res.status === 200) 
                { 
                    return res 
                } else { 
                    throw new Error(); 
                }
            })
            .then(res => res.json())
            .then(data => {
                sessionStorage.setItem('jwt', data);
                this.setState({ ...this.state, loggedIn: true, error: false });
                window.location.reload();
            })
            .catch(err => this.setState({ ...this.state, error: true, loggedIn: false }));
    }

    logout = () => {
        sessionStorage.removeItem('jwt');
        this.setState({ loggedIn: false });
        window.location.reload();
    }

    render() {
        return this.state.loggedIn ?
            (<div><div><h1>Welcome {this.props.name}</h1></div>
            <div><Button variant="primary" type="submit" onClick={this.logout}>Logout</Button></div></div>) :
            (<div className="Login">
                <Form noValidate onSubmit={this.handleSubmit} >
                    <Form.Row>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" placeholder="Enter user name" onChange={this.handleChange} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={this.handleChange} />
                        </Form.Group>
                    </Form.Row>
                    {this.state.error ? <div>Login failed</div> : null}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

            </div>
            );
    }
}

export default Login;