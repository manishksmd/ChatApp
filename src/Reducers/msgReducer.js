import { NEW_MSG, FILE_DOWNLOAD, READ_USER } from "../Actions/types";

const initialState = {
    items: [],
    item: {},
    chat: [],
    filedata: [],
    readreceipt: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case NEW_MSG:
            return {
                ...state,
                chat: action.payload
            }
        case FILE_DOWNLOAD:
            return {
                ...state,
                filedata: action.payload
            }
        case READ_USER:
            return {
                ...state,
                readreceipt: action.payload
            }
        default:
            return state;
    }
}