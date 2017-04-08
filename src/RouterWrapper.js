import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, Alert} from 'react-native';
import {UpsertUserMutation} from './graphql/user';
import {graphql} from 'react-apollo';
import {connect} from'react-redux'
import {userActions} from './modules';
import {Amplitude, Location, Permissions} from 'expo';
import Router from './Router';

const styles = StyleSheet.create({
  scrollList:{
    marginTop: 74, flex: 1,
  },
  wrapper: {
    flex: 1,
    // paddingTop: 30,
  },
});

class RouterWrapper extends Component{
  state = {
    isReady: false,
  };

  constructor(props){
    super(props);
    console.log("RouterWrapper props", this.props);
  }

  async upsertUser(){
    try {
      if (!this.props.fbUser) return null;

      const {id, name, token} = this.props.fbUser;
      console.log("id, name, token", id, name, token);

      const userResult = await this.props.mutate({
        variables: {
          id: id,
          fbName: name,
          token: token,
        }
      });

      const user = userResult.data.upsertUser;
      console.log("user", user);

      this.props.updateUser(user);
      // this.props.updateUserId(id);
      // console.log("user", user);
      return user;


    }
    catch(err){
      console.log("err", err);
      // Todo handle network connection error
    }
  }

  async getLocation(){
    try {
      // const locationPermission = await Permissions.getAsync(Permissions.LOCATION);
      // console.log("locationPermission", locationPermission);

      let location = {};
  
      // Keep track of User's location
      const options = {
        enableHighAccuracy: true,
        timeInterval: 5000,
        distanceInterval: 5
      };
      
      Location.watchPositionAsync(options, (updateResult) => {
        console.log("updateResult", updateResult);
        this.props.updateUserLocation(updateResult.coords);
      })
          .catch(error=>{
            console.log("error", error);
            console.log("location not permitted");
          });
      
      await Promise.race([
          Location.getCurrentPositionAsync({enableHighAccuracy: true}),
          // 2s Timeout for Android phones system version < 6
          new Promise((resolve, reject) => setTimeout(()=>reject(new Error('timeout')), 2000)),
      ])
          .then(result => {
            console.log("location", location);
            location = result
          })
          .catch(error => {
            console.log("get location timed out", error);
          });

      console.log("location", location);
      this.props.updateUserLocation(location.coords);
    }
    catch(error) {
      console.log("App doesn't have location permission");
      console.log("error", error);
    }
  }

  // async setAmplitudeUserId() {
  //   try {
  //     Amplitude.setUserId(this.props.fbUser.id)
  //   } catch(error) {
  //     console.log('********ERROR********')
  //   }
  // }

  async componentWillMount(){
    //Upsert user
    const promises = [
      this.getLocation(),
      this.upsertUser(),
      // this.setAmplitudeUserId()
    ];
    await Promise.all(promises);
    this.setState({isReady: true});
  }

  render(){
    if (!this.state.isReady) {
      // Toast.loading('Loading...', 0);
      return <View></View>;
    }

    return <Router/>
  }
}

// Container
const RouterWrapperWithMutation = graphql(UpsertUserMutation)(RouterWrapper);

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => dispatch(userActions.updateUser(user)),
    updateUserLocation: (location) => dispatch(userActions.updateUserLocation(location)),
  }
};

export default connect(null, mapDispatchToProps)(RouterWrapperWithMutation);
