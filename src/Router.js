import React from 'react';
import {StyleSheet, Platform, Image} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';
import Main from './components/Main';
import Swiper from './components/Swiper';
import AddCards from './components/AddCards';
import CardList from './components/CardList';
import PromoCodeContainer from './components/PromoCodeContainer';
import PromoSuccess from './components/PromoSuccess';
// import PanAnimation from './components/animations/PanAnimation';
import AnimatableExample from './components/animations/AnimatableExample';
import LottieAnimatedExample from './components/animations/lottie/LottieAnimatedExample';
import NavBarLogo from './components/NavBarLogo';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: /*(Platform.OS === 'ios') ? 0 : */50,
  },
  homeNavBar: {
    backgroundColor: null,
    //justifyContent: "flex-end",
    //flexDirection: "column",
    marginTop: 20,
    borderBottomWidth: 0,
  }
});

const RouterComponent = () => {
  return <Router>
    <Scene key="auth" hideNavBar>
      <Scene key="lottie" component={LottieAnimatedExample} />
      <Scene key="animated" component={AnimatableExample} />
      <Scene key="login" component={Main} title="Login" initial/>
    </Scene>
    
    <Scene key="intro" hideNavBar>
      <Scene key="swiper" component={Swiper} />
      <Scene key="promoCode" component={PromoCodeContainer} title="Promo Code"/>
      <Scene key="promoSuccess" component={PromoSuccess} direction="vertical" />
    </Scene>
    
    <Scene key="main"  sceneStyle={{paddingTop: 65}} initial>
      <Scene key="home" component={AddCards}
             navigationBarStyle={styles.homeNavBar}
             leftButtonImage={require('../public/images/promo.png')}
             leftButtonIconStyle={{}}
             rightButtonIconStyle={{}}
             rightButtonImage={require('../public/images/insight-icon.png')}
             onLeft={()=>{}} onRight={()=>{}}
             renderTitle={() => <NavBarLogo/>} initial/>
      <Scene key="cardList" component={CardList} title="Nomii"/>
    </Scene>
  </Router>;
};
//, justifyContent: "flex-end", flexDirection: "column"
export default RouterComponent;