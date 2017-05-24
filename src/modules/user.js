import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';

// Action types
const UPDATE_USER_ID = "UPDATE_USER_ID";
const UPDATE_USER = "UPDATE_USER";
const INIT_USER = "INIT_USER";
const UPDATE_USER_LOCATION = "UPDATE_USER_LOCATION";
const UPDATE_USER_PUSH_TOKEN = "UPDATE_USER_PUSH_TOKEN";

// Action creator
export const updateUserId = (userId) => ({
  type: UPDATE_USER_ID,
  payload: userId,
});

export const updateUser = (newFields) => ({
  type: UPDATE_USER,
  payload: newFields,
});

export const initUser = () => ({
  type: INIT_USER,
});

export const updateUserLocation = (location) => ({
  type: UPDATE_USER_LOCATION,
  payload: location,
});

export const updateUserPushToken = (pushToken) => ({
  type: UPDATE_USER_PUSH_TOKEN,
  payload: pushToken,
});


// Reducer
const initialState = {
  id: null,
  location: null,
  locationPermissionAsked: false,
  notificationPermissionAsked: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_USER_ID":
      return {...state, id: String(action.payload)};
    case "UPDATE_USER_LOCATION":
      return {...state, location: action.payload};
    case "UPDATE_USER":
      // console.log("new user", {...state, ...action.payload});
      return {...state, ...action.payload};
    case "UPDATE_USER_PUSH_TOKEN":
      return {...state, pushToken: action.payload};
    case "INIT_USER":
      return initialState;
    default:
      return state;
  }
};

export default reducer;




