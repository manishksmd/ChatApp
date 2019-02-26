import {  ALREADY_USER } from "../Actions/types";

const initialState = {
  items: [],
  item: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
      case ALREADY_USER:
        return{
          ...state,
          item: action.payload.user
        }
    default:
      return state;
  }
}
