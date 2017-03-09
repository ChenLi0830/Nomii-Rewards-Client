import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import createLogger from 'redux-logger';
import * as promoActions from './promoCode';
import * as inputPinActions from './inputPin';
import * as homeActions from './home';
import * as userActions from './user';
import {client} from './apollo';
import { composeWithDevTools } from 'remote-redux-devtools';


// const logger = createLogger();
const middleware = [
  client.middleware(),
  thunk,
  // __DEV__ && logger,
].filter(Boolean);

const store = createStore(reducer, /* preloadedState, */ composeWithDevTools(
    applyMiddleware(...middleware)
));

export default store;

export {promoActions, inputPinActions, homeActions, userActions};