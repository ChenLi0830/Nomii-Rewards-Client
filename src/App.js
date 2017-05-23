import React, {Component} from 'react';
import {StatusBar, AsyncStorage} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {client} from './modules/apollo';
import store from './modules';
import RouterWrapper from './RouterWrapper';
import {setCustomText, setCustomTextInput} from 'react-native-global-props';
import {persistStore} from 'redux-persist';
import {Loading} from './components/common';

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
  
  state = { rehydrated: false };
  
  componentWillMount(){
    persistStore(
        store,
        {
          storage: AsyncStorage,
          whitelist: ['apollo', 'user',]
        },
        () => {
          console.log("this.setState({ rehydrated: true })");
          this.setState({ rehydrated: true })
        }
    );
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
