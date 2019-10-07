import React, { FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FormControlProps } from 'react-bootstrap';
interface LoginState {
    username: string;
    password: string;
}

interface LoginProps {
    error?: boolean;
    loggedIn?: boolean;
    name?: string;
    login(username:string, password: string): void;
    logout(): void;
}

class Login extends React.Component<LoginProps> {
    public state: LoginState


    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '',
            password: ''
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
        this.props.login(this.state.username, this.state.password);
    }

    render() {
        return this.props.loggedIn ?
            (<div><div><h1>Welcome {this.props.name}</h1></div>
            <div><Button variant="primary" type="submit" onClick={this.props.logout}>Logout</Button></div></div>) :
            (<div className="Login">
                <h1>Login</h1>
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
                    {this.props.error ? <div>Login failed</div> : null}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

            </div>
            );
    }
}

export default Login;