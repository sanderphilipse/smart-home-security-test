import React from 'react';
import './App.css';
import Lights from './Lights/Lights';
import Login from './Login/Login';
import getHeaders from './utils/headers';

interface AppState {
  user: {
    _id: string;
    uid: string;
    username: string;
    name: string;
  }
}

class App extends React.Component {
  public state: AppState = {
    user: {
      _id: '',
      uid: '',
      username: '',
      name: ''
    }
  };

  componentDidMount() {
    fetch('http://localhost:8080/user', { headers: getHeaders() })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error();
        }
      })
      .then(data => this.setState({ user: data}))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Login name={this.state.user.name}></Login>
          <Lights></Lights>
        </header>
      </div>
    );
  }
}

export default App;
