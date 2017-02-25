import React from 'react';
import {Router, Scene, Actions} from 'react-native-router-flux';
import Main from './components/Main';
import Swiper from './components/Swiper';
import AddCards from './components/AddCards';
import CardList from './components/CardList';


const RouterComponent = () => {
  return <Router>
    <Scene key="auth" initial>
      <Scene key="login" component={Main} title="Please Login"/>
    </Scene>
  
    <Scene key="intro" component={Swiper} hideNavBar/>
    
    <Scene key="main">
      <Scene key="home" sceneStyle={{paddingTop: 65}} component={AddCards} title="Nomii" initial/>
      
      <Scene key="cardList" sceneStyle={{paddingTop: 65}} component={CardList} title="Nomii"/>
    </Scene>
  </Router>;
};

export default RouterComponent;