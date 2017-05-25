import React from 'react';
import {StatusBar, AsyncStorage} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {client} from './modules/apollo';
import store from './modules';
import RouterWrapper from './RouterWrapper';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import {persistStore} from 'redux-persist';
import {AppLoading} from 'expo';
import {getPromiseTime} from './components/api';
import {compose, withHandlers, withState, lifecycle, renderComponent, branch} from 'recompose';

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

const App = (props) => {
  return <ApolloProvider store={store} client={client}>
    <RouterWrapper fbUser={props.fbUser}/>
  </ApolloProvider>;
};

export default compose(
    withState('rehydrated', 'updateRehydrated', false),
    withHandlers({
      rehydrateReduxStore: props => async() => {
        try {
          await persistStore(
              store,
              {
                storage: AsyncStorage,
                whitelist: ['user',],
                debounce: 2000,
              }
          )
        } catch (error) {
          console.log("rehydrateStore error", error);
        }
      }
    }),
    lifecycle({
      async componentWillMount(){
        await getPromiseTime(this.props.rehydrateReduxStore(), "rehydrateReduxStore");
        this.props.updateRehydrated(true);
      },
    }),
    branch(
        props => !props.rehydrated,
        renderComponent(AppLoading),
    ),
)(App);
