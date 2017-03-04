import React, {Component} from 'react';
import {Platform} from 'react-native';
import Router from './Router';
import {Provider} from 'react-redux';
import store from './modules';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';

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

class App extends Component {

  render() {
    return <Provider store={store}>
      <Router/>
    </Provider>;
  }
}

export default App;