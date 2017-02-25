import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';
import createLogger from 'redux-logger';


// console.log("reducer", reducer);
// console.log("AuthActions", AuthActions);

const DEBUG = true;

const logger = createLogger();

const middleware = [
  thunk,
  DEBUG && logger,
].filter(Boolean);

const store = createStore(reducer, applyMiddleware(...middleware));

export default store;

export {};