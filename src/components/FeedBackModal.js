import React from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import {compose, withHandlers} from 'recompose';
import {connect} from 'react-redux';
import {appActions} from '../modules';
import ModalBox from 'react-native-modalbox';
import Feedback1 from './Feedback1';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: responsiveWidth(90),
    height: responsiveHeight(86),
    borderRadius: 10,
  },
  container: {
    flex: 1,
    width: responsiveWidth(60),
    // height: responsiveHeight(60),
  },
});

const FeedBackModal = (props) => {
  return (
    <ModalBox isOpen={props.showModal}
              backdropPressToClose={false}
              swipeToClose={false}
              backdropOpacity={0.7}
              style={styles.wrapper}>
      <View style={styles.container}>
        <Feedback1/>
      </View>
    </ModalBox>
  )
};

export default compose(
    connect(
        (state) => ({
          showModal: state.app.showFeedbackModal,
          rating: state.app.feedbackRating,
          step: state.app.feedBackStep,
        }),
        {
          toggleFeedbackModal: appActions.toggleFeedbackModal,
          setFeedbackRating: appActions.setFeedbackRating,
          nextFeedbackStep: appActions.nextFeedbackStep,
        }
    ),
    
)(FeedBackModal);