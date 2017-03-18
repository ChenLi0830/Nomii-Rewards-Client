import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {UpsertUserMutation} from '../graphql/user';
import {graphql} from 'react-apollo';
import {connect} from'react-redux'
import HomeCards from './HomeCards';
import {userActions} from '../modules';
import Expo from 'exponent';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollList:{
    marginTop: 74, flex: 1,
  },
  wrapper: {
    flex: 1,
    // paddingTop: 30,
  },
});

class Home extends Component{
  state = {
    isReady: false,
  };
  
  constructor(props){
    super(props);
    console.log("props", this.props);
  }
  
  async upsertUser(){
    try{
      const {id, name} = this.props.fbUser;
    
      const user = await this.props.mutate({
        variables: {
          id: id,
          fbName: name,
        }
      });
    
      this.props.updateUserId(id);
    }
    catch(err){
      console.log("err", err);
      // Todo handle network connection error
    }
  }
  
  async askLocationPermission(){
    const { Location, Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    // console.warn("status",status);
    if (status === 'granted') {
      const options = {
        enableHighAccuracy: true,
        // timeInterval: 5000,
        // distanceInterval: 5
      };
      
      Location.watchPositionAsync(options, (updateResult) => {
        console.log("updateResult", updateResult);
        this.props.updateUserLocation(updateResult.coords);
      });
    } else {
      throw new Error('Location permission not granted');
    }
  }
  
  async componentWillMount(){
    //Upsert user
    const promises = [this.askLocationPermission(), this.upsertUser()];
    let results = await Promise.all(promises);
    // console.warn("results", results);
    this.setState({location: results[0], isReady: true});
    // console.log("upsert finished user", user);
  }
  
  render(){
    if (!this.state.isReady) {
      // Toast.loading('Loading...', 0);
      return <View></View>;
    }
    
    return <HomeCards/>
  }
}

// Container
const HomeWithMutation = graphql(UpsertUserMutation)(Home);

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserId: (id) => dispatch(userActions.updateUserId(id)),
    updateUserLocation: (location) => dispatch(userActions.updateUserLocation(location)),
  }
};

export default connect(null, mapDispatchToProps)(HomeWithMutation);
