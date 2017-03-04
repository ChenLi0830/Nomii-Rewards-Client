import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';


// Action types
const USER_CHANGE_PIN = "USER_CHANGE_PIN";
const USER_SUBMIT_PIN_START = "USER_SUBMIT_PIN_START";
const USER_SUBMIT_PIN_FAILED = "USER_SUBMIT_PIN_FAILED";
const USER_SUBMIT_PIN_SUCCESS = "USER_SUBMIT_PIN_SUCCESS";
const USER_TOGGLE_MODAL_VISIBILITY = "USER_TOGGLE_MODAL_VISIBILITY";

// Action creator
export const changePin = (pin) => ({
  type: USER_CHANGE_PIN,
  payload: pin,
});

const submitPinFailed = (message) => ({
  type: USER_SUBMIT_PIN_FAILED,
  payload: message,
});

const submitPinSuccess = () => ({
  type: USER_SUBMIT_PIN_SUCCESS,
});

export const toggleModal = () => ({
  type: USER_TOGGLE_MODAL_VISIBILITY,
});

export const userSubmitPin = (card) => {
  return (dispatch, getState) => {
    Toast.loading('Loading...', 0);
    // Todo: add pin validation logic
    setTimeout(() => {
      Toast.hide();
      if (getState().inputPin.pin === "2587") {
        // console.warn("success");
        dispatch(submitPinSuccess());
        dismissKeyboard();
        setTimeout(()=>{
          Actions.reward({progress: card.progress});
        }, 100);
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
  showModal: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_CHANGE_PIN":
      return {...state, pin: action.payload, message: ""};
    case "USER_SUBMIT_PIN_FAILED":
      return {...state, pin: "", message: action.payload};
    case "USER_SUBMIT_PIN_SUCCESS":
      return {...state, pin: ""};
    case "USER_TOGGLE_MODAL_VISIBILITY":
      return {...state, showModal: !state.showModal};
    default:
      return state;
  }
};

export default reducer;



