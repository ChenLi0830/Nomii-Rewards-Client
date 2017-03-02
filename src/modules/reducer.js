import {combineReducers} from 'redux';
import promoCodeReducer from './promoCode';
import inputPinReducer from './inputPin';

export default combineReducers({
  promoCode: promoCodeReducer,
  inputPin: inputPinReducer,
});

