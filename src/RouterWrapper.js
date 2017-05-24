import React from 'react';
import {AsyncStorage} from 'react-native';
import {UpsertUserMutation} from './graphql/user';
import {graphql, withApollo} from 'react-apollo';
import {connect} from 'react-redux';
import {userActions} from './modules';
import {Location, Permissions, Amplitude, AppLoading} from 'expo';
import Router from './Router';
import {lifecycle, compose, withHandlers, branch, renderComponent} from 'recompose';
import {getIfPermissionAsked} from './components/api';
import {Loading} from './components/common';
import {getPromiseTime, getTimeInSec} from './components/api';
import {getUserQuery} from './graphql/user';
import {Toast} from 'antd-mobile'

/**
 * Pass user and location props into Redux reducer
 * */
const RouterWrapper = (props) => {
  return <Router/>
};

export default compose(
    connect(
        (state) => ({
          user: state.user,
        }),
        {
          updateUser: userActions.updateUser,
          updateUserLocation: userActions.updateUserLocation,
          initUser: userActions.initUser,
        }
    ),
    graphql(UpsertUserMutation),
    withApollo, // add client to props
    withHandlers({
      /**
       * Fetch user from either persisted state or Fb
       * */
      fetchUser: props => async ()=>{
        try {
          // await AsyncStorage.removeItem("@NomiiStore:token");
          const value = await AsyncStorage.getItem("@NomiiStore:token");
          
          // no token return user = null
          if (value === null) {
            return null;
          }
          
          const {token, expires} = JSON.parse(value);
      
          // if token is valid and user is persisted, then directly return info from persisted user
          if (expires > getTimeInSec() && props.user && props.user.id) {
            Amplitude.logEvent("login user with persisted data");
            return {name: props.user.name, id: props.user.id, token: token};
          }
      
          // login through fb
          const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
          const result = await response.json();
      
          if (result.error) {
            Amplitude.logEventWithProperties("login user with stored token - fail", {error: result.error});
            return null;
          }
          else {
            Amplitude.logEvent("login user with stored token - success");
            console.log("result", result);
            const {name, id} = result;
            return {name, id, token};// result is user with token
          }
        }
        catch (err) {
          console.log("err", err);
          Amplitude.logEvent("Something went wrong (most likely network issue)");
          Toast.offline("Bad Internet\nconnection", 2);
        }
      },
    }),
    withHandlers({
      upsertUser: props => async () => {
        try {
          const user = await props.fetchUser();
  
          console.log("fetchUser result", user);
  
          // upsert user
          if (user !== null) {
            // update redux user state - legacy issue - store permissionAsked variable into redux store instead of AsyncStorage
            const notificationPermissionAsked = await getIfPermissionAsked("notification");
            const locationPermissionAsked = await getIfPermissionAsked("location");
            props.updateUser({id: user.id, name: user.name, notificationPermissionAsked, locationPermissionAsked});
  
            // async upsertUser
            props.mutate({
              variables: {
                id: user.id,
                fbName: user.name,
                token: user.token,
              }
            });
  
            Amplitude.setUserId(user.id);
          }
          // purge redux user state
          else {
            props.initUser();
          }
        }
        catch (err) {
          console.log("err", err);
          // Todo handle network connection error
        }
      },
      getLocation: props => async() => {
        try {
          const locationPermissionAskedBefore = await getIfPermissionAsked("location");
          console.log("locationPermissionAskedBefore", locationPermissionAskedBefore);
          // if (locationPermissionAskedBefore)
          const locationPermission = await Permissions.getAsync(Permissions.LOCATION);
          console.log("locationPermission  ", locationPermission);
          
          const notificationPermissionAsked = await getIfPermissionAsked("notification");
          console.log("notificationPermissionAsked", notificationPermissionAsked);
          const notifResponse = await Permissions.getAsync(Permissions.REMOTE_NOTIFICATIONS);
          console.log("notification permission response ", notifResponse);
          
          let location = {};
          
          if (locationPermission.status === "granted"){
            // Keep track of User's location
            const options = {
              enableHighAccuracy: true,
              timeInterval: 5000,
              distanceInterval: 5
            };
  
            Location.watchPositionAsync(options, (updateResult) => {
              console.log("updateResult.coords", updateResult.coords);
              props.updateUserLocation(updateResult.coords);
            })
                .catch(error => {
                  console.log("error", error);
                  console.log("location not permitted");
                });
  
            await Promise.race([
              Location.getCurrentPositionAsync({enableHighAccuracy: true}),
              // 2s Timeout for Android phones system version < 6
              new Promise((resolve, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
            ])
                .then(result => {
                  console.log("location", location);
                  location = result
                })
                .catch(error => {
                  console.log("get location timed out", error);
                });
          }
          
          props.updateUserLocation(location.coords);
        }
        catch (error) {
          console.log("App doesn't have location permission");
          console.log("error", error);
        }
      },
      prefetchUserQuery: props => async() => {
        await props.client.query({
          query: getUserQuery,
          variables: {id: props.fbUser.id},
        });
      },
    }),
    lifecycle({
      async componentWillMount(){
        // Async prefetch user data if fbUser exist
        this.props.fbUser && this.props.fbUser.id && this.props.prefetchUserQuery();
        
        // Upsert user
        const promises = [
          getPromiseTime(this.props.getLocation(), "getLocation"),
          getPromiseTime(this.props.upsertUser(), "fetchUser + upsertUser"),
        ];
        await Promise.all(promises);
        this.setState({isReady: true});
      }
    }),
    branch(
        props => !props.isReady,
        renderComponent(AppLoading),
    )
)(RouterWrapper);
