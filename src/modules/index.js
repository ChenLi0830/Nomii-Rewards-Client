import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';
import createLogger from 'redux-logger';
import * as promoActions from './promoCode';
import * as inputPinActions from './inputPin';
import * as homeActions from './home';
import * as cardListActions from './cardList';

const logger = createLogger();

const middleware = [
  thunk,
  __DEV__ && logger,
].filter(Boolean);

const store = createStore(reducer, applyMiddleware(...middleware));

export default store;

export {promoActions, inputPinActions, homeActions, cardListActions};