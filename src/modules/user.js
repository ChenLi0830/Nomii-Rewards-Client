import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';

// Action types
const UPDATE_USER_ID = "UPDATE_USER_ID";
const UPDATE_USER_LOCATION = "UPDATE_USER_LOCATION";

// Action creator
export const updateUserId = (userId) => ({
  type: UPDATE_USER_ID,
  payload: userId,
});

export const updateUserLocation = (location) => ({
  type: UPDATE_USER_LOCATION,
  payload: location,
});

// Reducer
const initialState = {
  id: null,
  location: null,
  // id: "1088303924608072",
  // id: 101,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_USER_ID":
      return {...state, id: String(action.payload)};
    case "UPDATE_USER_LOCATION":
      return {...state, location: action.payload};
    default:
      return state;
  }
};

export default reducer;




