import React from 'react';
import {View, Text, AsyncStorage, StyleSheet, Modal, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import {compose, withHandlers, lifecycle, branch, renderComponent, renderNothing, onlyUpdateForKeys} from 'recompose';
import {connect} from 'react-redux';
import {feedbackActions} from '../modules';
import {ModalBox} from './common';
import {graphql} from 'react-apollo';
import {getUserQuery} from '../graphql/user';
import {WithInvisibleLoadingComponent} from '../components/common';
import FeedbackContent1 from './FeedbackContent1';
import FeedbackContent2 from './FeedbackContent2';
import FeedbackContent3 from './FeedbackContent3';
import VisitFrequencyFeedback from './VisitFrequencyFeedback';
import {userSubmitFeedbackMutation} from '../graphql/user';
import {userSkipFeedbackMutation} from '../graphql/user';
import _ from 'lodash';
import {Toast} from 'antd-mobile';
import {Amplitude} from 'expo';

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
  const awaitFeedback = props.data.user.awaitFeedbacks.slice(-1)[0];

  let feedBackContent;
  props.step === 0 && (feedBackContent = <FeedbackContent1 awaitFeedback={awaitFeedback} submitFeedback={props.onSubmitFeedback} skipFeedback={props.onSkipFeedback}/>);
  props.step === 1 && (feedBackContent = <FeedbackContent2 awaitFeedback={awaitFeedback} submitFeedback={props.onSubmitFeedback}/>);
  props.step === 2 && (feedBackContent = <FeedbackContent3 submitFeedback={props.onSubmitFeedback}/>);
  if (awaitFeedback.isNewUser){
    feedBackContent = <VisitFrequencyFeedback awaitFeedback={awaitFeedback} submitFeedback={props.onSubmitFeedback}/>
  }

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
          modalSkipped: state.feedback.modalSkipped,
        }),
        {
          toggleFeedbackModal: feedbackActions.toggleFeedbackModal,
          nextFeedbackStep: feedbackActions.nextFeedbackStep,
          resetFeedbackState: feedbackActions.resetState,
          skipFeedback: feedbackActions.skipFeedback,
        }
    ),
    graphql(getUserQuery, {
      options: (props) => ({
        variables: {id: props.userId}
      })
    }),
    WithInvisibleLoadingComponent,
    graphql(userSubmitFeedbackMutation, {
      name: "submitFeedbackMutation"
    }),
    graphql(userSkipFeedbackMutation, {
      name: "skipFeedbackMutation"
    }),
    withHandlers({
      onSubmitFeedback: props => () =>{
        // dismiss feedback modal
        props.toggleFeedbackModal(false);
        
        // calc selected tags
        const awaitFeedback = props.data.user.awaitFeedbacks.slice(-1)[0];
        const {restaurantId, visitedAt, stampCountOfCard, employeeName, restaurant, feedbackTags} = awaitFeedback;
        const selectedTags = [];
        for (let tagId of Object.keys(props.selectedTags)){
          if (props.selectedTags[tagId]){ // if tag is selected
            let tag = _.find(feedbackTags, {id: tagId});
            selectedTags.push({id: tag.id, content: tag.content});
          }
        }
        
        // submit feedback
        Amplitude.logEvent("Feedback is submitted");
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
        
        // delay the submitFeedbackMutation so that optimisticResponse will not influence modal's animation
        setTimeout(() =>
            props.submitFeedbackMutation({
              variables: {...feedback},
              optimisticResponse: {
                __typename: "Mutation",
                submitUserFeedback: {
                  ...[...props.data.user.awaitFeedbacks].pop(),
                  __typename:"Feedback",
                }
              },
              updateQueries: {
                getUser: (prev, {mutationResult}) => {
                  let newAwaitFeedback = [...props.data.user.awaitFeedbacks].slice(0, props.data.user.awaitFeedbacks.length - 1);
                  return {
                    user: {
                      ...prev.user,
                      awaitFeedbacks: newAwaitFeedback,
                    },
                  };
                },
              }
            })
                .catch(err => {
                  console.log("err", err);
                })
        , 500);
      },
      onSkipFeedback: props => async () => {
        props.toggleFeedbackModal(false);
        props.skipFeedback();
        Amplitude.logEvent("Feedback is skipped");
        setTimeout(()=>props.skipFeedbackMutation({
          variables: {userId: props.userId},
        }), 500);
      }
    }),
    onlyUpdateForKeys(['showModal', 'step', 'data']),
    lifecycle({
      async componentWillMount(){
        // show modal on initial app launch, use @NomiiStore:showFeedback to store if it is shown before
        let showFeedback = await AsyncStorage.getItem("@NomiiStore:showFeedback");
        if (JSON.parse(showFeedback) && this.props.data.user.awaitFeedbacks && this.props.data.user.awaitFeedbacks.length > 0){
          this.props.toggleFeedbackModal(true);
        }
        await AsyncStorage.setItem("@NomiiStore:showFeedback", JSON.stringify(false));
      },
      componentWillReceiveProps(nextProps) {
        let oldAwaitFeedbacks = this.props.data.user.awaitFeedbacks;
        let newAwaitFeedbacks = nextProps.data.user.awaitFeedbacks;
        console.log("oldAwaitFeedbacks", oldAwaitFeedbacks);
        console.log("newAwaitFeedbacks", newAwaitFeedbacks);
        // if awaitFeedbacks is shortened && modalSkipped===false, it means the user submitted an feedback. Keep showing feedback modal in this case
        if (oldAwaitFeedbacks.length > newAwaitFeedbacks.length && newAwaitFeedbacks.length > 0 && this.props.modalSkipped===false){
          this.props.toggleFeedbackModal(true);
        }
      },
    }),
    // stop rendering FeedBackModal component if there is no awaitFeedbakcs
    branch(
        props => !(props.data && props.data.user && props.data.user.awaitFeedbacks && props.data.user.awaitFeedbacks.length > 0),
        renderNothing,
    ),
)(FeedBackModal);