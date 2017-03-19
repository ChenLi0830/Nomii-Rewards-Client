import React from 'react';
import {StyleSheet, Platform, Alert} from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import Main from './components/Main';
import Swiper from './components/Swiper';
import HomeCards from './components/HomeCards';
import CardList from './components/CardList';
import PromoCode from './components/PromoCode';
import PromoSuccess from './components/PromoSuccess';
import {RewardScreen} from './components/common';
import AssignPIN from './components/AssignPIN'
import ShowStats from './components/ShowStats';

// import PanAnimation from './components/animations/PanAnimation';
// import AnimatableExample from './components/animations/AnimatableExample';
// import LottieAnimatedExample from './components/playgound/lottie/LottieAnimatedExample';
import LottieAnimatedExample from './components/playgound/lottie/SimpleExample';
import NavBarLogo from './components/NavBarLogo';
import InputPinScreen from './components/InputPinScreen';
import LocationComponent from './components/playgound/Location';
import SimpleExampleNomii from './components/playgound/lottie/SimpleExampleNomii';

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


const RouterComponent = ({user}) => {
  // console.log("RouterComponent user", user);
  return <Router>
    <Scene key="auth" hideNavBar initial={!user}>
      {/*<Scene key="lottie" component={SimpleExampleNomii} />*/}
      {/*<Scene key="lottie" component={LottieAnimatedExample} />*/}
      {/*<Scene key="animated" component={AnimatableExample} />*/}
      {/*<Scene key="location" component={LocationComponent}/>*/}
      <Scene key="login" component={Main} title="Login" />
    </Scene>
    
    <Scene key="intro" hideNavBar >
      <Scene key="swiper" component={Swiper} />
      <Scene key="promoCode" component={PromoCode} />
      <Scene key="promoSuccess" component={PromoSuccess} direction="vertical" />
    </Scene>
    
    <Scene key="main" direction="vertical" type="reset" initial={!!user}>
      <Scene key="home" component={HomeCards} animation="fade" type="reset"
             hideNavBar={false} navigationBarStyle={styles.homeNavBar}
             leftButtonImage={require('../public/images/promo.png')}
             onLeft={()=>{Actions.promoCode()}}
             rightButtonImage={(user && user.ownedRestaurants.length > 0) ? require('../public/images/insight-icon.png') : null}
             onRight={()=>Actions.statistics()}
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
  
      <Scene key="promoCode" component={PromoCode}
             direction="vertical" hideNavBar/>
      <Scene key="promoSuccess" component={PromoSuccess} direction="vertical" />
      
      <Scene key="statistics" direction="vertical"  type="reset" initial>
        <Scene key="stat" component={ShowStats} title="Report" initial
               leftButtonImage={require('../public/images/close-button.png')}
               navigationBarStyle={[styles.homeNavBar, {borderBottomWidth: 0}]}
               ownedRestaurant = {user && user.ownedRestaurants[0]}
               onLeft={()=>{Actions.home()}}/>
        
        <Scene key="assignPin" component={AssignPIN} title="Assign PIN"
               navigationBarStyle={styles.homeNavBar}/>
      </Scene>
      
    </Scene>
  </Router>;
};
//, justifyContent: "flex-end", flexDirection: "column"


export default RouterComponent;