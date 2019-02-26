import { USER_TYPING } from './types';
import { socket } from '../index';

export const userTyping = () => dispatch => {
    socket.emit('TYPING');
}
export const typingUserName = () => dispatch => {
    socket.on('USER_TYPING', function (data) {
        dispatch({
            type: USER_TYPING,
            payload: data
        })
    });
}