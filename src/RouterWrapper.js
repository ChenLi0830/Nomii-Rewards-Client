import React from 'react';
import {UpsertUserMutation} from './graphql/user';
import {graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {userActions} from './modules';
import {Location, Permissions} from 'expo';
import Router from './Router';
import {lifecycle, compose, withHandlers, branch, renderNothing} from 'recompose';
import {getIfPermissionAsked} from './components/api';

/**
 * Pass user and location props into Redux reducer
 * */
const RouterWrapper = () => {
  return <Router/>
};

export default compose(
    connect(
        null,
        {
          updateUser: userActions.updateUser,
          updateUserLocation: userActions.updateUserLocation,
        }
    ),
    graphql(UpsertUserMutation),
    withHandlers({
      upsertUser: props => async() => {
        try {
          if (!props.fbUser) return null;
          
          const {id, name, token} = props.fbUser;
          console.log("id, name, token", id, name, token);
          
          const userResult = await props.mutate({
            variables: {
              id: id,
              fbName: name,
              token: token,
            }
          });
          
          const user = userResult.data.upsertUser;
          
          props.updateUser(user);
          return user;
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
              console.log("updateResult", updateResult);
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
          
          console.log("location", location);
          props.updateUserLocation(location.coords);
        }
        catch (error) {
          console.log("App doesn't have location permission");
          console.log("error", error);
        }
      }
    }),
    lifecycle({
      async componentWillMount(){
        //Upsert user
        const promises = [
          this.props.getLocation(),
          this.props.upsertUser(),
          // this.setAmplitudeUserId()
        ];
        await Promise.all(promises);
        this.setState({isReady: true});
      }
    }),
    branch(
        props => !props.isReady,
        renderNothing,
    )
)(RouterWrapper);
