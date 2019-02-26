import { combineReducers } from "redux";
import userReducer from './userReducer';
import getUsersReducer from './getUsersReducer';
import alreadyUserReducer from "./alreadyUserReducer";
import msgReducer from './msgReducer';
import userTypingReducer from "./userTypingReducer";

export default combineReducers({
    user : userReducer,
    users : getUsersReducer,
    allUsers : userReducer,
    alreadyUsers: alreadyUserReducer,
    msgs : msgReducer,
    userTypingData : userTypingReducer,
    disconnected : userReducer,
});