import React from 'react';
import {Asset, Components} from 'exponent';
import {AsyncStorage} from 'react-native';
import App from './App';

class AppPreloading extends React.Component {
  state = {
    isReady: false,
    fbUser: undefined,
  };
  
  componentWillMount() {
    (async ()=>{
      const promises = [
        this.fetchUser(),
        this._cacheResourcesAsync(),
      ];
  
      const result = await Promise.all(promises);
      
      console.log("Promise all result", result);
      
      this.setState({
        fbUser: result[0],
        isReady: true,
      });
    })()
  }
  
  render() {
    if (!this.state.isReady) {
      return <Components.AppLoading />;
    }
    
    return (
        <App fbUser={this.state.fbUser} />
    );
  }
  
  async _cacheResourcesAsync() {
    const images = [
      require('../public/images/1st-circle-check.png'),
      require('../public/images/big-check.png'),
      require('../public/images/promo.png'),
      require('../public/images/insight-icon.png'),
      require('../public/images/card-icons-onboarding.png'),
      require('../public/images/nomii-offers-login.png'),
      require('../public/images/Hand-over-icon-onboarding.png'),
      require('../public/images/reward-icon-onboarding.png'),
      require('../public/images/slogan.png'),
    ];
    for (let image of images) {
      await Asset.fromModule(image).downloadAsync();
    }
    return true;
  }
  
  async fetchUser() {
    try {
      // await AsyncStorage.removeItem("@NomiiStore:token");
      const value = await AsyncStorage.getItem("@NomiiStore:token");
      if (value !== null) {// Found token
        // console.log(value);
        const {token, expires} = JSON.parse(value);
        console.log(token, expires);
        
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const result = await response.json();
        
        if (result.error) return null;
        else return result;// result is user
      }
    }
    catch (err) {
      console.log("err", err);
    }
  }
}

export default AppPreloading;