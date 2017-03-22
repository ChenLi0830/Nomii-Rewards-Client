import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, Alert} from 'react-native';
import {UpsertUserMutation} from './graphql/user';
import {graphql} from 'react-apollo';
import {connect} from'react-redux'
import {userActions} from './modules';
import {Location, Permissions} from 'expo';
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
    try{
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
  
  async keepAskingLocationPermission(){
    let status = "";
    status = await this.askLocationPermission();
    if (status !== "granted"){
      Alert.alert(
          'Location is required',
          'Please enable location by going to Settings -> Scroll down to Nomii Rewards -> Location -> Select "While Using the App"',
          [
            {text: 'Finished', onPress: async() => {status = await this.askLocationPermission();}},
          ],
          { cancelable: false }
      );
    }
  }
  
  async askLocationPermission(){
    // const { Location, Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    // console.warn("status",status);
    if (status === 'granted') {
      //Get instant location
      const location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      this.props.updateUserLocation(location.coords);
  
      // Keep track of User's location
      const options = {
        enableHighAccuracy: true,
        timeInterval: 5000,
        distanceInterval: 5
      };

      Location.watchPositionAsync(options, (updateResult) => {
        console.log("updateResult", updateResult);
        this.props.updateUserLocation(updateResult.coords);
      });
    }
    else {
      Alert.alert(
          'Location is required',
          'Please enable location by going to Settings -> Scroll down to Nomii Rewards -> Location -> Select "While Using the App"',
          [
            {text: 'Finished', onPress: () => {}},
          ],
          { cancelable: false }
      );
      // console.warn(new Error('Location permission not granted'));
    }
    return status;
  }
  
  async componentWillMount(){
    //Upsert user
    const promises = [this.askLocationPermission(), this.upsertUser()];
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

