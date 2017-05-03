import React from 'react';
import {StyleSheet, Text, View, Image, Platform, AsyncStorage} from 'react-native';
import {Button} from './Button';
import {Actions} from 'react-native-router-flux';
import {graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {userAddPushTokenMutation} from '../../graphql/user';
import {feedbackActions} from '../../modules';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import {compose, lifecycle, withHandlers} from 'recompose';
import {Amplitude} from 'expo';
import {getIfPermissionAsked} from '../api';

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
  },
  title: {
    color: '#6EB8C0',
    fontSize: 45,
    textAlign: 'center',
    fontWeight: '300',
    marginVertical: - responsiveHeight(5),
  },
  image: {
    width: responsiveWidth(50),
  },
  detailText: {
    color: '#95A5A6',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '500',
    width: responsiveWidth(90),
  },
  button: {
    width: responsiveWidth(80),
    height: 40,
    marginTop: Platform.OS === "ios" ? -30 : 0,
    bottom: Platform.OS === "ios" ? 10 : -40,
    alignSelf: "center",
    borderWidth: 0,
  }
});

const images = {
  0: require('../../../public/images/big-check.png'),
  1: require('../../../public/images/big-five-percent.png'),
  2: require('../../../public/images/big-ten-percent.png'),
  firstTime10Off: require('../../../public/images/big-ten-percent.png'),
};

const titles = {
  0: "Noiceee!",
  1: "Littt!",
  2: "Radical!",
  firstTime10Off: "Awesome!",
};

const detailText = {
  0: "Thanks for the visit!\nGet 5% on your next visit!",
  1: "5% off your total\nGet 10% on your next visit!",
  2: "10% off your total!\nYou’re a warrior for completing the card!",
  firstTime10Off: "Special reward for you!\n10% off your 1st stamp!",
};

const buttonTitles = {
  0: "AWESOME!",
  1: "SWEET!",
  2: "AWESOME!",
  firstTime10Off: "SWEET!",
};

const RewardScreenComponent = (props) => {
  let index = props.successScreen ? props.successScreen : props.progress;
  
  return (
      <View style={styles.slide}>
        <Image resizeMode="contain"
               style={styles.image}
               source={images[index]}/>
        
        <Text style={styles.title}>
          {titles[index]}
        </Text>
        
        <Text style={styles.detailText}>
          {detailText[index]}
        </Text>
        
        <Button style={styles.button} type="primary" onPress={props.btnPressed}>
          {buttonTitles[index]}
        </Button>
      </View>
  )
};

//Container
const containerComponent = compose(
    connect(
        state => ({
          userId: state.user.id,
        }),
        {toggleFeedbackModal: feedbackActions.toggleFeedbackModal}
    ),
    withHandlers({
      btnPressed: props => async () => {
        let notificationPermissionAsked = await getIfPermissionAsked("notification");
        // console.log("location screen notificationPermissionAsked", notificationPermissionAsked);
        if (notificationPermissionAsked) {
          Actions.home();
          console.log("toggleFeedbackModal from congrats screen");
          props.toggleFeedbackModal();
        } else {
          Actions.askNotification();
        }
      }
    }),
)(RewardScreenComponent);

export {containerComponent as RewardScreen};