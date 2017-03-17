import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {UpsertUserMutation} from '../graphql/mutations/user';
import {graphql} from 'react-apollo';
import {connect} from'react-redux'
import HomeCards from './HomeCards';
import {userActions} from '../modules';

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
  
  componentWillMount(){
    //Upsert user
    (async () => {
      try{
        const {id, name} = this.props.fbUser;
        
        const user = await this.props.mutate({
          variables: {
            id: id,
            fbName: name,
          }
        });
        
        this.props.updateUserId(id);
        
        this.setState({isReady: true});
        // console.log("upsert finished user", user);
      }
      catch(err){
        console.log("err", err);
        // Todo handle network connection error
      }
    })()
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
    updateUserId: (id) => dispatch(userActions.updateUserId(id))
  }
};

export default connect(null, mapDispatchToProps)(HomeWithMutation);
