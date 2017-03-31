import React from 'react';
import {Amplitude, Asset, AppLoading} from 'expo';
import {AsyncStorage, Text} from 'react-native';
import App from './App';
import {Toast} from 'antd-mobile';
import config from '../exp.json';

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
        this.initAmplitude(),
      ];

      const result = await Promise.all(promises);

      // console.log("Promise all result", result);

      this.setState({
        fbUser: result[0],
        isReady: true,
      });
    })()
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
        <App fbUser={this.state.fbUser} />
    );
  }

  async initAmplitude() {
    switch (config.slug) {
      case "nomii-rewards-exponentjs":
        const apiKey = '803bfb08c172b8c368784b020106cfd7' // production
        break;
      default:
        const apiKey = 'c0e8baedac6e93c09a242c7efeedcf68' // staging
        break;
    }

    await Amplitude.initialize(apiKey)
  }

  async _cacheResourcesAsync() {
    const images = [
      require('../public/images/1st-circle-check.png'),
      require('../public/images/too-far-icon.png'),
      require('../public/images/big-check.png'),
      require('../public/images/promo.png'),
      require('../public/images/insight-icon.png'),
      require('../public/images/card-icons-onboarding.png'),
      require('../public/images/nomii-offers-login.png'),
      require('../public/images/Hand-over-icon-onboarding.png'),
      require('../public/images/reward-icon-onboarding.png'),
      require('../public/images/slogan.png'),
      require('../public/images/circle-empty-highlight 2.png'),
      require('../public/images/Home-empty-screen-card.png'),
      require('../public/images/down-arrow.png'),
      require('../public/images/DEALS2.png'),
      require('../public/images/Promocode-placeholder.png'),
      require('../public/images/Location-services-icon.png'),
      require('../public/images/card-screens/1st-circle-check.png'),
      require('../public/images/card-screens/2nd-circle-5-percent-red.png'),
      require('../public/images/card-screens/2nd-circle-5-percent-teal.png'),
      require('../public/images/card-screens/2nd-circle-5-percent.png'),
      require('../public/images/card-screens/3rd-circle-orange.png'),
      require('../public/images/card-screens/3rd-circle-teal.png'),
      require('../public/images/card-screens/3rd-circle.png'),
      require('../public/images/card-screens/circle-empty-highlight-orange.png'),
      require('../public/images/card-screens/circle-empty-highlight-red.png'),
      require('../public/images/card-screens/circle-empty-highlight-teal.png'),
      require('../public/images/card-screens/circle-1 check.png'),
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
        // console.log(token, expires);

        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const result = await response.json();

        if (result.error) return null;
        else return {...result, token: token};// result is user with token
      }
    }
    catch (err) {
      console.log("err", err);
      Toast.fail("Something is wrong\nPlease try again", 2);
    }
  }
}

export default AppPreloading;
