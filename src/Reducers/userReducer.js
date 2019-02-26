import { USER, ALL_USER, DISCONNECTED_USER, GET_USER, ONLINE_USER } from "../Actions/types";

const initialState = {
  items: [],
  item: {},
  user: [],
  userObj: [],
  onlineUser: [],
  onlineUserName: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER:
      return {
        ...state,
        userObj: action.payload.Name
      };
    case ALL_USER:
      return {
        ...state,
        items: action.payload
      }
    case DISCONNECTED_USER:
      return {
        ...state,
        user: action.payload
      }
    case GET_USER:
      return {
        ...state,
        onlineUser: action.payload
      }
    case ONLINE_USER:
      return {
        ...state,
        onlineUserName: action.payload
      }
    default:
      return state;
  }
}
