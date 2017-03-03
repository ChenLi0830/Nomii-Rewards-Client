import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';


// Action types
const USER_CHANGE_PROMO = "USER_CHANGE_PROMO";
const USER_SUBMIT_PROMO_START = "USER_SUBMIT_PROMO_START";
const USER_SUBMIT_PROMO_FAILED = "USER_SUBMIT_PROMO_FAILED";
const USER_CHANGED_SCREEN = "USER_CHANGED_SCREEN";
// const LOADING_STOP = "LOADING_STOP";
// const USER_SUBMIT_PROMO = "USER_SUBMIT_PROMO";
// const USER_SKIP_PROMO = "USER_SKIP_PROMO";

// Action creator
export const userChangePromo = (newPromo) => ({
  type: USER_CHANGE_PROMO,
  payload: newPromo,
});

const submitPromoFailed = (message) => ({
  type: USER_SUBMIT_PROMO_FAILED,
  payload: message,
});

const userChangedScreen = () => ({
  type: USER_CHANGED_SCREEN,
});

// const userSubmitPromoStart = () => ({
//   type: USER_SUBMIT_PROMO_START,
// });

export const userSubmitPromo = () => {
  return (dispatch, getState) => {
    // dispatch(userSubmitPromoStart());
    Toast.loading('Loading...', 0);
    // Todo: add promo validation logic
    setTimeout(() => {
      Toast.hide();
      if (getState().promoCode.code === "code") {
        dismissKeyboard();
        Actions.promoSuccess();
        dispatch(userChangedScreen());
      }
      else dispatch(submitPromoFailed("Invalid Code"));
    }, 1000);
  }
};

export const userSkipPromo = () => {
  return (dispatch) => {
    dismissKeyboard();
    setTimeout(() => {
      Actions.home();
      dispatch(userChangedScreen());
    },300)}
};

// Reducer
const initialState = {
  code: "",
  message: "",
  // loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_CHANGE_PROMO":
      return {...state, code: action.payload, message: ""};
    // case "USER_SUBMIT_PROMO_START":
    //   return {...state, loading: true};
    case "USER_SUBMIT_PROMO_FAILED":
      return {...state, code: "", message: action.payload};
    case "USER_CHANGED_SCREEN":
      return {...initialState};
    default:
      return state;
  }
};

export default reducer;




