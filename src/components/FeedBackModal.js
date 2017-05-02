import React from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import {compose, withHandlers, lifecycle, branch, renderComponent} from 'recompose';
import {connect} from 'react-redux';
import {appActions} from '../modules';
import ModalBox from 'react-native-modalbox';
import FeedbackContent1 from './FeedbackContent1';
import {graphql} from 'react-apollo';
import {getUserQuery} from '../graphql/user';
import {WithInvisibleLoadingComponent} from '../components/common';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: responsiveWidth(90),
    height: responsiveHeight(90),
    borderRadius: 5,
  },
  container: {
    flex: 1,
    width: responsiveWidth(76),
    // height: responsiveHeight(60),
  },
});

const FeedBackModal = (props) => {
  const awaitFeedback = props.data.user.awaitFeedbacks[0];
  console.log("props.data.user.awaitFeedbacks[0]", awaitFeedback);
  
  let feedBackContent;
  props.step === 0 && (feedBackContent = <FeedbackContent1 awaitFeedback={awaitFeedback}/>);
  props.step === 1 && (feedBackContent = <FeedbackContent1 awaitFeedback={awaitFeedback}/>);
  
  return (
    <ModalBox isOpen={props.showModal}
              backdropPressToClose={false}
              swipeToClose={false}
              backdropOpacity={0.7}
              style={styles.wrapper}>
      <View style={styles.container}>
        {feedBackContent}
      </View>
    </ModalBox>
  )
};

export default compose(
    connect(
        (state) => ({
          showModal: state.app.showFeedbackModal,
          step: state.app.feedBackStep,
          userId: state.user.id,
        }),
        {
          toggleFeedbackModal: appActions.toggleFeedbackModal,
          nextFeedbackStep: appActions.nextFeedbackStep,
        }
    ),
    graphql(getUserQuery, {
      options: (props) => ({
        variables: {id: props.userId}
      })
    }),
    WithInvisibleLoadingComponent,
    lifecycle({
      componentDidMount() {
        const awaitFeedbacks = this.props.data.user.awaitFeedbacks;
        if (awaitFeedbacks.length === 0) return;
        
        // console.log("this.props", this.props);
        // if (props.data)
        // console.log(props.)
        setTimeout(() => {
          this.props.toggleFeedbackModal()
        }, 1000);
      }
    }),
)(FeedBackModal);