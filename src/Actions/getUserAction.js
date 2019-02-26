import { GET_USER } from './types';
import { socket } from '..';

export const getUsers = () => dispatch => {
    socket.on('GET_USER', function (data) {
        dispatch({
            type: GET_USER,
            payload: data
        })
    });
}