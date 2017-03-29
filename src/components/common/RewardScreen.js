import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Platform} from 'react-native';
import {Button} from './Button';
import {Actions} from 'react-native-router-flux';
import { Permissions, Notifications } from 'expo';
import {graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {userUpsertPushTokenMutation} from '../../graphql/user';
import {userActions} from '../../modules';

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

const images = [
  require('../../../public/images/big-check.png'),
  require('../../../public/images/big-five-percent.png'),
  require('../../../public/images/big-ten-percent.png'),
];

const titles = [
  "Noiceee!",
  "Littt!",
  "Radical!",
];

const detailText = [
  "Thanks for the visit!\nGet 5% on your next visit!",
  "5% off your total\nGet 10% on your next visit!",
  "10% off your total!\nYou’re a warrior for completing the card!"
];

const buttonTitles = [
  "AWESOME!",
  "SWEET!",
  "AWESOME!"
];

async function registerForPushNotificationsAsync(props) {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
  
  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    console.log("status", status);
    return;
  }
  
  // Get the token that uniquely identifies this device
  let token = await Notifications.getExponentPushTokenAsync();
  
  console.log("props.userId", props.userId);
  console.log("pushToken", token);
  
  await props.mutate({
    variables: {
      userId: props.userId,
      pushToken: token,
  }});
  
  props.updateUserPushToken(token);
}

const btnPressed = async (props) => {
  if (!props.pushToken || typeof props.pushToken !== "string" || props.pushToken.length === 0) {
    try {
      await registerForPushNotificationsAsync(props);
    }
    catch(error){
      console.log("error registerForPushNotificationsAsync", error);
    }
  }
  Actions.home();
};

const RewardScreen = (props) => {
  console.log("RewardScreen props", props);
  const index = props.progress;
  
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
};

//Container
const RewardScreenWithGraphQL = graphql(userUpsertPushTokenMutation, {
  options: (ownProps) => ({variables: {id: ownProps.userId}}),
})(RewardScreen);

const mapStateToProps = (state) => {
  console.log("state.user", state.user);
  // console.log("state.user.userId", state.user.userId);
  return {
    userId: state.user.id,
    pushToken: state.user.pushToken,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserPushToken: (pushToken) => dispatch(userActions.updateUserPushToken(pushToken)),
  }
};

const containerComponent = connect(mapStateToProps, mapDispatchToProps)(RewardScreenWithGraphQL);

export {containerComponent as RewardScreen};