import React from 'react';
import {View, Text, AsyncStorage, StyleSheet, Modal, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import {compose, withHandlers, lifecycle, branch, renderComponent, onlyUpdateForKeys} from 'recompose';
import {connect} from 'react-redux';
import {feedbackActions} from '../modules';
import {ModalBox} from './common';
import {graphql} from 'react-apollo';
import {getUserQuery} from '../graphql/user';
import {WithInvisibleLoadingComponent} from '../components/common';
import FeedbackContent1 from './FeedbackContent1';
import FeedbackContent2 from './FeedbackContent2';
import FeedbackContent3 from './FeedbackContent3';
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
  console.log("props.data.user.awaitFeedbacks.length", props.data.user.awaitFeedbacks.length);
  // console.log("props.feedbackIndex", props.feedbackIndex);
  if (props.feedbackIndex === -1) return <View/>;
  
  const awaitFeedback = props.data.user.awaitFeedbacks[props.feedbackIndex];

  let feedBackContent;
  props.step === 0 && (feedBackContent = <FeedbackContent1 awaitFeedback={awaitFeedback} submitFeedback={props.onSubmitFeedback} skipFeedback={props.onSkipFeedback}/>);
  props.step === 1 && (feedBackContent = <FeedbackContent2 awaitFeedback={awaitFeedback} submitFeedback={props.onSubmitFeedback}/>);
  props.step === 2 && (feedBackContent = <FeedbackContent3 submitFeedback={props.onSubmitFeedback}/>);

  return (
    <ModalBox isOpen={props.showModal}
              backdropPressToClose={false}
              swipeToClose={false}
              backdropOpacity={0.7}
              backDropOnPress={Keyboard.dismiss}
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
          showModal: state.feedback.showFeedbackModal,
          rating: state.feedback.rating,
          step: state.feedback.step,
          selectedTags: state.feedback.selectedTags,
          comment: state.feedback.comment,
          contact: state.feedback.contact,
          contactName: state.feedback.contactName,
          userId: state.user.id,
          feedbackIndex: state.feedback.feedbackIndex,
        }),
        {
          toggleFeedbackModal: feedbackActions.toggleFeedbackModal,
          nextFeedbackStep: feedbackActions.nextFeedbackStep,
          resetFeedbackState: feedbackActions.resetState,
          updateFeedbackIndex: feedbackActions.updateFeedbackIndex,
        }
    ),
    graphql(getUserQuery, {
      options: (props) => ({
        variables: {id: props.userId}
      })
    }),
    WithInvisibleLoadingComponent,
    branch(
        props => !(props.data && props.data.user && props.data.user.awaitFeedbacks && props.data.user.awaitFeedbacks.length > 0),
        renderComponent(() => (<View/>)),
    ),
    graphql(userSubmitFeedbackMutation),
    withHandlers({
      onSubmitFeedback: props => () =>{
        // dismiss feedback modal
        props.toggleFeedbackModal(false);
        
        // calc selected tags
        const awaitFeedback = props.data.user.awaitFeedbacks[props.feedbackIndex];
        const {restaurantId, visitedAt, stampCountOfCard, employeeName, restaurant, feedbackTags} = awaitFeedback;
        const selectedTags = [];
        for (let tagId of Object.keys(props.selectedTags)){
          if (props.selectedTags[tagId]){ // if tag is selected
            let tag = _.find(feedbackTags, {id: tagId});
            selectedTags.push({id: tag.id, content: tag.content});
          }
        }

        // submit feedback
        const feedback = {
          restaurantId,
          userId: props.userId,
          userVisitedRestaurantAt:visitedAt,
          stampCountOfCard,
          employeeName,
          rating: props.rating,
          tags: selectedTags,
          comment: props.comment,
          userContact: props.contact,
          userContactName: props.contactName,
        };
        props.mutate({
          variables: {...feedback},
        })
            .catch(err => {
              console.log("err", err);
            });
        
        // update feedbackIndex
        setTimeout(() => {
          console.log("toggleFeedbackModal from componentWillReceiveProps");
          props.updateFeedbackIndex(props.feedbackIndex-1);
        }, 1000);
      },
      onSkipFeedback: props => async () => {
        props.toggleFeedbackModal(false);
        await AsyncStorage.setItem("@NomiiStore:showFeedback", JSON.stringify(false));
      }
    }),
    onlyUpdateForKeys(['showModal', 'step', 'feedbackIndex']),
    lifecycle({
      componentWillMount(){
        const awaitFeedbacks = this.props.data.user.awaitFeedbacks;
        if (awaitFeedbacks.length === 0) {
          return;
        } else {
          console.log("updating updateFeedbackIndex", awaitFeedbacks.length-1);
          if (this.props.feedbackIndex === -1){// This will only run once per app. awaitFeedbacks will not be updated
            this.props.updateFeedbackIndex(awaitFeedbacks.length-1);
          }
        }
      },
      componentWillReceiveProps(nextProps) {
        console.log("nextProps", nextProps);
        let oldAwaitFeedbacks = this.props.data.user.awaitFeedbacks;
        let newAwaitFeedbacks = nextProps.data.user.awaitFeedbacks;
        // updateFeedbackIndex when awaitFeedbacks is changed
        if (oldAwaitFeedbacks[oldAwaitFeedbacks.length-1].visitedAt !== newAwaitFeedbacks[newAwaitFeedbacks.length-1].visitedAt){
          this.props.updateFeedbackIndex(newAwaitFeedbacks.length-1);
        } else {
          // if awaitFeedbacks is not changed, toggleFeedbackModal to be true when feedbackIndex is changed
          if (this.props.feedbackIndex !== nextProps.feedbackIndex && nextProps.feedbackIndex !== -1){
            this.props.toggleFeedbackModal(true);
          }
        }
      },
    }),
)(FeedBackModal);