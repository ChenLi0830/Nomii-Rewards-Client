import React from 'react';
import {StatusBar, AsyncStorage} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {client} from './modules/apollo';
import store from './modules';
import RouterWrapper from './RouterWrapper';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import {persistStore} from 'redux-persist';
import {AppLoading} from './components/common';
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
    <RouterWrapper/>
  </ApolloProvider>;
};

export default compose(
    withState('rehydrated', 'updateRehydrated', false),
    withHandlers({
      rehydrateReduxStore: props => () => {
        persistStore(
            store,
            {
              storage: AsyncStorage,
              whitelist: ['user'],
              // debounce: 2000,
            },
            () => props.updateRehydrated(true)
        )
      }
    }),
    lifecycle({
      componentWillMount(){
        this.props.rehydrateReduxStore()
      },
    }),
    branch(
        props => !props.rehydrated,
        renderComponent(AppLoading),
    ),
)(App);
