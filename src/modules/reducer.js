import {combineReducers} from 'redux';
import promoCodeReducer from './promoCode';

export default combineReducers({
  promoCode: promoCodeReducer,
});