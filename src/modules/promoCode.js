import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';

// Action types
const USER_CHANGE_PROMO = "USER_CHANGE_PROMO";
const USER_SUBMIT_PROMO_START = "USER_SUBMIT_PROMO_START";
const USER_SUBMIT_PROMO_FAILED = "USER_SUBMIT_PROMO_FAILED";
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

const userSubmitPromoStart = () => ({
  type: USER_SUBMIT_PROMO_START,
});

export const userSubmitPromo = () => {
  return (dispatch, getState) => {
    // dispatch(userSubmitPromoStart());
    Toast.loading('Loading...', 0);
    // Todo: add promo validation logic
    setTimeout(() => {
      Toast.hide();
      if (getState().promoCode.code === "CODE") Actions.main();
      else dispatch(submitPromoFailed("Invalid Code"))
    }, 1000);
  }
};

export const userSkipPromo = () => {
  return (dispatch) => {
    Actions.main();
  }
};

// Reducer
const initialState = {
  code: "",
  loading: false,
  message: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_CHANGE_PROMO":
      return {...state, code: action.payload, message: ""};
    case "USER_SUBMIT_PROMO_START":
      return {...state, loading: true};
    case "USER_SUBMIT_PROMO_FAILED":
      return {...state, loading: false, message: action.payload};
    default:
      return state;
  }
};

export default reducer;




