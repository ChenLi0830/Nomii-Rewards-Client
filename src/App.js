import React, {Component} from 'react';
import {AsyncStorage, Platform, StatusBar} from 'react-native';
import Router from './Router';
// import {Provider} from 'react-redux';
import {ApolloProvider} from 'react-apollo';
import {client} from './modules/apollo';
import store from './modules';
import RouterWrapper from './RouterWrapper';
import {Amplitude} from 'expo';

import {setCustomText, setCustomTextInput} from 'react-native-global-props';

// Set global fonts for Text component
const customTextProps = {
  style: {
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  }
};
const customTextInputProps = {
  style: {
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  }
};

// Remove console.log from production app
if (!__DEV__) {
  console.log = () => {};
}

setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);
StatusBar.setBarStyle('dark-content', true);

class App extends Component {
  constructor(props){
    // console.log("App props", props);
    super(props);
  }

  render() {
    // Amplitude.logEvent('App opened');

    // console.log("App this.props.fbUser", this.props.fbUser);
    return <ApolloProvider store={store} client={client}>
      <RouterWrapper fbUser={this.props.fbUser}/>
    </ApolloProvider>;
  }
}

export default App;
