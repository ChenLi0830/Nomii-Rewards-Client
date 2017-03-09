import {combineReducers} from 'redux';
import promoCodeReducer from './promoCode';
import inputPinReducer from './inputPin';
import homeReducer from './home';
import {client} from './apollo';

export default combineReducers({
  apollo: client.reducer(),
  promoCode: promoCodeReducer,
  inputPin: inputPinReducer,
  home: homeReducer,
});

