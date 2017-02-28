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
             //renderLeftButton = {() => <Image source={require('../public/images/promo.png')}
             // style={{top:(Platform.OS === 'ios') ? 0 : 20}}/>}
             leftButtonImage={require('../public/images/promo.png')}
             leftButtonIconStyle={{top: (Platform.OS === 'ios') ? 0 : 20}}
             rightButtonImage={require('../public/images/insight-icon.png')}
             rightButtonIconStyle={{top: (Platform.OS === 'ios') ? 0 : 20}}
             onLeft={()=>{}} onRight={()=>{}}
             renderTitle={() => <NavBarLogo/>} initial/>
      <Scene key="cardList" component={CardList} title="Nomii"/>
    </Scene>
  </Router>;
};
//, justifyContent: "flex-end", flexDirection: "column"
export default RouterComponent;