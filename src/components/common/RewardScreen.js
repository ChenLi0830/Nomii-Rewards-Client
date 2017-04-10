import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Platform, AsyncStorage} from 'react-native';
import {Button} from './Button';
import {Actions} from 'react-native-router-flux';
import { Permissions, Notifications } from 'expo';
import {graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {userAddPushTokenMutation} from '../../graphql/user';
import {userActions} from '../../modules';
import {Toast} from 'antd-mobile';

const {width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.1,
  },
  title: {
    color: '#6EB8C0',
    fontSize: 45,
    textAlign: 'center',
    fontWeight: '300',
    marginVertical: -height * 0.05,
  },
  image: {
    width: width * 0.5,
    // marginTop: - height * 0.1
  },
  detailText:{
    color: '#95A5A6',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '500',
    width: width * 0.9,
  },
  button: {
    width: width * 0.8,
    height: 40,
    marginTop: Platform.OS === "ios" ? -30 : 0,
    bottom: Platform.OS === "ios" ? 10 : -40,
    alignSelf: "center",
    borderWidth: 0,
  }
});

const images = {
  0:require('../../../public/images/big-check.png'),
  1:require('../../../public/images/big-five-percent.png'),
  2:require('../../../public/images/big-ten-percent.png'),
  firstTime10Off: require('../../../public/images/big-ten-percent.png'),
};

const titles = {
  0:"Noiceee!",
  1:"Littt!",
  2:"Radical!",
  firstTime10Off: "Awesome!",
};

const detailText = {
  0:"Thanks for the visit!\nGet 5% on your next visit!",
  1:"5% off your total\nGet 10% on your next visit!",
  2:"10% off your total!\nYou’re a warrior for completing the card!",
  firstTime10Off: "Special reward for you!\n10% off your 1st stamp!",
};

const buttonTitles = {
  0:"AWESOME!",
  1:"SWEET!",
  2:"AWESOME!",
  firstTime10Off: "SWEET!",
};

const btnPressed = async (props) => {
    console.log("pushToken", pushToken);
    if (!pushToken || typeof pushToken !== "string" || pushToken.length === 0) {
      Actions.askNotification();
    } else {
      Actions.home();
    }
};

let pushToken;
class RewardScreen extends React.Component{
  async componentDidMount(){
    pushToken = await AsyncStorage.getItem("@NomiiStore:pushToken");
  }
  
  render(){
    let props = this.props;
    
    // console.log("RewardScreen props", props);
    let index = props.successScreen ? props.successScreen : props.progress;
    
    return (
        <View style={styles.slide}>
          <Image resizeMode="contain"
                 style={styles.image}
                 source = {images[index]}/>
        
          <Text style={styles.title}>
            {titles[index]}
          </Text>
        
          <Text style={styles.detailText}>
            {detailText[index]}
          </Text>
        
          <Button style={styles.button} type="primary" onPress={() => btnPressed(props)}>
            {buttonTitles[index]}
          </Button>
        </View>
    )
  }
}

//Container
const RewardScreenWithGraphQL = graphql(userAddPushTokenMutation, {
  options: (ownProps) => ({variables: {id: ownProps.userId}}),
})(RewardScreen);

const mapStateToProps = (state) => {
  // console.log("state.user", state.user);
  // console.log("state.user.userId", state.user.userId);
  return {
    userId: state.user.id,
    // pushToken: state.user.pushToken,
  }
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     updateUserPushToken: (pushToken) => dispatch(userActions.updateUserPushToken(pushToken)),
//   }
// };

const containerComponent = connect(mapStateToProps)(RewardScreenWithGraphQL);

export {containerComponent as RewardScreen};