import React from 'react';
import {Amplitude, Asset, AppLoading} from 'expo';
import {AsyncStorage, Text} from 'react-native';
import App from './App';
import {Toast} from 'antd-mobile';
import config from '../exp.json';
import { Font } from 'expo';
import {branch, compose, lifecycle, withHandlers, pure, renderComponent} from 'recompose';
import {getPromiseTime} from './components/api';

/**
 * Purpose of this component: initialize APP - fetchUser, PreloadAssets and initAmplitude
 * */
const AppPreloading = (props) => {
  // console.log("props", props);
  return (
      <App fbUser={props.fbUser} />
  );
};

export default compose(
    withHandlers({
      initAmplitude: props => async () => {
        let apiKey;
        switch (config.slug) {
          case "nomii-rewards-exponentjs":
            apiKey = '803bfb08c172b8c368784b020106cfd7' // production
            break;
          default:
            apiKey = 'c0e8baedac6e93c09a242c7efeedcf68' // staging
            break;
        }
  
        await Amplitude.initialize(apiKey);
        Amplitude.logEvent("Open Nomii Rewards");
      },
      cacheResourcesAsync: props => async () => {
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
        await Font.loadAsync({
          'Avenir Next': require('../public/fonts/avenir-next-regular.ttf'),
        });
        return true;
      },
      fetchUser: props => async ()=>{
        try {
          // await AsyncStorage.removeItem("@NomiiStore:token");
          const value = await AsyncStorage.getItem("@NomiiStore:token");
          if (value !== null) {// Found token
            const {token, expires} = JSON.parse(value);
        
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            const result = await response.json();
        
            if (result.error) {
              Amplitude.logEventWithProperties("login user with stored token - fail", {error: result.error});
              return null;
            }
            else {
              await Amplitude.setUserId(result.id);
              Amplitude.logEvent("login user with stored token - success");
              return {...result, token: token};// result is user with token
            }
          }
        }
        catch (err) {
          console.log("err", err);
          Amplitude.logEvent("Something went wrong (most likely network issue)");
          Toast.offline("Bad Internet\nconnection", 2);
        }
      },
      initAppVariables: props => async () => {
        // Use @NomiiStore:showFeedback to track if modal is shown when app is launched
        await AsyncStorage.setItem("@NomiiStore:showFeedback", JSON.stringify(true));
      },
    }),
    lifecycle({
      async componentWillMount(){
        const result = await Promise.all([
          getPromiseTime(this.props.fetchUser(), "fetchUser"),
          getPromiseTime(this.props.cacheResourcesAsync(), "cacheResourcesAsync"),
          getPromiseTime(this.props.initAmplitude(), "initAmplitude"),
          getPromiseTime(this.props.initAppVariables(), "initAppVariables"),
        ]);
  
        this.setState({
          fbUser: result[0],
          isReady: true,
        });
      }
    }),
    branch(
        props => !props.isReady,
        renderComponent(AppLoading),
    ),
    pure,
)(AppPreloading);
