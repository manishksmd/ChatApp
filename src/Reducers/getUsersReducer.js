import { GET_USER } from "../Actions/types";

const initialState = {
    items: [],
    item: {}
};

export default function (state = initialState, action) {
    switch (action.type.user) {
        case GET_USER:
            return {
                ...state,
                items: action.payload
            }
        default:
            return state;
    }
}