import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import Main from './components/Main';
import Swiper from './components/Swiper';
import AddCards from './components/AddCards';
import CardList from './components/CardList';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: (Platform.OS === 'ios') ? 0 : 50,
  }
});

const RouterComponent = () => {
  return <Router hideNavBar={Platform.OS !== 'ios'}>
    <Scene key="auth" initial>
      <Scene key="login" component={Main} title="Login"/>
    </Scene>
  
    <Scene key="intro" component={Swiper} hideNavBar/>
    
    <Scene key="main">
      <Scene key="home" sceneStyle={{paddingTop: 65}} component={AddCards} title="Nomii" initial/>
      
      <Scene key="cardList" sceneStyle={{paddingTop: 65}} component={CardList} title="Nomii"/>
    </Scene>
  </Router>;
};

export default RouterComponent;