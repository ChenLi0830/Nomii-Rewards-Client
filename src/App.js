import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {client} from './modules/apollo';
import store from './modules';
import RouterWrapper from './RouterWrapper';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';

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

class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    // Amplitude.logEvent('App opened');
    return <ApolloProvider store={store} client={client}>
      <RouterWrapper fbUser={this.props.fbUser}/>
    </ApolloProvider>;
  }
}

export default App;
