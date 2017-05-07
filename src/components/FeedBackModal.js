import React from 'react';
import {View, Text, StyleSheet, Modal, Keyboard, TouchableWithoutFeedback} from 'react-native';
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
  const awaitFeedback = props.data.user.awaitFeedbacks[0];

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
        }),
        {
          toggleFeedbackModal: feedbackActions.toggleFeedbackModal,
          nextFeedbackStep: feedbackActions.nextFeedbackStep,
          resetFeedbackState: feedbackActions.resetState,
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
        props.toggleFeedbackModal();
        
        // calc selected tags
        const awaitFeedback = props.data.user.awaitFeedbacks[0];
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
      },
      onSkipFeedback: props => () => {
        props.toggleFeedbackModal();
      }
    }),
    // lifecycle({
    //   componentDidMount() {
    //     const awaitFeedbacks = this.props.data.user.awaitFeedbacks;
    //     console.log("awaitFeedbacks", awaitFeedbacks);
    //     if (awaitFeedbacks.length === 0) return;
    //
    //     setTimeout(() => {
    //       console.log("toggleFeedbackModal from life cycle");
    //       this.props.toggleFeedbackModal()
    //     }, 1000);
    //   }
    // }),
    onlyUpdateForKeys(['showModal', 'step'])
)(FeedBackModal);