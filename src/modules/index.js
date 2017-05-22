// import thunk from 'redux-thunk';
// import {createStore, applyMiddleware} from 'redux';
// import reducer from './reducer';
import * as promoActions from './promoCode';
import * as inputPinActions from './inputPin';
import * as appActions from './app';
import * as userActions from './user';
import * as createPinActions from './createPin';
import * as feedbackActions from './feedbackModal';
// import {getClient} from './apollo';
// import {composeWithDevTools} from 'remote-redux-devtools';
// import logger from 'redux-logger'
// import {autoRehydrate, persistStore, createPersistor} from 'redux-persist';
// import {AsyncStorage} from 'react-native';

// const client = getClient();
//
// // const logger = createLogger();
// const middleware = [
//   client.middleware(),
//   // __DEV__ && logger,
//   thunk,
// ].filter(Boolean);
//
// const store = createStore(
//     reducer,
//     // undefined, //preloadedState
//     composeWithDevTools(
//       applyMiddleware(...middleware),
//       // autoRehydrate(),
//     )
// );
//
// // persistent storage
// // persistStore(store, {storage: AsyncStorage});
//
// let persistor = createPersistor(store, { storage: AsyncStorage });
//
// export default store;

export {promoActions, inputPinActions, appActions, userActions, createPinActions, feedbackActions};