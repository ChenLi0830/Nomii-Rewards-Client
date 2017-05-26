import React from 'react';
import {AsyncStorage} from 'react-native';
import {UpsertUserMutation} from './graphql/user';
import {graphql, withApollo} from 'react-apollo';
import {connect} from 'react-redux';
import {userActions} from './modules';
import {Location, Permissions, Amplitude} from 'expo';
import Router from './Router';
import {lifecycle, compose, withHandlers, branch, renderComponent} from 'recompose';
import {getIfPermissionAsked} from './components/api';
import {AppLoading} from './components/common';
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
          userWatchLocationStart: userActions.userWatchLocationStart,
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
            const notificationPermissionAsked = !!(await getIfPermissionAsked("notification")) || !!props.user.notificationPermissionAsked;
            const locationPermissionAsked = !!(await getIfPermissionAsked("location")) || !!props.user.locationPermissionAsked;
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
      getLocation: props => async () => {
        try {
          const locationPermission = await Permissions.getAsync(Permissions.LOCATION);
          
          if (locationPermission.status === "granted"){
            await props.userWatchLocationStart();
          } else {
            console.log("App doesn't have location permission");
          }
        }
        catch (error) {
          console.log("Error running Permissions.getAsync(Permissions.LOCATION)", error);
        }
      },
      prefetchQueries: props => async () => {
        console.log("props.user.id", props.user.id);
        await props.client.query({
          query: getUserQuery,
          variables: {id: props.user.id},
        });
      }
    }),
    lifecycle({
      async componentWillMount(){
        // Upsert user
        const promises = [
          getPromiseTime(this.props.getLocation(), "getLocation"),
          getPromiseTime(this.props.upsertUser(), "fetchUser + upsertUser"),
        ];
        await Promise.all(promises);
  
        // Async prefetch user data if fbUser exist
        await getPromiseTime(this.props.user && this.props.user.id && this.props.prefetchQueries(), "prefetchUserQuery");
        
        this.setState({isReady: true});
      }
    }),
    branch(
        props => !props.isReady,
        renderComponent(AppLoading),
    )
)(RouterWrapper);
