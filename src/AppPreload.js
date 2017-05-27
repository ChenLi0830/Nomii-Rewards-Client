import React from 'react';
import {Amplitude, Asset} from 'expo';
import {AsyncStorage, Text} from 'react-native';
import App from './App';
import {Toast} from 'antd-mobile';
import config from '../exp.json';
import { Font } from 'expo';
import {branch, compose, lifecycle, withHandlers, pure, renderComponent} from 'recompose';
import {getPromiseTime} from './components/api';
import {AppLoading} from './components/common';
import Sentry from 'sentry-expo';

/**
 * Purpose of this component: initialize APP - fetchUser, PreloadAssets and initAmplitude
 * */
const AppPreloading = (props) => {
  return (
      <App/>
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
      /**
       * Config Sentry - crash/fatal JS report
       * */
      initSentry: props => async () => {
        let publicDNS;
        switch (config.slug) {
          case "nomii-rewards-exponentjs":
            publicDNS = 'https://b09bb6294d254b009ba84d60ed5881b3@sentry.io/172874'; // production
            break;
          default:
            publicDNS = 'https://3e2474e12651427396d9ef1c0a79261e@sentry.io/172872'; // staging
            break;
        }
        
        Sentry.config(publicDNS).install();
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
      initAppVariables: props => async () => {
        // Use @NomiiStore:showFeedback to track if modal is shown when app is launched
        await AsyncStorage.setItem("@NomiiStore:showFeedback", JSON.stringify(true));
      },
    }),
    lifecycle({
      async componentWillMount(){
        const result = await Promise.all([
          getPromiseTime(this.props.cacheResourcesAsync(), "cacheResourcesAsync"),
          getPromiseTime(this.props.initAmplitude(), "initAmplitude"),
          getPromiseTime(this.props.initAppVariables(), "initAppVariables"),
          getPromiseTime(this.props.initSentry(), "initSentry"),
        ]);
  
        this.setState({
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
