import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import Main from './components/Main';
import Swiper from './components/Swiper';
import AddCards from './components/AddCards';
import CardList from './components/CardList';
// import PanAnimation from './components/animations/PanAnimation';
import AnimatableExample from './components/animations/AnimatableExample';
import LottieAnimatedExample from './components/animations/lottie/LottieAnimatedExample';
import SimpleExample from './components/animations/lottie/SimpleExample';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: (Platform.OS === 'ios') ? 0 : 50,
  }
});

console.log("This should be shown in exponent XDE");

const RouterComponent = () => {
  return <Router hideNavBar={Platform.OS !== 'ios'}>
    <Scene key="auth" initial>
      <Scene key="animated" component={AnimatableExample} hideNavBar/>
      <Scene key="login" component={Main} title="Login" hideNavBar/>
      <Scene key="lottie" component = {LottieAnimatedExample} initial hideNavBar/>
    </Scene>
  
    <Scene key="intro" component={Swiper} hideNavBar/>
    
    <Scene key="main">
      <Scene key="home" sceneStyle={{paddingTop: 65}} component={AddCards} title="Nomii" initial/>
      
      <Scene key="cardList" sceneStyle={{paddingTop: 65}} component={CardList} title="Nomii"/>
    </Scene>
  </Router>;
};

export default RouterComponent;