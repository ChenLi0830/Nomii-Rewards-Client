import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';

// Action types
const UPDATE_USER_ID = "UPDATE_USER_ID";

// Action creator
export const updateUserId = (userId) => ({
  type: UPDATE_USER_ID,
  payload: userId,
});

// Reducer
const initialState = {
  id: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_USER_ID":
      return {...state, id: String(action.payload)};
    default:
      return state;
  }
};

export default reducer;




