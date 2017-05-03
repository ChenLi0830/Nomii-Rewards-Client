import React from 'react';
import {View, Text, StyleSheet, Modal, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import {compose, withHandlers, lifecycle, branch, renderComponent, onlyUpdateForKeys} from 'recompose';
import {connect} from 'react-redux';
import {feedbackActions} from '../modules';
import {ModalBox} from './common';
import FeedbackContent1 from './FeedbackContent1';
import {graphql} from 'react-apollo';
import {getUserQuery} from '../graphql/user';
import {WithInvisibleLoadingComponent} from '../components/common';
import FeedbackContent2 from './FeedbackContent2';
import {userSubmitFeedbackMutation} from '../graphql/user';
import _ from 'lodash';
import {Toast} from 'antd-mobile';

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
  },
});

const FeedBackModal = (props) => {
  const awaitFeedback = props.data.user.awaitFeedbacks[0];
  console.log("props.data.user.awaitFeedbacks[0]", awaitFeedback);
  
  let feedBackContent;
  props.step === 0 && (feedBackContent = <FeedbackContent1 awaitFeedback={awaitFeedback}/>);
  props.step === 1 && (feedBackContent = <FeedbackContent2 awaitFeedback={awaitFeedback} submitFeedback={props.onSubmitFeedback}/>);
  
  return (
    <ModalBox isOpen={props.showModal}
              backdropPressToClose={false}
              swipeToClose={false}
              backdropOpacity={0.7}
              backDropOnPress={Keyboard.dismiss}
              style={styles.wrapper}>
      <View style={styles.container}>
        {feedBackContent}
        {/*<FeedbackContent2 awaitFeedback={awaitFeedback} submitFeedback={props.onSubmitFeedback}/>*/}
      </View>
    </ModalBox>
  )
};

export default compose(
    connect(
        (state) => ({
          showModal: state.feedback.showFeedbackModal,
          rating: state.feedback.rating,
          step: state.feedback.step,
          selectedTags: state.feedback.selectedTags,
          comment: state.feedback.comment,
          contact: state.feedback.contact,
          userId: state.user.id,
        }),
        {
          toggleFeedbackModal: feedbackActions.toggleFeedbackModal,
          nextFeedbackStep: feedbackActions.nextFeedbackStep,
        }
    ),
    graphql(getUserQuery, {
      options: (props) => ({
        variables: {id: props.userId}
      })
    }),
    WithInvisibleLoadingComponent,
    graphql(userSubmitFeedbackMutation),
    withHandlers({
      onSubmitFeedback: props => () =>{
        // calc selected tags
        const awaitFeedback = props.data.user.awaitFeedbacks[0];
        const {restaurantId, visitedAt, stampCountOfCard, employeeName, restaurant, feedbackTags} = awaitFeedback;
        const selectedTags = [];
        for (let tagId of Object.keys(props.selectedTags)){
          if (props.selectedTags[tagId]){ // if tag is selected
            selectedTags.push(_.find(feedbackTags, {id: tagId}));
          }
        }
        // submit feedback
        Toast.loading('Loading...', 0);
        props.mutate({
          variables: {
            restaurantId,
            userId: props.userId,
            userVisitedRestaurantAt:visitedAt,
            stampCountOfCard,
            employeeName,
            rating: props.rating,
            tags: selectedTags,
            comment: props.comment,
            userContact: props.userContact,
          },
        })
            .then(()=>{
              Toast.hide();
            });
      },
    }),
    lifecycle({
      componentDidMount() {
        const awaitFeedbacks = this.props.data.user.awaitFeedbacks;
        if (awaitFeedbacks.length === 0) return;
        
        setTimeout(() => {
          this.props.toggleFeedbackModal()
        }, 1000);
      }
    }),
    onlyUpdateForKeys(['showModal', 'step'])
)(FeedBackModal);