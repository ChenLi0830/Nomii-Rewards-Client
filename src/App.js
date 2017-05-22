import React, {Component} from 'react';
import {StatusBar, AsyncStorage} from 'react-native';
import {ApolloProvider} from 'react-apollo';
// import {client} from './modules/apollo';
// import store from './modules';
import RouterWrapper from './RouterWrapper';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import {persistStore} from 'redux-persist';
import {Loading} from './components/common';
import config from '../exp.json';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import { getStoredState, createPersistor } from 'redux-persist'
import {createStore, applyMiddleware, combineReducers} from 'redux';
import promoCodeReducer from './modules/promoCode';
import inputPinReducer from './modules/inputPin';
import appReducer from './modules/app';
import userReducer from './modules/user';
import createPinReducer from './modules/createPin';
import feedbackReducer from './modules/feedbackModal';
import {composeWithDevTools} from 'remote-redux-devtools';
import thunk from 'redux-thunk';

// Set global fonts for Text component
const customTextProps = {
  style: {
    fontFamily: 'Avenir Next',
    // fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  }
};

const customTextInputProps = {
  style: {
    fontFamily: 'Avenir Next',
  }
};

// Remove console.log from production app
if (!__DEV__) {
  console.log = () => {
  };
}

setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);
StatusBar.setBarStyle('dark-content', true);

let store, client;

class App extends Component {
  constructor(props) {
    super(props);
  }
  
  state = { rehydrated: false };
  
  componentWillMount(){
  
    let uri;
    switch (config.slug){
      case "nomii-rewards-exponentjs-dev":
        uri = "http://192.168.0.14:4000/graphql"; //The LAN IP address where GraphQL is hosted
        break;
      case "nomii-rewards-exponentjs-staging":
        uri = "https://aq9i785i63.execute-api.us-west-2.amazonaws.com/staging/graphql";
        break;
      case "nomii-rewards-exponentjs":
        uri = "https://bnbs6szfk8.execute-api.us-west-2.amazonaws.com/dev/graphql";
        break;
    }
  
    const networkInterface = createNetworkInterface({
      uri: uri,
      opts: {
        //The "same-origin" value makes query behave similarly to
        // XMLHttpRequest with regards to cookies. Otherwise, cookies won't get sent, resulting in these
        // requests not preserving the authentication session.
        credentials: "same-origin",
      }
    });
  
    getStoredState({ storage: AsyncStorage }, (error, rehydratedState) => {
      client = new ApolloClient({
        networkInterface: networkInterface,
        dataIdFromObject: o => o.id,
        initialState: { apollo: { data: rehydratedState.apollo.data }},
      });
  
      console.log("rehydratedState.apollo.data", rehydratedState.apollo.data);
      
      const middleware = [
        client.middleware(),
        // __DEV__ && logger,
        thunk,
      ].filter(Boolean);
  
      store = createStore(
          combineReducers({
            apollo: client.reducer(),
            promoCode: promoCodeReducer,
            inputPin: inputPinReducer,
            app: appReducer,
            user: userReducer,
            createPIN: createPinReducer,
            feedback: feedbackReducer,
          }),
          // undefined, //preloadedState
          composeWithDevTools(
              applyMiddleware(...middleware),
              // autoRehydrate(),
          )
      );
  
      let persistor = createPersistor(store, { storage: AsyncStorage });
      
      this.setState({rehydrated: true});
    });
  
    
  
    // persistStore(
    //     store,
    //     {
    //       storage: AsyncStorage,
    //       whitelist: ['apollo.data']
    //     },
    //     () => {
    //       console.log("this.setState({ rehydrated: true })");
    //       this.setState({ rehydrated: true })
    //     }
    // );
  }
  
  render() {
    if (!this.state.rehydrated) return <Loading/>;
  
    // Amplitude.logEvent('App opened');
    return <ApolloProvider store={store} client={client}>
      <RouterWrapper fbUser={this.props.fbUser}/>
    </ApolloProvider>;
  }
}

export default App;
