import { USER_TYPING } from "../Actions/types";

const initialState = {
  items: [],
  item: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_TYPING:
      return {
        ...state,
        items: action.payload
      };
    default:
      return state;
  }
}
