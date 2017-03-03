import React from 'react';
import {StyleSheet, Platform, Image} from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import Main from './components/Main';
import Swiper from './components/Swiper';
import Home from './components/Home';
import CardList from './components/CardList';
import PromoCode from './components/PromoCode';
import PromoSuccess from './components/PromoSuccess';
import {RewardScreen} from './components/common';
// import PanAnimation from './components/animations/PanAnimation';
import AnimatableExample from './components/animations/AnimatableExample';
import LottieAnimatedExample from './components/animations/lottie/LottieAnimatedExample';
import NavBarLogo from './components/NavBarLogo';
import InputPinScreen from './components/InputPinScreen';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: /*(Platform.OS === 'ios') ? 0 : */50,
  },
  homeNavBar: {
    backgroundColor: null,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    marginTop: (Platform.OS === 'ios') ? 10 : 20,
  },
  cardListNavBar:{
    backgroundColor: null,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    marginTop: (Platform.OS === 'ios') ? 10 : 20,
  },
  cardListTitle:{
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  }
});

const RouterComponent = () => {
  return <Router>
    <Scene key="auth" hideNavBar initial>
      {/*<Scene key="lottie" component={LottieAnimatedExample} />*/}
      {/*<Scene key="animated" component={AnimatableExample} />*/}
      <Scene key="login" component={Main} title="Login" initial/>
    </Scene>
    
    <Scene key="intro" hideNavBar>
      <Scene key="swiper" component={Swiper} />
    </Scene>
    
    <Scene key="main" >
      <Scene key="promoCode" component={PromoCode}
             direction="vertical" hideNavBar initial/>
      <Scene key="promoSuccess" component={PromoSuccess} direction="vertical" />
      
      <Scene key="home" component={Home} animation="fade" type="reset"
             hideNavBar={false} navigationBarStyle={styles.homeNavBar}
             leftButtonImage={require('../public/images/promo.png')}
             onLeft={()=>{Actions.promoCode()}}
             //rightButtonImage={require('../public/images/insight-icon.png')}
             //onRight={()=>{}}
             renderTitle={() => <NavBarLogo/>} />
      
      <Scene key="cardList" component={CardList}
             navigationBarStyle={styles.cardListNavBar}
             titleStyle = {styles.cardListTitle}
             title="Select Restaurant" />
      
      <Scene key="inputPin" component={InputPinScreen}
             navigationBarStyle={styles.cardListNavBar}
             titleStyle = {styles.cardListTitle}
             title="Restaurant PIN" direction="vertical" />
  
      <Scene key="reward" component={RewardScreen} hideNavBar
             direction="vertical" />
  
    </Scene>
  </Router>;
};
//, justifyContent: "flex-end", flexDirection: "column"
export default RouterComponent;