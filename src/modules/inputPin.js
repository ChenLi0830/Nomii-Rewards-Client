// Action types
const USER_CHANGE_PIN = "USER_CHANGE_PIN";
const USER_SUBMIT_PIN_START = "USER_SUBMIT_PIN_START";
const USER_SUBMIT_PIN_FAILED = "USER_SUBMIT_PIN_FAILED";
const USER_SUBMIT_PIN_SUCCESS = "USER_SUBMIT_PIN_SUCCESS";
const USER_ENTER_PIN_SCREEN = "USER_ENTER_PIN_SCREEN";
const USER_TOGGLE_MODAL_VISIBILITY = "USER_TOGGLE_MODAL_VISIBILITY";

// Action creator
export const changePin = (pin) => ({
  type: USER_CHANGE_PIN,
  payload: pin,
});

export const submitPinFailed = (message) => ({
  type: USER_SUBMIT_PIN_FAILED,
  payload: message,
});

export const submitPinSuccess = () => ({
  type: USER_SUBMIT_PIN_SUCCESS,
});

export const userEnterScreen = () => ({
  type: USER_ENTER_PIN_SCREEN,
});

export const toggleModal = () => ({
  type: USER_TOGGLE_MODAL_VISIBILITY,
});

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
    case "USER_ENTER_PIN_SCREEN":
      return initialState;
    case "USER_TOGGLE_MODAL_VISIBILITY":
      return {...state, showModal: !state.showModal};
    default:
      return state;
  }
};

export default reducer;




