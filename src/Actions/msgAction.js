import { SEND_MSG, NEW_MSG, FILE_DOWNLOAD, FILE_UPLOAD, READ_USER } from './types';
import { socket } from '../index';

export const sendMsg = (msg) => dispatch => {
    socket.emit('SEND_MSG',msg);
    dispatch({
        type: SEND_MSG,
        payload: msg
    })
}

export const getMsg = () => dispatch => {
    socket.on('NEW_MSG', function (msgs) {
        dispatch({
            type: NEW_MSG,
            payload: msgs
        })
    });
}

export const sendFile = (fileData) => dispatch => {
    socket.emit('FILE_UPLOAD',fileData);
    dispatch({
        type: FILE_UPLOAD,
        payload: fileData
    })
}

export const getFile = () => dispatch => {
    socket.on('FILE_DOWNLOAD', function (file) {
        dispatch({
            type: FILE_DOWNLOAD,
            payload: file
        })
    });
}

export const getReadReceipt = () => dispatch => {
    socket.on('READ_USER', function (readReceipt) {
        dispatch({
            type: READ_USER,
            payload: readReceipt
        })
    });
}

