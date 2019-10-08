import React from 'react';
import './App.css';
import Lights from './Lights/Lights';
import Login from './Login/Login';
import getHeaders from './utils/headers';
import { LightStatus, ILight } from './Lights/Light';
import Fridge, { FridgeProps, FridgeItem } from './Fridge/Fridge';

interface AppState {
  user?: {
    _id: string;
    uid: string;
    username: string;
    name: string;
  },
  lights: ILight[];
  token: string;
  refreshToken: string;
  loginError?: boolean;
  fridge: FridgeProps;
}

const serverUrl = '';

class App extends React.Component {
  private initialState: AppState = {
    user: undefined,
    lights: [],
    token: '',
    refreshToken: sessionStorage.getItem('token') || '',
    fridge: {
      _id: '',
      name: '',
      getFridge: this.getFridge.bind(this),
      error: false
    }
  };


  public state: AppState = this.initialState;

  componentDidMount() {

    if (this.state.refreshToken) {
      this.fetchData(this.state.token, this.state.refreshToken);
    }
  }

  getFridge(id: string, authorizationCode: string): Promise<FridgeItem[]> {
    const headers = new Headers();
    headers.append('authCode', authorizationCode);

    return this.authorizedFetch(serverUrl + '/fridge/' + id, this.state.token, this.state.refreshToken, {}, headers)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then(data => {
        if (data) {
          return data;
        }
        else throw new Error();
      })
  }

  fetchData(token: string, refreshToken: string) {
    this.authorizedFetch(serverUrl + '/user', token, refreshToken, {})
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then(data => this.setState({ user: data }))
      .catch(err => console.log(err));

    this.authorizedFetch(serverUrl + '/lights', token, refreshToken, {})
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then(res => this.setState({ ...this.state, lights: res ? mapLights(res) : [] }))
      .catch(err => this.setState({ ...this.state, lights: [] }));

    this.authorizedFetch(serverUrl + '/fridge', token, refreshToken, {})
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then(res => {this.setState({...this.state, fridge: {...this.state.fridge, _id: res._id, name: res.name}});})
      .catch(err => {this.setState({...this.state, fridge: {...this.initialState.fridge, error: true}});})
  }

  switchLight(id: string, status: LightStatus) {
    this.authorizedFetch(serverUrl + '/light/' + id + '/' + status, this.state.token, this.state.refreshToken, {
      method: 'POST'
    })
      .then(res => {
        if (res.status === 200) {
          const newLights = this.state.lights.map(light => light._id === id ? { ...light, status: status } : light);
          this.setState({ lights: newLights });
        } else {
          throw new Error();
        }
      })
      .catch(err => this.setState(({ ...this.state, error: true })));
  }

  login(username: string, password: string) {

    fetch(serverUrl + '/auth', { method: 'POST', body: JSON.stringify({ username: username, password: password }) })
      .then(res => {
        if (res.status === 200) {
          return res
        } else {
          throw new Error();
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({
          ...this.state,
          loggedIn: true,
          loginError: false,
          token: data.token,
          refreshToken: data.refreshToken
        });
        sessionStorage.setItem('token', data.refreshToken);
        this.fetchData(data.token, data.refreshToken);
      })
      .catch(err => this.setState({ loginError: true, loggedIn: false }));
  }

  logout() {
    this.authorizedFetch(serverUrl + '/logout', this.state.token, this.state.refreshToken, 
    { method: 'POST', body: JSON.stringify({refreshToken: this.state.refreshToken })});
    sessionStorage.removeItem('token');
    this.setState(this.initialState);
  }

  authorizedFetch(url: string, token: string, refreshToken: string, init: RequestInit, headers?: Headers): Promise<Response> {
    return fetch(url, { ...init, headers: getHeaders(token, headers) })
      .then(res => {
        if (res.status === 200 || res.status === 204) {
          return res;
        } else if (res.status === 401) {
          return fetch(serverUrl + '/token', { method: 'POST', body: JSON.stringify({ refreshToken: refreshToken }) })
            .then(res => { 
              if (res.status === 200 || res.status === 204) { 
                return res.json() 
              } 
              else if (res.status === 401) {
                sessionStorage.removeItem('token');
                this.setState({ ...this.state, loggedIn: false });
                throw new Error('401');
              }
              else {
                throw new Error(res.status.toString());
              }
            })
            .then(res => {
              this.setState({ ...this.state, token: res.token });
              return fetch(url, { ...init, headers: getHeaders(res.token, headers) });
            })
            .catch(err => {
              return err;
            })
        } else {
          throw new Error(res.status.toString());
        }
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Your smart home dashboard</h1> 
        </header>
        <div className="App-contents">
        <Login 
            name={(this.state.user && this.state.user.name)|| ''}
            loggedIn={!!this.state.token}
            login={this.login.bind(this)}
            error={this.state.loginError}
            logout={this.logout.bind(this)}></Login>
        <Lights lights={this.state.lights} error={false} switchLight={this.switchLight.bind(this)}></Lights>
        <Fridge {...this.state.fridge}></Fridge>
        </div>
      </div>
    );
  }
}

function mapLights(data: []): ILight[] {
  return data.map((light: any) => {
    return {
      _id: light._id,
      name: light.name,
      status: parseInt(light.status),
      color: light.color
    }
  });
}

export default App;
