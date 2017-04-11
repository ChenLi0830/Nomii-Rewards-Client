import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';
import {getUserQuery} from '../graphql/user';

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

export const submitPromoFailed = (message) => ({
  type: USER_SUBMIT_PROMO_FAILED,
  payload: message,
});

export const userChangedScreen = () => ({
  type: USER_CHANGED_SCREEN,
});

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




