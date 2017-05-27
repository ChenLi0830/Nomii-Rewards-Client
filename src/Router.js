import React from 'react';
import {StyleSheet, Platform, Alert, View} from 'react-native';
import {Router, Scene, Actions} from 'react-native-router-flux';
import Login from './components/Login';
import Swiper from './components/Swiper';
import HomeCards from './components/HomeCards';
import CardList from './components/CardList';
import PromoCode from './components/PromoCode';
import PromoSuccess from './components/PromoSuccess';
import {RewardScreen, WithLoadingComponent} from './components/common';
import AssignPIN from './components/AssignPIN';
import ShowStats from './components/ShowStats';
import AskLocationScreen from './components/AskLocationScreen';
import AskNotificationScreen from './components/AskNotificationScreen';
import SuperUserScreen from './components/SuperUserScreen';
import FeedBackModal from './components/FeedBackModal';
import SuperUserRestoVisitStats from './components/SuperUserRestoVisitStats';
import {connect} from 'react-redux';
import NavBarLogo from './components/NavBarLogo';
import InputPinScreen from './components/InputPinScreen';
import {compose, withHandlers, withState, branch, renderComponent, pure, onlyUpdateForKeys, lifecycle} from 'recompose';
import {getIfPermissionAsked, getTimeInSec} from './components/api';
import {Loading} from './components/common';
import {graphql} from 'react-apollo';
import {getUserQuery} from './graphql/user';
import {AppLoading, WithLoadingComponent} from './components/common';
import {MainDashboard, DashboardNavBarTitle} from './components/dashboard';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  homeNavBar: {
    backgroundColor: null,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    marginTop: (Platform.OS === 'ios') ? 10 : 20,
  },
  dashboardNavBar: {
    backgroundColor: null,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    marginTop: 20,
    height: 100,
    marginHorizontal: responsiveWidth(2),
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

let notificationPermissionAsked;

const RouterComponent = (props) => {
  console.log("RouterComponent props", props);
  const {notificationPermissionAsked} = props.user;
  let {user} = props.data;
  console.log("RouterComponent user", user);
  const isNewUser = user.lastLoginAt===user.registeredAt && getTimeInSec() - user.lastLoginAt < 60;// second part is for when user login the second time but that change is not updated to Dynamodb yet
  // const locationNotGranted = !user.location;
  
  let initialScreen = props.determineInitialScreen(isNewUser, notificationPermissionAsked);
  
  const scenes = Actions.create(
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
      
        <Scene key="askNotification" component={AskNotificationScreen} hideNavBar initial={initialScreen === "askNotification"}/>
      
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
        <Scene key="nomiiAdminVisitStats" component = {SuperUserRestoVisitStats} navigationBarStyle={styles.homeNavBar} title="Nomii Admin"/>
      
        <Scene key="businessDashboard" initial navigationBarStyle={styles.dashboardNavBar}>
          <Scene key="mainDash" component={MainDashboard} renderTitle={() => <DashboardNavBarTitle/>}
                 ownedRestaurant = {props.SUPickedRestaurant || user && user.ownedRestaurants[0]}/>
        </Scene>
      </Scene>
  );
  
  return <View style={{flex: 1}}>
        <Router scenes={scenes}/>
        <FeedBackModal/>
      </View>
};

//Container
export default compose(
    connect(
        state => ({
          user: state.user,
        })
    ),
    branch(
        props => (!props.user || !props.user.id),
        renderComponent(Login),
    ),
    graphql(
        getUserQuery,
        {
          // fetch only if props.user.id exist
          options: (props) => ({
            variables: {id: (props.user && props.user.id) ? props.user.id : ""},
          })
        }
    ),
    WithLoadingComponent,
    withHandlers({
      determineInitialScreen: props => (isNewUser, notificationPermissionAsked) => {
        console.log("isNewUser", isNewUser, "notificationPermissionAsked", notificationPermissionAsked);
        if (isNewUser) return "swiper";
        else {
          if (!notificationPermissionAsked) return "askNotification";
          else return "home";
        }
      },
    }),
    onlyUpdateForKeys([]),
)(RouterComponent);