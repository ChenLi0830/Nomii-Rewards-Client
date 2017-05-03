import React from 'react';
import {View, StyleSheet, Platform, Text, Keyboard} from 'react-native';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight
} from 'react-native-responsive-dimensions';
import {Button, InputBox} from './common';
import {compose, lifecycle, withHandlers} from 'recompose';
import {connect} from 'react-redux';
import {feedbackActions, appActions} from '../modules';
import TagButton from './TagButton';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {BackButton} from './common';

let styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveWidth(5),
  },
  backBtnView:{
    alignSelf: "flex-start",
    left: -responsiveWidth(4),
  },
  titleView: {
    marginTop: -responsiveHeight(6),
    alignSelf: "flex-start",
    alignItems: "flex-start"
  },
  title: {
    fontWeight: "600",
    fontSize: responsiveFontSize(3.5),
  },
  subTitle: {
    color: "#b4b4b4",
    fontSize: responsiveFontSize(2.2),
  },
  button: {
    width: responsiveWidth(80),
  }
});

const FeedbackContent2 = (props) => {
  // props.awaitFeedback
  const {visitedAt, stampCountOfCard, employeeName, restaurant, feedbackTags} = props.awaitFeedback;
  
  let tagButtonGroup = [];
  for (let i = 0; i < 3; i++) {
    tagButtonGroup.push(
        <View key={i} style={{flexDirection: "row", alignSelf: "center"}}>
          <View style={{paddingRight: responsiveWidth(3), paddingBottom: responsiveWidth(2.5)}}>
            <TagButton key={i * 2} id={feedbackTags[i * 2].id}
                       selected={!!props.selectedTags[feedbackTags[i * 2].id]}>
              {feedbackTags[i * 2].content}
            </TagButton>
          </View>
          <View style={{paddingBottom: responsiveWidth(2.5)}}>
            <TagButton key={i * 2 + 1} id={feedbackTags[i * 2 + 1].id}
                       selected={!!props.selectedTags[feedbackTags[i * 2 + 1].id]}>
              {feedbackTags[i * 2 + 1].content}
            </TagButton>
          </View>
        </View>
    )
  }
  
  return (
      <View style={{flex: 1}}>
        <View style={styles.wrapper}>
          {
            !props.keyboardIsShown
            &&
            <View style={styles.backBtnView}>
              <BackButton size={responsiveFontSize(3.6)} onPress={()=>props.prevFeedbackStep()}/>
            </View>
          }
          
          {
            !props.keyboardIsShown
            &&
            <View style={styles.titleView}>
              <Text style={styles.title}>
                What could be
                {"\n"}
                improved?
              </Text>
              
              <Text style={styles.subTitle}>
                Pick any of the following
              </Text>
            </View>
          }
          
          <View>
            <View>
              {tagButtonGroup}
            </View>
            
            <View>
              <InputBox text={props.comment}
                        width={responsiveWidth(76)}
                        height={responsiveHeight(20)}
                        onChange={props.changeFeedbackComment}
                        multiline
              />
            </View>
          </View>
  
          {
            props.rating <= 2
            &&
            <Button rounded={false} shadow={false} style={styles.button}
                    onPress={props.nextFeedbackStep}>
              Next
            </Button>
          }
          
          {
            props.rating > 2
              &&
            <Button rounded={false} shadow={false} style={styles.button}
                    onPress={props.submitFeedback}>
              Submit
            </Button>
          }
  
        </View>
        <KeyboardSpacer/>
      </View>
  
  );
};

export default compose(
    connect(
        (state) => ({
          rating: state.feedback.rating,
          selectedTags: state.feedback.selectedTags,
          comment: state.feedback.comment,
          keyboardIsShown: state.app.keyboardIsShown,
        }),
        {
          changeFeedbackComment: feedbackActions.changeFeedbackComment,
          prevFeedbackStep: feedbackActions.prevFeedbackStep,
          nextFeedbackStep: feedbackActions.nextFeedbackStep,
          toggleKeyboardVisibility: appActions.toggleKeyboardVisibility,
        }
    ),
    lifecycle({
      componentWillMount () {
        const keyboardShow = Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
        const keyboardHide = Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";
        this.keyboardDidShowListener =
            Keyboard.addListener(keyboardShow, this.props.toggleKeyboardVisibility);
        this.keyboardDidHideListener =
            Keyboard.addListener(keyboardHide, this.props.toggleKeyboardVisibility);
      },
      componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }
    }),
)(FeedbackContent2);