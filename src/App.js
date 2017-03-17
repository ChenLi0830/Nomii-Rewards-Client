import React, {Component} from 'react';
import {AsyncStorage, Platform, StatusBar} from 'react-native';
import Router from './Router';
// import {Provider} from 'react-redux';
import {ApolloProvider} from 'react-apollo';
import {client} from './modules/apollo';
import store from './modules';
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

setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);
StatusBar.setBarStyle('dark-content', true);

class App extends Component {
  constructor(props){
    super(props);
  }
  
  render() {
    // console.log("App this.props.fbUser", this.props.fbUser);
    return <ApolloProvider store={store} client={client}>
      <Router fbUser={this.props.fbUser}/>
    </ApolloProvider>;
  }
}

export default App;