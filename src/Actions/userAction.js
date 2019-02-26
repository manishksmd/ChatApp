import { USER, ALREADY_USER, ALL_USER, DISCONNECTED_USER, ONLINE_USER } from './types';
import { socket } from '../index';

export const addUser = (user) => dispatch => {
    socket.emit('NEW_USER', user);
    dispatch({
        type: USER,
        payload: user
    })
}

export const alreadyUsers = () => dispatch => {
    socket.on('ALREADY_USER', function (allUsers) {
        dispatch({
            type: ALREADY_USER,
            payload: allUsers
        })
    });
}

export const getAllUsers = () => dispatch => {
    socket.on('GET_USER', function (allUsers) {
        dispatch({
            type: ALL_USER,
            payload: allUsers
        })
    });
}

export const disConnctedUser = () => dispatch => {
    socket.on('DISCONNECTED_USER', function (userName) {
        dispatch({
            type: DISCONNECTED_USER,
            payload: userName
        })
    });
}
export const getOnlineUsers = () => dispatch =>{
    socket.on('ONLINE_USER', function (onlineUsers) {
        dispatch({
            type: ONLINE_USER,
            payload: onlineUsers
        })
    });
}