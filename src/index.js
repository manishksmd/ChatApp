import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './Reducers';
import { Provider } from 'react-redux';
import socketIOClient from 'socket.io-client';

const initialState = {};
const middleware = [thunk];
const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware)
    )
)
const port = process.env.PORT || 5000;
export const socket = socketIOClient('http://10.0.1.92:'+port)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
document.getElementById('root'));

