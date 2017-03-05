import {combineReducers} from 'redux';
import promoCodeReducer from './promoCode';
import inputPinReducer from './inputPin';
import homeReducer from './home';

export default combineReducers({
  promoCode: promoCodeReducer,
  inputPin: inputPinReducer,
  home: homeReducer,
});

