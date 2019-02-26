import React, { Component } from 'react';
import './App.css';
import Login from './Components/login';
import {
  BrowserRouter as Router,
  Redirect,
  Route
} from 'react-router-dom';
import ChatUI from './Components/chatUI';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
  )} />
)

export const fakeAuth = {
  isAuthenticated: false,
  authenticate(data) {
    this.isAuthenticated = true
    setTimeout(data, 100)
  },
  signout(data) {
    this.isAuthenticated = false
    setTimeout(data, 100)
  }
}

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <Router>
          <div>
            <Route path='/' exact component={Login} />
            <PrivateRoute path='/chat' component={ChatUI} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
