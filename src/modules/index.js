import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';
import * as promoActions from './promoCode';
import * as inputPinActions from './inputPin';
import * as appActions from './app';
import * as userActions from './user';
import * as createPinActions from './createPin';
import {client} from './apollo';
import {composeWithDevTools} from 'remote-redux-devtools';

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

export {promoActions, inputPinActions, appActions, userActions, createPinActions};