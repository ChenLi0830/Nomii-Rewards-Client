import React from 'react';
import {StyleSheet, Platform, Alert} from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import Login from './components/Login';
import Swiper from './components/Swiper';
import HomeCards from './components/HomeCards';
import CardList from './components/CardList';
import PromoCode from './components/PromoCode';
import PromoSuccess from './components/PromoSuccess';
import {RewardScreen} from './components/common';
import AssignPIN from './components/AssignPIN'
import ShowStats from './components/ShowStats';
import AskLocationScreen from './components/AskLocationScreen';
import AskNotificationScreen from './components/AskNotificationScreen';
import SuperUserScreen from './components/SuperUserScreen';

import {connect} from 'react-redux';
import NavBarLogo from './components/NavBarLogo';
import InputPinScreen from './components/InputPinScreen';
import Feedback1 from './components/Feedback1';
import {compose, withHandlers, branch, renderComponent} from 'recompose';

const styles = StyleSheet.create({
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
  },
  navTitle:{
    fontSize: 18,
    fontWeight: "600",
  }
});

const RouterComponent = (props) => {
  let {user} = props;
  // Todo: update GraphQL and make use this condition: user.lastLoginAt!==user.registeredAt
  const isNewUser = Math.abs(user.lastLoginAt-user.registeredAt) < 2;
  const locationNotGranted = !user.location;
  
  let initialScreen = props.determineInitialScreen(isNewUser, locationNotGranted);
  
  // console.log("initialScreen", initialScreen);
  // console.log("locationNotGranted", locationNotGranted);
  
  return <Router>
    <Scene key="main">
      <Scene key="askLocation" component = {AskLocationScreen} initial={initialScreen === "location"}
             navigationBarStyle={styles.cardListNavBar}
             titleStyle = {styles.cardListTitle} title="Location Services"/>
  
      <Scene key="home" component={HomeCards} type="reset" initial={initialScreen === "home"}
             hideNavBar={false} navigationBarStyle={styles.homeNavBar}
             leftButtonImage={require('../public/images/promo.png')}
             onLeft={()=>{Actions.promoCode()}}
             rightButtonImage={(user && (user.ownedRestaurants.length > 0 || user.isNomiiAdmin)) ? require('../public/images/insight-icon.png') : null}
             onRight={()=>user.isNomiiAdmin ? Actions.nomiiAdminScreen() : Actions.statistics()}
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
  
      <Scene key="swiper" component={Swiper} initial={initialScreen==="swiper"} hideNavBar/>
      
      <Scene key="promoCode" component={PromoCode}
             direction="vertical" hideNavBar/>
      <Scene key="promoSuccess" component={PromoSuccess} direction="vertical" hideNavBar/>
  
      <Scene key="askNotification" component={AskNotificationScreen} hideNavBar/>
      
      <Scene key="statistics" direction="vertical" type="reset" passProps>
        <Scene key="stat" component={ShowStats} title="Report"
               leftButtonImage={require('../public/images/close-button.png')}
               navigationBarStyle={[styles.homeNavBar, {borderBottomWidth: 0}]}
               ownedRestaurant = {props.SUPickedRestaurant || user && user.ownedRestaurants[0]} titleStyle={styles.navTitle}
               onLeft={()=>{Actions.home()}}/>
        
        <Scene key="assignPin" component={AssignPIN} title="Assign PIN"
               navigationBarStyle={styles.homeNavBar} titleStyle={styles.navTitle}/>
      </Scene>
      
      <Scene key="nomiiAdminScreen" component = {SuperUserScreen} navigationBarStyle={styles.homeNavBar} title="Nomii Admin"/>
  
      <Scene key="feedback1" component={Feedback1} hideNavBar initial/>
      
    </Scene>
  </Router>;
};

//Container
export default compose(
    connect(
        state => ({
          user: state.user,
        })
    ),
    branch(
        props => !props.user || !props.user.id,
        renderComponent(Login),
    ),
    withHandlers({
      determineInitialScreen: props => (isNewUser, locationNotGranted) => {
        if (isNewUser) return "swiper";
        else {
          if (locationNotGranted) return "location";
          else return "home";
        }
      },
      
    }),
)(RouterComponent);