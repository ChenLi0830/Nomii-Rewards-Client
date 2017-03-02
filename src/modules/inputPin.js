import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';


// Action types
const USER_CHANGE_PIN = "USER_CHANGE_PIN";
const USER_SUBMIT_PIN_START = "USER_SUBMIT_PIN_START";
const USER_SUBMIT_PIN_FAILED = "USER_SUBMIT_PIN_FAILED";

// Action creator
export const changePin = (pin) => ({
  type: USER_CHANGE_PIN,
  payload: pin,
});

const submitPinFailed = (message) => ({
  type: USER_SUBMIT_PIN_FAILED,
  payload: message,
});


export const userSubmitPin = () => {
  return (dispatch, getState) => {
    Toast.loading('Loading...', 0);
    // Todo: add pin validation logic
    setTimeout(() => {
      Toast.hide();
      if (getState().inputPin.pin === "2587") {
        console.warn("success");
        //Actions.promoSuccess();
        dismissKeyboard();
      }
      else dispatch(submitPinFailed("Invalid Pin"));
    }, 500);
  }
};

// Reducer
const initialState = {
  pin: "",
  // loading: false,
  message: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_CHANGE_PIN":
      return {...state, pin: action.payload, message: ""};
    case "USER_SUBMIT_PIN_FAILED":
      return {...state, pin: "", message: action.payload};
    default:
      return state;
  }
};

export default reducer;




