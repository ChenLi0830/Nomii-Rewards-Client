import {combineReducers} from 'redux';
import promoCodeReducer from './promoCode';
import inputPinReducer from './inputPin';
import appReducer from './app';
import userReducer from './user';
import createPinReducer from './createPin';
import feedbackReducer from './feedbackModal';
import {client} from './apollo';

export default combineReducers({
  apollo: client.reducer(),
  promoCode: promoCodeReducer,
  inputPin: inputPinReducer,
  app: appReducer,
  user: userReducer,
  createPIN: createPinReducer,
  feedback: feedbackReducer,
});

