import React from 'react';
import {View, Text, StyleSheet, Image, AsyncStorage} from 'react-native';
import {Permissions, Notifications} from 'expo';
import {responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import {Button} from '../components/common'
import {userAddPushTokenMutation} from '../graphql/user';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import {Actions} from 'react-native-router-flux';
import {Toast} from 'antd-mobile';

const styles = new StyleSheet.create({
  wrapperView: {
    justifyContent: "space-around",
    alignItems: "center",
    // marginTop: 74,
    flex:1,
  },
  title:{
    fontSize: responsiveFontSize(3.5),
    color: "#262626",
    fontWeight: "500",
    textAlign: "center",
  },
  contentView:{
    alignItems: "center",
  },
  image:{
    width: responsiveWidth(60),
    // aspectRatio: 0.885,
    height: responsiveWidth(53),
    marginVertical: responsiveHeight(5),
  },
  text: {
    fontSize: responsiveFontSize(2.5),
    color: "#262626",
    fontWeight: "500",
    textAlign: "center",
  },
});

const redirectScreen = (location) => {
  if (location) Actions.home();
  else Actions.location();
};

const registerForPushNotificationsAsync = async (props) => {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status === 'granted') {
    Toast.loading("Saving...", 0);
  
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExponentPushTokenAsync();
  
    console.log("props.userId", props.userId);
    console.log("pushToken", token);
  
    await props.mutate({
      variables: {
        userId: props.userId,
        pushToken: token,
      }});
  
    AsyncStorage.setItem("@NomiiStore:pushToken", token);
  
    Toast.hide();
  }

  redirectScreen(props.location);
};

const AskNotificationScreen = (props) => {
  const btnPressed = async () => {
    await registerForPushNotificationsAsync(props);
  };
  
  return <View style={styles.wrapperView}>
      <View>
        <Text style={styles.title}>
          Don’t miss out on
          {"\n"}
          your offer!
        </Text>
        
        <Image resizeMode="contain"
               style={styles.image}
               source = {require('../../public/images/reward-icon-onboarding.png')}/>
        <Text style={styles.text}>
          Nomii uses notifications
          {"\n"}
          to remind you
          {"\n"}
          of your expiring offers.
        </Text>
      </View>
      
      <Button onPress={() => btnPressed(props)}>
        Ok, Got it!
      </Button>
    </View>
};

//Container
const AskNotificationWithGraphQL = graphql(userAddPushTokenMutation, {
  options: (ownProps) => ({variables: {id: ownProps.userId}}),
})(AskNotificationScreen);

const mapStateToProps = (state) => {
  return {
    userId: state.user.id,
    location: state.user.location,
    // pushToken: state.user.pushToken,
  }
};

export default connect(mapStateToProps)(AskNotificationWithGraphQL);
